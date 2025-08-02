import { motion } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';

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

interface ExclusionZone {
  x: number;
  y: number;
  width: number;
  height: number;
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
  const lastConnectionTime = useRef(0);
  const animationFrameRef = useRef<number>();

  // Define exclusion zones where elements should avoid appearing
  const getExclusionZones = useCallback((): ExclusionZone[] => [
    // Title area
    { x: 15, y: 10, width: 70, height: 25 },
    // Feature cards area
    { x: 10, y: 40, width: 80, height: 35 },
    // How it works section
    { x: 10, y: 75, width: 80, height: 20 },
    // CTA section
    { x: 20, y: 85, width: 60, height: 10 }
  ], []);

  // Check if position overlaps with exclusion zones
  const isInExclusionZone = useCallback((x: number, y: number): boolean => {
    const zones = getExclusionZones();
    return zones.some(zone => 
      x >= zone.x && x <= zone.x + zone.width &&
      y >= zone.y && y <= zone.y + zone.height
    );
  }, [getExclusionZones]);

  // Generate safe position avoiding exclusion zones
  const generateSafePosition = useCallback((): { x: number; y: number } => {
    let attempts = 0;
    let x: number, y: number;
    
    do {
      x = 10 + Math.random() * 80; // Stay within 10-90% range
      y = 10 + Math.random() * 80;
      attempts++;
    } while (isInExclusionZone(x, y) && attempts < 20);
    
    // If we can't find a safe spot, place on edges
    if (attempts >= 20) {
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0: x = 5; y = 20 + Math.random() * 60; break; // Left
        case 1: x = 95; y = 20 + Math.random() * 60; break; // Right
        case 2: x = 20 + Math.random() * 60; y = 5; break; // Top
        case 3: x = 20 + Math.random() * 60; y = 95; break; // Bottom
      }
    }
    
    return { x, y };
  }, [isInExclusionZone]);

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

    // Initialize floating elements in safe positions
    const initialElements: FloatingElement[] = [
      ...logos.map((src, index) => {
        const position = generateSafePosition();
        return {
          id: `logo-${index}`,
          type: 'logo' as const,
          src,
          x: position.x,
          y: position.y,
          size: 50,
          speed: 0.05 + Math.random() * 0.05,
          direction: Math.random() * Math.PI * 2
        };
      }),
      ...avatars.map((src, index) => {
        const position = generateSafePosition();
        return {
          id: `avatar-${index}`,
          type: 'avatar' as const,
          src,
          x: position.x,
          y: position.y,
          size: 80,
          speed: 0.03 + Math.random() * 0.05,
          direction: Math.random() * Math.PI * 2
        };
      })
    ];

    setElements(initialElements);
  }, [generateSafePosition]);

  // Optimized connection creation system
  const createConnection = useCallback(() => {
    const now = Date.now();
    if (now - lastConnectionTime.current < 8000) return; // Throttle connections
    
    setElements(currentElements => {
      setConnections(prevConnections => {
        const logoElements = currentElements.filter(el => el.type === 'logo');
        const avatarElements = currentElements.filter(el => el.type === 'avatar');
        
        if (logoElements.length === 0 || avatarElements.length === 0) {
          return prevConnections;
        }

        // Find best connection using relative distance calculation
        let bestPair = null;
        let shortestRelativeDistance = Infinity;
        
        for (const logo of logoElements) {
          for (const avatar of avatarElements) {
            // Use percentage-based distance calculation
            const dx = Math.abs(logo.x - avatar.x);
            const dy = Math.abs(logo.y - avatar.y);
            const relativeDistance = Math.sqrt(dx * dx + dy * dy);
            
            // Skip if connection already exists
            const connectionExists = prevConnections.some(conn => 
              (conn.from.id === logo.id && conn.to.id === avatar.id) ||
              (conn.from.id === avatar.id && conn.to.id === logo.id)
            );
            
            // Use relative threshold (percentage-based)
            if (relativeDistance < shortestRelativeDistance && !connectionExists && relativeDistance < 30) {
              shortestRelativeDistance = relativeDistance;
              bestPair = { logo, avatar };
            }
          }
        }
        
        if (bestPair) {
          lastConnectionTime.current = now;
          const newConnection: Connection = {
            id: `connection-${now}-${Math.random()}`,
            from: bestPair.logo,
            to: bestPair.avatar,
            progress: 0,
            visible: true,
            showHeart: false,
            attractionPhase: false
          };
          
          // Keep only the latest 2 connections
          return [...prevConnections.slice(-1), newConnection];
        }
        
        return prevConnections;
      });
      return currentElements;
    });
  }, []);

  // Connection management
  useEffect(() => {
    if (elements.length === 0) return;

    const connectionTimer = setTimeout(() => {
      createConnection();
      const interval = setInterval(createConnection, 10000);
      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(connectionTimer);
  }, [elements.length, createConnection]);

  // Optimized connection animation
  useEffect(() => {
    const animateConnections = () => {
      setConnections(prev => 
        prev.map(conn => {
          const newProgress = Math.min(conn.progress + 0.012, 1);
          const newShowHeart = newProgress >= 0.95 && !conn.showHeart;
          const newAttractionPhase = newProgress >= 0.8;
          
          return {
            ...conn,
            progress: newProgress,
            showHeart: newShowHeart || conn.showHeart,
            attractionPhase: newAttractionPhase
          };
        }).filter(conn => conn.progress < 1.5) // Remove completed connections faster
      );
    };

    const interval = setInterval(animateConnections, 80);
    return () => clearInterval(interval);
  }, []);

  // Optimized floating animation with exclusion zone avoidance
  useEffect(() => {
    const floatElements = () => {
      setConnections(currentConnections => {
        setElements(prev =>
          prev.map(element => {
            let newX = element.x;
            let newY = element.y;
            
            // Gentle base movement
            const time = Date.now() * 0.0001;
            const baseMovementX = Math.cos(element.direction + time * element.speed) * 0.008;
            const baseMovementY = Math.sin(element.direction + time * element.speed) * 0.008;
            
            // Check for attraction to connected elements
            const activeConnection = currentConnections.find(conn => 
              conn.attractionPhase && (conn.from.id === element.id || conn.to.id === element.id)
            );
            
            if (activeConnection) {
              const other = activeConnection.from.id === element.id ? activeConnection.to : activeConnection.from;
              const dx = other.x - element.x;
              const dy = other.y - element.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 1) {
                newX += dx * 0.01;
                newY += dy * 0.01;
              }
            } else {
              // Normal floating with exclusion zone avoidance
              newX += baseMovementX;
              newY += baseMovementY;
              
              // Push away from exclusion zones
              if (isInExclusionZone(newX, newY)) {
                const zones = getExclusionZones();
                for (const zone of zones) {
                  const centerX = zone.x + zone.width / 2;
                  const centerY = zone.y + zone.height / 2;
                  const dx = newX - centerX;
                  const dy = newY - centerY;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  
                  if (distance < zone.width / 2 + 5) {
                    newX += (dx / distance) * 0.5;
                    newY += (dy / distance) * 0.5;
                  }
                }
              }
            }
            
            // Keep elements within safe bounds
            newX = Math.max(5, Math.min(95, newX));
            newY = Math.max(5, Math.min(95, newY));
            
            return {
              ...element,
              x: newX,
              y: newY,
              direction: element.direction + (Math.random() - 0.5) * 0.003
            };
          })
        );
        return currentConnections;
      });
    };

    const interval = setInterval(floatElements, 150);
    return () => clearInterval(interval);
  }, [isInExclusionZone, getExclusionZones]);

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
              className="w-full h-full object-contain opacity-60"
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
            y: [0, -6, 0],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={element.src} 
              alt="Creator avatar" 
              className="w-full h-full object-contain rounded-full opacity-60"
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
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: connection.progress,
                  opacity: connection.visible ? 0.8 : 0,
                  strokeDasharray: connection.attractionPhase ? "12,6" : "0,0"
                }}
                transition={{ 
                  duration: 0.2,
                  ease: "easeInOut"
                }}
                style={{
                  filter: connection.attractionPhase ? 'drop-shadow(0 0 12px #8b5cf6)' : 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.6))'
                }}
              />
              
              {/* Enhanced heart animation only when connection is truly established */}
              {connection.showHeart && connection.progress >= 0.95 && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.8, 1.2, 1.4, 1],
                    opacity: [0, 1, 1, 0.9, 0],
                    y: [0, -15, -30]
                  }}
                  transition={{ 
                    duration: 2.5,
                    ease: "easeOut"
                  }}
                >
                  <circle
                    cx={heartX}
                    cy={heartY}
                    r="25"
                    fill="rgba(236, 72, 153, 0.1)"
                    stroke="#ec4899"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <text
                    x={heartX}
                    y={heartY + 4}
                    textAnchor="middle"
                    fontSize="24"
                    fill="#ec4899"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(236, 72, 153, 0.8))' }}
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
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
