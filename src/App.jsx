import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { WEDDING_DATA } from './constants';
import Confetti from 'react-confetti';
import { Volume2, VolumeX } from 'lucide-react';

// Import Modular Components
import Hero from './components/Hero';
import Reveal from './components/Reveal';
import Countdown from './components/Countdown';
import Venue from './components/Venue';
import ThankYou from './components/ThankYou';

function App() {
  const [curtainState, setCurtainState] = useState('closed'); // 'closed', 'opening', 'opened'
  const [timeLeft, setTimeLeft] = useState({ days: '000', hours: '00', mins: '00', secs: '00' });
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const audioRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const videoRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Monitor scroll position to hide the complex SVG video filter when out of view
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > window.innerHeight * 0.4) {
        setIsScrolledPast(true);
      } else {
        setIsScrolledPast(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && !window.MSStream;
  const [isCurtainBelow, setIsCurtainBelow] = useState(false);

  useEffect(() => {
    if (curtainState === 'opening' && isApple) {
      const timer = setTimeout(() => setIsCurtainBelow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [curtainState, isApple]);

  const handleCurtainClick = () => {
    if (curtainState === 'closed') {
      setCurtainState('opening');
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.error("Video play failed", err));
      }
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(err => console.log("Autoplay still blocked:", err));
      }
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Manual play blocked:", e));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const isMusicPlayingRef = useRef(isMusicPlaying);
  useEffect(() => {
    isMusicPlayingRef.current = isMusicPlaying;
  }, [isMusicPlaying]);

  useEffect(() => {
    const handlePause = () => {
      if (audioRef.current && isMusicPlayingRef.current) {
        audioRef.current.pause();
      }
    };

    const handleResume = () => {
      if (audioRef.current && isMusicPlayingRef.current) {
        audioRef.current.play()
          .catch(err => console.log("Resume blocked:", err));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') handlePause();
      else handleResume();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handlePause);
    window.addEventListener('focus', handleResume);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handlePause);
      window.removeEventListener('focus', handleResume);
    };
  }, []);

  const content = WEDDING_DATA[lang];

  useEffect(() => {
    const targetDate = WEDDING_DATA.targetDate;

    const tick = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) return;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(3, '0'),
        hours: hours.toString().padStart(2, '0'),
        mins: mins.toString().padStart(2, '0'),
        secs: secs.toString().padStart(2, '0')
      });
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const [revealedStates, setRevealedStates] = useState([false, false, false]);
  const allRevealed = revealedStates.every(v => v === true);

  useEffect(() => {
    if (allRevealed) {
      setShowConfetti(true);
      setIsConfettiActive(true);
      const stopSpawn = setTimeout(() => setIsConfettiActive(false), 3000);
      const unmount = setTimeout(() => setShowConfetti(false), 7000);
      return () => {
        clearTimeout(stopSpawn);
        clearTimeout(unmount);
      };
    }
  }, [allRevealed]);

  const handleReveal = (index) => {
    setRevealedStates(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  useEffect(() => {
    if (curtainState === 'closed') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [curtainState]);

  return (
    <div className="app-container" data-lang={lang}>
      <audio ref={audioRef} src="/assets/music.mp3" loop />

      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 10000 }}
          recycle={isConfettiActive}
          numberOfPieces={300}
          gravity={0.15}
        />
      )}

      {/* SVG Chroma Key Filter */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <defs>
          <filter id="chroma-key-white" colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1.5 -1.5 -1.5 0 4" />
          </filter>
        </defs>
      </svg>

      {/* Floating Controls */}
      <div className="floating-lang-switch">
        <div className="lang-switch">
          <span className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</span>
          <span className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>HI</span>
        </div>
      </div>

      <button className="music-toggle" onClick={toggleMusic} aria-label="Toggle Music">
        {isMusicPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      <main className="content-wrapper">
        <Hero 
          curtainState={curtainState}
          isScrolledPast={isScrolledPast}
          isApple={isApple}
          isCurtainBelow={isCurtainBelow}
          content={content}
          handleCurtainClick={handleCurtainClick}
          videoRef={videoRef}
          setCurtainState={setCurtainState}
        />

        <Reveal 
          content={content}
          lang={lang}
          handleReveal={handleReveal}
          allRevealed={allRevealed}
        />

        {allRevealed && (
          <>
            <Countdown content={content} timeLeft={timeLeft} />
            <Venue content={content} />
            <ThankYou content={content} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;

