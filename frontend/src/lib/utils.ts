import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatDate(d: string | Date) {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d));
}
export function formatDateTime(d: string | Date) {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
}
export function formatNumber(v: number, d = 0) {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
}
export function formatWeight(tons: number) { return `${formatNumber(tons, 1)} ton`; }
export function formatPercent(v: number) { return `%${formatNumber(v, 1)}`; }
export function formatCurrency(v: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(v);
}

const maps: Record<string, Record<string, string>> = {
  siloStatus: { active: 'Aktif', maintenance: 'Bakımda', full: 'Dolu', empty: 'Boş', fumigation: 'Fumigasyon' },
  grainType: { wheat: 'Buğday', barley: 'Arpa', corn: 'Mısır', sunflower: 'Ayçiçeği', rye: 'Çavdar', oats: 'Yulaf', other: 'Diğer' },
  grainGrade: { grade_a: '1. Sınıf', grade_b: '2. Sınıf', grade_c: '3. Sınıf', feed: 'Yemlik' },
  dispatchStatus: { scheduled: 'Planlandı', loading: 'Yükleniyor', in_transit: 'Yolda', delivered: 'Teslim Edildi', cancelled: 'İptal' },
  contractStatus: { draft: 'Taslak', active: 'Aktif', fulfilled: 'Tamamlandı', expired: 'Süresi Doldu', cancelled: 'İptal' },
  maintenanceType: { fumigation: 'Fumigasyon', cleaning: 'Temizlik', aeration: 'Havalandırma', inspection: 'Muayene', repair: 'Onarım' },
  maintenanceStatus: { scheduled: 'Planlandı', in_progress: 'Devam Ediyor', completed: 'Tamamlandı', cancelled: 'İptal' },
  userRole: { admin: 'Yönetici', operator: 'Operatör', quality_inspector: 'Kalite Kontrol', accountant: 'Muhasebe' },
};
export function label(map: keyof typeof maps, key: string) { return maps[map][key] || key; }
export function unwrapList<T>(r: T[] | { data: T[] }) { return Array.isArray(r) ? r : r.data ?? []; }
