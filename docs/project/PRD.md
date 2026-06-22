# GrainVault — Ürün Gereksinim Dokümanı

## Özet
GrainVault, Türkiye'deki tahıl elevatörleri ve lisanslı depolar için silo envanter, kantar girişi, sevkiyat, kalite testi ve bakım operasyonlarını tek panelde yöneten SaaS platformudur.

## Hedef Kitle
- Tahıl elevatörü işletmecileri
- Lisanslı depo yöneticileri
- Kalite kontrol ve operasyon ekipleri

## Tasarım Yönü: Agricultural Editorial Premium
- Renkler: hasat amberi (#C9922A), adaçayı yeşili (#6B8F71), buğday kremi (#F4ECD8), toprak kahvesi (#3D2914)
- Tipografi: Playfair Display (başlık), Inter (gövde)
- Düzen: üst navigasyon + breadcrumb çubuğu (sidebar yok)

## Temel Modüller
1. **Silolar** — CRUD, kapasite, doluluk, nem takibi
2. **Girişler** — kamyon plakası, çiftçi, kantar ağırlığı
3. **Sevkiyat** — varış noktası, durum, tonaj
4. **Kalite Testleri** — nem, protein, yabancı madde
5. **Sözleşmeler** — çiftçi alım anlaşmaları
6. **Bakım** — fumigasyon, temizlik, muayene planları

## KPI Paneli
Doluluk oranı, toplam stok, aktif sözleşme sayısı, bekleyen bakım ve son giriş/sevkiyat listeleri.

## Dil
Tüm kullanıcı arayüzü Türkçe; teknik kod İngilizce.
