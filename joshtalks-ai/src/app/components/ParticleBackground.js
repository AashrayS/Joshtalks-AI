"use client";

import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const particleCount = 200;
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
    
    let mouse = { x: -1000, y: -1000 };
    let isHovering = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.velocity = Math.random() * 0.2 + 0.1;
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        // Subtle drift
        this.baseX += Math.cos(this.angle) * this.velocity;
        this.baseY += Math.sin(this.angle) * this.velocity;

        // Reset if out of bounds
        if (this.baseX < 0 || this.baseX > canvas.width || this.baseY < 0 || this.baseY > canvas.height) {
          this.reset();
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        let force = (200 - distance) / 200;
        if (force < 0) force = 0;

        if (distance < 250) {
          // Circular structure on hover
          let targetAngle = Math.atan2(dy, dx) + Math.PI;
          let circleRadius = 150;
          let tx = mouse.x + Math.cos(targetAngle + (this.angle * 0.5)) * circleRadius;
          let ty = mouse.y + Math.sin(targetAngle + (this.angle * 0.5)) * circleRadius;
          
          this.x += (tx - this.x) * 0.08;
          this.y += (ty - this.y) * 0.08;
        } else {
          // Return to base behavior
          this.x += (this.baseX - this.x) * 0.05;
          this.y += (this.baseY - this.y) * 0.05;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6
      }}
    />
  );
}
