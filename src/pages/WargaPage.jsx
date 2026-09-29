import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlinePlusCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineUserGroup,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2';
import { getWarga, createWarga, updateWarga, deleteWarga } from '@/services/api';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

const emptyForm = {
  nama_kepala_keluarga: '',
  alamat_blok_rumah: '',
  rt_rw: '',
  no_hp: '',
};

export default function WargaPage() {
  const [wargaList, setWargaList] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const data = await getWarga();
      setWargaList(data);
    } catch {
      toast.error('Gagal mengambil data warga.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getWarga()
      .then((data) => {
        if (active) setWargaList(data);
      })
      .catch(() => {
        if (active) toast.error('Gagal mengambil data warga.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'rt_rw') {
      value = value.replace(/[^0-9/]/g, '');
    }
    
    if (name === 'no_hp') {
      value = value.replace(/[^0-9]/g, '');
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Custom validation
    if (!formData.nama_kepala_keluarga || !formData.alamat_blok_rumah || !formData.rt_rw || !formData.no_hp) {
      toast.remove('validation-error');
      setTimeout(() => {
        toast.error('Mohon lengkapi semua data formulir terlebih dahulu.', { id: 'validation-error' });
      }, 50);
      return;
    }

    // Validasi Nomor HP agar terlihat seperti nomor asli Indonesia
    const noHp = formData.no_hp;
    const isValidFormat = /^08[1-9][0-9]{7,11}$/.test(noHp); // Harus 08 diikuti 1-9, total 10-14 digit
    const isFakeSequence = noHp === '081234567890' || /^08(\d)\1{7,}$/.test(noHp); // Tolak angka urut atau angka sama semua (misal 08111111111)

    if (!isValidFormat || isFakeSequence) {
      toast.remove('validation-error');
      setTimeout(() => {
        toast.error('Nomor HP tidak valid. Masukkan nomor yang benar (contoh: 0812xxxxxx).', { id: 'validation-error' });
      }, 50);
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateWarga(editingId, formData);
        toast.success('Data warga berhasil diperbarui!');
      } else {
        await createWarga(formData);
        toast.success('Data warga berhasil ditambahkan!');
      }
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan data warga.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_warga);
    setFormData({
      nama_kepala_keluarga: item.nama_kepala_keluarga || '',
      alamat_blok_rumah: item.alamat_blok_rumah || '',
      rt_rw: item.rt_rw || '',
      no_hp: item.no_hp || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus data ${item.nama_kepala_keluarga}?`)) return;
    try {
      await deleteWarga(item.id_warga);
      toast.success('Data warga berhasil dihapus.');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus data warga.');
    }
  };

  // Filter warga berdasarkan pencarian
  const filtered = wargaList.filter((w) => {
    const q = search.toLowerCase();
    return (
      w.nama_kepala_keluarga?.toLowerCase().includes(q) ||
      w.alamat_blok_rumah?.toLowerCase().includes(q) ||
      w.rt_rw?.toLowerCase().includes(q) || w.no_hp?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <LoadingSkeleton variant="table" />;
  }

  return (
    <>
      {/* Page Header */}
      <header className="page-header">
        <p className="page-header-eyebrow">Manajemen</p>
        <h1 className="page-header-title">Data Warga</h1>
        <p className="page-header-subtitle">
          Kelola data kepala keluarga yang terdaftar dalam sistem iuran sampah.
        </p>
      </header>

      {/* Actions Bar */}
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
            placeholder="Cari nama, no. HP, alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData(emptyForm);
          }}
        >
          <HiOutlinePlusCircle />
          {showForm ? 'Tutup Form' : 'Tambah Warga'}
        </button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-body">
            <h3
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-bold)',
                marginBottom: 'var(--space-5)',
              }}
            >
              {editingId ? 'Edit Data Warga' : 'Pendaftaran Warga Baru'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="nama_kepala_keluarga">
                    Nama Kepala Keluarga
                  </label>
                  <input
                    id="nama_kepala_keluarga"
                    className="form-input"
                    type="text"
                    name="nama_kepala_keluarga"
                    value={formData.nama_kepala_keluarga}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Contoh: Bapak Supardi"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="alamat_blok_rumah">
                    Alamat / Blok Rumah
                  </label>
                  <input
                    id="alamat_blok_rumah"
                    className="form-input"
                    type="text"
                    name="alamat_blok_rumah"
                    value={formData.alamat_blok_rumah}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Contoh: Blok B No. 5"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="rt_rw">
                    RT / RW
                  </label>
                  <input
                    id="rt_rw"
                    className="form-input"
                    type="text"
                    name="rt_rw"
                    value={formData.rt_rw}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Contoh: 02/04"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="no_hp">
                    No. HP
                  </label>
                  <input
                    id="no_hp"
                    className="form-input"
                    type="text"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                disabled={submitting}
              >
                {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Daftarkan Warga'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Warga Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-header-title">
            Daftar Warga{' '}
            <span
              className="badge badge-success"
              style={{ marginLeft: 'var(--space-2)' }}
            >
              {wargaList.length} terdaftar
            </span>
          </h2>
        </div>

        {filtered.length > 0 ? (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Kepala Keluarga</th>
                  <th>Alamat / Blok</th>
                  <th>RT/RW</th>
                  <th>No. HP</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, index) => (
                  <tr key={item.id_warga}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 500 }}>
                      {item.nama_kepala_keluarga}
                    </td>
                    <td>{item.alamat_blok_rumah}</td>
                    <td>{item.rt_rw}</td>
                    <td>{item.no_hp || '—'}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-secondary btn-icon" onClick={() => handleEdit(item)} aria-label={"Edit " + item.nama_kepala_keluarga}><HiOutlinePencilSquare /></button>
                          <button className="btn btn-danger btn-icon" onClick={() => handleDelete(item)} aria-label={"Hapus " + item.nama_kepala_keluarga}><HiOutlineTrash /></button>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : search ? (
          <EmptyState
            icon={<HiOutlineMagnifyingGlass />}
            title="Tidak ditemukan"
            description={"Tidak ada warga yang cocok dengan pencarian \"" + search + "\"."}
          />
        ) : (
          <EmptyState
            icon={<HiOutlineUserGroup />}
            title="Belum ada warga terdaftar"
            description="Mulai dengan mendaftarkan warga baru melalui tombol di atas."
          />
        )}
      </div>
    </>
  );
}
