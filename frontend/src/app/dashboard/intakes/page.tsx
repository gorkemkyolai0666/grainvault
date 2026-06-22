'use client';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { DataTable } from '@/components/data-table';
import { ErrorState, EmptyState, TableSkeleton } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/toast-context';
import { formatDate, formatWeight, label } from '@/lib/utils';

export default function IntakesPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [silos, setSilos] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ truckPlate: '', farmerName: '', netWeightTons: '', siloId: '', receivedAt: new Date().toISOString().slice(0, 10) });

  const load = () => {
    setLoading(true); setError(false);
    Promise.all([api.intakes.list(), api.silos.list()])
      .then(([intakes, siloList]) => { setRows(intakes as Array<Record<string, unknown>>); setSilos(siloList as Array<{ id: string; name: string }>); })
      .catch(() => setError(true)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.intakes.create({ ...form, netWeightTons: Number(form.netWeightTons), receivedAt: new Date(form.receivedAt).toISOString() });
      toast('Giriş kaydı oluşturuldu', 'success'); setShowForm(false); load();
    } catch (err) { toast(err instanceof Error ? err.message : 'Kayıt başarısız', 'error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-display text-3xl font-bold">Giriş Kayıtları</h1><p className="text-muted-foreground">Kantar giriş işlemleri</p></div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> Yeni Giriş</Button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="editorial-card grid gap-4 p-6 sm:grid-cols-2">
          <div><Label>Plaka</Label><Input value={form.truckPlate} onChange={(e) => setForm({ ...form, truckPlate: e.target.value })} required /></div>
          <div><Label>Çiftçi</Label><Input value={form.farmerName} onChange={(e) => setForm({ ...form, farmerName: e.target.value })} required /></div>
          <div><Label>Net Ağırlık (ton)</Label><Input type="number" step="0.1" value={form.netWeightTons} onChange={(e) => setForm({ ...form, netWeightTons: e.target.value })} required /></div>
          <div><Label>Silo</Label>
            <select className="input-field" value={form.siloId} onChange={(e) => setForm({ ...form, siloId: e.target.value })} required>
              <option value="">Seçin</option>
              {silos.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div><Label>Tarih</Label><Input type="date" value={form.receivedAt} onChange={(e) => setForm({ ...form, receivedAt: e.target.value })} required /></div>
          <div className="flex gap-2 sm:col-span-2"><Button type="submit">Kaydet</Button><Button type="button" variant="outline" onClick={() => setShowForm(false)}>İptal</Button></div>
        </form>
      )}
      {loading && <TableSkeleton />}
      {error && <ErrorState onRetry={load} />}
      {!loading && !error && rows.length === 0 && <EmptyState title="Giriş kaydı yok" description="İlk kantar girişini ekleyin." />}
      {!loading && !error && rows.length > 0 && (
        <DataTable page={page} pageSize={10} onPageChange={setPage} data={rows} columns={[
          { key: 'farmerName', header: 'Çiftçi', render: (r) => <span className="font-medium">{String(r.farmerName)}</span> },
          { key: 'truckPlate', header: 'Plaka' },
          { key: 'netWeightTons', header: 'Ağırlık', render: (r) => formatWeight(Number(r.netWeightTons)) },
          { key: 'grade', header: 'Sınıf', render: (r) => <Badge>{label('grainGrade', String(r.grade))}</Badge> },
          { key: 'receivedAt', header: 'Tarih', render: (r) => formatDate(String(r.receivedAt)) },
        ]} />
      )}
    </div>
  );
}
