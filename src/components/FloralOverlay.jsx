import React, { useRef, useEffect, useState } from 'react';

// Strips white/gray background from the PNG using canvas pixel processing
const FloralOverlay = ({ src, className }) => {
  const [processedSrc, setProcessedSrc] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Knock out any near-white or gray pixel (checkerboard pattern)
        // White: R,G,B all > 210
        // Gray checkerboard: R,G,B roughly equal and between 150-220
        const brightness = (r + g + b) / 3;
        const isNeutral = Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20;
        if (isNeutral && brightness > 155) {
          // Fade to transparent — more white = more transparent
          const alpha = Math.max(0, 1 - (brightness - 155) / 100);
          data[i + 3] = Math.round(alpha * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedSrc(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }, [src]);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [processedSrc]);

  if (!processedSrc) return null;
  return (
    <img 
      ref={imgRef}
      src={processedSrc} 
      className={className} 
      style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
      alt="" 
      aria-hidden="true" 
    />
  );
};

export default FloralOverlay;
