"use client";

import React, { useRef, useEffect } from 'react';

export const StarryBackground = () => {
  const canvasRef = useRef(null);
  const color = '#030711';

  useEffect(() => {
    const canvas = canvasRef.current! as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Star properties
    const stars = [];
    const numStars = 200;
    const maxStarRadius = 1.5;

    // Create stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * maxStarRadius,
        opacity: Math.random(),
        twinkleSpeed: 0.001 + Math.random() * 0.01
      });
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Twinkle effect
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default StarryBackground;
