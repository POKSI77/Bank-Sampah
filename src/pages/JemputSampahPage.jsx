import React, { useState } from 'react';
import { HiOutlineTruck } from 'react-icons/hi2';

export default function JemputSampahPage() {
  const [formData, setFormData] = useState({
    nama: '',
    no_hp: '',
    rt_rw: '',
    blok_rumah: '',
    catatan: ''
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Halo Admin Bank Sampah Ngariboyo, saya ingin *meminta penjemputan sampah* di lokasi saya.\n\nBerikut data diri dan lokasi saya:\n*Nama:* ${formData.nama}\n*No. HP:* ${formData.no_hp}\n*RT/RW:* ${formData.rt_rw}\n*Blok Rumah:* ${formData.blok_rumah}\n\n*Catatan Tambahan:*\n${formData.catatan || '-'}\n\nMohon informasi estimasi waktu penjemputannya ya. Terima kasih!`;
    
    const url = `https://wa.me/6281259741038?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="lookup-page public-section">
      <div className="lookup-heading">
        <div className="section-kicker">Layanan warga</div>
        <h1>Form Penjemputan Sampah</h1>
        <p>Isi data diri Anda sesuai dengan data di sistem untuk mengajukan penjemputan sampah di depan rumah.</p>
      </div>

      <div className="lookup-card-container">
        <form className="lookup-form" onSubmit={handleSubmit} style={{ display: 'block' }}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Nama Kepala Keluarga</label>
            <div className="lookup-input" style={{ marginTop: '8px' }}>
              <input required name="nama" value={formData.nama} onChange={handleChange} placeholder="Contoh: Budi Santoso" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }} />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Nomor WhatsApp</label>
            <div className="lookup-input" style={{ marginTop: '8px' }}>
              <input required name="no_hp" value={formData.no_hp} onChange={handleChange} placeholder="Contoh: 08123456789" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">RT/RW</label>
              <div className="lookup-input" style={{ marginTop: '8px' }}>
                <input required name="rt_rw" value={formData.rt_rw} onChange={handleChange} placeholder="Contoh: 01/02" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }} />
              </div>
            </div>
            <div>
              <label className="form-label">Blok Rumah</label>
              <div className="lookup-input" style={{ marginTop: '8px' }}>
                <input required name="blok_rumah" value={formData.blok_rumah} onChange={handleChange} placeholder="Contoh: Blok A No 12" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }} />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Catatan Tambahan (Opsional)</label>
            <div className="lookup-input" style={{ marginTop: '8px', padding: '12px 16px' }}>
              <textarea name="catatan" value={formData.catatan} onChange={handleChange} placeholder="Contoh: Sampah ada di dalam pagar" style={{ width: '100%', minHeight: '100px', border: 'none', outline: 'none', background: 'transparent', resize: 'vertical' }}></textarea>
            </div>
          </div>
          
          <button type="submit" className="btn btn-dark" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
            <HiOutlineTruck style={{ fontSize: '1.2rem', marginRight: '8px' }} /> Kirim Permintaan Penjemputan
          </button>
        </form>
      </div>
    </div>
  );
}
