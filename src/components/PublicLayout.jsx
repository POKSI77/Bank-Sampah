import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '@/components/Footer';
import PublicNavbar from '@/components/PublicNavbar';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    // Inisialisasi Lenis smooth scrolling (Desktop & Mobile)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Smooth scroll saat klik navigasi anchor link (misal: #tentang, #edukasi, #panduan)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href*="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        const hashIndex = href.indexOf('#');
        if (hashIndex !== -1) {
          const hash = href.slice(hashIndex);
          if (hash && hash !== '#') {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
              e.preventDefault();
              lenis.scrollTo(targetElement, { offset: -90, duration: 1.2 });
              if (window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname);
              }
            }
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Bersihkan URL jika ada hash bawaan saat pertama kali dibuka
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  // Reset scroll position ke atas saat pindah ke halaman lain (selain seksi landing page)
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    const landingPaths = ['/', '/tentang', '/edukasi', '/panduan'];
    const wasLanding = landingPaths.includes(prevPathRef.current);
    const isLanding = landingPaths.includes(location.pathname);

    if (!isLanding || (!wasLanding && isLanding && location.pathname === '/')) {
      window.scrollTo(0, 0);
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <div className="public-shell">
      <PublicNavbar />
      <main className="public-content"><Outlet /></main>
      <Footer />
    </div>
  );
}
