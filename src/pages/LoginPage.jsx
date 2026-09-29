import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import logoMagetan from '../assets/logo_magetan.png';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

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
      toast.success('Login berhasil.'); 
      navigate('/admin'); 
    }
  }

  return (
    <main className="login-page">
      <div className="login-panel">
        <div className="login-icon">
          <HiOutlineLockClosed />
        </div>
        <p className="section-kicker">Ruang pengelola</p>
        <h1>Selamat datang kembali.</h1>
        <p className="login-copy">Masuk untuk mengelola data warga dan transaksi iuran Desa Ngariboyo.</p>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username / Email</label>
            <input className="form-input" id="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="Masukkan email admin" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Kata sandi</label>
            <input className="form-input" id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Masukkan kata sandi" required />
          </div>
          <button className="btn btn-dark btn-block" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk ke dashboard'}
          </button>
        </form>
      </div>
      <div className="login-aside">
        <img className="login-logo" src={logoMagetan} alt="Logo resmi Magetan" />
        <h2>Menjaga desa,<br /><em>bersama-sama.</em></h2>
      </div>
    </main>
  );
}
