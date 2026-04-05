import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ScratchCard from './components/ScratchCard';
import FloralOverlay from './components/FloralOverlay';
import { WEDDING_DATA } from './constants';
import Confetti from 'react-confetti';
// Component for Fade In Sections
const FadeSection = ({ children, className = '' }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={domRef}
      className={`fade-up ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
};

function App() {
  const [curtainState, setCurtainState] = useState('closed'); // 'closed', 'opening'
  const [timeLeft, setTimeLeft] = useState({ days: '000', hours: '00', mins: '00', secs: '00' });
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const videoRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Monitor scroll position to hide the complex SVG video filter when out of view
  // This physically bypasses Chrome's off-screen hardware acceleration bug (the black bar!)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      // Hide the curtain wrapper completely if the user has scrolled past 40vh
      if (scrollY > window.innerHeight * 0.4) {
        setIsScrolledPast(true);
      } else {
        setIsScrolledPast(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check in case of page refresh/pre-scrolled
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Curtain click
  const handleCurtainClick = () => {
    if (curtainState === 'closed') {
      setCurtainState('opening');
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.error("Video play failed", err));
      }
    }
  };

  const content = WEDDING_DATA[lang];

  // Countdown logic
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
      setIsConfettiActive(true); // Creates continuous stream

      // Stop spawning new confetti after 3 seconds
      const stopSpawn = setTimeout(() => setIsConfettiActive(false), 3000);

      // Fully unmount the canvas after 7 seconds to let pieces fall naturally
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

  // Lock scrolling when curtains are closed
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
      {/* SVG Chroma Key Filter to make the MP4's white hole mathematically transparent while keeping red opaque */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none', visibility: 'hidden' }}>
        <filter id="chroma-key-white" filterUnits="objectBoundingBox" x="-50%" y="-50%" width="200%" height="200%">
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            -2 -2 -2 0 5
          " />
        </filter>
      </svg>

      {/* SVG Chroma Key Filter to make the MP4's white hole mathematically transparent while keeping red opaque */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none', visibility: 'hidden' }}>
        <filter id="chroma-key-white" filterUnits="objectBoundingBox" x="-50%" y="-50%" width="200%" height="200%">
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            -2 -2 -2 0 5
          " />
        </filter>
      </svg>

      {/* Floating Language Switcher */}
      <div className="floating-lang-switch">
        <div className="lang-switch">
          <span className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</span>
          <span className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>HI</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="content-wrapper">
        <FadeSection className="hero">
          {/* Curtain Overlay 
              - Uses 'fixed' positioning during the critical opening phase to prevent SVG filter artifacts.
              - Transitions to 'absolute' once opened so it stays attached to the Hero section and scrolls naturally.
          */}
          <div
            className={`curtain-overlay ${curtainState === 'opening' ? 'opening' : ''} ${isScrolledPast ? 'hidden-past' : ''}`}
            onClick={handleCurtainClick}
            style={{
              position: curtainState === 'opening' ? 'fixed' : 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              zIndex: 9999,
              pointerEvents: curtainState === 'opened' ? 'none' : 'auto',
              display: isScrolledPast ? 'none' : 'block' // Clean disposal when scrolled way past
            }}
          >
            <video
              ref={videoRef}
              onEnded={() => setCurtainState('opened')}
              className="curtain-video"
              src="/assets/curtain-video.mp4"
              poster="/assets/curtain-closed.jpg"
              playsInline
              muted
            />
            {curtainState === 'closed' && (
              <div className="curtain-instruction">
                <div className="instruction-box">
                  <span className="icon">👆</span>
                  <p>{content.curtainTap}</p>
                </div>
              </div>
            )}
          </div>

          <div className="hero-names-wrapper">
            <FloralOverlay src="/assets/floral_pattern.png" className="hero-floral" />
            <h1 className="names">
              <span className="name-part">{content.nameParts.first}</span>
              <span className="name-sep">{content.nameParts.sep}</span>
              <span className="name-part">{content.nameParts.second}</span>
            </h1>
            <p className="subtitle">{content.subtitle}</p>
          </div>
          {curtainState === 'opening' && (
            <div className="scroll-indicator">
              <div className="mouse">
                <div className="wheel"></div>
              </div>
              <p>{content.scrollDown}</p>
            </div>
          )}
        </FadeSection>

        <FadeSection className="reveal-section">
          <h2 className="section-title script-title">{content.revealTitle}</h2>
          <p className="section-subtitle">{content.revealSubtitle}</p>
          <div className="scratch-container">
            <ScratchCard text={new Date(WEDDING_DATA.targetDate).getDate().toString()} onReveal={() => handleReveal(0)} />
            <ScratchCard text={new Date(WEDDING_DATA.targetDate).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'short' })} onReveal={() => handleReveal(1)} />
            <ScratchCard text={new Date(WEDDING_DATA.targetDate).getFullYear().toString()} onReveal={() => handleReveal(2)} />
          </div>
          {allRevealed ? (
            <div className="scroll-indicator" style={{ animationDelay: '0.5s' }}>
              <div className="mouse">
                <div className="wheel"></div>
              </div>
              <p>{content.scrollDown}</p>
            </div>
          ) : (
            <p className="scratch-hint">{content.scratchHint}</p>
          )}
        </FadeSection>

        {allRevealed && (
          <>
            <FadeSection className="countdown-section">
              <h2 className="section-title script-title">{content.countdownTitle}</h2>
              <div className="timer">
                <div className="time-box"><span className="number">{timeLeft.days}</span><span className="label">{content.timeLabels.days}</span></div>
                <div className="time-box"><span className="number">{timeLeft.hours}</span><span className="label">{content.timeLabels.hours}</span></div>
                <div className="time-box"><span className="number">{timeLeft.mins}</span><span className="label">{content.timeLabels.mins}</span></div>
                <div className="time-box"><span className="number">{timeLeft.secs}</span><span className="label">{content.timeLabels.secs}</span></div>
              </div>
            </FadeSection>

            <FadeSection className="venue-section">
              <h2 className="section-title script-title">{content.venueSectionTitle}</h2>
              <div className="venue-content">
                <div className="venue-image">
                  <img src="/assets/villa_sketch.png" alt="Venue Sketch" />
                </div>
                <div className="venue-details">
                  <h2 className="venue-name title-serif">{content.venueTitle}</h2>
                  <p className="venue-address">{content.venueAddressPart1} <br /> {content.venueAddressPart2}</p>
                </div>
              </div>
            </FadeSection>

            <FadeSection className="thank-you-section">
              <footer className="main-footer">
                <h2 className="script-title">{content.footerThankYou}</h2>
                <p className="footer-names">{content.names}</p>
              </footer>
            </FadeSection>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
