import React from 'react';
import FadeSection from './FadeSection';

const Countdown = ({ content, timeLeft, className = '' }) => {
  return (
    <FadeSection className={`countdown-section ${className}`}>
      <h2 className="section-title script-title">{content.countdownTitle}</h2>
      <div className="timer">
        <div className="time-box"><span className="number">{timeLeft.days}</span><span className="label">{content.timeLabels.days}</span></div>
        <div className="time-box"><span className="number">{timeLeft.hours}</span><span className="label">{content.timeLabels.hours}</span></div>
        <div className="time-box"><span className="number">{timeLeft.mins}</span><span className="label">{content.timeLabels.mins}</span></div>
        <div className="time-box"><span className="number">{timeLeft.secs}</span><span className="label">{content.timeLabels.secs}</span></div>
      </div>
    </FadeSection>
  );
};

export default Countdown;
