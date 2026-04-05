import React from 'react';
import { Hand } from 'lucide-react';
import FloralOverlay from './FloralOverlay';
import FadeSection from './FadeSection';

const Hero = ({ 
  curtainState, 
  isScrolledPast, 
  isApple, 
  isCurtainBelow, 
  content, 
  handleCurtainClick, 
  videoRef, 
  setCurtainState 
}) => {
  return (
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
          zIndex: (isApple && isCurtainBelow) ? 0 : 9999,
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
              <div className="instruction-icon-wrapper">
                <Hand size={30} className="instruction-hand-icon" />
              </div>
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
  );
};

export default Hero;
