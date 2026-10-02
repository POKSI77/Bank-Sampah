import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineCreditCard,
  HiOutlineClipboardDocumentList,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import logoMagetan from '../assets/logo_magetan.png';
import { supabase } from '@/lib/supabase';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/admin/warga', label: 'Data Warga', icon: HiOutlineUserGroup },
  { to: '/admin/transaksi', label: 'Transaksi', icon: HiOutlineCreditCard },
  { to: '/admin/riwayat', label: 'Riwayat', icon: HiOutlineClipboardDocumentList },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = async () => {
    if (!window.confirm('Apakah Anda yakin ingin keluar dari dasbor Admin?')) return;
    
    await supabase.auth.signOut();
    toast.success('Berhasil keluar dari sistem.');
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-header-brand">
          <img className="mobile-header-icon" src={logoMagetan} alt="Logo resmi Magetan" />
          <span className="mobile-header-title">Desa Ngariboyo</span>
        </div>
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <HiOutlineXMark /> : <HiOutlineBars3 />}
        </button>
      </header>

      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-top">
            <img className="sidebar-brand-icon" src={logoMagetan} alt="Logo resmi Magetan" />
            <button
              className="sidebar-close-btn"
              onClick={closeSidebar}
              aria-label="Tutup menu sidebar"
            >
              <HiOutlineXMark />
            </button>
          </div>
          <Link to="/admin" className="sidebar-brand-title" onClick={closeSidebar}>Desa Ngariboyo</Link>
          <div className="sidebar-brand-subtitle">Sistem Iuran Sampah</div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">Menu Utama</span>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={closeSidebar}
            >
              <span className="sidebar-link-icon">
                <item.icon />
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="sidebar-link" 
            style={{ width: '100%', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }} 
            onClick={handleLogout}
          >
            <span className="sidebar-link-icon">
              <HiOutlineArrowRightOnRectangle />
            </span>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-container page-animate" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
