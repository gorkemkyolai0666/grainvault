'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { DataTable } from '@/components/data-table';
import { ErrorState, EmptyState, TableSkeleton } from '@/components/states';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatWeight, label } from '@/lib/utils';

export default function ContractsPage() {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const load = () => { setLoading(true); setError(false); api.contracts.list().then((d) => setRows(d as Array<Record<string, unknown>>)).catch(() => setError(true)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-bold">Sözleşmeler</h1><p className="text-muted-foreground">Çiftçi alım sözleşmeleri</p></div>
      {loading && <TableSkeleton />}{error && <ErrorState onRetry={load} />}
      {!loading && !error && rows.length === 0 && <EmptyState title="Kayıt bulunamadı" description="Henüz sözleşme eklenmemiş." />}
      {!loading && !error && rows.length > 0 && (
        <DataTable page={page} pageSize={10} onPageChange={setPage} data={rows} columns={[
          { key: 'farmerName', header: 'Çiftçi', render: (r) => <span className="font-medium">{String(r.farmerName)}</span> },
          { key: 'grainType', header: 'Ürün', render: (r) => label('grainType', String(r.grainType)) },
          { key: 'quantityTons', header: 'Miktar', render: (r) => formatWeight(Number(r.quantityTons)) },
          { key: 'pricePerTon', header: 'Birim Fiyat', render: (r) => formatCurrency(Number(r.pricePerTon)) },
          { key: 'status', header: 'Durum', render: (r) => <Badge variant="secondary">{label('contractStatus', String(r.status))}</Badge> },
        ]} />
      )}
    </div>
  );
}
