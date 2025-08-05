import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  color: string;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = ['#8B5CF6', '#EC4899', '#3B82F6'];

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Add new particles with higher density for smoother trail
      for (let i = 0; i < 8; i++) {
        particles.current.push({
          x: mouse.current.x + (Math.random() - 0.5) * 8,
          y: mouse.current.y + (Math.random() - 0.5) * 8,
          life: 120,
          maxLife: 120,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      // Limit particles count
      if (particles.current.length > 200) {
        particles.current = particles.current.slice(-200);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.current = particles.current.filter(particle => {
        particle.life--;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Enhanced gravity effect towards mouse
        const dx = mouse.current.x - particle.x;
        const dy = mouse.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          particle.vx += dx * 0.00008;
          particle.vy += dy * 0.00008;
        }

        const alpha = particle.life / particle.maxLife;
        const size = alpha * 3; // Smaller, finer particles

        ctx.save();
        
        // Multiple glow layers for more visibility
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        
        // Outer glow - largest
        ctx.globalAlpha = alpha * 0.2;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Middle glow
        ctx.globalAlpha = alpha * 0.4;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner glow
        ctx.globalAlpha = alpha * 0.6;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle - brightest and most visible
        ctx.globalAlpha = alpha * 0.95;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();

        return particle.life > 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
    />
  );
}