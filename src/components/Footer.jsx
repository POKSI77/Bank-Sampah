import { Link } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from 'react-icons/hi2';
import logoMagetan from '../assets/logo_magetan.png';

export default function Footer() {
  return (
    <footer className="public-footer">
      <div className="footer-top">
        <h2 className="footer-huge-title">NGARIBOYO</h2>
        <p className="footer-tagline">Desa Bersih. Warga Sehat. Masa Depan Lestari.</p>
      </div>
      
      <div className="footer-grid">
        <div className="footer-identity">
          <div className="footer-brand-wrapper">
            <img className="footer-logo" src={logoMagetan} alt="Logo resmi Magetan" />
            <h3>Bank Sampah Ngariboyo</h3>
          </div>
          <p>Sistem digitalisasi pengelolaan iuran dan penjemputan sampah untuk mewujudkan Desa Ngariboyo yang bersih, hijau, dan transparan.</p>
        </div>
        
        <div className="footer-column">
          <h3>Jelajahi</h3>
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Beranda</Link>
          <Link to="/jemput" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Jemput Sampah</Link>
          <Link to="/cek-iuran" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Cek Iuran</Link>
          <a href="/#panduan" onClick={(e) => {
            if (window.location.pathname === '/' && window.location.hash === '#panduan') {
              e.preventDefault();
              document.getElementById('panduan')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}>Panduan Memilah</a>
        </div>
        
        <div className="footer-column footer-contact">
          <h3>Hubungi Kami</h3>
          <p><HiOutlineMapPin /> Jl. Raya Parang No.16, Ngariboyo, Magetan</p>
          <a href="https://wa.me/6281259741038" target="_blank" rel="noreferrer"><HiOutlinePhone /> +62 812-5974-1038</a>
          <a href="mailto:balai@ngariboyo.desa.id"><HiOutlineEnvelope /> balai@ngariboyo.desa.id</a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Bank Sampah Desa Ngariboyo.</p>
        <p className="footer-message">Terima kasih telah peduli pada lingkungan!</p>
      </div>
    </footer>
  );
}
