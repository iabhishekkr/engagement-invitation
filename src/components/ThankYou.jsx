import React from 'react';
import FadeSection from './FadeSection';

const ThankYou = ({ content }) => {
  return (
    <FadeSection className="thank-you-section">
      <footer className="main-footer">
        <h2 className="script-title">{content.footerThankYou}</h2>
        <p className="footer-names">{content.names}</p>
      </footer>
    </FadeSection>
  );
};

export default ThankYou;
