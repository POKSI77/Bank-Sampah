import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiArrowRightOnRectangle, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import logoMagetan from '../assets/logo_magetan.png';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!form.username || !form.password) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.username,
      password: form.password,
    });
    setLoading(false);

    if (error) {
      let errorMessage = 'Terjadi kesalahan sistem.';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email atau kata sandi salah.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Email belum dikonfirmasi. Cek kotak masuk Anda.';
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } else {
      toast.success('Berhasil masuk ke dasbor.');
      navigate('/admin');
    }
  }

  return (
    <main className="premium-login-container">
      {/* Background Effects */}
      <div className="premium-login-bg-shape1"></div>
      <div className="premium-login-bg-shape2"></div>

      <div className="premium-login-card">
        <div className="premium-login-header">
          <div className="premium-login-logo-wrap">
            <img src={logoMagetan} alt="Logo Magetan" />
          </div>
          <h1>Ruang Pengelola</h1>
          <p>Sistem Informasi Iuran Sampah Desa Ngariboyo</p>
        </div>

        <form className="premium-login-form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Alamat Email</label>
            <div className="premium-login-input-wrap">
              <HiOutlineEnvelope className="premium-login-icon" />
              <input
                id="username"
                className="premium-login-input"
                type="email"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Masukkan email admin"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Kata Sandi</label>
            <div className="premium-login-input-wrap">
              <HiOutlineLockClosed className="premium-login-icon" />
              <input
                id="password"
                className="premium-login-input"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Masukkan kata sandi rahasia"
                required
                disabled={loading}
                style={{ paddingRight: '48px' }}
              />
              <button
                type="button"
                className="premium-login-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="premium-login-btn" disabled={loading}>
            {loading ? 'Memverifikasi...' : (
              <>Masuk ke Sistem <HiArrowRightOnRectangle style={{ fontSize: '1.2rem' }} /></>
            )}
          </button>
        </form>

        <div className="premium-login-footer">
          Bukan pengelola? <Link to="/">Kembali ke Beranda</Link>
        </div>
      </div>
    </main>
  );
}
