import { useEffect, useRef } from 'react';

interface FloatingLogo {
  id: string;
  logoPath: string;
  x: number;
  y: number;
  rotation: number;
  speed: number;
  scale: number;
}

interface CreatorAvatar {
  id: string;
  x: number;
  y: number;
  avatarPath: string;
  visible: boolean;
  fadePhase: number;
}

interface Connection {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  progress: number;
  completed: boolean;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoPositions = useRef<FloatingLogo[]>([]);
  const avatarPositions = useRef<CreatorAvatar[]>([]);
  const connections = useRef<Connection[]>([]);
  const animationRef = useRef<number>();

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

    // Initialize floating logos with real company logos
    const companyLogos = [
      '/logos/Coca-Cola_logo.svg',
      '/logos/Adidas_Logo.svg',
      '/logos/Apple_logo_black.svg',
      '/logos/Logo_NIKE.svg',
      '/logos/Netflix_2015_logo.svg',
      '/logos/Sephora_logo.svg',
      '/logos/L\'Oréal_logo.svg',
      '/logos/McDonald\'s_SVG_logo.svg',
      '/logos/PlayStation_logo.svg',
      '/logos/Samsung_Logo.svg',
      '/logos/Starbucks_Coffee_Logo.svg',
      '/logos/Revolut.svg',
      '/logos/Zara_Logo.svg',
      '/logos/WWF_logo_2000.svg'
    ];
    
    logoPositions.current = companyLogos.map((logoPath, index) => ({
      id: `logo-${index}`,
      logoPath,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      rotation: 0,
      speed: 0.1 + Math.random() * 0.2,
      scale: 0.8 + Math.random() * 0.4
    }));

    // Initialize creator avatars with memoji-style avatars
    const avatarPaths = [
      '/avatars/avatar1.svg',
      '/avatars/avatar2.svg',
      '/avatars/avatar3.svg',
      '/avatars/avatar4.svg',
      '/avatars/avatar5.svg',
      '/avatars/avatar6.svg',
      '/avatars/avatar7.svg',
      '/avatars/avatar8.svg',
      '/avatars/avatar9.svg',
      '/avatars/avatar10.svg',
      '/avatars/avatar11.svg'
    ];
    
    avatarPositions.current = avatarPaths.map((avatarPath, index) => ({
      id: `avatar-${index}`,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      avatarPath,
      visible: Math.random() > 0.5,
      fadePhase: Math.random() * Math.PI * 2
    }));

    let time = 0;

