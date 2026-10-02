import { useState, useEffect } from 'react';
import logoMagetan from '../assets/logo_magetan.png';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Mulai animasi fade out setelah 2 detik
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Hapus dari DOM setelah animasi selesai
      setTimeout(() => setLoading(false), 500); 
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className={`preloader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="preloader-bg-pattern"></div>
      <div className="preloader-content">
        <div className="preloader-icon-wrapper">
          <img src={logoMagetan} alt="Logo Resmi Magetan" className="preloader-logo" />
        </div>
        <h1 className="preloader-brand">Desa Ngariboyo</h1>
        
        <div className="preloader-status">
          <div className="spinner-mini"></div>
          <span>Memuat halaman...</span>
        </div>
        
        <p className="preloader-subtext">
          {(() => {
            const p = window.location.pathname;
            if (p.startsWith('/admin')) return 'Menuju ke Dasbor Admin...';
            if (p.startsWith('/login')) return 'Menyiapkan Halaman Login...';
            if (p.startsWith('/cek-iuran')) return 'Menyiapkan Data Iuran...';
            if (p.startsWith('/jemput')) return 'Menyiapkan Layanan Jemput...';
            return 'Menuju ke Beranda...';
          })()}
        </p>
        
        <div className="preloader-bar-container">
          <div className="preloader-bar-progress"></div>
        </div>
      </div>
    </div>
  );
}
