#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4630/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== GrainVault Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@tahilelevatoru.com.tr","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  FAIL=$((FAIL + 1))
else
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
  assert_status "Dashboard Stats" 200 "$HTTP_CODE"

  for endpoint in silos intakes dispatches quality-tests contracts maintenance; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/$endpoint" -H "Authorization: Bearer $TOKEN")
    assert_status "List $endpoint" 200 "$HTTP_CODE"
  done

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/auth/me" -H "Authorization: Bearer $TOKEN")
  assert_status "Auth Me" 200 "$HTTP_CODE"

  CREATE_SILO=$(curl -s -w "\n%{http_code}" "$API_URL/silos" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -d '{"name":"Test Silo","grainType":"wheat","capacityTons":1000}')
  HTTP_CODE=$(echo "$CREATE_SILO" | tail -1)
  assert_status "Create Silo" 201 "$HTTP_CODE"

  SILO_ID=$(echo "$CREATE_SILO" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

  if [ -n "$SILO_ID" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/silos/$SILO_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -H 'Content-Type: application/json' \
      -X PATCH \
      -d '{"currentLevelTons":500}')
    assert_status "Update Silo" 200 "$HTTP_CODE"

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/silos/$SILO_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -X DELETE)
    assert_status "Delete Silo" 200 "$HTTP_CODE"
  fi

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/silos")
  assert_status "Unauthorized Access" 401 "$HTTP_CODE"
fi

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
{ [ "$FAIL" -eq 0 ] || exit 1; } || true
