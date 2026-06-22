# GrainVault — Dağıtım Kılavuzu

## Portlar
- Frontend (geliştirme): 3630
- Backend API: 4630

## Ortam Değişkenleri
### Frontend
```
NEXT_PUBLIC_API_URL=https://grainvault-backend-production.up.railway.app/api
```

### Backend
```
DATABASE_URL=postgresql://...
JWT_SECRET=<güvenli-rastgele-değer>
FRONTEND_URL=https://grainvault.vercel.app
PORT=8080
```

## Demo Hesabı
- E-posta: demo@tahilelevatoru.com.tr
- Şifre: demo123456

## Yerel Geliştirme
```bash
cd backend && npm install --legacy-peer-deps && npx prisma migrate deploy && npm run start:dev
cd frontend && npm install && npm run dev
```

## Dağıtım
- Backend: Railway (Nixpacks, `npm run deploy`)
- Frontend: Vercel (rootDirectory: frontend)
- CI: GitHub Actions provision job (main branch)
