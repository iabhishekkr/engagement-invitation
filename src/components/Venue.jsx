import React from 'react';
import FadeSection from './FadeSection';

const Venue = ({ content }) => {
  return (
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
  );
};

export default Venue;
