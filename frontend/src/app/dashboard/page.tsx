'use client';
import { useEffect, useState } from 'react';
import { Warehouse, Percent, Droplets, FileText, Wrench } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { formatDate, formatPercent, formatWeight, label } from '@/lib/utils';

interface DashboardStats {
  totalSilos: number;
  totalCapacityTons: number;
  totalStockTons: number;
  occupancyRate: number;
  avgMoisturePct: number;
  activeContracts: number;
  pendingMaintenance: number;
  recentIntakes?: Array<{ id: string; farmerName: string; truckPlate: string; netWeightTons: number; receivedAt: string }>;
  recentDispatches?: Array<{ id: string; destination: string; netWeightTons: number; status: string; dispatchedAt: string }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api.dashboard.stats()
      .then((d) => setStats(d as DashboardStats))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Operasyon Paneli</h1>
        <p className="text-muted-foreground">Silo doluluk, giriş ve sevkiyat KPI özeti</p>
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorState onRetry={load} />}
      {stats && !loading && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Doluluk Oranı" value={formatPercent(stats.occupancyRate)} description={`${formatWeight(stats.totalStockTons)} / ${formatWeight(stats.totalCapacityTons)}`} icon={<Percent className="h-5 w-5" />} />
            <StatCard title="Aktif Silo" value={stats.totalSilos} description={`Ort. nem %${stats.avgMoisturePct}`} icon={<Warehouse className="h-5 w-5" />} />
            <StatCard title="Aktif Sözleşme" value={stats.activeContracts} description="Çiftçi alım anlaşmaları" icon={<FileText className="h-5 w-5" />} />
            <StatCard title="Bekleyen Bakım" value={stats.pendingMaintenance} description="Planlı bakım işleri" icon={<Wrench className="h-5 w-5" />} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-lg">Son Girişler</CardTitle></CardHeader>
              <CardContent>
                {!stats.recentIntakes?.length ? <p className="text-sm text-muted-foreground">Henüz giriş kaydı yok.</p> : (
                  <table className="data-table">
                    <thead><tr><th>Çiftçi</th><th>Plaka</th><th>Ağırlık</th><th>Tarih</th></tr></thead>
                    <tbody>
                      {stats.recentIntakes.map((i) => (
                        <tr key={i.id}>
                          <td className="font-medium">{i.farmerName}</td>
                          <td>{i.truckPlate}</td>
                          <td>{formatWeight(i.netWeightTons)}</td>
                          <td>{formatDate(i.receivedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Son Sevkiyatlar</CardTitle></CardHeader>
              <CardContent>
                {!stats.recentDispatches?.length ? <p className="text-sm text-muted-foreground">Sevkiyat kaydı yok.</p> : (
                  <table className="data-table">
                    <thead><tr><th>Varış</th><th>Ağırlık</th><th>Durum</th><th>Tarih</th></tr></thead>
                    <tbody>
                      {stats.recentDispatches.map((d) => (
                        <tr key={d.id}>
                          <td className="font-medium">{d.destination}</td>
                          <td>{formatWeight(d.netWeightTons)}</td>
                          <td><Badge variant="secondary">{label('dispatchStatus', d.status)}</Badge></td>
                          <td>{formatDate(d.dispatchedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="editorial-card flex items-center gap-3 p-4 text-sm text-muted-foreground">
            <Droplets className="h-5 w-5 text-sage" />
            Ortalama silo nemi %{stats.avgMoisturePct} — kalite testleri ile izlenmektedir.
          </div>
        </>
      )}
    </div>
  );
}
