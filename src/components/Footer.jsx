import { Link } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from 'react-icons/hi2';
import logoMagetan from '../assets/logo_magetan.png';

export default function Footer() {
  return (
    <footer className="public-footer relative z-10 w-full">
      <div className="footer-grid">
        <div className="footer-identity">
          <div className="footer-brand-wrapper">
            <img className="footer-logo" src={logoMagetan} alt="Logo resmi Magetan" />
            <h2>Bank Sampah Desa Ngariboyo</h2>
          </div>
          <p>Bersama menjaga kebersihan desa melalui kebiasaan memilah dan pengelolaan iuran yang transparan.</p>
        </div>
        <div className="footer-column">
          <h3>Tautan cepat</h3>
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
          <h3>Kontak & Lokasi</h3>
          <p><HiOutlineMapPin /> Jl. Raya Parang No.16, Ngariboyo, Kec. Ngariboyo, Kabupaten Magetan, Jawa Timur 63351</p>
          <a href="https://wa.me/6281259741038"><HiOutlinePhone /> +62 812-5974-1038</a>
          <a href="mailto:balai@ngariboyo.desa.id"><HiOutlineEnvelope /> balai@ngariboyo.desa.id</a>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Bank Sampah Desa Ngariboyo. Semua hak cipta dilindungi.</div>
    </footer>
  );
}
