import { supabase } from '@/lib/supabase';

// ==================== WARGA ====================

export async function getWarga() {
  const { data, error } = await supabase
    .from('warga')
    .select('*')
    .order('tanggal_daftar', { ascending: false, nullsFirst: false });
  
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createWarga(wargaData) {
  const { data, error } = await supabase
    .from('warga')
    .insert([{
      nama_kepala_keluarga: wargaData.nama_kepala_keluarga,
      alamat_blok_rumah: wargaData.alamat_blok_rumah,
      rt_rw: wargaData.rt_rw,
      no_hp: wargaData.no_hp
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { status: 'success', data };
}

export async function updateWarga(id, wargaData) {
  const { data, error } = await supabase
    .from('warga')
    .update({
      nama_kepala_keluarga: wargaData.nama_kepala_keluarga,
      alamat_blok_rumah: wargaData.alamat_blok_rumah,
      rt_rw: wargaData.rt_rw,
      no_hp: wargaData.no_hp
    })
    .eq('id_warga', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { status: 'success', data };
}

export async function deleteWarga(id) {
  const { error } = await supabase
    .from('warga')
    .delete()
    .eq('id_warga', id);

  if (error) throw new Error(error.message);
  return { status: 'success', message: 'Berhasil dihapus' };
}

// ==================== TRANSAKSI ====================

export async function getTransaksi() {
  const { data, error } = await supabase
    .from('transaksi_iuran')
    .select(`
      *,
      warga (
        nama_kepala_keluarga
      )
    `)
    .order('tanggal_bayar', { ascending: false, nullsFirst: false });

  if (error) {
    console.warn('Gagal fetch transaksi:', error);
    return [];
  }

  // Format data agar sesuai ekspektasi komponen (seperti JOIN di Express)
  return (data || []).map((item) => {
    const rawBulan = item.bulan_tagihan || '';
    const formattedBulan = formatBulanTagihan(rawBulan);
    
    return {
      ...item,
      bulan_tagihan_raw: rawBulan,
      bulan_tagihan: formattedBulan,
      bulan: formattedBulan,
      nominal: Number(item.nominal) || 0,
      ditagih_oleh: item.ditagih_oleh || null,
      // Ekstrak relasi ke string rata
      nama_kepala_keluarga: item.warga?.nama_kepala_keluarga || 'Warga Tidak Diketahui'
    };
  });
}

export async function createTransaksi(trxData) {
  const { data, error } = await supabase
    .from('transaksi_iuran')
    .insert([{
      id_warga: trxData.id_warga,
      bulan_tagihan: (trxData.bulan_tagihan || trxData.bulan || '').trim(),
      tanggal_bayar: trxData.tanggal_bayar || new Date().toISOString(),
      nominal: Number(trxData.nominal),
      status_pembayaran: trxData.status_pembayaran || 'Lunas',
      metode_bayar: trxData.metode_bayar || 'Tunai'
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { status: 'success', data };
}

// ==================== HELPERS ====================

/**
 * Format string "YYYY-MM" (misal "2026-09") menjadi "September 2026"
 */
export function formatBulanTagihan(yyyy_mm) {
  if (!yyyy_mm || !yyyy_mm.includes('-')) return yyyy_mm;
  const parts = yyyy_mm.split('-');
  if (parts.length !== 2) return yyyy_mm;
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const date = new Date(year, month, 1);
  return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
}

/**
 * Generate semua "YYYY-MM" dari startDate sampai bulan ini
 */
export function generateBulanList(startDateStr) {
  const result = [];
  const start = startDateStr ? new Date(startDateStr) : new Date(new Date().getFullYear(), 0, 1); // default ke awal tahun jika kosong
  const now = new Date();
  
  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  
  while (current <= end) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    result.push(`${y}-${m}`);
    current.setMonth(current.getMonth() + 1);
  }
  return result;
}

// ==================== DASHBOARD ====================

export async function getDashboardStats() {
  const [wargaList, transaksiList] = await Promise.all([
    getWarga(),
    getTransaksi(),
  ]);

  const totalWarga = wargaList.length;
  const totalIuran = transaksiList.reduce(
    (sum, trx) => sum + (Number(trx.nominal) || 0),
    0
  );

  const now = new Date();
  const bulanSekarang = now.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  const transaksiSekarang = transaksiList.filter(
    (trx) => (trx.bulan_tagihan || trx.bulan)?.toLowerCase() === bulanSekarang.toLowerCase()
  );

  const totalBulanIni = transaksiSekarang.reduce(
    (sum, trx) => sum + (Number(trx.nominal) || 0),
    0
  );

  const wargaSudahBayar = new Set(transaksiSekarang.map((trx) => trx.id_warga)).size;
  const wargaBelumBayar = Math.max(0, totalWarga - wargaSudahBayar);

  // Hitung jumlah metode pembayaran dan nominal
  const metodeMap = {};
  transaksiList.forEach(trx => {
    const met = trx.metode_bayar || 'Tunai';
    const nominal = Number(trx.nominal) || 0;
    if (!metodeMap[met]) {
      metodeMap[met] = { count: 0, nominal: 0 };
    }
    metodeMap[met].count += 1;
    metodeMap[met].nominal += nominal;
  });
  
  const metodePembayaranData = Object.keys(metodeMap).map(name => ({
    name,
    value: metodeMap[name].count,
    nominal: metodeMap[name].nominal
  }));

  // Target Pemasukan
  const targetPemasukan = totalWarga * 25000;
  const progressPemasukan = targetPemasukan > 0 ? Math.min(100, Math.round((totalBulanIni / targetPemasukan) * 100)) : 0;

  // Tren Pemasukan (6 bulan terakhir)
  const trenPemasukan = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthRaw = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = d.toLocaleString('id-ID', { month: 'short' });
    
    const total = transaksiList
      .filter(trx => trx.bulan_tagihan_raw === monthRaw)
      .reduce((sum, trx) => sum + (Number(trx.nominal) || 0), 0);
      
    trenPemasukan.push({
      name: monthLabel,
      total: total
    });
  }

  // Warga Menunggak (belum bayar bulan ini)
  const rawBulanSekarang = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const trxBulanIni = transaksiList.filter(t => t.bulan_tagihan_raw === rawBulanSekarang);
  const sudahBayarBulanIniSet = new Set(trxBulanIni.map(t => t.id_warga));
  
  const wargaMenunggak = wargaList
    .filter(w => !sudahBayarBulanIniSet.has(w.id_warga))
    .slice(0, 5)
    .map(w => ({
       id_warga: w.id_warga,
       nama: w.nama_kepala_keluarga,
       alamat: w.alamat_blok_rumah
    }));

  // Hitung Total Piutang Keseluruhan (Uang mengendap dari tunggakan bulan-bulan lalu)
  let totalPiutang = 0;
  let totalBulanNunggak = 0;
  
  for (const warga of wargaList) {
    const wargaTrx = transaksiList.filter(t => t.id_warga === warga.id_warga);
    const dibayarSet = new Set(wargaTrx.map(t => t.bulan_tagihan_raw || t.bulan_tagihan));
    const expectedBulan = generateBulanList(warga.tanggal_daftar || '2026-01-01');
    
    for (const b of expectedBulan) {
      if (!dibayarSet.has(b)) {
         totalPiutang += 25000;
         totalBulanNunggak += 1;
      }
    }
  }

  return {
    totalWarga,
    totalIuran,
    totalBulanIni,
    wargaSudahBayar,
    wargaBelumBayar,
    bulanSekarang,
    transaksiTerbaru: transaksiList.slice(0, 10),
    wargaList,
    metodePembayaranData,
    targetPemasukan,
    progressPemasukan,
    trenPemasukan,
    wargaMenunggak,
    totalPiutang,
    totalBulanNunggak,
  };
}

// ==================== RIWAYAT LENGKAP ====================

/**
 * Menggabungkan transaksi asli dan tagihan yang belum lunas
 */
export async function getRiwayatLengkap() {
  const [wargaList, transaksiList] = await Promise.all([
    getWarga(),
    getTransaksi()
  ]);

  const riwayat = [];

  for (const warga of wargaList) {
    // Cari semua transaksi milik warga ini
    const wargaTrx = transaksiList.filter(t => t.id_warga === warga.id_warga);
    const dibayarSet = new Set(wargaTrx.map(t => t.bulan_tagihan_raw || t.bulan_tagihan));

    // Daftar bulan sejak warga mendaftar (atau default ke awal tahun)
    const expectedBulan = generateBulanList(warga.tanggal_daftar || '2026-01-01');

    for (const b of expectedBulan) {
      if (dibayarSet.has(b)) {
        // Sudah dibayar, gunakan data asli
        const trx = wargaTrx.find(t => (t.bulan_tagihan_raw || t.bulan_tagihan) === b);
        if (trx) riwayat.push(trx);
      } else {
        // Belum dibayar, buat data dummy
        riwayat.push({
          id_transaksi: `DUMMY-${warga.id_warga}-${b}`,
          id_warga: warga.id_warga,
          nama_kepala_keluarga: warga.nama_kepala_keluarga,
          tanggal_bayar: null,
          bulan: formatBulanTagihan(b),
          bulan_tagihan: formatBulanTagihan(b),
          bulan_tagihan_raw: b,
          nominal: 25000,
          status_pembayaran: 'Belum Lunas',
          metode_bayar: '-'
        });
      }
    }

    // Tambahkan juga transaksi asli yang dibayar di luar bulan ekspektasi (misal bayar di muka)
    for (const trx of wargaTrx) {
      const b = trx.bulan_tagihan_raw || trx.bulan_tagihan;
      if (!expectedBulan.includes(b)) {
        riwayat.push(trx);
      }
    }
  }

  // Sort descending by tanggal (using raw string or fallback)
  riwayat.sort((a, b) => {
    const valA = a.bulan_tagihan_raw || a.tanggal_bayar || '';
    const valB = b.bulan_tagihan_raw || b.tanggal_bayar || '';
    return valB.localeCompare(valA);
  });

  return riwayat;
}
