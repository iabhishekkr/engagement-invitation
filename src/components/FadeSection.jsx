import React, { useState, useEffect, useRef } from 'react';

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

export default FadeSection;
