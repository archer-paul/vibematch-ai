import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingElement {
  id: string;
  type: 'logo' | 'avatar';
  src: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
}

interface Connection {
  id: string;
  from: FloatingElement;
  to: FloatingElement;
  progress: number;
  visible: boolean;
}

export function ParticleBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    // Company logos
    const logos = [
      '/logos/Coca-Cola_logo.svg',
      '/logos/Adidas_Logo.svg',
      '/logos/Apple_logo_black.svg',
      '/logos/Logo_NIKE.svg',
      '/logos/Netflix_2015_logo.svg',
      '/logos/Sephora_logo.svg'
    ];

    // Creator avatars
    const avatars = [
      '/avatars/avatar1.svg',
      '/avatars/avatar2.svg',
      '/avatars/avatar3.svg',
      '/avatars/avatar4.svg',
      '/avatars/avatar5.svg',
      '/avatars/avatar6.svg'
    ];

    // Initialize floating elements
    const initialElements: FloatingElement[] = [
      ...logos.map((src, index) => ({
        id: `logo-${index}`,
        type: 'logo' as const,
        src,
        x: Math.random() * 80 + 10, // 10-90% of screen width
        y: Math.random() * 80 + 10, // 10-90% of screen height
        size: 40 + Math.random() * 20,
        speed: 0.5 + Math.random() * 0.5,
        direction: Math.random() * Math.PI * 2
      })),
      ...avatars.map((src, index) => ({
        id: `avatar-${index}`,
        type: 'avatar' as const,
        src,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        size: 50 + Math.random() * 20,
        speed: 0.3 + Math.random() * 0.4,
        direction: Math.random() * Math.PI * 2
      }))
    ];

    setElements(initialElements);

    // Create connections randomly
    const createConnection = () => {
      const logoElements = initialElements.filter(el => el.type === 'logo');
      const avatarElements = initialElements.filter(el => el.type === 'avatar');
      
      if (logoElements.length > 0 && avatarElements.length > 0) {
        const logo = logoElements[Math.floor(Math.random() * logoElements.length)];
        const avatar = avatarElements[Math.floor(Math.random() * avatarElements.length)];
        
        const newConnection: Connection = {
          id: `connection-${Date.now()}`,
          from: logo,
          to: avatar,
          progress: 0,
          visible: true
        };
        
        setConnections(prev => [...prev.slice(-2), newConnection]); // Keep max 3 connections
      }
    };

    const connectionInterval = setInterval(createConnection, 3000);

    return () => {
      clearInterval(connectionInterval);
    };
  }, []);

  useEffect(() => {
    // Animate connections
    const animateConnections = () => {
      setConnections(prev => 
        prev.map(conn => ({
          ...conn,
          progress: Math.min(conn.progress + 0.02, 1)
        })).filter(conn => conn.progress < 1.2) // Remove completed connections
      );
    };

    const interval = setInterval(animateConnections, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Float elements
    const floatElements = () => {
      setElements(prev =>
        prev.map(element => ({
          ...element,
          x: element.x + Math.cos(element.direction + Date.now() * 0.001 * element.speed) * 0.1,
          y: element.y + Math.sin(element.direction + Date.now() * 0.001 * element.speed) * 0.1,
          direction: element.direction + (Math.random() - 0.5) * 0.02
        }))
      );
    };

    const interval = setInterval(floatElements, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating logos */}
      {elements.filter(el => el.type === 'logo').map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center shadow-lg">
            <img 
              src={element.src} 
              alt="Company logo" 
              className="w-6 h-6 object-contain opacity-80"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </motion.div>
      ))}

      {/* Floating avatars */}
      {elements.filter(el => el.type === 'avatar').map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-full border border-pink-300/30 flex items-center justify-center shadow-lg">
            <img 
              src={element.src} 
              alt="Creator avatar" 
              className="w-8 h-8 object-contain"
            />
          </div>
        </motion.div>
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection) => {
          const fromX = (connection.from.x / 100) * window.innerWidth;
          const fromY = (connection.from.y / 100) * window.innerHeight;
          const toX = (connection.to.x / 100) * window.innerWidth;
          const toY = (connection.to.y / 100) * window.innerHeight;
          
          const currentX = fromX + (toX - fromX) * connection.progress;
          const currentY = fromY + (toY - fromY) * connection.progress;

          return (
            <g key={connection.id}>
              <motion.line
                x1={fromX}
                y1={fromY}
                x2={currentX}
                y2={currentY}
                stroke="url(#connectionGradient)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: connection.progress,
                  opacity: connection.visible ? 0.8 : 0
                }}
                transition={{ duration: 0.1 }}
              />
              {/* Animated particles along connection */}
              {Array.from({ length: Math.floor(connection.progress * 5) }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={fromX + (toX - fromX) * (i / 5) * connection.progress}
                  cy={fromY + (toY - fromY) * (i / 5) * connection.progress}
                  r="2"
                  fill="#8b5cf6"
                  animate={{
                    opacity: [0, 1, 0],
                    r: [1, 3, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </g>
          );
        })}
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}