import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  HiOutlineHome, 
  HiOutlineCreditCard, 
  HiOutlineTruck,
  HiOutlineArrowLeft
} from 'react-icons/hi2';
import logoMagetan from '../assets/logo_magetan.png';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 - Halaman Tidak Ditemukan | Bank Sampah Ngariboyo</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="not-found-section" aria-label="Halaman tidak ditemukan">
        <div className="not-found-card not-found-card-rich">
          {/* Header Brand Pill */}
          <div className="not-found-header-brand">
            <img src={logoMagetan} alt="Logo Magetan" className="not-found-brand-logo" />
            <span className="not-found-brand-name">Bank Sampah Desa Ngariboyo</span>
          </div>

          {/* 4 [Mascot Search] 4 Visual */}
          <div className="eco-404-scene">
            <span className="eco-404-digit eco-digit-left">4</span>

            <div className="eco-mascot-portal">
              <div className="eco-portal-glow"></div>
              <svg 
                className="eco-mascot-svg" 
                viewBox="0 0 200 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Searchlight Cone */}
                <path 
                  d="M100 100 L40 185 L160 185 Z" 
                  fill="url(#lightBeam)" 
                  className="mascot-searchlight"
                  opacity="0.3"
                />

                {/* Ground Shadow */}
                <ellipse cx="100" cy="174" rx="44" ry="8" fill="#173b2a" opacity="0.12" />

                {/* Bin Body (Cute Friendly Mascot) */}
                <g className="mascot-body-group">
                  {/* Feet */}
                  <rect x="80" y="163" width="12" height="9" rx="4.5" fill="#1d4832" />
                  <rect x="108" y="163" width="12" height="9" rx="4.5" fill="#1d4832" />

                  {/* Left Arm (Resting on hip) */}
                  <path d="M72 118 Q58 126 65 135" stroke="#27633c" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                  <circle cx="65" cy="135" r="4.5" fill="#3b965c" />

                  {/* Main Bin Bucket */}
                  <path 
                    d="M68 85 L74 162 C74.5 166.5 78.2 170 82.7 170 H117.3 C121.8 170 125.5 166.5 126 162 L132 85 Z" 
                    fill="url(#binGradient)" 
                  />

                  {/* 3D Side Shadow */}
                  <path 
                    d="M125 85 L121 162 C120.7 164.5 119.5 166 117.5 166 H114 L120 85 Z" 
                    fill="#173b2a" 
                    opacity="0.25"
                  />

                  {/* Authentic 3-Arrow Recycling Symbol Badge on Belly */}
                  <circle cx="100" cy="133" r="14" fill="#ffffff" />
                  <g transform="translate(91.5, 124.5) scale(0.0332)">
                    <path 
                      d="M184.561 261.903c3.232 13.997-12.123 24.635-24.068 17.168l-40.736-25.455-50.867 81.402C55.606 356.273 70.96 384 96.012 384H148c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12H96.115c-75.334 0-121.302-83.048-81.408-146.88l50.822-81.388-40.725-25.448c-12.081-7.547-8.966-25.961 4.879-29.158l110.237-25.45c8.611-1.988 17.201 3.381 19.189 11.99l25.452 110.237zm98.561-182.915l41.289 66.076-40.74 25.457c-12.051 7.528-9 25.953 4.879 29.158l110.237 25.45c8.672 1.999 17.215-3.438 19.189-11.99l25.45-110.237c3.197-13.844-11.99-24.719-24.068-17.168l-40.687 25.424-41.263-66.082c-37.521-60.033-125.209-60.171-162.816 0l-17.963 28.766c-3.51 5.62-1.8 13.021 3.82 16.533l33.919 21.195c5.62 3.512 13.024 1.803 16.536-3.817l17.961-28.743c12.712-20.341 41.973-19.676 54.257-.022zM497.288 301.12l-27.515-44.065c-3.511-5.623-10.916-7.334-16.538-3.821l-33.861 21.159c-5.62 3.512-7.33 10.915-3.818 16.536l27.564 44.112c13.257 21.211-2.057 48.96-27.136 48.96H320V336.02c0-14.213-17.242-21.383-27.313-11.313l-80 79.981c-6.249 6.248-6.249 16.379 0 22.627l80 79.989C302.689 517.308 320 510.3 320 495.989V448h95.88c75.274 0 121.335-82.997 81.408-146.88z" 
                      fill="#2e7447" 
                    />
                  </g>

                  {/* Bin Rim */}
                  <rect x="64" y="78" width="72" height="9" rx="4.5" fill="#225b37" />

                  {/* Bin Lid with Handle */}
                  <g className="mascot-lid-group">
                    <rect x="65" y="69" width="70" height="9" rx="4.5" fill="url(#lidGradient)" />
                    <rect x="91" y="61" width="18" height="8" rx="4" fill="#225b37" />
                  </g>

                  {/* Eyes (Blinking & Looking) */}
                  <g className="mascot-eyes">
                    {/* Left Eye */}
                    <ellipse cx="88" cy="106" rx="6.5" ry="8" fill="#ffffff" />
                    <circle cx="89" cy="106" r="4" fill="#173b2a" className="mascot-pupil" />
                    <circle cx="87.5" cy="103.5" r="1.5" fill="#ffffff" />

                    {/* Right Eye */}
                    <ellipse cx="112" cy="106" rx="6.5" ry="8" fill="#ffffff" />
                    <circle cx="113" cy="106" r="4" fill="#173b2a" className="mascot-pupil" />
                    <circle cx="111.5" cy="103.5" r="1.5" fill="#ffffff" />

                    {/* Cute Rosy Cheeks */}
                    <ellipse cx="79" cy="115" rx="5" ry="3" fill="#f87171" opacity="0.65" />
                    <ellipse cx="121" cy="115" rx="5" ry="3" fill="#f87171" opacity="0.65" />

                    {/* Cute Smile Mouth */}
                    <path d="M96 117 Q100 121 104 117" stroke="#173b2a" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                  </g>

                  {/* Right Arm Holding Magnifying Glass Properly */}
                  <g className="mascot-magnifier">
                    {/* Right Arm */}
                    <path d="M125 118 Q140 125 134 135" stroke="#27633c" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                    
                    {/* Handle properly attached to the bottom of the glass */}
                    <line x1="139" y1="129" x2="128" y2="141" stroke="#1f4f31" strokeWidth="5" strokeLinecap="round" />
                    
                    {/* Hand gripping the handle */}
                    <circle cx="132" cy="136" r="5" fill="#3b965c" stroke="#1f4f31" strokeWidth="1" />

                    {/* Magnifier Glass Rim (Green & Gold trim, attached seamlessly) */}
                    <circle cx="150" cy="116" r="17" stroke="#2e7447" strokeWidth="4.5" fill="rgba(240, 253, 244, 0.45)" />
                    <circle cx="150" cy="116" r="14.5" stroke="#dcfce7" strokeWidth="1.5" fill="none" opacity="0.7" />

                    {/* Glass Reflection Glint */}
                    <path d="M142 108 A11 11 0 0 1 156 106" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />
                  </g>
                </g>

                {/* SVG Gradients */}
                <defs>
                  <linearGradient id="binGradient" x1="68" y1="85" x2="132" y2="170" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3ea364" />
                    <stop offset="1" stopColor="#225b37" />
                  </linearGradient>
                  <linearGradient id="lidGradient" x1="65" y1="69" x2="135" y2="78" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4bc277" />
                    <stop offset="1" stopColor="#296b42" />
                  </linearGradient>
                  <radialGradient id="lightBeam" cx="50%" cy="0%" r="90%">
                    <stop offset="0%" stopColor="#a8d96b" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#2e7447" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            <span className="eco-404-digit eco-digit-right">4</span>
          </div>

          {/* Status Badge */}
          <div className="not-found-badge">
            <span className="not-found-pulse"></span>
            404 ERROR • PAGE NOT FOUND
          </div>

          <h1 className="not-found-title">
            Waduh, Halamannya Belum Ditemukan!
          </h1>

          <p className="not-found-desc">
            Maskot Bank Sampah Ngariboyo sudah mencari ke seluruh penjuru, namun alamat web yang Anda tuju sepertinya salah ketik, sudah dipindahkan, atau telah didaur ulang.
          </p>

          {/* Quick Action Navigation */}
          <div className="not-found-actions">
            <Link to="/" className="btn btn-not-found-primary">
              <HiOutlineHome className="text-lg" /> Kembali ke Beranda
            </Link>
            <Link to="/cek-iuran" className="btn btn-not-found-secondary">
              <HiOutlineCreditCard className="text-lg" /> Cek Iuran Warga
            </Link>
            <Link to="/jemput" className="btn btn-not-found-outline">
              <HiOutlineTruck className="text-lg" /> Jemput Sampah
            </Link>
          </div>

          {/* Return button */}
          <div className="not-found-footer-note">
            <button 
              type="button" 
              onClick={() => window.history.back()} 
              className="not-found-back-link"
            >
              <HiOutlineArrowLeft /> Kembali ke halaman sebelumnya
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
