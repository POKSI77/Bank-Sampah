import React, { useState } from 'react';
import { HiOutlineTruck, HiOutlineCalendar, HiOutlineMapPin, HiOutlineChatBubbleBottomCenterText, HiOutlineUser } from 'react-icons/hi2';

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
    <div className="premium-lookup-page">
      <div className="premium-pickup-wrapper">
        
        <div className="premium-pickup-info">
          <div className="section-kicker">Layanan Penjemputan</div>
          <h1>Tinggal Klik,<br/>Sampah Dijemput!</h1>
          <p>Cukup isi formulir ini untuk menjadwalkan penjemputan sampah langsung ke depan rumah Anda. Mari bersama wujudkan Ngariboyo yang bersih dan lestari.</p>
          
          <ul className="premium-pickup-features">
            <li>
              <div className="feature-icon"><HiOutlineTruck /></div>
              <span>Armada truk siap jalan setiap hari kerja</span>
            </li>
            <li>
              <div className="feature-icon"><HiOutlineCalendar /></div>
              <span>Jadwal bisa disesuaikan dengan waktu Anda</span>
            </li>
            <li>
              <div className="feature-icon"><HiOutlineMapPin /></div>
              <span>Menjangkau seluruh pelosok RT/RW desa</span>
            </li>
          </ul>
        </div>
        
        <div className="premium-pickup-card">
          <h3>Formulir Penjemputan</h3>
          <form onSubmit={handleSubmit} className="premium-pickup-form">
            <div className="form-group">
              <label>Nama Kepala Keluarga</label>
              <div className="premium-input-group">
                <HiOutlineUser className="premium-input-icon" />
                <input required name="nama" value={formData.nama} onChange={handleChange} placeholder="Contoh: Budi Santoso" className="premium-input" />
              </div>
            </div>
            
            <div className="form-group">
              <label>Nomor WhatsApp</label>
              <div className="premium-input-group">
                <HiOutlineChatBubbleBottomCenterText className="premium-input-icon" />
                <input required name="no_hp" value={formData.no_hp} onChange={handleChange} placeholder="Contoh: 08123456789" className="premium-input" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>RT/RW</label>
                <div className="premium-input-group">
                  <input required name="rt_rw" value={formData.rt_rw} onChange={handleChange} placeholder="Contoh: 01/02" className="premium-input" />
                </div>
              </div>
              <div className="form-group">
                <label>Blok Rumah</label>
                <div className="premium-input-group">
                  <input required name="blok_rumah" value={formData.blok_rumah} onChange={handleChange} placeholder="Blok A No 12" className="premium-input" />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Catatan Tambahan (Opsional)</label>
              <div className="premium-input-group textarea-group">
                <textarea name="catatan" value={formData.catatan} onChange={handleChange} placeholder="Sampah sudah diikat di depan pagar..." className="premium-input textarea-input"></textarea>
              </div>
            </div>
            
            <button type="submit" className="premium-btn-submit pickup-btn">
              <HiOutlineTruck style={{ fontSize: '1.4rem' }} /> Jadwalkan via WhatsApp
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
