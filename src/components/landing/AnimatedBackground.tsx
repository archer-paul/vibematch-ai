import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter } from 'react-icons/fa';

interface FloatingLogo {
  id: string;
  icon: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  speed: number;
}

interface CreatorAvatar {
  id: string;
  x: number;
  y: number;
  emoji: string;
  visible: boolean;
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

    // Initialize floating logos with social media icons
    const socialLogos = [
      { component: FaInstagram, color: '#E1306C' },
      { component: FaTiktok, color: '#000000' },
      { component: FaYoutube, color: '#FF0000' },
      { component: FaTwitter, color: '#1DA1F2' }
    ];
    logoPositions.current = socialLogos.map((logo, index) => ({
      id: `logo-${index}`,
      icon: logo.component.name,
      color: logo.color,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      rotation: 0,
      speed: 0.2 + Math.random() * 0.3
    }));

    // Initialize creator avatars with diverse characters
    const avatarEmojis = ['👩🏻‍💻', '👨🏾‍🎨', '👩🏽‍🎤', '👨🏻‍💼', '👩🏾‍🎨', '👨🏽‍🎵', '👩🏿‍📱', '👨🏻‍🎬', '👩🏽‍💻', '👨🏿‍🎨', '👩🏻‍🎤', '👨🏾‍💼'];
    avatarPositions.current = avatarEmojis.map((emoji, index) => ({
      id: `avatar-${index}`,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      emoji,
      visible: Math.random() > 0.5
    }));

    let time = 0;

    const animate = () => {
      time += 0.016; // ~60fps
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw floating logos
      logoPositions.current.forEach(logo => {
        logo.x += Math.sin(time * logo.speed) * 0.5;
        logo.y += Math.cos(time * logo.speed * 0.7) * 0.3;
        logo.rotation += logo.speed * 0.5;

        // Keep within bounds
        if (logo.x < -50) logo.x = canvas.width + 50;
        if (logo.x > canvas.width + 50) logo.x = -50;
        if (logo.y < -50) logo.y = canvas.height + 50;
        if (logo.y > canvas.height + 50) logo.y = -50;

        // Draw social media icons
        ctx.save();
        ctx.translate(logo.x, logo.y);
        ctx.rotate(logo.rotation);
        
        // Create icon representation with colors
        const iconSize = 20;
        ctx.shadowColor = logo.color || '#8B5CF6';
        ctx.shadowBlur = 15;
        
        // Draw icon background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(-iconSize/2, -iconSize/2, iconSize, iconSize);
        
        // Draw colored icon representation
        ctx.fillStyle = logo.color || '#8B5CF6';
        ctx.fillRect(-iconSize/2 + 2, -iconSize/2 + 2, iconSize - 4, iconSize - 4);
        
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
          const alpha = Math.sin(time * 2) * 0.2 + 0.8;
          
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.font = '32px Arial';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#EC4899';
          ctx.shadowBlur = 15;
          ctx.fillText(avatar.emoji, avatar.x, avatar.y);
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
          
          // Lightning effect when connection completes
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          
          // Multiple lightning bolts effect
          for (let i = 0; i < 3; i++) {
            setTimeout(() => {
              ctx.strokeStyle = i % 2 === 0 ? '#EC4899' : '#8B5CF6';
              ctx.lineWidth = 4 - i;
              ctx.shadowColor = i % 2 === 0 ? '#EC4899' : '#8B5CF6';
              ctx.shadowBlur = 40;
              
              // Add some randomness to lightning path
              const midX = (connection.from.x + connection.to.x) / 2 + (Math.random() - 0.5) * 20;
              const midY = (connection.from.y + connection.to.y) / 2 + (Math.random() - 0.5) * 20;
              
              ctx.beginPath();
              ctx.moveTo(connection.from.x, connection.from.y);
              ctx.quadraticCurveTo(midX, midY, connection.to.x, connection.to.y);
              ctx.stroke();
            }, i * 50);
          }
          
          ctx.restore();
        }

        // Draw connection line
        if (connection.progress <= 1) {
          const currentX = connection.from.x + (connection.to.x - connection.from.x) * connection.progress;
          const currentY = connection.from.y + (connection.to.y - connection.from.y) * connection.progress;
          
          ctx.save();
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.6 * (1 - connection.progress * 0.5)})`;
          ctx.lineWidth = 2;
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(connection.from.x, connection.from.y);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
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
