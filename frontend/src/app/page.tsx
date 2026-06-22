import Link from 'next/link';
import { Wheat, Warehouse, ShieldCheck, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="editorial-hero relative flex min-h-[88vh] items-center">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-amber-light">Tahıl Depolama SaaS</p>
            <h1 className="font-display text-4xl font-bold leading-tight text-wheat sm:text-5xl lg:text-6xl">
              Silo envanterinizi tek panelden yönetin
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-wheat/80">
              GrainVault; giriş kantarı, sevkiyat, kalite testleri ve bakım planlarını
              Türkiye&apos;nin tahıl elevatörleri için tasarlanmış editorial arayüzde birleştirir.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg"><Link href="/register">Ücretsiz Başlayın</Link></Button>
              <Button asChild variant="outline" size="lg" className="border-wheat/30 text-wheat hover:bg-wheat/10">
                <Link href="/login">Giriş Yap</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
          {[
            { icon: Warehouse, title: 'Silo CRUD', desc: 'Kapasite, nem ve doluluk takibi' },
            { icon: Wheat, title: 'Giriş & Sevkiyat', desc: 'Kantar kayıtları ve lojistik akışı' },
            { icon: ShieldCheck, title: 'Kalite Kontrol', desc: 'Protein, nem ve yabancı madde testleri' },
            { icon: BarChart3, title: 'KPI Paneli', desc: 'Doluluk oranı ve operasyon özeti' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="editorial-card p-6">
              <Icon className="mb-4 h-8 w-8 text-amber" />
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
