import { useEffect, useState, useMemo } from 'react';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
} from 'react-icons/hi2';
import { getWarga, getRiwayatLengkap } from '@/services/api';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

/** Format angka ke Rupiah */
function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export default function RiwayatPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [wargaList, setWargaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBulan, setFilterBulan] = useState('');

  useEffect(() => {
    Promise.all([getRiwayatLengkap(), getWarga()])
      .then(([trx, warga]) => {
        setTransaksiList(trx);
        setWargaList(warga);
      })
      .catch((err) => console.error('Riwayat error:', err))
      .finally(() => setLoading(false));
  }, []);

  // Buat map warga untuk lookup cepat
  const wargaMap = useMemo(() => {
    const map = {};
    wargaList.forEach((w) => {
      map[w.id_warga] = w;
    });
    return map;
  }, [wargaList]);

  // Daftar bulan unik untuk filter
  const bulanOptions = useMemo(() => {
    const months = [...new Set(transaksiList.map((t) => t.bulan))].filter(Boolean);
    return months.sort();
  }, [transaksiList]);

  // Filter data
  const filtered = useMemo(() => {
    return transaksiList.filter((trx) => {
      const warga = wargaMap[trx.id_warga];
      const q = search.toLowerCase();
      const nama = trx.nama_kepala_keluarga || warga?.nama_kepala_keluarga || '';
      const alamat = warga?.alamat_blok_rumah || '';
      const bulan = trx.bulan_tagihan || trx.bulan || '';

      const matchSearch =
        !search ||
        nama.toLowerCase().includes(q) ||
        alamat.toLowerCase().includes(q) ||
        bulan.toLowerCase().includes(q);

      const matchBulan = !filterBulan || bulan === filterBulan;

      return matchSearch && matchBulan;
    });
  }, [transaksiList, wargaMap, search, filterBulan]);

  // Total nominal dari hasil filter
  const totalFiltered = useMemo(() => {
    return filtered.reduce((sum, trx) => sum + (Number(trx.nominal) || 0), 0);
  }, [filtered]);

  if (loading) {
    return <LoadingSkeleton variant="table" />;
  }

  return (
    <>
      {/* Page Header */}
      <header className="page-header">
        <p className="page-header-eyebrow">Laporan</p>
        <h1 className="page-header-title">Riwayat Transaksi</h1>
        <p className="page-header-subtitle">
          Lihat seluruh riwayat pembayaran iuran sampah warga.
        </p>
      </header>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div className="search-box" style={{ flex: '1 1 250px' }}>
          <span className="search-box-icon">
            <HiOutlineMagnifyingGlass />
          </span>
          <input
            type="text"
            className="form-input"
            placeholder="Cari nama warga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <HiOutlineFunnel style={{ color: 'var(--text-tertiary)' }} />
          <select
            className="form-select"
            value={filterBulan}
            onChange={(e) => setFilterBulan(e.target.value)}
            style={{ width: 'auto', minWidth: '180px' }}
          >
            <option value="">Semua Bulan</option>
            {bulanOptions.map((bulan) => (
              <option key={bulan} value={bulan}>
                {bulan}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-header-title">
            Daftar Transaksi{' '}
            <span
              className="badge badge-info"
              style={{ marginLeft: 'var(--space-2)' }}
            >
              {filtered.length} data
            </span>
          </h2>
          {filtered.length > 0 && (
            <span
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-accent)',
              }}
            >
              Total: {formatRupiah(totalFiltered)}
            </span>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Kepala Keluarga</th>
                  <th>Alamat</th>
                  <th>Bulan</th>
                  <th>Nominal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((trx, index) => {
                  const warga = wargaMap[trx.id_warga];
                  return (
                    <tr key={trx.id_transaksi || index}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: 500 }}>
                        {trx.nama_kepala_keluarga || warga?.nama_kepala_keluarga || `Warga #${trx.id_warga}`}
                      </td>
                      <td>{warga?.alamat_blok_rumah || '—'}</td>
                      <td>{trx.bulan_tagihan || trx.bulan}</td>
                      <td className="currency">{formatRupiah(trx.nominal || 0)}</td>
                      <td>
                        <span className={`badge ${trx.status_pembayaran === 'Belum Lunas' ? 'badge-error' : 'badge-success'}`} style={trx.status_pembayaran === 'Belum Lunas' ? { background: '#fee2e2', color: '#b91c1c' } : {}}>
                          {trx.status_pembayaran || 'Lunas'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : transaksiList.length === 0 ? (
          <EmptyState
            icon={<HiOutlineClipboardDocumentList />}
            title="Belum ada riwayat transaksi"
            description="Data riwayat tagihan dan pembayaran akan muncul di sini secara otomatis."
          />
        ) : (
          <EmptyState
            icon={<HiOutlineMagnifyingGlass />}
            title="Tidak ditemukan"
            description="Tidak ada transaksi yang cocok dengan filter Anda."
          />
        )}
      </div>
    </>
  );
}
