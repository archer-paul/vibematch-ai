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
  showHeart: boolean;
  attractionPhase: boolean;
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
        size: 35 + Math.random() * 15,
        speed: 0.5 + Math.random() * 0.5,
        direction: Math.random() * Math.PI * 2
      })),
      ...avatars.map((src, index) => ({
        id: `avatar-${index}`,
        type: 'avatar' as const,
        src,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        size: 70 + Math.random() * 30,
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
          visible: true,
          showHeart: false,
          attractionPhase: false
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
        prev.map(conn => {
          const newProgress = Math.min(conn.progress + 0.02, 1);
          const newShowHeart = newProgress >= 0.8 && !conn.showHeart;
          const newAttractionPhase = newProgress >= 0.6;
          
          return {
            ...conn,
            progress: newProgress,
            showHeart: newShowHeart || conn.showHeart,
            attractionPhase: newAttractionPhase
          };
        }).filter(conn => conn.progress < 1.5) // Remove completed connections
      );
    };

    const interval = setInterval(animateConnections, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Float elements with attraction logic
    const floatElements = () => {
      setElements(prev =>
        prev.map(element => {
          let newX = element.x + Math.cos(element.direction + Date.now() * 0.001 * element.speed) * 0.1;
          let newY = element.y + Math.sin(element.direction + Date.now() * 0.001 * element.speed) * 0.1;
          
          // Check if element is part of an active connection in attraction phase
          const activeConnection = connections.find(conn => 
            conn.attractionPhase && (conn.from.id === element.id || conn.to.id === element.id)
          );
          
          if (activeConnection) {
            const other = activeConnection.from.id === element.id ? activeConnection.to : activeConnection.from;
            const dx = other.x - element.x;
            const dy = other.y - element.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
              newX += dx * 0.02;
              newY += dy * 0.02;
            }
          }
          
          return {
            ...element,
            x: newX,
            y: newY,
            direction: element.direction + (Math.random() - 0.5) * 0.02
          };
        })
      );
    };

    const interval = setInterval(floatElements, 100);
    return () => clearInterval(interval);
  }, [connections]);

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
              className="w-5 h-5 object-contain opacity-80"
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
              className="w-12 h-12 object-contain"
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
          
          // Heart position at midpoint when connection is complete
          const heartX = (fromX + toX) / 2;
          const heartY = (fromY + toY) / 2;

          return (
            <g key={connection.id}>
              <motion.line
                x1={fromX}
                y1={fromY}
                x2={currentX}
                y2={currentY}
                stroke="url(#connectionGradient)"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: connection.progress,
                  opacity: connection.visible ? 0.8 : 0,
                  strokeDasharray: connection.attractionPhase ? "5,5" : "0,0"
                }}
                transition={{ 
                  duration: 0.1,
                  strokeDasharray: { duration: 0.3 }
                }}
                style={{
                  filter: connection.attractionPhase ? 'drop-shadow(0 0 6px #ec4899)' : 'none'
                }}
              />
              
              {/* Heart animation when connection completes */}
              {connection.showHeart && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    opacity: [0, 1, 0.8],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 1,
                    ease: "easeOut"
                  }}
                >
                  <circle
                    cx={heartX}
                    cy={heartY}
                    r="15"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <text
                    x={heartX}
                    y={heartY + 2}
                    textAnchor="middle"
                    fontSize="16"
                    fill="#ec4899"
                  >
                    ❤️
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}