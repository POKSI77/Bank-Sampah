import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import logoMagetan from '../assets/logo_magetan.png';

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const closeMenu = () => setMenuOpen(false);

  const handleNavClick = (event, sectionId) => {
    event.preventDefault();
    closeMenu();

    if (pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }

    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (pathname !== '/') {
      const resetTimer = setTimeout(() => setActiveSection(''), 0);
      return () => clearTimeout(resetTimer);
    }

    const sections = ['beranda', 'tentang', 'edukasi', 'panduan']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const visibleSections = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      let bestSection = '';
      let bestRatio = -1;
      visibleSections.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestSection = id;
        }
      });

      if (bestSection) {
        setActiveSection(bestSection);
        const currentHash = window.location.hash.slice(1);
        if (currentHash !== bestSection) {
           window.history.replaceState(null, '', bestSection === 'beranda' ? '/' : `/#${bestSection}`);
        }
      }
    }, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      rootMargin: '-80px 0px -40% 0px',
    });

    sections.forEach((section) => observer.observe(section));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      if (window.scrollY < 50) {
        setActiveSection('beranda');
        if (window.location.hash) {
          window.history.replaceState(null, '', '/');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname === '/' && hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [hash, pathname]);

  return (
    <nav className={`public-nav floating-navbar z-[9999] ${isScrolled ? 'nav-scrolled' : ''}`} aria-label="Navigasi publik">
      <a
        href="https://www.google.com/maps/place/Kec.+Ngariboyo,+Kabupaten+Magetan,+Jawa+Timur/@-7.691142,111.3222075,14z/data=!3m1!4b1!4m6!3m5!1s0x2e79910e159bb1c5:0x57b22b1864fcb7d8!8m2!3d-7.6784221!4d111.3393698!16s%2Fg%2F121_jn6x?entry=ttu&g_ep=EgoyMDI2MDkxNS4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        rel="noopener noreferrer"
        className="public-brand"
        onClick={closeMenu}
      >
        <img className="brand-logo" src={logoMagetan} alt="Logo resmi Magetan" />
        <span><strong>Ngariboyo</strong><small>Desa Lestari</small></span>
      </a>
      <button
        className="public-menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <HiOutlineXMark /> : <HiOutlineBars3 />}
      </button>
      <div className={`public-links ${menuOpen ? 'is-open' : ''}`}>
        <NavLink to="/" end className={() => (pathname === '/' && activeSection === 'beranda' ? 'active-menu' : '')} onClick={(event) => handleNavClick(event, 'beranda')}>Beranda</NavLink>
        <Link to="/#tentang" className={pathname === '/' && activeSection === 'tentang' ? 'active-menu' : ''} onClick={(event) => handleNavClick(event, 'tentang')}>Tentang</Link>
        <Link to="/#edukasi" className={pathname === '/' && activeSection === 'edukasi' ? 'active-menu' : ''} onClick={(event) => handleNavClick(event, 'edukasi')}>Edukasi</Link>
        <Link to="/#panduan" className={pathname === '/' && activeSection === 'panduan' ? 'active-menu' : ''} onClick={(event) => handleNavClick(event, 'panduan')}>Panduan memilah</Link>
        <Link to="/jemput" className="btn-nav-mobile btn-nav-outline" style={{ marginBottom: '8px' }} onClick={closeMenu}>Jemput Sampah</Link>
        <Link to="/cek-iuran" className="btn-nav-mobile" onClick={closeMenu}>Cek Iuran</Link>
      </div>
      <div className="nav-desktop-actions">
        <Link to="/jemput" className="btn-nav-action btn-nav-outline" onClick={closeMenu}>Jemput Sampah</Link>
        <Link to="/cek-iuran" className="btn-nav-action" onClick={closeMenu}>Cek Iuran <HiOutlineArrowRight /></Link>
      </div>
    </nav>
  );
}



