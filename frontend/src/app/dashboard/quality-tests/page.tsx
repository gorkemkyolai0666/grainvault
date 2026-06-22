'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { DataTable } from '@/components/data-table';
import { ErrorState, EmptyState, TableSkeleton } from '@/components/states';
import { Badge } from '@/components/ui/badge';
import { formatDate, label } from '@/lib/utils';

export default function QualityTestsPage() {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const load = () => { setLoading(true); setError(false); api.qualityTests.list().then((d) => setRows(d as Array<Record<string, unknown>>)).catch(() => setError(true)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-bold">Kalite Testleri</h1><p className="text-muted-foreground">Nem, protein ve saflık analizleri</p></div>
      {loading && <TableSkeleton />}{error && <ErrorState onRetry={load} />}
      {!loading && !error && rows.length === 0 && <EmptyState title="Kayıt bulunamadı" description="Henüz kalite testi eklenmemiş." />}
      {!loading && !error && rows.length > 0 && (
        <DataTable page={page} pageSize={10} onPageChange={setPage} data={rows} columns={[
          { key: 'moisture', header: 'Nem %', render: (r) => `%${r.moisture}` },
          { key: 'protein', header: 'Protein %', render: (r) => `%${r.protein}` },
          { key: 'foreignMatter', header: 'Yabancı Madde %' },
          { key: 'grade', header: 'Sınıf', render: (r) => <Badge>{label('grainGrade', String(r.grade))}</Badge> },
          { key: 'testedAt', header: 'Test Tarihi', render: (r) => formatDate(String(r.testedAt)) },
        ]} />
      )}
    </div>
  );
}
