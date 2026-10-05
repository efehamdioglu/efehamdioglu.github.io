/* CV içeriği — masaüstündeki .txt dosyaları buradan üretilir. */
const CV = {
  name: 'Osman Efe Hamdioğlu',
  short: 'Efe Hamdioğlu',
  title: 'Bilgisayar Mühendisi / Yazılım Geliştirici',
  email: 'efehamdbusiness@gmail.com',
  phone: '+90 507 489 25 89',
  website: 'https://efehamdioglu.com',
  linkedin: 'https://linkedin.com/in/efehamd',
  github: 'https://github.com/efehamdioglu',
  pdf: 'assets/Osman_Efe_Hamdioglu_CV.pdf',
};

const CV_FILES = [
  {
    name: 'Beni Oku.txt',
    date: '23.09.2026 09:00',
    text: `BENİ OKU
========

Hoş geldiniz!

Bu bilgisayar aslında benim özgeçmişim. Masaüstündeki .txt dosyaları CV'min bölümlerini içeriyor:

  Hakkımda.txt       -> Kısaca ben
  İş Deneyimi.txt    -> Şu anki pozisyonum
  Stajlar.txt        -> Tamamladığım 6 staj
  Projeler.txt       -> Seçilmiş projeler
  Yetenekler.txt     -> Teknik yetkinlikler
  Eğitim.txt         -> Üniversite ve yabancı dil
  İlgi Alanları.txt  -> Kod dışında neler ilgimi çeker
  İletişim.txt       -> Bana ulaşın

İpuçları:
  * Simgeleri açmak için çift tıklayın (telefonda tek dokunuş yeterli).
  * Pencereleri başlık çubuğundan sürükleyebilir, kenarlarından boyutlandırabilirsiniz.
  * Masaüstü simgelerini sürükleyip istediğiniz yere taşıyabilirsiniz.
  * Başlat menüsündeki Visual Studio Code'u açıp kodun kendi kendine yazılmasını izleyin.
  * Bu bilgisayarda gizli sürprizler var. Kaçını bulduğunuzu Başlat menüsündeki "Başarımlar"dan görebilirsiniz.
  * Başlat menüsünü, Mayın Tarlası'nı, Paint'i ve Komut İstemi'ni keşfetmeyi unutmayın.
  * Komut İstemi'nde "help" yazarak komutları görebilirsiniz.
  * CV'nin PDF halini masaüstündeki "Osman_Efe_Hamdioglu_CV.pdf" simgesinden indirebilirsiniz.

İyi gezinmeler!
— Efe`,
  },
  {
    name: 'Hakkımda.txt',
    date: '23.09.2026 09:01',
    text: `==========================================
  OSMAN EFE HAMDİOĞLU
  Bilgisayar Mühendisi / Yazılım Geliştirici
==========================================

Konum    : Ankara, Türkiye
E-posta  : efehamdbusiness@gmail.com
Web      : https://efehamdioglu.com
LinkedIn : https://linkedin.com/in/efehamd
GitHub   : https://github.com/efehamdioglu


HAKKIMDA
--------
Ostim Teknik Üniversitesi Bilgisayar Mühendisliği bölümünden mezun oldum. Çalışma biçimim uçtan uca ürün geliştirme üzerine kurulu; veri modelinin kurgulanmasından arayüzün son detayına kadar sürecin tamamını üstleniyorum.

Altı stajlık süreçte siber güvenlik, ağ mühendisliği ve kurumsal yazılım alanlarında görev aldım; bu üç alanın kesişimi, geliştirdiğim ürünlerde güvenliği ve altyapıyı tasarımın parçası olarak ele almamı sağlıyor.

Hâlihazırda kurumsal ERP çözümleri geliştiriyor, paralelde SaaS ürünleri ve otonom yapay zekâ ajanları üzerinde çalışıyorum.


Diğer bölümler için masaüstündeki diğer .txt dosyalarına göz atın.`,
  },
  {
    name: 'İş Deneyimi.txt',
    date: '23.09.2026 09:02',
    text: `İŞ DENEYİMİ
===========

Yazılım Geliştirici
BZB İletişim — Ankara
Haziran 2026 — Devam ediyor

 * Müşteri şirketler için ERP çözümlerinin geliştirilmesi ve teslimi
 * Analizden dağıtıma kadar tam geliştirme yaşam döngüsünde sorumluluk


(Stajlarım için Stajlar.txt dosyasına bakın.)`,
  },
  {
    name: 'Stajlar.txt',
    date: '23.09.2026 09:03',
    text: `STAJLAR
=======

[Şubat 2026 — Haziran 2026]
ERP Geliştirici Stajyeri
BZB İletişim · TTT World, SILA Group — Ankara
 * TTT World'e ait ERP sistem modüllerinin geliştirilmesi ve bakımı
 * Legacy ASP.NET Web Forms sisteminin ASP.NET Core 8 + React'e taşınması

[Mart — Nisan 2025]
Siber Güvenlik Stajyeri
Akgün Yazılım A.Ş. — Ankara
 * Web uygulamaları ve iç sistemlerde zafiyet analizi ve sızma testleri
 * Bulgular için aksiyon alınabilir raporlama ve çözüm önerileri

[Ocak — Şubat 2025]
Ağ Güvenliği Mühendisi Stajyeri
Forte Bilgi İletişim Teknolojileri ve Savunma Sanayi A.Ş. — Ankara
 * Kurumsal ağ cihazlarının ve VLAN segmentasyonunun yapılandırılması
 * Çevre ve Kültür bakanlıklarının saha kurulumlarında ağ anahtarlarının (switch) kurulumu ve yapılandırılması
 * Savunma sanayi ortamlarında tehdit göstergelerine yönelik trafik izleme

[Ağustos 2024]
Ağ Güvenliği Stajyeri
Forte Bilgi İletişim — Ankara
 * Güvenlik duvarı kuralları, IDS/IPS kurulumu, paket analizi (Wireshark, Nmap)

[Ocak 2024]
Yazılım Mühendisi Stajyeri
Forte Bilgi İletişim — Ankara
 * ASP.NET MVC, C# ve SQL Server ile RESTful API ve web özellikleri geliştirilmesi
 * Çevik sprint süreçleri, kod incelemeleri ve işlevler arası ekip çalışması

[Eylül 2023]
Test Otomasyon Stajyeri
İnnova Bilişim — Ankara
 * Kurumsal yazılım regresyon testleri için otomatik test süitleri geliştirilmesi`,
  },
  {
    name: 'Projeler.txt',
    date: '23.09.2026 09:04',
    text: `SEÇİLMİŞ PROJELER
=================

[1] Dermapi — https://dermapi.net
    Estetik ve dermatoloji klinikleri için klinik yönetim SaaS'ı. Hasta, randevu, tedavi teklifi, stok/lot ve KVKK uyumlu kayıt yönetimi.
    Teknoloji: Spring Boot + React, PostgreSQL, Docker

[2] WavLock — https://wavlock.com
    Türk prodüktörler ve sanatçılar için beat pazarı: keşif, lisanslama, yarışma ve iş birliği.
    Teknoloji: Next.js 16, React 19, Prisma, PostgreSQL, Redis

[3] TTT World ERP
    TTT World için geliştirdiğim kurumsal ERP sistemi: ithalat takibi, görev yönetimi, stok ve raporlama. Legacy ASP.NET Web Forms tarafının ASP.NET Core 8 ve React mimarisine taşınması. Üretimde.

[4] BZB Bilişim Web Sitesi — https://bzb-bilisim.vercel.app
    Firmanın ERP-CRM ve dijital dönüşüm hizmetlerini anlatan kurumsal web sitesinin tasarımı ve geliştirmesi.
    Teknoloji: Next.js, TypeScript

[5] AI Sales Orchestrator
    Üretici firmalarda serbest metin talebi ürüne, fiyata, PDF teklife ve takip görevine dönüştüren otonom satış ajanı.
    Teknoloji: Next.js, PostgreSQL, arka plan worker

[6] STUDIOBASE — Açık kaynak
    Çoklu ajanlı müzik konsepti ve söz motoru; Kreatif Direktör, Söz Yazarı, Eleştirmen ve Görsel Stil ajanları birbirine veri aktararak albüm konsepti üretir.
    Teknoloji: Python, Streamlit

[7] İlacım Cepte
    İlaç ve doz takibi için çevrimdışı çalışan mobil uygulama; barkod/reçeteden ilaç ekleme, hatırlatma bildirimleri, bakmakla yükümlü olunan kişiler için ayrı profiller.
    Teknoloji: React Native, Expo

[8] Robb-IT Security — Açık kaynak
    Windows için terminal tabanlı güvenlik aracı: sistem taraması, canlı trafik izleme, IP bloklama, DPI bypass.
    Teknoloji: C#`,
  },
  {
    name: 'Yetenekler.txt',
    date: '23.09.2026 09:05',
    text: `TEKNİK YETKİNLİKLER
===================

[Programlama Dilleri]
C#, TypeScript / JavaScript, Python, Java, C / C++, SQL, HTML / CSS

[Framework'ler]
ASP.NET Core & MVC, Next.js, React, Spring Boot, React Native (Expo), Streamlit

[Veritabanları]
PostgreSQL, SQL Server, Supabase, Prisma, EF Core, Redis, SQLite, ChromaDB

[Yapay Zekâ]
Çoklu ajan orkestrasyonu, tool calling, RAG ve vektör arama, guardrail tasarımı, human-in-the-loop akışlar, prompt mühendisliği, yerel LLM dağıtımı (Ollama), Claude ve Gemini API entegrasyonu

[Güvenlik]
Sızma testi, zafiyet analizi, Wireshark, Nmap, Metasploit, IDS/IPS

[Ağ]
TCP/IP, VLAN, güvenlik duvarı, VPN, DoH / DPI

[Altyapı]
Docker, Vercel, Hetzner, Caddy, Git / GitHub, Linux, VMware

[Diğer]
SaaS ürün geliştirme, UI/UX tasarımı, JUCE / VST3 ses eklentisi`,
  },
  {
    name: 'Eğitim.txt',
    date: '23.09.2026 09:06',
    text: `EĞİTİM
======

Ostim Teknik Üniversitesi
Bilgisayar Mühendisliği (Lisans) — Ankara
Eylül 2022 — Haziran 2026
Ortalama: 2,74


YABANCI DİL
-----------
Türkçe    : Anadil
İngilizce : C1 İleri Düzey · YDS 76.25`,
  },
  {
    name: 'İlgi Alanları.txt',
    date: '23.09.2026 09:07',
    text: `İLGİ ALANLARI
=============

 * Yapay zekâ ve dil modelleri
 * SaaS geliştirme
 * UI/UX tasarımı
 * Ofansif güvenlik
 * CTF yarışmaları
 * Bulut güvenliği
 * Blokzincir
 * Müzik prodüksiyonu`,
  },
  {
    name: 'İletişim.txt',
    date: '23.09.2026 09:08',
    text: `İLETİŞİM
========

Osman Efe Hamdioğlu
Bilgisayar Mühendisi / Yazılım Geliştirici — Ankara, Türkiye

E-posta  : efehamdbusiness@gmail.com
Telefon  : +90 507 489 25 89
Web      : https://efehamdioglu.com
LinkedIn : https://linkedin.com/in/efehamd
GitHub   : https://github.com/efehamdioglu

CV (PDF) : Masaüstündeki "Osman_Efe_Hamdioglu_CV.pdf" simgesi

Yeni fırsatlar ve iş birlikleri için her zaman ulaşabilirsiniz. :)`,
  },
];

