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
  vx: number;
  vy: number;
  lastUpdateTime: number;
  isResting: boolean;
  preferredZone?: string;
  collisionRadius: number;
}

interface ExclusionZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  buffer: number;
}

interface PreferredZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  attraction: number;
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  fromSnapshot: { x: number; y: number };
  toSnapshot: { x: number; y: number };
  progress: number;
  visible: boolean;
  showHeart: boolean;
  heartVisible: boolean;
  phase: 'approaching' | 'connected' | 'separating' | 'completed';
  createdAt: number;
  lastUpdate: number;
}

export function ParticleBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const lastConnectionTime = useRef(0);
  const animationFrameRef = useRef<number>();
  const connectionDebounce = useRef<{ [key: string]: number }>({});

  // Enhanced exclusion zones based on actual page layout
  const getExclusionZones = useCallback((): ExclusionZone[] => [
    { id: 'header', x: 0, y: 0, width: 100, height: 15, buffer: 3 },
    { id: 'hero-title', x: 10, y: 15, width: 80, height: 20, buffer: 5 },
    { id: 'hero-buttons', x: 20, y: 35, width: 60, height: 8, buffer: 3 },
    { id: 'features-header', x: 15, y: 45, width: 70, height: 8, buffer: 2 },
    { id: 'features-grid', x: 5, y: 53, width: 90, height: 25, buffer: 4 },
    { id: 'how-it-works-header', x: 15, y: 78, width: 70, height: 6, buffer: 2 },
    { id: 'how-it-works-cards', x: 10, y: 84, width: 80, height: 12, buffer: 3 },
    { id: 'cta-section', x: 20, y: 96, width: 60, height: 4, buffer: 2 }
  ], []);

  // Preferred zones for element attraction
  const getPreferredZones = useCallback((): PreferredZone[] => [
    { id: 'left-sidebar', x: 0, y: 20, width: 15, height: 60, attraction: 0.3 },
    { id: 'right-sidebar', x: 85, y: 20, width: 15, height: 60, attraction: 0.3 },
    { id: 'top-area', x: 20, y: 0, width: 60, height: 15, attraction: 0.2 },
    { id: 'between-sections', x: 15, y: 43, width: 70, height: 2, attraction: 0.4 }
  ], []);

  // Enhanced collision detection with forbidden zones
  const checkCollision = useCallback((element1: FloatingElement, element2: FloatingElement): boolean => {
    const dx = element1.x - element2.x;
    const dy = element1.y - element2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (element1.collisionRadius + element2.collisionRadius) / 15;
    return distance < minDistance;
  }, []);

  // Significantly enhanced avoidance force with rebound effect
  const getAvoidanceForce = useCallback((element: FloatingElement, others: FloatingElement[]) => {
    let forceX = 0;
    let forceY = 0;
    
    others.forEach(other => {
      if (other.id === element.id) return;
      
      const dx = element.x - other.x;
      const dy = element.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const forbiddenDistance = (element.collisionRadius + other.collisionRadius) / 12;
      const safeDistance = forbiddenDistance * 1.8;
      
      if (distance < safeDistance && distance > 0) {
        const urgency = distance < forbiddenDistance ? 3.0 : 1.0;
        const force = ((safeDistance - distance) / safeDistance) * urgency;
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        
        forceX += normalizedX * force * 0.8;
        forceY += normalizedY * force * 0.8;
        
        // Add rebound effect for very close collisions
        if (distance < forbiddenDistance) {
          forceX += normalizedX * 0.5;
          forceY += normalizedY * 0.5;
        }
      }
    });
    
    return { forceX, forceY };
  }, []);

  // Enhanced exclusion zone checking with buffer zones
  const isInExclusionZone = useCallback((x: number, y: number, elementSize: number = 50): boolean => {
    const zones = getExclusionZones();
    const sizeBuffer = elementSize / 100;
    
    return zones.some(zone => 
      x >= (zone.x - zone.buffer - sizeBuffer) && 
      x <= (zone.x + zone.width + zone.buffer + sizeBuffer) &&
      y >= (zone.y - zone.buffer - sizeBuffer) && 
      y <= (zone.y + zone.height + zone.buffer + sizeBuffer)
    );
  }, [getExclusionZones]);

  // Get attraction force from preferred zones
  const getZoneAttraction = useCallback((element: FloatingElement) => {
    const zones = getPreferredZones();
    let forceX = 0;
    let forceY = 0;
    
    zones.forEach(zone => {
      const zoneCenterX = zone.x + zone.width / 2;
      const zoneCenterY = zone.y + zone.height / 2;
      const dx = zoneCenterX - element.x;
      const dy = zoneCenterY - element.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0 && distance < 40) {
        const force = zone.attraction * (1 - distance / 40);
        forceX += (dx / distance) * force * 0.001;
        forceY += (dy / distance) * force * 0.001;
      }
    });
    
    return { forceX, forceY };
  }, [getPreferredZones]);

  // Adaptive grid distribution with safe positioning
  const generateSafePosition = useCallback((existingElements: FloatingElement[] = [], elementSize: number = 50): { x: number; y: number } => {
    let attempts = 0;
    let x: number, y: number;
    
    // Try random positioning first
    do {
      x = 8 + Math.random() * 84;
      y = 8 + Math.random() * 84;
      attempts++;
      
      const collision = existingElements.some(existing => {
        const dx = x - existing.x;
        const dy = y - existing.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (elementSize + existing.size) / 20;
        return distance < minDistance;
      });
      
      if (!collision && !isInExclusionZone(x, y, elementSize)) {
        break;
      }
    } while (attempts < 40);
    
    // Enhanced grid-based fallback with more cells
    if (attempts >= 40) {
      const gridSize = 10;
      const cellWidth = 84 / gridSize;
      const cellHeight = 84 / gridSize;
      
      // Try multiple grid positions
      for (let i = 0; i < gridSize * gridSize; i++) {
        const gridIndex = (existingElements.length + i) % (gridSize * gridSize);
        const gridX = gridIndex % gridSize;
        const gridY = Math.floor(gridIndex / gridSize);
        
        x = 8 + gridX * cellWidth + cellWidth / 2;
        y = 8 + gridY * cellHeight + cellHeight / 2;
        
        if (!isInExclusionZone(x, y, elementSize)) {
          // Add some randomness to grid positioning
          x += (Math.random() - 0.5) * cellWidth * 0.4;
          y += (Math.random() - 0.5) * cellHeight * 0.4;
          break;
        }
      }
    }
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  }, [isInExclusionZone]);

  // Initialize with more elements for better distribution
  useEffect(() => {
    const logos = [
      '/logos/Coca-Cola_logo.svg',
      '/logos/Adidas_Logo.svg',
      '/logos/Apple_logo_black.svg',
      '/logos/Logo_NIKE.svg',
      '/logos/Netflix_2015_logo.svg',
      '/logos/Sephora_logo.svg',
      '/logos/L\'Oréal_logo.svg',
      '/logos/Revolut.svg',
      '/logos/Samsung_Logo.svg',
      '/logos/Starbucks_Coffee_Logo.svg'
    ];

    const avatars = [
      '/avatars/avatar1.svg',
      '/avatars/avatar2.svg',
      '/avatars/avatar3.svg',
      '/avatars/avatar4.svg',
      '/avatars/avatar5.svg',
      '/avatars/avatar6.svg',
      '/avatars/avatar7.svg',
      '/avatars/avatar8.svg'
    ];

    const initialElements: FloatingElement[] = [];
    const now = Date.now();
    
    // Add logos
    logos.forEach((src, index) => {
      const position = generateSafePosition(initialElements, 45);
      initialElements.push({
        id: `logo-${index}`,
        type: 'logo' as const,
        src,
        x: position.x,
        y: position.y,
        size: 45,
        speed: 0.015 + Math.random() * 0.02,
        direction: Math.random() * Math.PI * 2,
        vx: 0,
        vy: 0,
        lastUpdateTime: now,
        isResting: false,
        collisionRadius: 55
      });
    });
    
    // Add avatars
    avatars.forEach((src, index) => {
      const position = generateSafePosition(initialElements, 75);
      initialElements.push({
        id: `avatar-${index}`,
        type: 'avatar' as const,
        src,
        x: position.x,
        y: position.y,
        size: 75,
        speed: 0.012 + Math.random() * 0.018,
        direction: Math.random() * Math.PI * 2,
        vx: 0,
        vy: 0,
        lastUpdateTime: now,
        isResting: false,
        collisionRadius: 85
      });
    });

    setElements(initialElements);
  }, [generateSafePosition]);

  // Enhanced connection creation with ID-based system
  const createConnection = useCallback(() => {
    const now = Date.now();
    if (now - lastConnectionTime.current < 4000) return;
    
    setElements(currentElements => {
      setConnections(prevConnections => {
        const activeConnections = prevConnections.filter(conn => 
          conn.phase !== 'completed' && now - conn.createdAt < 12000
        );
        
        if (activeConnections.length >= 3) return prevConnections;
        
        const logoElements = currentElements.filter(el => el.type === 'logo');
        const avatarElements = currentElements.filter(el => el.type === 'avatar');
        
        if (logoElements.length === 0 || avatarElements.length === 0) {
          return prevConnections;
        }

        // Find best connection pair with debouncing
        let bestPair = null;
        let shortestDistance = Infinity;
        
        for (const logo of logoElements) {
          for (const avatar of avatarElements) {
            const pairKey = `${logo.id}-${avatar.id}`;
            const debounceTime = connectionDebounce.current[pairKey] || 0;
            
            if (now - debounceTime < 8000) continue;
            
            const dx = logo.x - avatar.x;
            const dy = logo.y - avatar.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const recentlyConnected = activeConnections.some(conn => 
              (conn.fromId === logo.id && conn.toId === avatar.id) ||
              (conn.fromId === avatar.id && conn.toId === logo.id)
            );
            
            if (distance < shortestDistance && !recentlyConnected && distance < 30) {
              shortestDistance = distance;
              bestPair = { logo, avatar };
            }
          }
        }
        
        if (bestPair) {
          lastConnectionTime.current = now;
          const pairKey = `${bestPair.logo.id}-${bestPair.avatar.id}`;
          connectionDebounce.current[pairKey] = now;
          
          const newConnection: Connection = {
            id: `connection-${now}-${Math.random()}`,
            fromId: bestPair.logo.id,
            toId: bestPair.avatar.id,
            fromSnapshot: { x: bestPair.logo.x, y: bestPair.logo.y },
            toSnapshot: { x: bestPair.avatar.x, y: bestPair.avatar.y },
            progress: 0,
            visible: true,
            showHeart: false,
            heartVisible: false,
            phase: 'approaching',
            createdAt: now,
            lastUpdate: now
          };
          
          return [...activeConnections, newConnection];
        }
        
        return prevConnections;
      });
      return currentElements;
    });
  }, []);

  // Connection management with reduced frequency
  useEffect(() => {
    if (elements.length === 0) return;

    const connectionTimer = setTimeout(() => {
      createConnection();
      const interval = setInterval(createConnection, 8000);
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(connectionTimer);
  }, [elements.length, createConnection]);

  // Optimized connection animation with snapshots
  useEffect(() => {
    const animateConnections = () => {
      const now = Date.now();
      
      setConnections(prev => 
        prev.map(conn => {
          const timeSinceUpdate = now - conn.lastUpdate;
          if (timeSinceUpdate < 40) return conn; // Throttle updates
          
          let newProgress = conn.progress;
          let newPhase = conn.phase;
          let newShowHeart = conn.showHeart;
          let newHeartVisible = conn.heartVisible;
          
          if (conn.phase === 'approaching') {
            newProgress = Math.min(conn.progress + 0.012, 1);
            if (newProgress >= 1) {
              newPhase = 'connected';
              newShowHeart = true;
              newHeartVisible = true;
            }
          } else if (conn.phase === 'connected') {
            if (now - conn.createdAt > 2500) {
              newPhase = 'separating';
              newHeartVisible = false;
            }
          } else if (conn.phase === 'separating') {
            if (now - conn.createdAt > 4000) {
              newPhase = 'completed';
            }
          }
          
          return {
            ...conn,
            progress: newProgress,
            phase: newPhase,
            showHeart: newShowHeart,
            heartVisible: newHeartVisible,
            lastUpdate: now
          };
        }).filter(conn => conn.phase !== 'completed')
      );
    };

    const interval = setInterval(animateConnections, 50);
    return () => clearInterval(interval);
  }, []);

  // Optimized physics system with resting states
  useEffect(() => {
    const updateElements = () => {
      const now = Date.now();
      
      setElements(prev => {
        return prev.map(element => {
          const timeSinceUpdate = now - element.lastUpdateTime;
          if (timeSinceUpdate < 60) return element; // Reduce update frequency
          
          let newVx = element.vx;
          let newVy = element.vy;
          
          // Check if element should be resting
          const velocity = Math.sqrt(newVx * newVx + newVy * newVy);
          const shouldRest = velocity < 0.001 && !isInExclusionZone(element.x, element.y, element.size);
          
          if (shouldRest && !element.isResting) {
            return { ...element, isResting: true, vx: 0, vy: 0, lastUpdateTime: now };
          }
          
          if (element.isResting && Math.random() < 0.01) {
            // Occasionally wake up resting elements
            return { ...element, isResting: false, lastUpdateTime: now };
          }
          
          if (element.isResting) return element;
          
          // Base drift movement
          const time = now * 0.00008;
          const driftX = Math.cos(element.direction + time * element.speed) * 0.002;
          const driftY = Math.sin(element.direction + time * element.speed) * 0.002;
          
          newVx += driftX;
          newVy += driftY;
          
          // Enhanced collision avoidance
          const { forceX, forceY } = getAvoidanceForce(element, prev);
          newVx += forceX * 0.003;
          newVy += forceY * 0.003;
          
          // Zone attraction
          const { forceX: zoneForceX, forceY: zoneForceY } = getZoneAttraction(element);
          newVx += zoneForceX;
          newVy += zoneForceY;
          
          // Enhanced exclusion zone avoidance
          if (isInExclusionZone(element.x, element.y, element.size)) {
            const zones = getExclusionZones();
            for (const zone of zones) {
              const centerX = zone.x + zone.width / 2;
              const centerY = zone.y + zone.height / 2;
              const dx = element.x - centerX;
              const dy = element.y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 0) {
                const force = 0.015;
                newVx += (dx / distance) * force;
                newVy += (dy / distance) * force;
              }
            }
          }
          
          // Stronger boundary repulsion
          const margin = 6;
          if (element.x < margin) newVx += (margin - element.x) * 0.004;
          if (element.x > 100 - margin) newVx -= (element.x - (100 - margin)) * 0.004;
          if (element.y < margin) newVy += (margin - element.y) * 0.004;
          if (element.y > 100 - margin) newVy -= (element.y - (100 - margin)) * 0.004;
          
          // Apply damping
          newVx *= 0.92;
          newVy *= 0.92;
          
          // Update position
          const newX = Math.max(3, Math.min(97, element.x + newVx));
          const newY = Math.max(3, Math.min(97, element.y + newVy));
          
          return {
            ...element,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            direction: element.direction + (Math.random() - 0.5) * 0.001,
            lastUpdateTime: now,
            isResting: false
          };
        });
      });
    };

    const interval = setInterval(updateElements, 70);
    return () => clearInterval(interval);
  }, [getAvoidanceForce, isInExclusionZone, getZoneAttraction]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Company logos */}
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
            scale: element.isResting ? 0.95 : [0.9, 1.1, 0.9]
          }}
          transition={{
            rotate: { duration: 45, repeat: Infinity, ease: "linear" },
            scale: { 
              duration: element.isResting ? 2 : 10, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }
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

      {/* Creator avatars */}
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
            y: element.isResting ? 0 : [0, -8, 0],
            opacity: element.isResting ? 0.5 : [0.6, 0.9, 0.6]
          }}
          transition={{
            duration: element.isResting ? 1 : 10 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={element.src} 
              alt="Creator avatar" 
              className="w-full h-full object-contain rounded-full opacity-70"
            />
          </div>
        </motion.div>
      ))}

      {/* Enhanced connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection) => {
          if (typeof window === 'undefined') return null;
          
          const fromX = (connection.fromSnapshot.x / 100) * window.innerWidth;
          const fromY = (connection.fromSnapshot.y / 100) * window.innerHeight;
          const toX = (connection.toSnapshot.x / 100) * window.innerWidth;
          const toY = (connection.toSnapshot.y / 100) * window.innerHeight;
          
          const currentX = fromX + (toX - fromX) * connection.progress;
          const currentY = fromY + (toY - fromY) * connection.progress;
          
          const heartX = fromX + (toX - fromX) * 0.5;
          const heartY = fromY + (toY - fromY) * 0.5;

          return (
            <g key={connection.id}>
              <motion.line
                x1={fromX}
                y1={fromY}
                x2={currentX}
                y2={currentY}
                stroke="white"
                strokeWidth="2.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: connection.progress,
                  opacity: connection.visible ? 0.9 : 0
                }}
                transition={{ 
                  duration: 0.4,
                  ease: "easeInOut"
                }}
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.4))'
                }}
              />
              
              {/* Enhanced heart with glow */}
              {connection.heartVisible && connection.phase === 'connected' && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: connection.heartVisible ? [0, 1.8, 1.2] : [1.2, 0],
                    opacity: connection.heartVisible ? [0, 1, 0.9] : [0.9, 0]
                  }}
                  transition={{ 
                    duration: connection.heartVisible ? 1.5 : 1,
                    ease: "easeOut"
                  }}
                >
                  <path
                    d={`M${heartX},${heartY + 5} 
                        C${heartX},${heartY - 3} ${heartX - 10},${heartY - 8} ${heartX - 10},${heartY - 3}
                        C${heartX - 10},${heartY + 3} ${heartX},${heartY + 10} ${heartX},${heartY + 10}
                        C${heartX},${heartY + 10} ${heartX + 10},${heartY + 3} ${heartX + 10},${heartY - 3}
                        C${heartX + 10},${heartY - 8} ${heartX},${heartY - 3} ${heartX},${heartY + 5} Z`}
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    style={{
                      filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))'
                    }}
                  />
                </motion.g>
              )}
              
              {/* Pulse animation for active connections */}
              {connection.phase === 'connected' && (
                <motion.circle
                  cx={heartX}
                  cy={heartY}
                  r="20"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.3"
                  animate={{
                    r: [20, 35, 20],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}