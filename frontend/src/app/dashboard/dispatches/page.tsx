'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { DataTable } from '@/components/data-table';
import { ErrorState, EmptyState, TableSkeleton } from '@/components/states';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatWeight, label } from '@/lib/utils';

export default function DispatchesPage() {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const load = () => { setLoading(true); setError(false); api.dispatches.list().then((d) => setRows(d as Array<Record<string, unknown>>)).catch(() => setError(true)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-bold">Sevkiyat</h1><p className="text-muted-foreground">Çıkış ve lojistik kayıtları</p></div>
      {loading && <TableSkeleton />}{error && <ErrorState onRetry={load} />}
      {!loading && !error && rows.length === 0 && <EmptyState title="Kayıt bulunamadı" description="Henüz sevkiyat eklenmemiş." />}
      {!loading && !error && rows.length > 0 && (
        <DataTable page={page} pageSize={10} onPageChange={setPage} data={rows} columns={[
          { key: 'destination', header: 'Varış', render: (r) => <span className="font-medium">{String(r.destination)}</span> },
          { key: 'grainType', header: 'Ürün', render: (r) => label('grainType', String(r.grainType)) },
          { key: 'netWeightTons', header: 'Ağırlık', render: (r) => formatWeight(Number(r.netWeightTons)) },
          { key: 'status', header: 'Durum', render: (r) => <Badge variant="secondary">{label('dispatchStatus', String(r.status))}</Badge> },
          { key: 'dispatchedAt', header: 'Tarih', render: (r) => formatDate(String(r.dispatchedAt)) },
        ]} />
      )}
    </div>
  );
}
