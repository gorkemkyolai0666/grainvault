'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { DataTable } from '@/components/data-table';
import { ErrorState, EmptyState, TableSkeleton } from '@/components/states';
import { Badge } from '@/components/ui/badge';
import { formatDate, label } from '@/lib/utils';

export default function MaintenancePage() {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const load = () => { setLoading(true); setError(false); api.maintenance.list().then((d) => setRows(d as Array<Record<string, unknown>>)).catch(() => setError(true)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-bold">Bakım Planları</h1><p className="text-muted-foreground">Fumigasyon, temizlik ve muayene</p></div>
      {loading && <TableSkeleton />}{error && <ErrorState onRetry={load} />}
      {!loading && !error && rows.length === 0 && <EmptyState title="Kayıt bulunamadı" description="Henüz bakım planı eklenmemiş." />}
      {!loading && !error && rows.length > 0 && (
        <DataTable page={page} pageSize={10} onPageChange={setPage} data={rows} columns={[
          { key: 'type', header: 'İşlem', render: (r) => label('maintenanceType', String(r.type)) },
          { key: 'scheduledAt', header: 'Planlanan', render: (r) => formatDate(String(r.scheduledAt)) },
          { key: 'status', header: 'Durum', render: (r) => <Badge variant="secondary">{label('maintenanceStatus', String(r.status))}</Badge> },
          { key: 'notes', header: 'Not' },
        ]} />
      )}
    </div>
  );
}
