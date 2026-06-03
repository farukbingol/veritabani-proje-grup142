import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('calisanlar');
  const [calisanlar, setCalisanlar] = useState([]);
  const [departmanlar, setDepartmanlar] = useState([]);
  const [izinler, setIzinler] = useState([]);
  const [maaslar, setMaaslar] = useState([]);
  const [performanslar, setPerformanslar] = useState([]);

  const [calisanForm, setCalisanForm] = useState({
    tc_no: '',
    ad: '',
    ikinciad: '',
    soyad: '',
    eposta: '',
    telefon: '',
    tabanmaas: '',
    departmanid: ''
  });

  const [editingCalisan, setEditingCalisan] = useState(null);

  const [spDepForm, setSpDepForm] = useState({
    calisanid: '',
    yenidepartmanid: ''
  });

  const [izinForm, setIzinForm] = useState({
    calisanid: '',
    izinturu: 'Yıllık İzin',
    baslangictarihi: '',
    bitistarihi: ''
  });

  const [maasForm, setMaasForm] = useState({
    calisanid: '',
    donem: ''
  });

  useEffect(() => {
    getCalisanlar();
    getDepartmanlar();
    getIzinler();
    getMaaslar();
    getPerformanslar();
  }, []);

  const getCalisanlar = () => {
    fetch('http://localhost:5000/api/calisanlar')
      .then(res => res.json())
      .then(data => setCalisanlar(data))
      .catch(err => console.error(err));
  };

  const getDepartmanlar = () => {
    fetch('http://localhost:5000/api/departmanlar')
      .then(res => res.json())
      .then(data => setDepartmanlar(data))
      .catch(err => console.error(err));
  };

  const getIzinler = () => {
    fetch('http://localhost:5000/api/izinler')
      .then(res => res.json())
      .then(data => setIzinler(data))
      .catch(err => console.error(err));
  };

  const getMaaslar = () => {
    fetch('http://localhost:5000/api/maaslar')
      .then(res => res.json())
      .then(data => setMaaslar(data))
      .catch(err => console.error(err));
  };

  const getPerformanslar = () => {
    fetch('http://localhost:5000/api/performanslar')
      .then(res => res.json())
      .then(data => setPerformanslar(data))
      .catch(err => console.error(err));
  };

  const handleCalisanEkle = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/calisanlar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...calisanForm,
        tabanmaas: Number(calisanForm.tabanmaas),
        departmanid: calisanForm.departmanid ? Number(calisanForm.departmanid) : null
      })
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Çalışan eklenemedi');
        }
        return res.json();
      })
      .then(() => {
        alert('Çalışan başarıyla eklendi.');
        setCalisanForm({
          tc_no: '',
          ad: '',
          ikinciad: '',
          soyad: '',
          eposta: '',
          telefon: '',
          tabanmaas: '',
          departmanid: ''
        });
        getCalisanlar();
      })
      .catch(err => alert('Hata: ' + err.message));
  };

  const handleCalisanGuncelle = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/calisanlar/${editingCalisan.calisanid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editingCalisan,
        tabanmaas: Number(editingCalisan.tabanmaas),
        departmanid: editingCalisan.departmanid ? Number(editingCalisan.departmanid) : null
      })
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Çalışan güncellenemedi');
        }
        return res.json();
      })
      .then(() => {
        alert('Çalışan bilgileri güncellendi.');
        setEditingCalisan(null);
        getCalisanlar();
      })
      .catch(err => alert('Hata: ' + err.message));
  };

  const handleCalisanSil = (id) => {
    if (window.confirm('Bu çalışanı silmek istediğinize emin misiniz?')) {
      fetch(`http://localhost:5000/api/calisanlar/${id}`, {
        method: 'DELETE'
      })
        .then(async res => {
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Çalışan silinemedi');
          }
          return res.json();
        })
        .then(() => {
          alert('Çalışan silindi.');
          getCalisanlar();
        })
        .catch(err => alert('Hata: ' + err.message));
    }
  };

  const handleSpDepartmanDegistir = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/calisanlar/departman-degistir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calisanid: Number(spDepForm.calisanid),
        yenidepartmanid: Number(spDepForm.yenidepartmanid)
      })
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Departman değiştirilemedi');
        }
        return res.json();
      })
      .then(data => {
        alert(data.message || 'Departman başarıyla değiştirildi.');
        setSpDepForm({ calisanid: '', yenidepartmanid: '' });
        getCalisanlar();
      })
      .catch(err => alert('Hata: ' + err.message));
  };

  const handleIzinEkle = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/izinler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calisanid: Number(izinForm.calisanid),
        izinturu: izinForm.izinturu,
        baslangictarihi: izinForm.baslangictarihi,
        bitistarihi: izinForm.bitistarihi
      })
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'İzin talebi oluşturulamadı');
        }
        return res.json();
      })
      .then(() => {
        alert('İzin talebi oluşturuldu.');
        setIzinForm({
          calisanid: '',
          izinturu: 'Yıllık İzin',
          baslangictarihi: '',
          bitistarihi: ''
        });
        getIzinler();
      })
      .catch(err => alert('Hata: ' + err.message));
  };

  const handleIzinOnayla = (id, karar) => {
    fetch('http://localhost:5000/api/izinler/onayla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        izinid: id,
        karar: karar
      })
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'İzin işlemi başarısız');
        }
        return res.json();
      })
      .then(data => {
        alert(data.message);
        getIzinler();
      })
      .catch(err => alert('Hata: ' + err.message));
  };

  const handleMaasHesapla = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/maaslar/hesapla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calisanid: Number(maasForm.calisanid),
        donem: maasForm.donem
      })
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Maaş hesaplanamadı');
        }
        return res.json();
      })
      .then(data => {
        alert(data.message || 'Maaş başarıyla hesaplandı ve kaydedildi.');
        setMaasForm({ calisanid: '', donem: '' });
        getMaaslar();
      })
      .catch(err => alert('Hata: ' + err.message));
  };

  return (
    <div className="admin-container">
      <header className="main-header">
        <h1>VTYS Personel Yönetim Paneli</h1>
      </header>

      <nav className="tab-navigation">
        <button
          className={activeTab === 'calisanlar' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('calisanlar')}
        >
          Çalışan Yönetimi
        </button>
        <button
          className={activeTab === 'izinler' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('izinler')}
        >
          İzin Talepleri
        </button>
        <button
          className={activeTab === 'maaslar' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('maaslar')}
        >
          Maaş Geçmişi
        </button>
        <button
          className={activeTab === 'performanslar' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('performanslar')}
        >
          Performans Raporu
        </button>
      </nav>

      <main className="content">
        {activeTab === 'calisanlar' && (
          <div>
            <div className="flex-container">
              <div className="table-card flex-main">
                <h2>Çalışan Listesi</h2>
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>Ad Soyad</th>
                      <th>TC No</th>
                      <th>E-posta</th>
                      <th>Telefon</th>
                      <th>Departman</th>
                      <th>Maaş</th>
                      <th>Aktif</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calisanlar.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center' }}>
                          Kayıt bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      calisanlar.map(k => (
                        <tr key={k.calisanid}>
                          <td>
                            <strong>
                              {k.ad} {k.ikinciad ? k.ikinciad + ' ' : ''}{k.soyad}
                            </strong>
                          </td>
                          <td>{k.tc_no}</td>
                          <td>{k.eposta}</td>
                          <td>{k.telefon || '-'}</td>
                          <td>{k.departmanadi || 'Atanmadı'}</td>
                          <td>{Number(k.tabanmaas).toLocaleString('tr-TR')} ₺</td>
                          <td>{k.aktiflik ? 'Evet' : 'Hayır'}</td>
                          <td>
                            <button
                              className="btn-edit"
                              onClick={() =>
                                setEditingCalisan({
                                  calisanid: k.calisanid,
                                  tc_no: k.tc_no,
                                  ad: k.ad,
                                  ikinciad: k.ikinciad || '',
                                  soyad: k.soyad,
                                  eposta: k.eposta,
                                  telefon: k.telefon || '',
                                  tabanmaas: k.tabanmaas,
                                  departmanid: k.departmanid || '',
                                  aktiflik: k.aktiflik
                                })
                              }
                            >
                              Düzenle
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleCalisanSil(k.calisanid)}
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="form-card flex-side">
                {editingCalisan ? (
                  <form onSubmit={handleCalisanGuncelle}>
                    <h2>Çalışan Düzenle</h2>
                    <label>TC Kimlik No</label>
                    <input
                      type="text"
                      maxLength="11"
                      required
                      value={editingCalisan.tc_no}
                      onChange={e =>
                        setEditingCalisan({ ...editingCalisan, tc_no: e.target.value })
                      }
                    />

                    <label>Ad</label>
                    <input
                      type="text"
                      required
                      value={editingCalisan.ad}
                      onChange={e =>
                        setEditingCalisan({ ...editingCalisan, ad: e.target.value })
                      }
                    />

                    <label>İkinci Ad (Opsiyonel)</label>
                    <input
                      type="text"
                      value={editingCalisan.ikinciad}
                      onChange={e =>
                        setEditingCalisan({ ...editingCalisan, ikinciad: e.target.value })
                      }
                    />

                    <label>Soyad</label>
                    <input
                      type="text"
                      required
                      value={editingCalisan.soyad}
                      onChange={e =>
                        setEditingCalisan({ ...editingCalisan, soyad: e.target.value })
                      }
                    />

                    <label>E-posta</label>
                    <input
                      type="email"
                      required
                      value={editingCalisan.eposta}
                      onChange={e =>
                        setEditingCalisan({ ...editingCalisan, eposta: e.target.value })
                      }
                    />

                    <label>Telefon (Opsiyonel)</label>
                    <input
                      type="text"
                      maxLength="11"
                      value={editingCalisan.telefon}
                      onChange={e =>
                        setEditingCalisan({ ...editingCalisan, telefon: e.target.value })
                      }
                    />

                    <label>Taban Maaş</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editingCalisan.tabanmaas}
                      onChange={e =>
                        setEditingCalisan({ ...editingCalisan, tabanmaas: e.target.value })
                      }
                    />

                    <label>Departman</label>
                    <select
                      value={editingCalisan.departmanid}
                      onChange={e =>
                        setEditingCalisan({
                          ...editingCalisan,
                          departmanid: e.target.value
                        })
                      }
                    >
                      <option value="">Seçiniz</option>
                      {departmanlar.map(d => (
                        <option key={d.departmanid} value={d.departmanid}>
                          {d.departmanadi}
                        </option>
                      ))}
                    </select>

                    <label>Aktiflik Durumu</label>
                    <select
                      value={editingCalisan.aktiflik ? 'true' : 'false'}
                      onChange={e =>
                        setEditingCalisan({
                          ...editingCalisan,
                          aktiflik: e.target.value === 'true'
                        })
                      }
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Pasif</option>
                    </select>

                    <button type="submit" className="add-btn">
                      Kaydet
                    </button>
                    <button
                      type="button"
                      className="btn-edit"
                      style={{ marginTop: '8px', width: '100%' }}
                      onClick={() => setEditingCalisan(null)}
                    >
                      İptal
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleCalisanEkle}>
                    <h2>Yeni Çalışan Ekle</h2>
                    <label>TC Kimlik No</label>
                    <input
                      type="text"
                      maxLength="11"
                      required
                      value={calisanForm.tc_no}
                      onChange={e =>
                        setCalisanForm({ ...calisanForm, tc_no: e.target.value })
                      }
                    />

                    <label>Ad</label>
                    <input
                      type="text"
                      required
                      value={calisanForm.ad}
                      onChange={e => setCalisanForm({ ...calisanForm, ad: e.target.value })}
                    />

                    <label>İkinci Ad (Opsiyonel)</label>
                    <input
                      type="text"
                      value={calisanForm.ikinciad}
                      onChange={e =>
                        setCalisanForm({ ...calisanForm, ikinciad: e.target.value })
                      }
                    />

                    <label>Soyad</label>
                    <input
                      type="text"
                      required
                      value={calisanForm.soyad}
                      onChange={e =>
                        setCalisanForm({ ...calisanForm, soyad: e.target.value })
                      }
                    />

                    <label>E-posta</label>
                    <input
                      type="email"
                      required
                      value={calisanForm.eposta}
                      onChange={e =>
                        setCalisanForm({ ...calisanForm, eposta: e.target.value })
                      }
                    />

                    <label>Telefon (Opsiyonel)</label>
                    <input
                      type="text"
                      maxLength="11"
                      value={calisanForm.telefon}
                      onChange={e =>
                        setCalisanForm({ ...calisanForm, telefon: e.target.value })
                      }
                    />

                    <label>Taban Maaş</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={calisanForm.tabanmaas}
                      onChange={e =>
                        setCalisanForm({ ...calisanForm, tabanmaas: e.target.value })
                      }
                    />

                    <label>Departman</label>
                    <select
                      value={calisanForm.departmanid}
                      onChange={e =>
                        setCalisanForm({ ...calisanForm, departmanid: e.target.value })
                      }
                    >
                      <option value="">Seçiniz</option>
                      {departmanlar.map(d => (
                        <option key={d.departmanid} value={d.departmanid}>
                          {d.departmanadi}
                        </option>
                      ))}
                    </select>

                    <button type="submit" className="add-btn">
                      Ekle
                    </button>
                  </form>
                )}

                <form onSubmit={handleSpDepartmanDegistir} style={{ marginTop: '24px' }}>
                  <h2>Departman Değiştir (SP)</h2>
                  <label>Çalışan</label>
                  <select
                    required
                    value={spDepForm.calisanid}
                    onChange={e =>
                      setSpDepForm({ ...spDepForm, calisanid: e.target.value })
                    }
                  >
                    <option value="">Seçiniz</option>
                    {calisanlar.map(k => (
                      <option key={k.calisanid} value={k.calisanid}>
                        {k.ad} {k.soyad}
                      </option>
                    ))}
                  </select>

                  <label>Yeni Departman</label>
                  <select
                    required
                    value={spDepForm.yenidepartmanid}
                    onChange={e =>
                      setSpDepForm({ ...spDepForm, yenidepartmanid: e.target.value })
                    }
                  >
                    <option value="">Seçiniz</option>
                    {departmanlar.map(d => (
                      <option key={d.departmanid} value={d.departmanid}>
                        {d.departmanadi}
                      </option>
                    ))}
                  </select>

                  <button type="submit" className="add-btn" style={{ background: '#0284c7' }}>
                    Departman Değiştir (SP Çağır)
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'izinler' && (
          <div className="flex-container">
            <div className="table-card flex-main">
              <h2>İzin Kayıtları</h2>
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Çalışan</th>
                    <th>İzin Türü</th>
                    <th>Başlangıç Tarihi</th>
                    <th>Bitiş Tarihi</th>
                    <th>Onay Durumu</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {izinler.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>
                        İzin talebi bulunmamaktadır.
                      </td>
                    </tr>
                  ) : (
                    izinler.map(i => (
                      <tr key={i.izinid}>
                        <td>
                          <strong>
                            {i.ad} {i.soyad}
                          </strong>
                        </td>
                        <td>{i.izinturu}</td>
                        <td>{new Date(i.baslangictarihi).toLocaleDateString('tr-TR')}</td>
                        <td>{new Date(i.bitistarihi).toLocaleDateString('tr-TR')}</td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor:
                                i.onaydurumu === 'Onaylandı'
                                  ? '#dcfce7'
                                  : i.onaydurumu === 'Reddedildi'
                                  ? '#fee2fee'
                                  : '#fef3c7',
                              color:
                                i.onaydurumu === 'Onaylandı'
                                  ? '#15803d'
                                  : i.onaydurumu === 'Reddedildi'
                                  ? '#b91c1c'
                                  : '#b45309'
                            }}
                          >
                            {i.onaydurumu}
                          </span>
                        </td>
                        <td>
                          {i.onaydurumu === 'Beklemede' && (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                className="btn-edit"
                                style={{ background: '#dcfce7', color: '#15803d' }}
                                onClick={() => handleIzinOnayla(i.izinid, 'Onaylandı')}
                              >
                                Onayla (SP)
                              </button>
                              <button
                                className="btn-delete"
                                style={{ background: '#fee2e2', color: '#b91c1c' }}
                                onClick={() => handleIzinOnayla(i.izinid, 'Reddedildi')}
                              >
                                Reddet (SP)
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="form-card flex-side">
              <form onSubmit={handleIzinEkle}>
                <h2>Yeni İzin Talebi</h2>
                <label>Çalışan</label>
                <select
                  required
                  value={izinForm.calisanid}
                  onChange={e => setIzinForm({ ...izinForm, calisanid: e.target.value })}
                >
                  <option value="">Seçiniz</option>
                  {calisanlar.map(k => (
                    <option key={k.calisanid} value={k.calisanid}>
                      {k.ad} {k.soyad}
                    </option>
                  ))}
                </select>

                <label>İzin Türü</label>
                <select
                  value={izinForm.izinturu}
                  onChange={e => setIzinForm({ ...izinForm, izinturu: e.target.value })}
                >
                  <option value="Yıllık İzin">Yıllık İzin</option>
                  <option value="Sağlık İzni">Sağlık İzni</option>
                  <option value="Ücretsiz İzin">Ücretsiz İzin</option>
                  <option value="Mazeret İzni">Mazeret İzni</option>
                </select>

                <label>Başlangıç Tarihi</label>
                <input
                  type="date"
                  required
                  value={izinForm.baslangictarihi}
                  onChange={e =>
                    setIzinForm({ ...izinForm, baslangictarihi: e.target.value })
                  }
                />

                <label>Bitiş Tarihi</label>
                <input
                  type="date"
                  required
                  value={izinForm.bitistarihi}
                  onChange={e => setIzinForm({ ...izinForm, bitistarihi: e.target.value })}
                />

                <button type="submit" className="add-btn">
                  Talep Oluştur
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'maaslar' && (
          <div className="flex-container">
            <div className="table-card flex-main">
              <h2>Maaş Bordroları</h2>
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Çalışan</th>
                    <th>Dönem</th>
                    <th>Net Maaş</th>
                    <th>Bonus</th>
                    <th>Kesinti</th>
                    <th>İşlem Tarihi</th>
                    <th>Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  {maaslar.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center' }}>
                        Maaş bordrosu bulunmamaktadır.
                      </td>
                    </tr>
                  ) : (
                    maaslar.map(m => (
                      <tr key={m.bordroid}>
                        <td>
                          <strong>
                            {m.ad} {m.soyad}
                          </strong>
                        </td>
                        <td>{m.maasdonemi}</td>
                        <td>{Number(m.netmaas).toLocaleString('tr-TR')} ₺</td>
                        <td>{Number(m.bonus).toLocaleString('tr-TR')} ₺</td>
                        <td>{Number(m.kesinti).toLocaleString('tr-TR')} ₺</td>
                        <td>{new Date(m.islemtarihi).toLocaleString('tr-TR')}</td>
                        <td>{m.aciklama}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="form-card flex-side">
              <form onSubmit={handleMaasHesapla}>
                <h2>Maaş Hesapla (SP)</h2>
                <label>Çalışan</label>
                <select
                  required
                  value={maasForm.calisanid}
                  onChange={e => setMaasForm({ ...maasForm, calisanid: e.target.value })}
                >
                  <option value="">Seçiniz</option>
                  {calisanlar.map(k => (
                    <option key={k.calisanid} value={k.calisanid}>
                      {k.ad} {k.soyad}
                    </option>
                  ))}
                </select>

                <label>Dönem (YYYY-MM)</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 2026-04"
                  maxLength="7"
                  value={maasForm.donem}
                  onChange={e => setMaasForm({ ...maasForm, donem: e.target.value })}
                />

                <button type="submit" className="add-btn" style={{ background: '#10b981' }}>
                  Hesapla & Kaydet (SP Çağır)
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'performanslar' && (
          <div className="table-card">
            <h2>Performans Değerlendirmeleri</h2>
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Çalışan</th>
                  <th>Değerlendirme Dönemi</th>
                  <th>Performans Skoru</th>
                  <th>Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {performanslar.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                ) : (
                  performanslar.map(p => (
                    <tr key={p.performansid}>
                      <td>
                        <strong>
                          {p.ad} {p.soyad}
                        </strong>
                      </td>
                      <td>{p.degerlendirmedonemi}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor:
                              p.skor >= 4
                                ? '#dcfce7'
                                : p.skor === 3
                                ? '#fef3c7'
                                : '#fee2e2',
                            color:
                              p.skor >= 4
                                ? '#15803d'
                                : p.skor === 3
                                ? '#b45309'
                                : '#b91c1c'
                          }}
                        >
                          {p.skor} / 5
                        </span>
                      </td>
                      <td>{p.aciklama}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;