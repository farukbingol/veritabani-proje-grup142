const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Veritabanı bağlantı ayarı
const pool = new Pool({
  user: 'faruk',
  host: 'localhost',
  database: 'calisan_sistemi',
  password: '123456',
  port: 5432,
});

// Departmanları listele
app.get('/api/departmanlar', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Departmanlar ORDER BY DepartmanID');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Çalışanları listele (Departman adları ile birlikte)
app.get('/api/calisanlar', async (req, res) => {
  try {
    const query = `
      SELECT c.*, d.DepartmanAdi 
      FROM Calisanlar c 
      LEFT JOIN Departmanlar d ON c.DepartmanID = d.DepartmanID 
      ORDER BY c.CalisanID
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yeni çalışan ekle
app.post('/api/calisanlar', async (req, res) => {
  const { tc_no, ad, ikinciad, soyad, eposta, telefon, tabanmaas, departmanid } = req.body;
  try {
    const query = `
      INSERT INTO Calisanlar (TC_No, Ad, IkinciAd, Soyad, Eposta, Telefon, TabanMaas, DepartmanID) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;
    const values = [tc_no, ad, ikinciad || null, soyad, eposta, telefon || null, tabanmaas, departmanid || null];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Çalışan bilgilerini güncelle
app.put('/api/calisanlar/:id', async (req, res) => {
  const { id } = req.params;
  const { tc_no, ad, ikinciad, soyad, eposta, telefon, tabanmaas, departmanid, aktiflik } = req.body;
  try {
    const query = `
      UPDATE Calisanlar 
      SET TC_No = $1, Ad = $2, IkinciAd = $3, Soyad = $4, Eposta = $5, Telefon = $6, TabanMaas = $7, DepartmanID = $8, Aktiflik = $9 
      WHERE CalisanID = $10 
      RETURNING *
    `;
    const values = [tc_no, ad, ikinciad || null, soyad, eposta, telefon || null, tabanmaas, departmanid || null, aktiflik, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Çalışan bulunamadı!' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Çalışanı tablodan sil
app.delete('/api/calisanlar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Calisanlar WHERE CalisanID = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Çalışan bulunamadı!' });
    }
    res.json({ message: 'Çalışan başarıyla silindi.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Çalışanın departmanını değiştir (Saklı Yordam/Stored Procedure çağrısı)
app.post('/api/calisanlar/departman-degistir', async (req, res) => {
  const { calisanid, yenidepartmanid } = req.body;
  try {
    await pool.query('CALL sp_CalisanDepartmanDegistir($1, $2)', [calisanid, yenidepartmanid]);
    res.json({ message: 'Çalışan departmanı başarıyla değiştirildi.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// İzin taleplerini listele
app.get('/api/izinler', async (req, res) => {
  try {
    const query = `
      SELECT i.*, c.Ad, c.Soyad 
      FROM Izinler i 
      JOIN Calisanlar c ON i.CalisanID = c.CalisanID 
      ORDER BY i.IzinID DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yeni izin talebi oluştur (Tetikleyici izin limitini kontrol eder)
app.post('/api/izinler', async (req, res) => {
  const { calisanid, izinturu, baslangictarihi, bitistarihi } = req.body;
  try {
    const query = `
      INSERT INTO Izinler (CalisanID, IzinTuru, BaslangicTarihi, BitisTarihi, OnayDurumu) 
      VALUES ($1, $2, $3, $4, 'Beklemede') 
      RETURNING *
    `;
    const values = [calisanid, izinturu, baslangictarihi, bitistarihi];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// İzin talebini onayla veya reddet (Saklı Yordam/Stored Procedure çağrısı)
app.post('/api/izinler/onayla', async (req, res) => {
  const { izinid, karar } = req.body; // karar: 'Onaylandı' veya 'Reddedildi'
  try {
    await pool.query('CALL sp_IzinOnayla($1, $2)', [izinid, karar]);
    res.json({ message: `İzin talebi '${karar}' olarak güncellendi.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Performansları listele
app.get('/api/performanslar', async (req, res) => {
  try {
    const query = `
      SELECT p.*, c.Ad, c.Soyad 
      FROM Performanslar p 
      JOIN Calisanlar c ON p.CalisanID = c.CalisanID 
      ORDER BY p.PerformansID DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Maaş geçmişini listele
app.get('/api/maaslar', async (req, res) => {
  try {
    const query = `
      SELECT m.*, c.Ad, c.Soyad 
      FROM MaasGecmisi m 
      JOIN Calisanlar c ON m.CalisanID = c.CalisanID 
      ORDER BY m.BordroID DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Çalışan maaşını hesapla ve kaydet
app.post('/api/maaslar/hesapla', async (req, res) => {
  const { calisanid, donem } = req.body;
  try {
    await pool.query('CALL sp_MaasHesaplaVeEkle($1, $2)', [calisanid, donem]);
    res.json({ message: 'Personel maaşı başarıyla hesaplandı.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde aktif!`);
});
