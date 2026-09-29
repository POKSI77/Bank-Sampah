import { useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineClipboardDocumentList, HiOutlineExclamationCircle } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { getWarga, getRiwayatLengkap } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const rupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);

export default function CekIuranPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(event) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setError(''); setResult(null); setCandidates([]);
    try {
      const warga = await getWarga();
      const normalized = query.trim().toLowerCase();
      
      // Temukan semua data yang mengandung kata kunci pencarian
      const matches = warga.filter((item) => item.nama_kepala_keluarga?.toLowerCase().includes(normalized) || item.no_hp?.includes(query.trim()));
      
      if (matches.length === 0) { 
        setError('Data warga tidak ditemukan. Coba gunakan nama lengkap atau nomor HP.'); 
        setLoading(false);
        return; 
      }
      
      // Jika hasil cuma satu, langsung pilih itu
      if (matches.length === 1) {
        const selectedPerson = matches[0];
        const transaksi = await getRiwayatLengkap();
        const userTransactions = transaksi.filter((item) => item.id_warga === selectedPerson.id_warga);
        setResult({ person: selectedPerson, transactions: userTransactions });
      } else {
        // Jika ada banyak (lebih dari satu), tampilkan daftar pilihan (jangan auto-select)
        setCandidates(matches);
      }
    } catch { 
      setError('Layanan sedang tidak tersedia. Pastikan backend sudah menyala.'); 
    }
    finally { 
      setLoading(false); 
    }
  }

  async function handleSelectCandidate(person) {
    setLoading(true); setCandidates([]); setError('');
    try {
      const transaksi = await getRiwayatLengkap();
      const userTransactions = transaksi.filter((item) => item.id_warga === person.id_warga);
      setResult({ person, transactions: userTransactions });
    } catch {
      setError('Layanan sedang tidak tersedia.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setQuery('');
    setResult(null);
    setCandidates([]);
    setError('');
  }

  return (
    <div className="lookup-page public-section">
      <div className="lookup-heading">
        <div className="section-kicker">Layanan warga</div>
        <h1>Cek iuran mandiri</h1>
        <p>Masukkan nama kepala keluarga atau nomor HP untuk melihat riwayat pembayaran.</p>
      </div>

      <div className="lookup-card-container">
        <form className="lookup-form lookup-form-large" onSubmit={handleSearch}>
          <div className="lookup-input">
            <HiOutlineMagnifyingGlass />
            <input 
              value={query} 
              onChange={(event) => setQuery(event.target.value)} 
              placeholder="Contoh: Bapak Supardi / 0812..." 
              aria-label="Nama atau nomor HP" 
            />
          </div>
          <button className="btn btn-dark" disabled={loading}>
            {loading ? 'Mencari...' : 'Cari data'}
          </button>
        </form>

        {loading && <LoadingSpinner text="Mencari data iuran..." />}
        
        {error && (
          <div className="alert alert-error flex items-center gap-3">
            <HiOutlineExclamationCircle className="alert-icon" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {candidates.length > 0 && (
        <section className="lookup-result">
          <h3 style={{ fontSize: '1.2rem', color: '#173b2a', marginBottom: '16px', fontWeight: 'bold', textAlign: 'center' }}>
            Ditemukan beberapa data yang mirip:
          </h3>
          <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {candidates.map((person, i) => (
                <li key={person.id_warga} style={{ padding: '16px', borderBottom: i === candidates.length - 1 ? 'none' : '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 600, fontSize: '1rem', color: '#1e293b' }}>{person.nama_kepala_keluarga}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{person.alamat_blok_rumah} - RT/RW {person.rt_rw}</p>
                  </div>
                  <button onClick={() => handleSelectCandidate(person)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Pilih Warga</button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {result && (
        <section className="lookup-result">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#173b2a', margin: 0, fontWeight: 'bold' }}>Hasil Pencarian</h3>
            <button onClick={handleReset} className="btn" style={{ background: '#ffffff', color: '#374151', padding: '8px 16px', fontSize: '0.9rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              Pencarian Baru
            </button>
          </div>
          <div className="result-profile">
            <div className="result-profile-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="profile-initial">{result.person.nama_kepala_keluarga?.charAt(0)}</span>
              <div>
                <p className="section-kicker">Data Ditemukan</p>
                <h2 className="capitalize">{result.person.nama_kepala_keluarga}</h2>
                <p>{result.person.alamat_blok_rumah} - RT/RW {result.person.rt_rw}</p>
              </div>
            </div>
            <div className="profile-status" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="badge badge-success" style={{ padding: '8px 16px', fontSize: '13px' }}>Aktif</span>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-header-title">
                <HiOutlineClipboardDocumentList /> Riwayat pembayaran
              </h3>
            </div>
            {result.transactions.length ? (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Bulan</th>
                      <th>Tanggal</th>
                      <th>Nominal</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.transactions.map((item) => (
                      <tr key={item.id_transaksi}>
                        <td>{item.bulan_tagihan || item.bulan}</td>
                        <td>{item.tanggal_bayar ? new Date(item.tanggal_bayar).toLocaleDateString('id-ID') : '-'}</td>
                        <td className="currency">{rupiah(item.nominal)}</td>
                        <td>
                          {item.status_pembayaran === 'Belum Lunas' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="badge" style={{ background: '#fee2e2', color: '#b91c1c', padding: '6px 12px' }}>Belum Lunas</span>
                              <button 
                                onClick={() => {
                                  const text = `Halo Admin Bank Sampah Ngariboyo, saya ingin melakukan pembayaran iuran sampah.\n\nBerikut detail tagihan saya:\n*Nama:* ${result.person.nama_kepala_keluarga}\n*Bulan:* ${item.bulan_tagihan}\n*Nominal:* Rp${item.nominal.toLocaleString('id-ID')}\n\nMohon informasi nomor rekening atau metode pembayarannya. Terima kasih!`;
                                  window.open(`https://wa.me/6281259741038?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                                className="btn" 
                                style={{ background: '#166534', color: '#fff', padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                              >
                                Bayar Sekarang
                              </button>
                            </div>
                          ) : (
                            <span className="badge badge-success">{item.status_pembayaran || 'Lunas'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p className="empty-state-title">Belum ada transaksi</p>
                <p className="empty-state-description">Riwayat pembayaran belum tercatat.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
