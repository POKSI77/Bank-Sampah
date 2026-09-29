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
    <div className="premium-lookup-page">
      <div className="premium-lookup-hero">
        <div className="premium-lookup-header">
          <div className="section-kicker">Layanan Warga</div>
          <h1>Cek Iuran Mandiri</h1>
          <p>Ketikkan nama kepala keluarga atau nomor HP untuk melihat status dan riwayat pembayaran iuran sampah Anda.</p>
        </div>
  
        <div className="premium-lookup-card-wrapper">
          <div className="premium-lookup-card">
            <form className="premium-lookup-form" onSubmit={handleSearch}>
              <div className="premium-input-group">
                <HiOutlineMagnifyingGlass className="premium-input-icon" />
                <input 
                  value={query} 
                  onChange={(event) => setQuery(event.target.value)} 
                  placeholder="Ketik nama atau nomor ponsel..." 
                  aria-label="Nama atau nomor HP" 
                  className="premium-input"
                />
              </div>
              <button className="premium-btn-submit" disabled={loading}>
                {loading ? 'Mencari...' : 'Cari Data'}
              </button>
            </form>
    
            {loading && (
              <div className="premium-state-container">
                <LoadingSpinner text="Mencari data iuran..." />
              </div>
            )}
            
            {error && (
              <div className="premium-alert error">
                <HiOutlineExclamationCircle className="premium-alert-icon" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {candidates.length > 0 && (
        <section className="premium-lookup-results-wrapper" style={{ padding: '0 24px 60px' }}>
          <div className="premium-lookup-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#173b2a', marginBottom: '16px', fontWeight: 'bold' }}>
              Ditemukan beberapa data yang mirip:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {candidates.map((person, i) => (
                <li key={person.id_warga} style={{ padding: '16px 0', borderBottom: i === candidates.length - 1 ? 'none' : '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 700, fontSize: '1.05rem', color: '#173b2a' }}>{person.nama_kepala_keluarga}</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#55705e' }}>{person.alamat_blok_rumah} - RT/RW {person.rt_rw}</p>
                  </div>
                  <button onClick={() => handleSelectCandidate(person)} className="premium-btn-submit" style={{ padding: '0 20px', height: '40px', fontSize: '0.9rem', borderRadius: '8px' }}>
                    Pilih Warga
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {result && (
        <section className="premium-lookup-results-wrapper" style={{ padding: '0 24px 80px' }}>
          <div className="premium-lookup-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '0', overflow: 'hidden' }}>
            {/* Header Result */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #f1f5f9', background: '#f8faf9', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#173b2a', color: '#a8d96b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {result.person.nama_kepala_keluarga?.charAt(0)}
                </div>
                <div>
                  <div className="section-kicker" style={{ marginBottom: '4px' }}>Data Ditemukan</div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#173b2a', margin: 0, textTransform: 'capitalize' }}>{result.person.nama_kepala_keluarga}</h2>
                  <p style={{ color: '#55705e', margin: '4px 0 0 0', fontSize: '0.95rem' }}>{result.person.alamat_blok_rumah} - RT/RW {result.person.rt_rw}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <span style={{ padding: '6px 16px', background: '#dcfce7', color: '#166534', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '700' }}>Warga Aktif</span>
                <button onClick={handleReset} style={{ background: 'transparent', color: '#173b2a', border: '1px solid #173b2a', padding: '6px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                  Pencarian Baru
                </button>
              </div>
            </div>

            {/* Riwayat Pembayaran */}
            <div style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#173b2a', marginBottom: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlineClipboardDocumentList style={{ fontSize: '1.5rem', color: '#a8d96b' }} /> Riwayat Pembayaran
              </h3>
              
              {result.transactions.length ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '12px 16px', color: '#55705e', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' }}>Bulan</th>
                        <th style={{ padding: '12px 16px', color: '#55705e', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' }}>Tanggal</th>
                        <th style={{ padding: '12px 16px', color: '#55705e', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' }}>Nominal</th>
                        <th style={{ padding: '12px 16px', color: '#55705e', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.transactions.map((item) => (
                        <tr key={item.id_transaksi} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '16px', fontWeight: '500', color: '#173b2a' }}>{item.bulan_tagihan || item.bulan}</td>
                          <td style={{ padding: '16px', color: '#55705e' }}>{item.tanggal_bayar ? new Date(item.tanggal_bayar).toLocaleDateString('id-ID') : '-'}</td>
                          <td style={{ padding: '16px', fontWeight: '600', color: '#173b2a' }}>{rupiah(item.nominal)}</td>
                          <td style={{ padding: '16px' }}>
                            {item.status_pembayaran === 'Belum Lunas' ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap' }}>Belum Lunas</span>
                                <button 
                                  onClick={() => {
                                    const text = `Halo Admin Bank Sampah Ngariboyo, saya ingin melakukan pembayaran iuran sampah.\n\nBerikut detail tagihan saya:\n*Nama:* ${result.person.nama_kepala_keluarga}\n*Bulan:* ${item.bulan_tagihan}\n*Nominal:* Rp${item.nominal.toLocaleString('id-ID')}\n\nMohon informasi nomor rekening atau metode pembayarannya. Terima kasih!`;
                                    window.open(`https://wa.me/6281259741038?text=${encodeURIComponent(text)}`, '_blank');
                                  }}
                                  className="premium-btn-submit" 
                                  style={{ background: '#25D366', color: '#fff', padding: '0 16px', height: '36px', fontSize: '0.85rem', borderRadius: '8px', boxShadow: 'none' }}
                                >
                                  Bayar via WA
                                </button>
                              </div>
                            ) : (
                              <span style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>{item.status_pembayaran || 'Lunas'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8faf9', borderRadius: '12px' }}>
                  <p style={{ fontWeight: '600', color: '#173b2a', fontSize: '1.1rem', margin: '0 0 8px 0' }}>Belum ada transaksi</p>
                  <p style={{ color: '#55705e', margin: 0 }}>Riwayat pembayaran belum tercatat di sistem.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
