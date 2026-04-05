import React from 'react';
import ScratchCard from './ScratchCard';
import FadeSection from './FadeSection';
import { WEDDING_DATA } from '../constants';

const Reveal = ({ content, lang, handleReveal, allRevealed }) => {
  return (
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
  );
};

export default Reveal;
