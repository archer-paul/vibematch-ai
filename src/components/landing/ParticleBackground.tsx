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
  targetX?: number;
  targetY?: number;
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

  // Initialize elements once on mount
  useEffect(() => {
    // Company logos
    const logos = [
      '/logos/Coca-Cola_logo.svg',
      '/logos/Adidas_Logo.svg',
      '/logos/Apple_logo_black.svg',
      '/logos/Logo_NIKE.svg',
      '/logos/Netflix_2015_logo.svg',
      '/logos/Sephora_logo.svg',
      '/logos/L\'Oréal_logo.svg',
      '/logos/Revolut.svg'
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

    // Initialize floating elements with better spacing
    const initialElements: FloatingElement[] = [
      ...logos.map((src, index) => ({
        id: `logo-${index}`,
        type: 'logo' as const,
        src,
        x: 15 + (index % 3) * 30 + Math.random() * 15,
        y: 20 + Math.floor(index / 3) * 25 + Math.random() * 15,
        size: 60,
        speed: 0.1 + Math.random() * 0.1, // Reduced speed significantly
        direction: Math.random() * Math.PI * 2
      })),
      ...avatars.map((src, index) => ({
        id: `avatar-${index}`,
        type: 'avatar' as const,
        src,
        x: 20 + (index % 3) * 25 + Math.random() * 20,
        y: 25 + Math.floor(index / 3) * 30 + Math.random() * 20,
        size: 100,
        speed: 0.08 + Math.random() * 0.1, // Reduced speed significantly
        direction: Math.random() * Math.PI * 2
      }))
    ];

    setElements(initialElements);
  }, []); // Only run once on mount

  // Separate connection system with stable dependencies
  useEffect(() => {
    if (elements.length === 0) return;

    const createConnection = () => {
      setConnections(prevConnections => {
        setElements(currentElements => {
          const logoElements = currentElements.filter(el => el.type === 'logo');
          const avatarElements = currentElements.filter(el => el.type === 'avatar');
          
          if (logoElements.length === 0 || avatarElements.length === 0) {
            return currentElements;
          }

          // Find closest pairs for connections
          let bestPair = null;
          let shortestDistance = Infinity;
          
          for (const logo of logoElements) {
            for (const avatar of avatarElements) {
              // Use absolute distance calculation for consistency
              const distance = Math.sqrt(
                Math.pow((logo.x - avatar.x) * window.innerWidth / 100, 2) + 
                Math.pow((logo.y - avatar.y) * window.innerHeight / 100, 2)
              );
              
              // Skip if connection already exists
              const existsConnection = prevConnections.some(conn => 
                (conn.from.id === logo.id && conn.to.id === avatar.id) ||
                (conn.from.id === avatar.id && conn.to.id === logo.id)
              );
              
              // Increased distance threshold for better connections
              if (distance < shortestDistance && !existsConnection && distance < 400) {
                shortestDistance = distance;
                bestPair = { logo, avatar };
              }
            }
          }
          
          if (bestPair) {
            const newConnection: Connection = {
              id: `connection-${Date.now()}-${Math.random()}`,
              from: bestPair.logo,
              to: bestPair.avatar,
              progress: 0,
              visible: true,
              showHeart: false,
              attractionPhase: false
            };
            
            setConnections(prev => [...prev.slice(-1), newConnection]); // Keep max 2 connections
          }
          
          return currentElements;
        });
        return prevConnections;
      });
    };

    // Delay first connection and create them less frequently
    const initialDelay = setTimeout(() => {
      createConnection();
      const connectionInterval = setInterval(createConnection, 6000); // Increased interval
      
      return () => clearInterval(connectionInterval);
    }, 2000); // Initial 2-second delay

    return () => clearTimeout(initialDelay);
  }, [elements.length]); // Only depend on element count, not the elements themselves

  useEffect(() => {
    // Animate connections with slower, smoother timing
    const animateConnections = () => {
      setConnections(prev => 
        prev.map(conn => {
          const newProgress = Math.min(conn.progress + 0.008, 1); // Slower progress
          const newShowHeart = newProgress >= 0.95 && !conn.showHeart;
          const newAttractionPhase = newProgress >= 0.7;
          
          return {
            ...conn,
            progress: newProgress,
            showHeart: newShowHeart || conn.showHeart,
            attractionPhase: newAttractionPhase
          };
        }).filter(conn => conn.progress < 2)
      );
    };

    const interval = setInterval(animateConnections, 120); // Slower interval
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Slow, gentle floating animation
    const floatElements = () => {
      setConnections(currentConnections => {
        setElements(prev =>
          prev.map(element => {
            let newX = element.x;
            let newY = element.y;
            
            // Much slower base movement
            const baseMovementX = Math.cos(element.direction + Date.now() * 0.0001 * element.speed) * 0.015;
            const baseMovementY = Math.sin(element.direction + Date.now() * 0.0001 * element.speed) * 0.015;
            
            // Check for attraction to connected elements
            const activeConnection = currentConnections.find(conn => 
              conn.attractionPhase && (conn.from.id === element.id || conn.to.id === element.id)
            );
            
            if (activeConnection) {
              const other = activeConnection.from.id === element.id ? activeConnection.to : activeConnection.from;
              const dx = other.x - element.x;
              const dy = other.y - element.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 2) {
                // Gentle attraction force
                newX += dx * 0.015;
                newY += dy * 0.015;
              }
            } else {
              // Normal gentle floating
              newX += baseMovementX;
              newY += baseMovementY;
            }
            
            // Keep elements within bounds
            newX = Math.max(8, Math.min(92, newX));
            newY = Math.max(8, Math.min(92, newY));
            
            return {
              ...element,
              x: newX,
              y: newY,
              direction: element.direction + (Math.random() - 0.5) * 0.005 // Less random direction change
            };
          })
        );
        return currentConnections;
      });
    };

    const interval = setInterval(floatElements, 200); // Much slower interval
    return () => clearInterval(interval);
  }, []); // No dependencies to prevent constant re-creation

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Company logos - clean design without bubbles */}
      {elements.filter(el => el.type === 'logo').map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={element.src} 
              alt="Company logo" 
              className="w-full h-full object-contain opacity-70"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </motion.div>
      ))}

      {/* Creator avatars - larger and cleaner */}
      {elements.filter(el => el.type === 'avatar').map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={element.src} 
              alt="Creator avatar" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </motion.div>
      ))}

      {/* Enhanced connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection) => {
          if (typeof window === 'undefined') return null;
          
          const fromX = (connection.from.x / 100) * window.innerWidth;
          const fromY = (connection.from.y / 100) * window.innerHeight;
          const toX = (connection.to.x / 100) * window.innerWidth;
          const toY = (connection.to.y / 100) * window.innerHeight;
          
          const currentX = fromX + (toX - fromX) * connection.progress;
          const currentY = fromY + (toY - fromY) * connection.progress;
          
          // Heart position at actual connection endpoint
          const heartX = toX;
          const heartY = toY;

          return (
            <g key={connection.id}>
              <motion.line
                x1={fromX}
                y1={fromY}
                x2={currentX}
                y2={currentY}
                stroke="url(#connectionGradient)"
                strokeWidth="4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: connection.progress,
                  opacity: connection.visible ? 0.9 : 0,
                  strokeDasharray: connection.attractionPhase ? "8,4" : "0,0"
                }}
                transition={{ 
                  duration: 0.1,
                  strokeDasharray: { duration: 0.4 }
                }}
                style={{
                  filter: connection.attractionPhase ? 'drop-shadow(0 0 8px #8b5cf6)' : 'drop-shadow(0 0 4px #8b5cf6)'
                }}
              />
              
              {/* Heart animation only when actual connection is established */}
              {connection.showHeart && connection.progress >= 0.95 && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 1, 1.2, 1],
                    opacity: [0, 1, 1, 0.8, 0],
                    y: [0, -10, -20]
                  }}
                  transition={{ 
                    duration: 2,
                    ease: "easeOut"
                  }}
                >
                  <circle
                    cx={heartX}
                    cy={heartY}
                    r="20"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                  <text
                    x={heartX}
                    y={heartY + 3}
                    textAnchor="middle"
                    fontSize="20"
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
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
