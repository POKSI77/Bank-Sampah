import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineUserGroup,
  HiOutlineBanknotes,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlinePlusCircle,
  HiOutlineArrowRight,
} from 'react-icons/hi2';
import { getDashboardStats } from '@/services/api';
import StatsCard from '@/components/StatsCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
  if (percent < 0.05) return null; // Sembunyikan label kalau terlalu kecil
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '13px', fontWeight: 'bold' }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/** Format angka ke Rupiah */
function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSkeleton variant="page" />;
  }

  // Format data untuk Bar Chart agar Rupiahnya lebih mudah dibaca di Tooltip
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#334155' }}>{label}</p>
          <p style={{ margin: 0, color: '#10b981', fontWeight: 700 }}>
            {formatRupiah(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate Y-axis ticks to always be multiples of 25,000
  const maxDataPemasukan = stats?.trenPemasukan ? Math.max(...stats.trenPemasukan.map(d => d.total)) : 0;
  // Memastikan grafik selalu memiliki garis vertikal yang cukup (minimal sampai 100k) agar tidak terlihat kosong
  const maxPemasukan = Math.max(maxDataPemasukan, 100000);

  // Limit max ticks to 5 so it doesn't get crowded. Calculate appropriate step.
  let step = 25000;
  while (maxPemasukan / step > 6) {
    step += 25000;
  }
  const yTicks = [];
  for (let i = 0; i <= (Math.ceil(maxPemasukan / step) * step); i += step) {
    yTicks.push(i);
  }

  return (
    <>
      {/* Page Header */}
      <header className="page-header">
        <p className="page-header-eyebrow">Desa Ngariboyo</p>
        <h1 className="page-header-title">Dashboard</h1>
        <p className="page-header-subtitle">
          Ringkasan data iuran sampah warga ?" {stats?.bulanSekarang || ''}
        </p>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          icon={<HiOutlineUserGroup />}
          label="Total Warga"
          value={stats?.totalWarga ?? 0}
          hint="Kepala keluarga terdaftar"
          color="emerald"
        />
        <StatsCard
          icon={<HiOutlineBanknotes />}
          label="Iuran Bulan Ini"
          value={formatRupiah(stats?.totalBulanIni ?? 0)}
          hint={
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#64748b' }}>
                <span>Target: {formatRupiah(stats?.targetPemasukan ?? 0)}</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary-600)' }}>{stats?.progressPemasukan ?? 0}%</span>
              </div>
              <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${stats?.progressPemasukan ?? 0}%`, background: 'var(--color-primary-500)', height: '100%', borderRadius: '4px', transition: 'width 1s ease-in-out' }} />
              </div>
            </div>
          }
          color="blue"
        />
        <StatsCard
          icon={<HiOutlineExclamationTriangle />}
          label="Belum Bayar"
          value={stats?.wargaBelumBayar ?? 0}
          hint={`${stats?.wargaSudahBayar ?? 0} sudah lunas`}
          color="amber"
        />
        <StatsCard
          icon={<HiOutlineCheckCircle />}
          label="Total Terkumpul"
          value={formatRupiah(stats?.totalIuran ?? 0)}
          hint="Seluruh periode"
          color="emerald"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions" style={{ marginBottom: 'var(--space-8)' }}>
        <Link to="/admin/warga" className="btn btn-primary">
          <HiOutlinePlusCircle /> Daftarkan Warga
        </Link>
        <Link to="/admin/transaksi" className="btn btn-secondary">
          <HiOutlineBanknotes /> Catat Transaksi
        </Link>
        <Link to="/admin/riwayat" className="btn btn-secondary">
          <HiOutlineArrowRight /> Lihat Riwayat
        </Link>
      </div>

      {/* Charts Section (Bar Chart & Pie Chart side by side) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>

        {/* Bar Chart: Tren Pemasukan */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-header-title">Tren Pemasukan (6 Bulan)</h2>
          </div>
          <div className="card-body" style={{ height: '320px', padding: '0 var(--space-4) var(--space-4)' }}>
            {stats?.trenPemasukan?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.trenPemasukan} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(val) => `Rp${val / 1000}k`}
                    ticks={yTicks}
                    domain={[0, yTicks[yTicks.length - 1] || 'dataMax']}
                  />
                  <RechartsTooltip content={<CustomBarTooltip />} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={<HiOutlineBanknotes />} title="Belum ada data" description="Tren akan muncul saat ada transaksi." />
            )}
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-header-title">Metode Pembayaran</h2>
          </div>
          <div className="card-body" style={{ height: '320px', padding: '0 var(--space-4) var(--space-4)' }}>
            {stats?.metodePembayaranData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.metodePembayaranData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.metodePembayaranData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value, name, props) => {
                      const nom = formatRupiah(props.payload.nominal || 0);
                      return [`${value} Transaksi (${nom})`, name];
                    }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState icon={<HiOutlineBanknotes />} title="Data Kosong" description="Belum ada data." />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Transaksi Terakhir & Daftar Menunggak */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-6)', alignItems: 'start' }}>

        {/* Recent Transactions (Lebih panjang) */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h2 className="card-header-title">Transaksi Terakhir</h2>
            <Link to="/admin/riwayat" className="btn btn-secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
              Lihat Semua <HiOutlineArrowRight />
            </Link>
          </div>

          {stats?.transaksiTerbaru?.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama Warga</th>
                    <th>Bulan</th>
                    <th>Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.transaksiTerbaru.map((trx, index) => {
                    const warga = stats.wargaList?.find(
                      (w) => w.id_warga === trx.id_warga
                    );
                    return (
                      <tr key={trx.id_transaksi || index}>
                        <td style={{ fontWeight: 500 }}>
                          {trx.nama_kepala_keluarga || warga?.nama_kepala_keluarga || (trx.id_warga ? `Warga #${trx.id_warga}` : 'Warga')}
                        </td>
                        <td>{trx.bulan}</td>
                        <td className="currency">
                          {formatRupiah(trx.nominal || 0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={<HiOutlineBanknotes />}
              title="Belum ada transaksi"
              description="Data transaksi akan muncul setelah Anda mencatat pembayaran iuran warga."
            >
              <Link to="/admin/transaksi" className="btn btn-primary">
                <HiOutlinePlusCircle /> Catat Transaksi Pertama
              </Link>
            </EmptyState>
          )}
        </div>

        {/* Prioritas Tagihan */}
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-header-title" style={{ color: '#ef4444' }}>
              <HiOutlineExclamationTriangle style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
              Prioritas Tagihan
            </h2>
          </div>
          <div className="card-body" style={{ padding: '0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {stats?.wargaMenunggak?.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {stats.wargaMenunggak.map((w, i) => (
                  <li key={w.id_warga} style={{
                    padding: '16px',
                    borderBottom: i === stats.wargaMenunggak.length - 1 ? 'none' : '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{w.nama}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{w.alamat}</p>
                    </div>
                    <Link to="/admin/transaksi" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                      Tagih
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ padding: '32px 16px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ color: '#10b981', fontWeight: 600, margin: '0 0 8px 0' }}>Bagus Sekali!</p>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Semua warga bulan ini sudah melunasi tagihannya.</p>
              </div>
            )}
          </div>
        </div>

        {/* Potensi Piutang */}
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-header-title" style={{ color: '#0ea5e9' }}>
              <HiOutlineBanknotes style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
              Potensi Piutang
            </h2>
          </div>
          <div className="card-body" style={{ padding: '24px 16px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px' }}>Total Seluruh Piutang</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#0ea5e9', margin: '0 0 8px 0' }}>{formatRupiah(stats?.totalPiutang || 0)}</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Dari <strong style={{ color: '#334155' }}>{stats?.totalBulanNunggak || 0}</strong> tagihan yang belum dibayar warga sejak awal mendaftar.
            </p>
            <Link to="/admin/riwayat" className="btn btn-secondary" style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}>
              Lihat Detail Riwayat
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
