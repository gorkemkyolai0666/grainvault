'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { DataTable } from '@/components/data-table';
import { ErrorState, EmptyState, TableSkeleton } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/toast-context';
import { formatWeight, label } from '@/lib/utils';

interface SiloRow {
  id: string; name: string; grainType: string; capacityTons: number;
  currentLevelTons: number; moisturePct: number; status: string;
}

export default function SilosPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<SiloRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', grainType: 'wheat', capacityTons: '', currentLevelTons: '0', moisturePct: '0', status: 'active' });

  const load = () => {
    setLoading(true);
    setError(false);
    api.silos.list().then((d) => setRows(d as SiloRow[])).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ name: '', grainType: 'wheat', capacityTons: '', currentLevelTons: '0', moisturePct: '0', status: 'active' });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name, grainType: form.grainType,
      capacityTons: Number(form.capacityTons), currentLevelTons: Number(form.currentLevelTons),
      moisturePct: Number(form.moisturePct), status: form.status,
    };
    try {
      if (editId) { await api.silos.update(editId, payload); toast('Silo güncellendi', 'success'); }
      else { await api.silos.create(payload); toast('Silo oluşturuldu', 'success'); }
      resetForm(); load();
    } catch (err) { toast(err instanceof Error ? err.message : 'İşlem başarısız', 'error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu siloyu silmek istediğinize emin misiniz?')) return;
    try { await api.silos.delete(id); toast('Silo silindi', 'success'); load(); }
    catch (err) { toast(err instanceof Error ? err.message : 'Silme başarısız', 'error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-display text-3xl font-bold">Silolar</h1><p className="text-muted-foreground">Silo envanter yönetimi</p></div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Yeni Silo</Button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="editorial-card grid gap-4 p-6 sm:grid-cols-2">
          <div><Label>Ad</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div><Label>Kapasite (ton)</Label><Input type="number" value={form.capacityTons} onChange={(e) => setForm({ ...form, capacityTons: e.target.value })} required /></div>
          <div><Label>Mevcut Seviye (ton)</Label><Input type="number" value={form.currentLevelTons} onChange={(e) => setForm({ ...form, currentLevelTons: e.target.value })} /></div>
          <div><Label>Nem (%)</Label><Input type="number" step="0.1" value={form.moisturePct} onChange={(e) => setForm({ ...form, moisturePct: e.target.value })} /></div>
          <div className="flex gap-2 sm:col-span-2"><Button type="submit">{editId ? 'Güncelle' : 'Kaydet'}</Button><Button type="button" variant="outline" onClick={resetForm}>İptal</Button></div>
        </form>
      )}
      {loading && <TableSkeleton />}
      {error && <ErrorState onRetry={load} />}
      {!loading && !error && rows.length === 0 && (
        <EmptyState title="Silo bulunamadı" description="İlk silonuzu ekleyerek başlayın." action={<Button onClick={() => setShowForm(true)}>Silo Ekle</Button>} />
      )}
      {!loading && !error && rows.length > 0 && (
        <DataTable data={rows} page={page} pageSize={8} onPageChange={setPage} columns={[
          { key: 'name', header: 'Silo', render: (r) => <span className="font-medium">{r.name}</span> },
          { key: 'grainType', header: 'Ürün', render: (r) => label('grainType', r.grainType) },
          { key: 'capacityTons', header: 'Kapasite', render: (r) => formatWeight(r.capacityTons) },
          { key: 'currentLevelTons', header: 'Doluluk', render: (r) => formatWeight(r.currentLevelTons) },
          { key: 'moisturePct', header: 'Nem', render: (r) => `%${r.moisturePct}` },
          { key: 'status', header: 'Durum', render: (r) => <Badge variant="secondary">{label('siloStatus', r.status)}</Badge> },
          { key: 'actions', header: '', render: (r) => (
            <div className="flex gap-1">
              <button onClick={() => { setEditId(r.id); setForm({ name: r.name, grainType: r.grainType, capacityTons: String(r.capacityTons), currentLevelTons: String(r.currentLevelTons), moisturePct: String(r.moisturePct), status: r.status }); setShowForm(true); }} className="rounded p-1.5 hover:bg-muted" aria-label="Düzenle"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(r.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10" aria-label="Sil"><Trash2 className="h-4 w-4" /></button>
            </div>
          ) },
        ]} />
      )}
    </div>
  );
}