const PROJECTS = [
  { name: 'Dermapi', url: 'https://dermapi.net', desc: 'Estetik ve dermatoloji klinikleri için klinik yönetim SaaS\'ı.', tech: 'Spring Boot · React · PostgreSQL · Docker' },
  { name: 'WavLock', url: 'https://wavlock.com', desc: 'Türk prodüktörler ve sanatçılar için beat pazarı: keşif, lisanslama, yarışma ve iş birliği.', tech: 'Next.js 16 · React 19 · Prisma · PostgreSQL · Redis' },
  { name: 'TTT World ERP', desc: 'İthalat takibi, görev yönetimi, stok ve raporlama. ASP.NET Web Forms → ASP.NET Core 8 + React. Üretimde.', tech: 'ASP.NET Core 8 · React' },
  { name: 'BZB Bilişim Web Sitesi', url: 'https://bzb-bilisim.vercel.app', desc: 'ERP-CRM ve dijital dönüşüm hizmetlerini anlatan kurumsal web sitesi.', tech: 'Next.js · TypeScript' },
  { name: 'AI Sales Orchestrator', desc: 'Serbest metin talebi ürüne, fiyata, PDF teklife ve takip görevine dönüştüren otonom satış ajanı.', tech: 'Next.js · PostgreSQL · worker' },
  { name: 'STUDIOBASE', desc: 'Çoklu ajanlı müzik konsepti ve söz motoru. Açık kaynak.', tech: 'Python · Streamlit' },
  { name: 'İlacım Cepte', desc: 'Çevrimdışı çalışan ilaç ve doz takibi mobil uygulaması.', tech: 'React Native · Expo' },
  { name: 'Robb-IT Security', desc: 'Windows için terminal tabanlı güvenlik aracı. Açık kaynak.', tech: 'C#' },
];

const RECYCLE_ITEMS = [
  { name: 'cv_final_final_SON_v3.doc', type: 'Microsoft Word Belgesi', size: '84 KB', icon: 'doc' },
  { name: 'hello_world.java', type: 'JAVA Dosyası', size: '1 KB', icon: 'txt' },
  { name: 'uyku_programı.txt', type: 'Metin Belgesi', size: '0 KB', icon: 'txt' },
  { name: 'node_modules', type: 'Dosya Klasörü', size: '1,4 GB', icon: 'folder' },
];
