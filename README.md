# TBL331 Veritabanı Yönetim Sistemleri Dönem Projesi

Merhaba! Bu depo, TBL331 Veritabanı Yönetim Sistemleri dersi için Grup 142 olarak hazırladığımız dönem projesinin dosyalarını içeriyor. 

## Proje Hakkında
Bu projede bir şirketin temel insan kaynakları ve personel süreçlerini takip edebileceğimiz bir sistem tasarladık. Veritabanımızda şu bilgileri yönetiyoruz:
* Çalışanların bilgileri (departmanları, kişisel bilgileri, taban maaşları)
* Şirketteki departmanlar ve konumları
* Çalışanların izin talepleri (20 günlük yıllık izin sınırı kontrolüyle birlikte)
* Dönemlik performans değerlendirmeleri ve skorları
* Ay sonu maaş ödemeleri (performans primi ve izin kesintilerinin otomatik hesaplandığı bordro sistemi)

## Neler Kullandık?
* **Veritabanı:** PostgreSQL 18.3
* **Sunucu (Backend API):** Node.js & Express.js (Veritabanı ile React arayüzünü bağlamak için)

---

## Projeyi Nasıl Çalıştırabilirsiniz?

### 1. Veritabanı Kurulumu (PostgreSQL)
Veritabanını ayağa kaldırmak için bilgisayarınızda PostgreSQL yüklü olmalıdır.
1. PostgreSQL üzerinde yeni bir veritabanı oluşturun (örneğin `calisan_sistemi` adında).
2. Depodaki `grup142_sql_betikleri.txt` dosyasını açın ve içindeki tüm SQL komutlarını bu veritabanında sırayla çalıştırın. Tablolar, test verileri, görünümler, prosedürler ve tetikleyiciler otomatik olarak kurulacaktır.

### 2. Backend Sunucusunu Çalıştırma (Node.js)
React arayüzünün veritabanıyla konuşabilmesi için API sunucusunu başlatmamız gerekiyor.
1. Terminalden `backend` klasörünün içine girin:
   ```bash
   cd backend
   ```
2. Gerekli kütüphaneleri bilgisayarınıza yüklemek için şu komutu çalıştırın:
   ```bash
   npm install
   ```
3. Sunucuyu başlatmak için:
   ```bash
   npm start
   ```
4. Her şey yolunda giderse terminalde `Sunucu http://localhost:5000 adresinde aktif!` yazısını göreceksiniz.
