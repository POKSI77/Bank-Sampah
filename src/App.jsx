import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/Layout';
import PublicLayout from '@/components/PublicLayout';
import Preloader from '@/components/Preloader';
import DashboardPage from '@/pages/DashboardPage';
import WargaPage from '@/pages/WargaPage';
import TransaksiPage from '@/pages/TransaksiPage';
import RiwayatPage from '@/pages/RiwayatPage';
import LandingPage from '@/pages/LandingPage';
import CekIuranPage from '@/pages/CekIuranPage';
import LoginPage from '@/pages/LoginPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import JemputSampahPage from '@/pages/JemputSampahPage';

export default function App() {
  return (
    <>
      <Preloader />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/cek-iuran" element={<CekIuranPage />} />
            <Route path="/jemput" element={<JemputSampahPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="warga" element={<WargaPage />} />
              <Route path="transaksi" element={<TransaksiPage />} />
              <Route path="riwayat" element={<RiwayatPage />} />
            </Route>
          </Route>
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--font-size-sm)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              boxShadow: 'var(--shadow-lg)',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-primary-500)',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--color-danger)',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </>
  );
}