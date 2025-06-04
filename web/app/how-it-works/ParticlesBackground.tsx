"use client";

import React, { useEffect, useRef } from 'react';

// Interface for particle properties
interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  alpha: number;
  alphaSpeed: number;
  glowSize: number; // Added glow size property
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  
  // Initialize the particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full window size
    const handleResize = () => {
      if (!canvas) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Re-initialize particles when resizing
      initializeParticles();
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Create initial particles
    function initializeParticles() {
      if (!canvas) return;
      
      particlesRef.current = [];
      // Increase particle count for more impact
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 150);
      
      // Brighter, more saturated colors
      const vibrantColors = [
        'rgba(147, 51, 234, 0.9)', // Brighter purple
        'rgba(168, 85, 247, 0.9)', // Brighter light purple
        'rgba(217, 70, 239, 0.9)', // Brighter pink-purple
        'rgba(236, 72, 153, 0.9)', // Brighter pink
        'rgba(124, 58, 237, 0.9)', // Brighter violet
        'rgba(139, 92, 246, 0.9)', // Brighter indigo
        'rgba(191, 34, 119, 0.9)', // Bright magenta
      ];
      
      for (let i = 0; i < particleCount; i++) {
        // Create particles with varied properties for more dynamic visuals
        particlesRef.current.push({
          x: Math.random() * (canvas?.width || window.innerWidth),
          y: Math.random() * (canvas?.height || window.innerHeight),
          // Increase particle size range for more impact
          size: Math.random() * 4 + 1.5,
          color: vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
          speedX: (Math.random() - 0.5) * 0.7, // Slightly faster movement
          speedY: (Math.random() - 0.5) * 0.7,
          alpha: Math.random() * 0.7 + 0.3, // Higher minimum alpha for visibility
          alphaSpeed: Math.random() * 0.015 + 0.005, // Faster pulsing
          glowSize: Math.random() * 7 + 4 // Larger glow for more visibility
        });
      }
    }
    
    // Animation function
    function animate() {
      if (!canvas || !ctx) return;
      
      // Use a semi-transparent black to create trails effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Pulse alpha (opacity) with higher range
        particle.alpha += particle.alphaSpeed;
        if (particle.alpha > 0.9 || particle.alpha < 0.3) {
          particle.alphaSpeed = -particle.alphaSpeed;
        }
        
        // Wrap around edges
        if (!canvas) return;
        
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw enhanced glow effect first (layered behind the particle)
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.glowSize
        );
        
        // Update color with current alpha but make glow more intense
        const baseColor = particle.color.replace(/[\d\.]+\)$/g, `${particle.alpha * 1.2})`);
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(0.6, baseColor.replace(/[\d\.]+\)$/g, `${particle.alpha * 0.5})`));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw particle core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        const rgbaColor = particle.color.replace(/[\d\.]+\)$/g, `${particle.alpha})`);
        ctx.fillStyle = rgbaColor;
        ctx.fill();
        
        // Optional: Add a small white core to make it pop
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha * 0.9})`;
        ctx.fill();
      });
      
      // The connectParticles function call is removed to stop drawing lines between particles
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    // Connect nearby particles with brighter lines - Kept the function definition but it's not called anymore
    function connectParticles(ctx: CanvasRenderingContext2D) {
      const maxDistance = 180; // Increased connection distance
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Create brighter connections with higher opacity
            const opacity = 1 - (distance / maxDistance);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Use a gradient for the line color
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `rgba(147, 51, 234, ${opacity * 0.5})`); // Start with purple
            gradient.addColorStop(1, `rgba(236, 72, 153, ${opacity * 0.5})`); // End with pink
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5; // Thicker lines for visibility
            ctx.stroke();
          }
        }
      }
    }
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 bg-black"
    />
  );
}