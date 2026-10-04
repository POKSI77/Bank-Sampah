import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import FloatingMascot from '@/components/FloatingMascot';
import {
  HiOutlineAcademicCap,
  HiOutlineBuildingStorefront,
  HiOutlineArrowRight,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineStar,
  HiOutlineTrophy,
  HiOutlineGlobeAlt,
  HiOutlineLightBulb,
  HiOutlineDocumentText,
  HiOutlineLifebuoy,
  HiOutlineSquares2X2,
  HiOutlineClock,
  HiOutlineBolt,
  HiOutlineShoppingBag,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import { LuTreePine } from 'react-icons/lu';
import logoMagetan from '../assets/logo_magetan.png';
import card1Jenis from '../assets/card1_jenis.jpg';
import card2Pilah from '../assets/card2_pilah.jpg';
import card3Dampak from '../assets/card3_dampak.jpg';
import card4Solusi from '../assets/card4_solusi.jpg';
import card5Kondisi from '../assets/card5_kondisi.jpg';

/* ── Mini Game Data ── */
const dataSampahAwal = [
  { id: 1, nama: 'Kulit Pisang', kategori: 'Organik', image: '/icons/pisang.png' },
  { id: 2, nama: 'Botol Plastik', kategori: 'Anorganik', image: '/icons/botol.png' },
  { id: 3, nama: 'Baterai Bekas', kategori: 'B3', image: '/icons/baterai.png' },
  { id: 4, nama: 'Laptop Rusak', kategori: 'Elektronik', image: '/icons/laptop.png' },
  { id: 5, nama: 'Sisa Nasi', kategori: 'Organik', image: '/icons/nasi.png' },
  { id: 6, nama: 'Kaleng Minuman', kategori: 'Anorganik', image: '/icons/kaleng.png' },
  { id: 7, nama: 'Cat Semprot', kategori: 'B3', image: '/icons/cat.png' },
  { id: 8, nama: 'Charger HP', kategori: 'Elektronik', image: '/icons/charger.png' },
  { id: 9, nama: 'Daun Kering', kategori: 'Organik', image: '/icons/daun.png' },
  { id: 10, nama: 'Kantong Plastik', kategori: 'Anorganik', image: '/icons/plastik.png' },
];

const tongSampah = [
  { kategori: 'Organik', label: 'Organik', emoji: '🍃', tone: 'green' },
  { kategori: 'Anorganik', label: 'Anorganik', emoji: '♻️', tone: 'yellow' },
  { kategori: 'B3', label: 'B3', emoji: '☢️', tone: 'red' },
  { kategori: 'Elektronik', label: 'Elektronik', emoji: '⚡', tone: 'blue' },
];

const featureCards = [
  {
    title: 'Masalah Sampah',
    text: 'Kenali kebiasaan kecil yang membuat sampah menumpuk di sekitar kita.',
    icon: HiOutlineTrash,
    tone: 'orange',
  },
  {
    title: 'Edukasi Mudah',
    text: 'Panduan sederhana untuk memilah, menyimpan, dan menyetorkan sampah.',
    icon: HiOutlineBookOpen,
    tone: 'blue',
  },
  {
    title: 'Dampak Besar',
    text: 'Setiap iuran dan setoran tercatat sebagai langkah nyata untuk desa.',
    icon: HiOutlineChartBar,
    tone: 'green',
  },
  {
    title: 'Misi Bersama',
    text: 'Warga, pengurus, dan lingkungan bergerak dalam satu kebiasaan baik.',
    icon: HiOutlineUserGroup,
    tone: 'lilac',
  },
];

const typewriterPhrases = ['Gimana?', 'Masih Cuek', 'Kapan Belajar?', 'Nggak Malu?', 'Kapan Sadar?'];

const educationCards = [
  {
    icon: HiOutlineLifebuoy,
    iconBg: '#10b981',
    title: 'Mengenal Jenis Sampah',
    description: 'Pahami perbedaan antara sampah organik, anorganik, B3, dan elektronik dengan panduan lengkap.',
    image: card1Jenis,
    artikel: 'Tahukah kamu bahwa sampah yang kita hasilkan setiap hari ternyata terbagi dalam beberapa kategori? Memahami perbedaannya adalah langkah awal yang sangat penting dalam pengelolaan sampah yang bertanggung jawab.\n\nSampah Organik adalah sampah yang berasal dari makhluk hidup dan dapat terurai secara alami, seperti sisa makanan, dedaunan, dan potongan sayuran. Sampah jenis ini dapat diolah menjadi kompos yang sangat bermanfaat untuk menyuburkan tanaman.\n\nSampah Anorganik adalah sampah yang tidak mudah terurai, seperti plastik, kaca, logam, dan kertas. Meskipun sulit terurai, banyak dari sampah anorganik yang masih bisa didaur ulang menjadi produk baru yang berguna.\n\nSampah B3 (Bahan Berbahaya dan Beracun) memerlukan penanganan khusus karena bisa membahayakan kesehatan dan lingkungan. Contohnya termasuk baterai bekas, cat semprot, obat-obatan kedaluwarsa, dan pestisida.\n\nSampah Elektronik (e-waste) adalah perangkat elektronik yang sudah tidak terpakai seperti HP rusak, laptop, dan charger. Sampah ini mengandung logam berat yang berbahaya jika tidak ditangani dengan benar.',
  },
  {
    icon: HiOutlineUserGroup,
    iconBg: '#3b82f6',
    title: 'Praktik Pemilahan',
    description: 'Belajar teknik memilah sampah yang benar dari rumah dengan mudah dan praktis.',
    image: card2Pilah,
    artikel: 'Memilah sampah dari rumah sebenarnya tidaklah sulit. Yang dibutuhkan hanyalah konsistensi dan sedikit kreativitas dalam menyiapkan wadah pemilahan. Berikut panduan praktis yang bisa kamu terapkan mulai hari ini.\n\nLangkah pertama, siapkan minimal tiga wadah terpisah di area dapur atau dekat tempat sampah utama. Beri label jelas: Organik, Anorganik, dan B3/Residu. Kamu bisa menggunakan ember bekas, kardus, atau keranjang yang sudah tidak terpakai.\n\nLangkah kedua, biasakan memisahkan sampah saat membuang. Sisa makanan dan kulit buah masuk ke wadah Organik. Botol plastik, kaleng, dan kertas masuk ke Anorganik. Baterai bekas dan lampu pecah masuk ke B3.\n\nLangkah ketiga, sampah organik bisa langsung diolah menjadi kompos di halaman rumah. Sementara sampah anorganik bernilai jual bisa dikumpulkan dan disetor ke Bank Sampah secara berkala.\n\nDengan kebiasaan kecil ini, kamu sudah berkontribusi besar dalam mengurangi volume sampah yang berakhir di TPA.',
  },
  {
    icon: LuTreePine,
    iconBg: '#22c55e',
    title: 'Dampak Lingkungan',
    description: 'Memahami bagaimana tumpukan sampah mempengaruhi lingkungan dan kesehatan kita semua.',
    image: card3Dampak,
    artikel: 'Sampah yang tidak dikelola dengan baik menimbulkan dampak serius terhadap lingkungan dan kesehatan manusia. Pencemaran tanah, air, dan udara adalah konsekuensi langsung dari kebiasaan membuang sampah sembarangan.\n\nPencemaran Tanah: Sampah plastik dan bahan kimia yang tertimbun di tanah merusak kesuburan lahan pertanian. Zat-zat beracun dari sampah meresap ke dalam tanah dan mencemari sumber air tanah yang digunakan warga sehari-hari.\n\nPencemaran Air: Sampah yang dibuang ke sungai dan saluran air menyebabkan banjir dan pencemaran ekosistem perairan. Ikan dan biota laut terancam punah akibat sampah plastik yang mereka telan.\n\nPencemaran Udara: Pembakaran sampah di area terbuka menghasilkan gas beracun seperti dioksin dan furan yang sangat berbahaya bagi sistem pernapasan. Gas metana dari sampah organik yang membusuk juga berkontribusi terhadap pemanasan global.\n\nDengan mengelola sampah secara bertanggung jawab, kita melindungi tidak hanya lingkungan, tetapi juga kesehatan generasi mendatang.',
  },
  {
    icon: HiOutlineLightBulb,
    iconBg: '#eab308',
    title: 'Solusi Kreatif',
    description: 'Temukan cara inovatif untuk mengurangi dan mendaur ulang sampah dengan kreativitas.',
    image: card4Solusi,
    artikel: 'Pengelolaan sampah tidak harus membosankan. Dengan sedikit kreativitas, sampah bisa berubah menjadi sesuatu yang bernilai, bahkan menjadi sumber penghasilan tambahan bagi warga.\n\nKomposting: Sampah organik seperti sisa makanan dan daun kering bisa diolah menjadi kompos berkualitas tinggi. Proses pembuatannya sederhana dan bisa dilakukan di halaman rumah menggunakan metode Takakura atau lubang biopori.\n\nKerajinan Daur Ulang: Botol plastik bisa disulap menjadi pot tanaman cantik, vas bunga, atau hiasan dinding. Kain perca dan baju bekas bisa dijahit menjadi tas belanja yang unik dan ramah lingkungan.\n\nBank Sampah Digital: Di era modern, pengelolaan bank sampah bisa dilakukan secara digital. Pencatatan setoran, perhitungan nilai sampah, dan pelaporan bisa diakses melalui aplikasi, memudahkan warga dalam berpartisipasi.\n\nEcobrick: Teknik mengisi botol plastik dengan sampah plastik kecil hingga padat bisa menghasilkan material bangunan alternatif yang kuat dan tahan lama.',
  },
  {
    icon: HiOutlineGlobeAlt,
    iconBg: '#ef4444',
    title: 'Kondisi Saat Ini',
    description: 'Desa kita membutuhkan langkah nyata. Mari berubah mulai dari langkah kecil hari ini!',
    image: card5Kondisi,
    artikel: 'Indonesia menghasilkan lebih dari 64 juta ton sampah setiap tahunnya. Sayangnya, sebagian besar sampah tersebut berakhir di Tempat Pembuangan Akhir (TPA) yang semakin penuh. Desa Ngariboyo pun tak luput dari masalah ini. Tumpukan sampah yang tak terkelola dapat mencemari tanah, air, dan udara, hingga mengancam kesehatan warga.\n\nNamun, perubahan dimulai dari langkah kecil. Dengan memilah sampah dari rumah, setiap keluarga bisa mengurangi volume sampah yang dibuang ke TPA hingga 30%. Sampah organik bisa dijadikan kompos untuk menyuburkan tanaman, sementara sampah anorganik bernilai jual bisa disetor ke Bank Sampah.\n\nProgram Bank Sampah Desa Ngariboyo hadir sebagai solusi nyata. Warga yang aktif berpartisipasi tidak hanya membantu menjaga kebersihan lingkungan, tetapi juga mendapatkan manfaat ekonomi dari sampah yang mereka pilah. Setiap kilogram sampah yang disetor dicatat dan dihargai, menciptakan insentif positif untuk kebiasaan baik.\n\nMari bersama-sama kita ubah mindset tentang sampah. Bukan hanya sekadar barang buangan, tapi sumber daya yang bisa dimanfaatkan kembali demi masa depan desa yang lebih bersih dan sehat.',
  },
];

const sortingSteps = [
  { title: 'Siapkan Tempat', text: 'Sediakan wadah terpisah yang mudah dijangkau di rumah.', icon: HiOutlineHome },
  { title: 'Pisahkan Sesuai Jenis', text: 'Kelompokkan sampah organik, anorganik, dan residu.', icon: HiOutlineSquares2X2 },
  { title: 'Setor ke Bank Sampah', text: 'Bawa sampah bernilai ke bank sampah secara berkala.', icon: HiOutlineBuildingStorefront },
];

const factCards = [
    {
      icon: HiOutlineTrash,
      emojiBg: '#d1fae5',
      pill: '64 juta ton/tahun',
      pillBg: '#2e7447',
      pillColor: '#ffffff',
      title: 'Produksi Sampah Indonesia',
      description: 'Indonesia menghasilkan sekitar 64 juta ton sampah setiap tahunnya, dan angka ini terus meningkat.',
      cardBg: '#ffffff',
      cardBorder: '#173b2a'
    },
    {
      icon: HiOutlineGlobeAlt,
      emojiBg: '#ecfdf5',
      pill: 'Peringkat #2 Dunia',
      pillBg: '#2e7447',
      pillColor: '#ffffff',
      title: 'Sampah Plastik di Laut',
      description: 'Indonesia merupakan penyumbang sampah plastik ke laut terbesar kedua di dunia setelah Tiongkok.',
      cardBg: '#ffffff',
      cardBorder: '#173b2a'
    },
    {
      icon: HiOutlineClock,
      emojiBg: '#d1fae5',
      pill: '500 tahun vs 5 bulan',
      pillBg: '#2e7447',
      pillColor: '#ffffff',
      title: 'Waktu Penguraian',
      description: 'Plastik butuh 20–500 tahun untuk terurai, sedangkan kertas hanya butuh 2–5 bulan.',
      cardBg: '#ffffff',
      cardBorder: '#173b2a'
    },
    {
      icon: HiOutlineDocumentText,
      emojiBg: '#ecfdf5',
      pill: '17 pohon + 26.500L air',
      pillBg: '#2e7447',
      pillColor: '#ffffff',
      title: 'Daur Ulang Kertas',
      description: 'Mendaur ulang 1 ton kertas dapat menyelamatkan 17 pohon dan menghemat 26.500 liter air.',
      cardBg: '#ffffff',
      cardBorder: '#173b2a'
    },
    {
      icon: HiOutlineBolt,
      emojiBg: '#d1fae5',
      pill: 'Energi Terbarukan',
      pillBg: '#2e7447',
      pillColor: '#ffffff',
      title: 'Energi dari Sampah',
      description: 'Sampah organik dapat diolah menjadi biogas yang bisa menjadi sumber energi alternatif.',
      cardBg: '#ffffff',
      cardBorder: '#173b2a'
    },
    {
      icon: HiOutlineShoppingBag,
      emojiBg: '#ecfdf5',
      pill: '700 kantong/tahun',
      pillBg: '#2e7447',
      pillColor: '#ffffff',
      title: 'Konsumsi Plastik',
      description: 'Rata-rata orang Indonesia menggunakan 700 kantong plastik per tahun, atau hampir 2 kantong per hari.',
      cardBg: '#ffffff',
      cardBorder: '#173b2a'
    },
  ];

export default function LandingPage() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [artikelAktif, setArtikelAktif] = useState(null);

  /* ── Mini Game State ── */
  const [sampahAktif, setSampahAktif] = useState(null);
  const [sisaSampah, setSisaSampah] = useState(dataSampahAwal);
  const [skor, setSkor] = useState(0);
  const [percobaan, setPercobaan] = useState(0);
  const [shakingTong, setShakingTong] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((current) => (current + 1) % typewriterPhrases.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const currentPhrase = typewriterPhrases[phraseIndex];

  /* ── Mini Game Logic ── */
  const pilihSampah = useCallback((item) => {
    setSampahAktif((prev) => (prev?.id === item.id ? null : item));
  }, []);

  const klikTong = useCallback((kategoriTong) => {
    if (!sampahAktif) return;

    setPercobaan((p) => p + 1);

    if (sampahAktif.kategori === kategoriTong) {
      setSisaSampah((prev) => prev.filter((s) => s.id !== sampahAktif.id));
      setSkor((s) => s + 1);
      setSampahAktif(null);
    } else {
      setShakingTong(kategoriTong);
      setTimeout(() => setShakingTong(null), 500);
    }
  }, [sampahAktif]);

  const resetGame = useCallback(() => {
    setSisaSampah(dataSampahAwal);
    setSkor(0);
    setPercobaan(0);
    setSampahAktif(null);
    setShakingTong(null);
  }, []);

  const akurasi = percobaan > 0 ? Math.round((skor / percobaan) * 100) : 0;
  const gameSelesai = sisaSampah.length === 0 && percobaan > 0;

  /* ── Render artikel dengan keyword berwarna & list otomatis ── */
  const keywordMap = [
    { keyword: 'Sampah Organik', cls: 'kw-organik' },
    { keyword: 'Sampah Anorganik', cls: 'kw-anorganik' },
    { keyword: 'Sampah B3', cls: 'kw-b3' },
    { keyword: 'Sampah Elektronik', cls: 'kw-elektronik' },
  ];

  const highlightKeywords = (text) => {
    const regex = new RegExp(`(${keywordMap.map(k => k.keyword).join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => {
      const match = keywordMap.find(k => k.keyword.toLowerCase() === part.toLowerCase());
      if (match) return <strong key={i} className={match.cls}>{part}</strong>;
      return part;
    });
  };

  const renderArtikel = (artikelText) => {
    const paragraphs = artikelText.split('\n\n');
    const listKeywords = ['Sampah Organik', 'Sampah Anorganik', 'Sampah B3', 'Sampah Elektronik', 'Pencemaran Tanah:', 'Pencemaran Air:', 'Pencemaran Udara:', 'Komposting:', 'Kerajinan Daur Ulang:', 'Bank Sampah Digital:', 'Ecobrick:', 'Langkah pertama,', 'Langkah kedua,', 'Langkah ketiga,'];
    const result = [];
    let listBuffer = [];

    const flushList = () => {
      if (listBuffer.length > 0) {
        result.push(
          <ul key={`list-${result.length}`}>
            {listBuffer.map((item, j) => {
              let categoryCls = '';
              const lower = item.toLowerCase();
              if (lower.startsWith('sampah anorganik') || lower.includes('anorganik:')) {
                categoryCls = 'li-anorganik';
              } else if (lower.startsWith('sampah organik') || lower.includes('organik:')) {
                categoryCls = 'li-organik';
              } else if (lower.startsWith('sampah b3') || lower.includes('b3:')) {
                categoryCls = 'li-b3';
              } else if (lower.startsWith('sampah elektronik') || lower.includes('elektronik:') || lower.includes('e-waste')) {
                categoryCls = 'li-elektronik';
              }
              return (
                <li key={j} className={categoryCls}>
                  {highlightKeywords(item)}
                </li>
              );
            })}
          </ul>
        );
        listBuffer = [];
      }
    };

    paragraphs.forEach((para, i) => {
      const isListItem = listKeywords.some(kw => para.startsWith(kw));
      if (isListItem) {
        listBuffer.push(para);
      } else {
        flushList();
        result.push(<p key={`p-${i}`}>{highlightKeywords(para)}</p>);
      }
    });
    flushList();
    return result;
  };

  return (
    <>
      <Helmet>
        <title>Bank Sampah Ngariboyo - Layanan Iuran & Jemput Sampah</title>
        <meta
          name="description"
          content="Website resmi Bank Sampah Desa Ngariboyo, Magetan. Layanan digital pengelolaan iuran sampah warga, penjemputan sampah terpilah, dan edukasi pemilahan sampah lingkungan."
        />
        <meta
          name="keywords"
          content="Bank Sampah Ngariboyo, Iuran Sampah Ngariboyo, Jemput Sampah Ngariboyo, Bank Sampah Magetan, Desa Ngariboyo, Pemilahan Sampah, Pengelolaan Sampah Desa"
        />
        <meta name="author" content="Pemerintah Desa Ngariboyo" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.banksampahngariboyo.my.id/" />
        <meta property="og:site_name" content="Bank Sampah Ngariboyo" />
        <meta property="og:title" content="Bank Sampah Ngariboyo - Layanan Iuran & Jemput Sampah" />
        <meta property="og:description" content="Layanan digital pengelolaan iuran dan penjemputan sampah Desa Ngariboyo. Bersama wujudkan desa bersih, sehat, dan lestari." />
        <meta property="og:image" content="/icons/area-sampah.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bank Sampah Ngariboyo - Layanan Iuran & Jemput Sampah" />
        <meta name="twitter:description" content="Layanan digital pengelolaan iuran dan penjemputan sampah Desa Ngariboyo. Bersama wujudkan desa bersih, sehat, dan lestari." />

        {/* Google Site Name Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Bank Sampah Ngariboyo',
            alternateName: ['Bank Sampah Desa Ngariboyo', 'Layanan Iuran & Jemput Sampah Ngariboyo'],
            url: 'https://www.banksampahngariboyo.my.id/',
          })}
        </script>
      </Helmet>

      <div className="landing-page">
      {/* Removed Parallax background temporarily for performance */}

      {/* ── Section Navbar & Hero (Beranda) ── */}
      <div className="w-full bg-[#a8d96b] relative z-10">
        <section id="beranda" className="public-hero relative z-10">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="hero-kicker"><HiOutlineAcademicCap /> Belajar untuk desa yang lebih baik</p>
              <h1>Sampah Aja Diedukasi,<br /><span className="hero-question">Kamu <span className="dynamic-box" key={currentPhrase}>{currentPhrase}</span></span></h1>
              <p className="hero-lead">Belajar memilah, mengolah, dan mengurangi sampah dengan cara yang mudah dan menyenangkan.</p>
              <div className="hero-actions">
                <a href="#tentang" className="btn btn-hero-primary">Mulai Sekarang <HiOutlineArrowRight /></a>
                <a href="#edukasi" className="hero-text-link">Pelajari Lebih Lanjut <HiOutlineArrowRight /></a>
              </div>
            </div>
            <div className="hero-visual" aria-label="Ilustrasi gerakan bank sampah Desa Ngariboyo">
              <div className="hero-visual-card">
                <img src={logoMagetan} alt="Logo resmi Magetan" />
                <strong>Jaga bumi,<br /><em>mulai hari ini.</em></strong>
              </div>
              <span className="hero-visual-note note-one">Pilah</span>
              <span className="hero-visual-note note-two">Setor</span>
            </div>
          </div>
        </section>
      </div>

      {/* ── Section Tentang ── */}
      <div className="w-full bg-white relative z-10">
        <section id="tentang" className="feature-section relative z-10 bg-white">
          <div className="feature-heading">
            <div>
              <p className="section-kicker">Kenapa ada website ini?</p>
              <h2>Belajar sedikit,<br /><span>berdampak banyak.</span></h2>
            </div>
            <p>Ruang digital untuk memahami lingkungan dan membuat kebiasaan baik terasa lebih dekat dengan keseharian warga.</p>
          </div>
          <div className="feature-grid">
            {featureCards.map(({ title, text, icon: Icon, tone }) => (
              <article className="feature-card" key={title}>
                <div className={`feature-icon feature-icon-${tone}`}><Icon /></div>
                <h3>{title}</h3>
                <p>{text}</p>

              </article>
            ))}
          </div>
        </section>
      </div>

      {/* ── Section Edukasi ── */}
      <div className="w-full bg-white relative z-10">
        <section id="edukasi" className="education-section relative z-10 bg-white">
          <div className="education-heading">
            <p className="section-kicker">Belajar bersama</p>
            <h2>Materi Edukasi Bank Sampah</h2>
          </div>
          <div className="education-grid">
            {educationCards.map(({ icon: Icon, iconBg, title, description, image, artikel }) => (
              <article 
                className={`education-card ${activeCard === title ? 'mobile-active' : ''}`} 
                key={title} 
                style={{ backgroundImage: `url(${image})` }}
                onClick={() => setActiveCard(activeCard === title ? null : title)}
              >
                <div className="education-card-overlay" />
                <div className="education-card-icon" style={{ backgroundColor: iconBg }}>
                  <Icon style={{ color: "white", fontSize: "1.5rem" }} />
                </div>
                <div className="education-card-text">
                  <h3>{title}</h3>
                  <p>
                    {description}
                    <button
                      className="read-more-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setArtikelAktif({ icon: Icon, iconBg, title, description, image, artikel });
                      }}
                    >
                      Baca Selengkapnya ➔
                    </button>
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="facts-container">
            <div className="facts-heading">
              <h2>Fakta <span className="facts-highlight">Menarik</span> Seputar Sampah</h2>
              <p>Kenali fakta-fakta penting seputar sampah yang perlu kamu ketahui untuk mulai bergerak.</p>
            </div>
            <div className="facts-grid">
              {factCards.map(({ icon: Icon, emojiBg, pill, pillBg, pillColor, title, description, cardBg, cardBorder }) => (
                  <article 
                    className="fact-card" 
                    key={title} 
                    style={{ 
                      backgroundColor: cardBg, 
                      borderColor: cardBorder,
                      '--card-border': cardBorder,
                      '--card-bg': cardBg,
                      '--pill-bg': pillBg
                    }}
                  >
                    <div className="fact-card-emoji-box" style={{ backgroundColor: emojiBg }}>
                      <Icon style={{ color: '#173b2a', fontSize: '1.75rem' }} />
                    </div>
                    <span className="fact-card-pill" style={{ backgroundColor: pillBg, color: pillColor }}>
                      {pill}
                    </span>
                    <h3 className="fact-card-title">{title}</h3>
                    <p className="fact-card-desc">{description}</p>
                    <div className="fact-card-line"></div>
                  </article>
              ))}
            </div>
          </div>
        </section>

        <section className="public-section intro-section relative z-10 bg-white">
          <div className="section-kicker">Mengapa ini penting</div>
          <div className="intro-grid">
            <h2>Lingkungan terawat,<br /><span>desa makin kuat.</span></h2>
            <div><p>Bank Sampah Desa Ngariboyo hadir sebagai ruang gotong royong. Setiap botol yang dipilah dan setiap iuran yang tercatat adalah langkah nyata untuk menjaga rumah kita bersama.</p><div className="check-list"><span><HiOutlineCheckCircle /> Data iuran transparan</span><span><HiOutlineCheckCircle /> Sampah bernilai kembali</span></div></div>
          </div>
        </section>
      </div>

      {/* ── Section Slogan Parallax (Revealing Background - TETAP TRANSPARAN) ── */}
      <section className="parallax-slogan bg-transparent">
        <div className="parallax-overlay bg-black/40"></div>
        <div className="parallax-content">
          <span className="parallax-badge">Slogan</span>
          <h2 className="parallax-title">Reduce Reuse Recycle</h2>
          <p className="parallax-text">
            Slogan ini mengajak kita untuk mengurangi, menggunakan kembali, dan mendaur ulang sampah.
            Dengan melakukan ketiga hal ini, kita dapat mengurangi dampak negatif sampah terhadap
            lingkungan dan menciptakan dunia yang lebih bersih dan sehat.
          </p>
        </div>
      </section>

      {/* ── Section Panduan Memilah (Mini Game) ── */}
      <div className="w-full bg-white relative z-10">
        <section id="panduan" className="sorting-section relative z-10 bg-white">
          <div className="sorting-heading">
            <p className="section-kicker">Mulai dari rumah</p>
            <h2>Mulai Memilah dari Rumah</h2>
            <p>3 Langkah mudah menyelamatkan lingkungan.</p>
          </div>
          <div className="sorting-steps">
            {sortingSteps.map(({ title, text, icon: Icon }, index) => (
              <article className="sorting-step" key={title}>
                <span className="sorting-step-number">0{index + 1}</span>
                <div className="sorting-step-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          {/* ── Mini Game: Ayo Memilah! ── */}
          <div className="minigame-container">
            <div className="minigame-top-header">
              <span className="minigame-top-pill">◎ Mini Game</span>
              <h2>Game <span className="highlight-text">Pilah Sampah</span></h2>
              <p>Klik sampah lalu klik tong yang tepat! Uji pemahamanmu<br/> tentang jenis-jenis sampah</p>
            </div>

            {!gameSelesai ? (
              <>
                {/* Area sampah (Container Kuning) */}
                <div className="minigame-trash-area">
                  <div className="minigame-header">
                    <div className="minigame-title-box">
                      <h3 className="minigame-title">Area Sampah <img src="/icons/area-sampah.png" alt="" className="minigame-title-icon-img" /></h3>
                    </div>
                    <div className="minigame-stats">
                      <span className="minigame-pill pill-skor">
                        <HiOutlineStar className="minigame-stat-icon" /> Skor: <strong>{skor}</strong>
                      </span>
                      <span className="minigame-pill pill-akurasi">
                        <HiOutlineTrophy className="minigame-stat-icon" /> Akurasi: <strong>{akurasi}%</strong>
                      </span>
                      <span className="minigame-pill pill-sisa">
                        <HiOutlineTrash className="minigame-stat-icon" /> Sisa: <strong>{sisaSampah.length}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="minigame-trash-items">
                    {sisaSampah.map((item) => (
                      <button
                        key={item.id}
                        className={`minigame-trash-item pos-item-${item.id}${sampahAktif?.id === item.id ? ' active' : ''}`}
                        onClick={() => pilihSampah(item)}
                        title={item.nama}
                      >
                        <span className="minigame-trash-emoji">
                          <img src={item.image} alt={item.nama} className="minigame-trash-img" />
                          {sampahAktif?.id === item.id && <span className="minigame-check-badge">✓</span>}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Area tong sampah */}
                <div className="minigame-bins">
                  {tongSampah.map(({ kategori, label, tone }) => (
                    <button
                      key={kategori}
                      className={`minigame-bin minigame-bin-${tone}${shakingTong === kategori ? ' wrong-shake' : ''}`}
                      onClick={() => klikTong(kategori)}
                    >
                      <div className="minigame-bin-icon-wrapper">
                        <HiOutlineTrash />
                      </div>
                      <span className="minigame-bin-label">{label}</span>
                      <span className="minigame-bin-action">Klik untuk buang</span>
                    </button>
                  ))}
                </div>

                <div className="minigame-footer-actions">
                  <button className="minigame-reset-main-btn" onClick={resetGame}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Reset Game
                  </button>
                </div>
              </>
            ) : (
              /* Layar Sukses */
              <div className="minigame-success">
                <span className="minigame-success-icon"><HiOutlineCheckCircle /></span>
                <h3>Selamat, Kamu Berhasil!</h3>
                <p>Semua sampah sudah terpilah dengan benar.</p>
                <div className="minigame-success-stat">
                  <span>Skor: {skor}/{percobaan}</span>
                  <span className="minigame-pill pill-akurasi">Akurasi: {akurasi}%</span>
                </div>
                <button className="btn btn-hero-primary minigame-reset-btn" onClick={resetGame} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HiOutlineArrowPath /> Main Lagi
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── Section Cara Mendaftar (WA Flow) ── */}
      <div className="registration-flow-wrapper">
        <div className="registration-container">
          <div className="registration-header">
            <span className="registration-kicker">Cara Bergabung</span>
            <h2>Mulai dari Tiga Langkah Mudah</h2>
            <p>Kami merancang proses pendaftaran semudah mungkin. Cukup gunakan WhatsApp Anda tanpa perlu repot mengingat password.</p>
          </div>
          
          <div className="registration-grid">
            <div className="registration-connector"></div>
            
            {/* Step 1 */}
            <div className="registration-step">
              <div className="registration-circle">1</div>
              <h3>Hubungi Admin</h3>
              <p>Klik tombol pendaftaran WhatsApp di bawah atau di halaman Cek Iuran.</p>
            </div>
            
            {/* Step 2 */}
            <div className="registration-step">
              <div className="registration-circle">2</div>
              <h3>Kirim Data Diri</h3>
              <p>Kirim format otomatis yang tersedia (Nama, RT/RW, Blok) ke WhatsApp admin.</p>
            </div>
            
            {/* Step 3 */}
            <div className="registration-step">
              <div className="registration-circle">3</div>
              <h3>Akses Cek Iuran</h3>
              <p>Setelah didaftarkan, Anda bisa langsung mengecek status iuran di website ini kapan saja.</p>
            </div>
          </div>
          
          <div className="registration-cta">
            <a href="https://wa.me/6281259741038?text=Halo%20Admin%20Iuran%20Sampah,%20saya%20ingin%20mendaftar." target="_blank" rel="noreferrer" className="btn-whatsapp">
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Daftar Cepat via WhatsApp
            </a>
            <p>Nomor tujuan: Admin Desa Ngariboyo</p>
          </div>
        </div>
      </div>

      {/* ── Section Cek Iuran ── */}
      <div className="public-cta-wrapper w-full bg-white relative z-10">
        <section className="public-cta">
          <div>
            <p className="section-kicker">Warga Ngariboyo</p>
            <h2>Sudah bayar iuran bulan ini?</h2>
            <p>Cek status pembayaran Anda kapan saja, tanpa perlu login.</p>
          </div>
          <Link to="/cek-iuran" className="btn btn-dark">
            <HiOutlineMagnifyingGlass /> Cek iuran mandiri
          </Link>
        </section>
      </div>
    </div>

      {/* ── Modal Artikel Edukasi ── */}
      {artikelAktif && (
        <div className="artikel-overlay" onClick={() => setArtikelAktif(null)}>
          <div className="artikel-kertas" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
            <button className="artikel-close-btn" onClick={() => setArtikelAktif(null)}>✕</button>
            <img className="artikel-kertas-img" src={artikelAktif.image} alt={artikelAktif.title} />
            <div className="artikel-kertas-body">
              <div className="artikel-kertas-emoji" style={{ backgroundColor: artikelAktif.iconBg, display: "flex", justifyContent: "center", alignItems: "center" }}>{(() => { const ActiveIcon = artikelAktif.icon; return <ActiveIcon style={{ color: "white", fontSize: "1.5rem" }} />; })()}</div>
              <h2 className="artikel-kertas-title">{artikelAktif.title}</h2>
              <div className="artikel-kertas-text">
                {renderArtikel(artikelAktif.artikel)}
              </div>
            </div>
          </div>
        </div>
      )}

      <FloatingMascot />
    </>
  );
}
