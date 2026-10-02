import React, { useState, useEffect, useRef } from 'react';
import './FloatingMascot.css';

const facts = [
  "Tahukah kamu? Sampah organik bisa jadi kompos dalam 2-3 bulan!",
  "Satu botol plastik butuh 450 tahun untuk terurai di alam!",
  "Mendaur ulang 1 ton kertas menyelamatkan 17 pohon lho!",
  "Buang sampah pada tempatnya = pahlawan lingkungan!",
  "Baterai bekas itu beracun, jangan dibuang sembarangan ya!",
  "Sampah makanan menyumbang gas metana yang bikin bumi makin panas!",
  "Tas kain bisa dipakai berulang kali, yuk kurangi kantong plastik!",
  "Pisahkan sampah organik dan anorganik biar gampang didaur ulang!",
  "Yuk kurangi sedotan plastik, kasihan penyu di laut!",
  "Ubah botol bekas jadi pot tanaman, kreatif dan asri!",
  "Kaca bekas bisa didaur ulang 100% tanpa kehilangan kualitasnya lho!",
  "Daripada dibuang, pakaian tak terpakai bisa disumbangkan atau dirombak!",
  "Bawa botol minum (tumbler) sendiri hemat uang dan selamatkan bumi!",
  "Popok sekali pakai butuh 500 tahun untuk hancur. Yuk lebih bijak!",
  "Minyak jelantah jangan dibuang ke wastafel, bisa menyumbat saluran air!",
  "Satu kaleng aluminium daur ulang hemat energi untuk menyalakan TV selama 3 jam!",
  "Pilah sampah kertas yang bersih, jangan dicampur sampah basah ya!",
  "Sisa potongan sayur bisa ditanam lagi pakai metode regrow lho!",
  "Hindari beli makanan dengan kemasan plastik berlapis (sachet), susah didaur ulang!",
  "Sampah puntung rokok itu racun bagi biota air, jangan buang ke selokan!",
  "Beli barang secukupnya saja, kurangi perilaku konsumtif untuk kurangi sampah!",
  "Barang elektronik bekas (e-waste) punya nilai jual tinggi kalau disetor ke bank sampah!",
  "Yuk buat ekoenzim dari sisa kulit buah, serbaguna untuk bersih-bersih!",
  "Memilah sampah dari rumah adalah langkah pertama aksi cinta bumi yang nyata!"
];

const bubbleGradients = [
  'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Merah
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Kuning/Oranye
  'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Hijau
  'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', // Biru
  'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', // Ungu
  'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', // Pink
];

const FloatingMascot = () => {
  const [showBubble, setShowBubble] = useState(false);
  const [currentFact, setCurrentFact] = useState(facts[0]);
  const [currentColor, setCurrentColor] = useState(bubbleGradients[0]);
  const [isWiggling, setIsWiggling] = useState(false);
  const hideTimerRef = useRef(null);

  // Bersihkan timer saat komponen unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const handleClick = () => {
    // Bersihkan timer lama supaya nggak tiba-tiba hilang pas baru diklik
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    // Pilih fakta random
    let newFact = currentFact;
    while (newFact === currentFact) {
      newFact = facts[Math.floor(Math.random() * facts.length)];
    }
    
    // Pilih warna random
    let newColor = currentColor;
    while (newColor === currentColor) {
      newColor = bubbleGradients[Math.floor(Math.random() * bubbleGradients.length)];
    }
    
    setCurrentFact(newFact);
    setCurrentColor(newColor);
    setShowBubble(true);
    setIsWiggling(true);
    
    setTimeout(() => setIsWiggling(false), 500);
    
    // Auto-hide setelah 5 detik
    hideTimerRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 5000);
  };

  return (
    <div className="floating-mascot-container">
      {/* Speech Bubble */}
      <div 
        className={`mascot-bubble ${showBubble ? 'show' : ''}`}
        style={{ background: currentColor, pointerEvents: showBubble ? 'auto' : 'none', cursor: 'pointer' }}
        onClick={() => setShowBubble(false)}
        title="Klik untuk menutup"
      >
        {currentFact}
      </div>

      {/* Mascot Image */}
      <div 
        className={`mascot-image-wrapper ${isWiggling ? 'wiggle' : ''}`}
        onClick={handleClick}
      >
        <img 
          src="/icons/maskot.png" 
          alt="Maskot Bank Sampah" 
          className="mascot-img"
        />
        {/* Notif dot biar user tau bisa diklik */}
        {!showBubble && <div className="mascot-ping"></div>}
      </div>
    </div>
  );
};

export default FloatingMascot;
