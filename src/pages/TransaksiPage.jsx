import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlineBanknotes,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
} from 'react-icons/hi2';
import { getWarga, createTransaksi, getRiwayatLengkap } from '@/services/api';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const initialFormData = {
  id_warga: '',
  nominal_per_bulan: 25000,
  tanggal_bayar: '',
  metode_bayar: 'Tunai',
  selected_months: [],
  custom_month: ''
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

export default function TransaksiPage() {
  const [wargaList, setWargaList] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([getWarga(), getRiwayatLengkap()])
      .then(([warga, r]) => {
        setWargaList(warga);
        setRiwayat(r);
      })
      .catch(() => toast.error('Gagal mengambil data dari server.'))
      .finally(() => setLoading(false));
  }, []);

  const unpaidMonths = useMemo(() => {
    if (!formData.id_warga) return [];
    return riwayat
      .filter(r => r.id_warga === formData.id_warga && r.status_pembayaran === 'Belum Lunas')
      .sort((a, b) => a.bulan_tagihan_raw.localeCompare(b.bulan_tagihan_raw));
  }, [formData.id_warga, riwayat]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleCheckboxChange = (monthRaw) => {
    setFormData((prev) => {
      const selected = prev.selected_months.includes(monthRaw)
        ? prev.selected_months.filter(m => m !== monthRaw)
        : [...prev.selected_months, monthRaw];
      return { ...prev, selected_months: selected };
    });
    setSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(false);

    const monthsToPay = [...formData.selected_months];
    if (formData.custom_month && !monthsToPay.includes(formData.custom_month)) {
      monthsToPay.push(formData.custom_month);
    }

    if (monthsToPay.length === 0) {
      toast.error('Pilih minimal 1 bulan untuk dibayar!');
      return;
    }

    setSubmitting(true);
    try {
      for (const m of monthsToPay) {
        await createTransaksi({
          id_warga: formData.id_warga,
          bulan_tagihan: m,
          nominal: formData.nominal_per_bulan,
          metode_bayar: formData.metode_bayar,
          tanggal_bayar: formData.tanggal_bayar
        });
      }
      toast.success(`Berhasil mencatat ${monthsToPay.length} bulan iuran!`);
      
      // Refresh riwayat so checkboxes update
      const updatedRiwayat = await getRiwayatLengkap();
      setRiwayat(updatedRiwayat);
      
      setFormData(initialFormData);
      setSuccess(true);
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan transaksi. Pastikan server backend menyala.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalMonths = formData.selected_months.length + (formData.custom_month ? 1 : 0);
  const totalNominal = totalMonths * (Number(formData.nominal_per_bulan) || 0);

  if (loading) {
    return <LoadingSkeleton variant="form" />;
  }

  return (
    <>
      <header className="page-header">
        <p className="page-header-eyebrow">Pencatatan</p>
        <h1 className="page-header-title">Transaksi Iuran</h1>
        <p className="page-header-subtitle">
          Catat pembayaran iuran bulanan warga dengan rapi dan terstruktur.
        </p>
      </header>

      {success && (
        <div className="alert alert-success admin-form-alert">
          <HiOutlineCheckCircle style={{ fontSize: '1.3rem', flexShrink: 0 }} />
          <div>
            <strong>Berhasil!</strong> Data iuran telah tersimpan.{' '}
            <Link to="/admin/riwayat" style={{ fontWeight: 600 }}>
              Lihat riwayat &rarr;
            </Link>
          </div>
        </div>
      )}

      <div className="card admin-form-card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="id_warga">
                Kepala Keluarga
              </label>
              <select
                id="id_warga"
                name="id_warga"
                className="form-select"
                value={formData.id_warga}
                onChange={(e) => {
                  handleChange(e);
                  // Reset selected months when warga changes
                  setFormData(prev => ({ ...prev, selected_months: [] }));
                }}
                required
                disabled={submitting}
              >
                <option value="">Pilih kepala keluarga</option>
                {wargaList.map((warga) => (
                  <option key={warga.id_warga} value={warga.id_warga}>
                    {warga.nama_kepala_keluarga} — {warga.alamat_blok_rumah}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Bulan Tagihan
              </label>
              
              {formData.id_warga && unpaidMonths.length > 0 && (
                <div className="unpaid-months-container">
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                    Tunggakan Belum Lunas:
                  </p>
                  <div className="unpaid-months-grid">
                    {unpaidMonths.map(bill => {
                      const isChecked = formData.selected_months.includes(bill.bulan_tagihan_raw);
                      return (
                        <label key={bill.bulan_tagihan_raw} className={`unpaid-month-item ${isChecked ? 'checked' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(bill.bulan_tagihan_raw)}
                            disabled={submitting}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }}
                          />
                          <span style={{ fontSize: '0.9rem' }}>{bill.bulan_tagihan}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ marginTop: formData.id_warga && unpaidMonths.length > 0 ? '12px' : '0' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Tambahkan bulan lain secara manual (opsional):
                </p>
                <input
                  id="custom_month"
                  name="custom_month"
                  type="month"
                  className="form-input"
                  value={formData.custom_month}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="nominal_per_bulan">
                Nominal Pembayaran (Per Bulan)
              </label>
              <input
                id="nominal_per_bulan"
                name="nominal_per_bulan"
                type="number"
                min="0"
                step="1000"
                className="form-input"
                value={formData.nominal_per_bulan}
                onChange={handleChange}
                required
                disabled={submitting}
              />
              <span className="form-hint">
                <HiOutlineBanknotes style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Total yang harus dibayar: <strong>{formatRupiah(totalNominal)}</strong> ({totalMonths} bulan)
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="metode_bayar">
                Metode Pembayaran
              </label>
              <select id="metode_bayar" name="metode_bayar" className="form-select" value={formData.metode_bayar} onChange={handleChange} required disabled={submitting}>
                <option value="Tunai">Tunai</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tanggal_bayar">
                Tanggal Pembayaran
              </label>
              <input
                type="date"
                name="tanggal_bayar"
                id="tanggal_bayar"
                className="form-input"
                value={formData.tanggal_bayar}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={submitting || wargaList.length === 0 || totalMonths === 0}
            >
              {submitting ? 'Menyimpan...' : `Simpan ${totalMonths} Transaksi`}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