    const animate = () => {
      time += 0.016; // ~60fps
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw floating logos
      logoPositions.current.forEach(logo => {
        // Slow floating movement
        logo.x += Math.sin(time * logo.speed) * 0.3;
        logo.y += Math.cos(time * logo.speed * 0.8) * 0.2;
        logo.rotation += logo.speed * 0.3; // Slow rotation

        // Keep within bounds
        if (logo.x < -100) logo.x = canvas.width + 100;
        if (logo.x > canvas.width + 100) logo.x = -100;
        if (logo.y < -100) logo.y = canvas.height + 100;
        if (logo.y > canvas.height + 100) logo.y = -100;

        // Draw company logos (we'll create a simple representation for canvas)
        ctx.save();
        ctx.translate(logo.x, logo.y);
        ctx.rotate(logo.rotation);
        ctx.scale(logo.scale, logo.scale);
        
        const logoSize = 40;
        
        // Create a subtle glow effect
        ctx.shadowColor = 'rgba(139, 92, 246, 0.6)';
        ctx.shadowBlur = 20;
        
        // Draw logo background with glassmorphism effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        
        // Rounded rectangle for logo container
        const radius = 8;
        ctx.beginPath();
        ctx.roundRect(-logoSize/2, -logoSize/2, logoSize, logoSize, radius);
        ctx.fill();
        ctx.stroke();
        
        // Add a subtle inner highlight
        ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.fillRect(-logoSize/2 + 4, -logoSize/2 + 4, logoSize - 8, logoSize - 8);
        
        ctx.restore();
      });

      // Update avatar visibility randomly
      if (time % 2 < 0.016) { // Every ~2 seconds
        avatarPositions.current.forEach(avatar => {
          if (Math.random() < 0.3) {
            avatar.visible = !avatar.visible;
          }
        });
      }

      // Draw avatars with fade effect
      avatarPositions.current.forEach(avatar => {
        if (avatar.visible) {
          avatar.fadePhase += 0.02;
          const alpha = Math.sin(avatar.fadePhase) * 0.3 + 0.7;
          
          ctx.save();
          ctx.globalAlpha = alpha;
          
          const avatarSize = 50;
          
          // Create avatar glow
          ctx.shadowColor = '#EC4899';
          ctx.shadowBlur = 25;
          
          // Draw avatar background circle
          ctx.fillStyle = 'rgba(236, 72, 153, 0.2)';
          ctx.beginPath();
          ctx.arc(avatar.x, avatar.y, avatarSize/2 + 5, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw avatar container
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(avatar.x, avatar.y, avatarSize/2, 0, Math.PI * 2);
          ctx.fill();
          
          // Add avatar border
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Add inner avatar representation
          ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
          ctx.beginPath();
          ctx.arc(avatar.x, avatar.y, avatarSize/2 - 6, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      });

      // Create new connections randomly
      if (Math.random() < 0.01 && connections.current.length < 5) {
        const logo = logoPositions.current[Math.floor(Math.random() * logoPositions.current.length)];
        const avatar = avatarPositions.current.find(a => a.visible);
        
        if (avatar) {
          connections.current.push({
            id: `connection-${Date.now()}`,
            from: { x: logo.x, y: logo.y },
            to: { x: avatar.x, y: avatar.y },
            progress: 0,
            completed: false
          });
        }
      }

      // Update and draw connections
      connections.current = connections.current.filter(connection => {
        connection.progress += 0.02;
        
        if (connection.progress >= 1 && !connection.completed) {
          connection.completed = true;
          
          // Enhanced lightning effect when connection completes
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          
          // Multiple lightning bolts with trembling effect
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              const colors = ['#EC4899', '#8B5CF6', '#3B82F6', '#F59E0B'];
              ctx.strokeStyle = colors[i % colors.length];
              ctx.lineWidth = 6 - i;
              ctx.shadowColor = colors[i % colors.length];
              ctx.shadowBlur = 50;
              
              // Create trembling lightning path with multiple segments
              const segments = 8;
              ctx.beginPath();
              ctx.moveTo(connection.from.x, connection.from.y);
              
              for (let seg = 1; seg <= segments; seg++) {
                const progress = seg / segments;
                const baseX = connection.from.x + (connection.to.x - connection.from.x) * progress;
                const baseY = connection.from.y + (connection.to.y - connection.from.y) * progress;
                
                // Add trembling offset
                const trembleX = baseX + (Math.random() - 0.5) * 30;
                const trembleY = baseY + (Math.random() - 0.5) * 30;
                
                if (seg === segments) {
                  ctx.lineTo(connection.to.x, connection.to.y);
                } else {
                  ctx.lineTo(trembleX, trembleY);
                }
              }
              
              ctx.stroke();
              
              // Add glow effect
              ctx.globalAlpha = 0.3;
              ctx.lineWidth = 12;
              ctx.stroke();
              
            }, i * 30);
          }
          
          ctx.restore();
        }

        // Draw animated connection line with glow
        if (connection.progress <= 1) {
          const currentX = connection.from.x + (connection.to.x - connection.from.x) * connection.progress;
          const currentY = connection.from.y + (connection.to.y - connection.from.y) * connection.progress;
          
          ctx.save();
          
          // Main line
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.8 * (1 - connection.progress * 0.3)})`;
          ctx.lineWidth = 3;
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.moveTo(connection.from.x, connection.from.y);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
          
          // Glow effect
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 * (1 - connection.progress * 0.3)})`;
          ctx.lineWidth = 8;
          ctx.shadowBlur = 25;
          ctx.stroke();
          
          // Particles along the line
          const particleCount = Math.floor(connection.progress * 10);
          for (let i = 0; i < particleCount; i++) {
            const particleProgress = (i / particleCount) * connection.progress;
            const particleX = connection.from.x + (connection.to.x - connection.from.x) * particleProgress;
            const particleY = connection.from.y + (connection.to.y - connection.from.y) * particleProgress;
            
            ctx.fillStyle = 'rgba(236, 72, 153, 0.8)';
            ctx.shadowColor = '#EC4899';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.restore();
        }

        return connection.progress < 3; // Keep for a while after completion
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
