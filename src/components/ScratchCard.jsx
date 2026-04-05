import React, { useRef, useEffect, useState } from 'react';

const ScratchCard = ({ text, onReveal }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed && onReveal) {
      onReveal();
    }
  }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;

    let isDrawing = false;
    let canvasRect = canvas.getBoundingClientRect();

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      canvasRect = canvas.getBoundingClientRect();
      drawCover();
    };

    const coverImg = new Image();
    coverImg.src = '/assets/gold_texture.png';
    coverImg.onload = resizeCanvas;

    const drawCover = () => {
      ctx.globalCompositeOperation = 'source-over';
      const scale = Math.max(canvas.width / coverImg.width, canvas.height / coverImg.height) * 2;
      const x = (canvas.width / 2) - (coverImg.width / 2) * scale;
      const y = (canvas.height / 2) - (coverImg.height / 2) * scale;
      ctx.drawImage(coverImg, x, y, coverImg.width * scale, coverImg.height * scale);
    };

    const getMousePos = (evt) => {
      const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
      const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
      canvasRect = canvas.getBoundingClientRect();
      return { x: clientX - canvasRect.left, y: clientY - canvasRect.top };
    };

    const drawPosition = (e) => {
      if (!isDrawing) return;
      const { x, y } = getMousePos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 30;
      ctx.lineCap = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const checkReveal = () => {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparentCount = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentCount++;
      }
      const pctScratched = parseInt((transparentCount / (pixels.length / 4)) * 100);
      if (pctScratched > 30) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.pointerEvents = 'none';
        setRevealed(true);
      }
    };

    const startDraw = (e) => {
      isDrawing = true;
      drawPosition(e);
    };

    const endDraw = () => {
      isDrawing = false;
      ctx.beginPath();
      checkReveal();
    };

    // Event listeners
    const handleTouchMove = (e) => {
      if (isDrawing) e.preventDefault();
      drawPosition(e);
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', drawPosition);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    window.addEventListener('resize', () => canvasRect = canvas.getBoundingClientRect());

    return () => {
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', drawPosition);
      canvas.removeEventListener('mouseup', endDraw);
      canvas.removeEventListener('mouseleave', endDraw);
      canvas.removeEventListener('touchstart', startDraw);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', endDraw);
    };
  }, []);

  return (
    <div className="scratch-card" ref={containerRef}>
      <div className="hidden-content title-serif">{text}</div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ScratchCard;
