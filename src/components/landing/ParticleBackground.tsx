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
  vx: number; // velocity x
  vy: number; // velocity y
  targetX?: number;
  targetY?: number;
  connectedUntil?: number; // timestamp when separation should complete
  avoidanceForceX?: number;
  avoidanceForceY?: number;
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
  heartVisible: boolean;
  phase: 'approaching' | 'connected' | 'separating' | 'completed';
  createdAt: number;
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

  // Check for collision between two elements
  const checkCollision = useCallback((element1: FloatingElement, element2: FloatingElement): boolean => {
    const dx = element1.x - element2.x;
    const dy = element1.y - element2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (element1.size + element2.size) / 40; // Convert pixels to percentage
    return distance < minDistance;
  }, []);

  // Generate collision avoidance force
  const getAvoidanceForce = useCallback((element: FloatingElement, others: FloatingElement[]) => {
    let forceX = 0;
    let forceY = 0;
    
    others.forEach(other => {
      if (other.id === element.id) return;
      
      const dx = element.x - other.x;
      const dy = element.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = (element.size + other.size) / 30;
      
      if (distance < minDistance && distance > 0) {
        const force = (minDistance - distance) / minDistance;
        forceX += (dx / distance) * force * 0.5;
        forceY += (dy / distance) * force * 0.5;
      }
    });
    
    return { forceX, forceY };
  }, []);

  // Check if position overlaps with exclusion zones
  const isInExclusionZone = useCallback((x: number, y: number): boolean => {
    const zones = getExclusionZones();
    return zones.some(zone => 
      x >= zone.x && x <= zone.x + zone.width &&
      y >= zone.y && y <= zone.y + zone.height
    );
  }, [getExclusionZones]);

  // Generate safe position avoiding exclusion zones and other elements
  const generateSafePosition = useCallback((existingElements: FloatingElement[] = [], elementSize: number = 50): { x: number; y: number } => {
    let attempts = 0;
    let x: number, y: number;
    
    do {
      x = 10 + Math.random() * 80; // Stay within 10-90% range
      y = 10 + Math.random() * 80;
      attempts++;
      
      // Check collision with existing elements
      const collision = existingElements.some(existing => {
        const dx = x - existing.x;
        const dy = y - existing.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (elementSize + existing.size) / 25; // Minimum distance in percentage
        return distance < minDistance;
      });
      
      if (!collision && !isInExclusionZone(x, y)) {
        break;
      }
    } while (attempts < 30);
    
    // If we can't find a safe spot, use grid-based distribution
    if (attempts >= 30) {
      const gridSize = 6;
      const cellWidth = 80 / gridSize;
      const cellHeight = 80 / gridSize;
      const gridIndex = existingElements.length % (gridSize * gridSize);
      const gridX = gridIndex % gridSize;
      const gridY = Math.floor(gridIndex / gridSize);
      
      x = 10 + gridX * cellWidth + cellWidth / 2;
      y = 10 + gridY * cellHeight + cellHeight / 2;
      
      // Avoid exclusion zones in grid placement
      if (isInExclusionZone(x, y)) {
        x = x < 50 ? 5 : 95;
        y = 20 + Math.random() * 60;
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
    const initialElements: FloatingElement[] = [];
    
    // Add logos with collision avoidance
    logos.forEach((src, index) => {
      const position = generateSafePosition(initialElements, 50);
      initialElements.push({
        id: `logo-${index}`,
        type: 'logo' as const,
        src,
        x: position.x,
        y: position.y,
        size: 50,
        speed: 0.02 + Math.random() * 0.03,
        direction: Math.random() * Math.PI * 2,
        vx: 0,
        vy: 0
      });
    });
    
    // Add avatars with collision avoidance
    avatars.forEach((src, index) => {
      const position = generateSafePosition(initialElements, 80);
      initialElements.push({
        id: `avatar-${index}`,
        type: 'avatar' as const,
        src,
        x: position.x,
        y: position.y,
        size: 80,
        speed: 0.015 + Math.random() * 0.025,
        direction: Math.random() * Math.PI * 2,
        vx: 0,
        vy: 0
      });
    });

    setElements(initialElements);
  }, [generateSafePosition]);

  // Enhanced connection creation system
  const createConnection = useCallback(() => {
    const now = Date.now();
    if (now - lastConnectionTime.current < 6000) return; // Reduced throttle time
    
    setElements(currentElements => {
      setConnections(prevConnections => {
        // Only create new connections if we have fewer than 2 active ones
        const activeConnections = prevConnections.filter(conn => conn.phase !== 'completed');
        if (activeConnections.length >= 2) return prevConnections;
        
        const logoElements = currentElements.filter(el => el.type === 'logo');
        const avatarElements = currentElements.filter(el => el.type === 'avatar');
        
        if (logoElements.length === 0 || avatarElements.length === 0) {
          return prevConnections;
        }

        // Find best connection pair
        let bestPair = null;
        let shortestDistance = Infinity;
        
        for (const logo of logoElements) {
          for (const avatar of avatarElements) {
            const dx = logo.x - avatar.x;
            const dy = logo.y - avatar.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Skip if either element is recently connected
            const recentlyConnected = prevConnections.some(conn => 
              now - conn.createdAt < 8000 && (
                conn.from.id === logo.id || conn.to.id === avatar.id ||
                conn.from.id === avatar.id || conn.to.id === logo.id
              )
            );
            
            if (distance < shortestDistance && !recentlyConnected && distance < 35) {
              shortestDistance = distance;
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
            heartVisible: false,
            phase: 'approaching',
            createdAt: now
          };
          
          return [...prevConnections.filter(conn => conn.phase !== 'completed'), newConnection];
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

  // Enhanced connection animation with phases
  useEffect(() => {
    const animateConnections = () => {
      const now = Date.now();
      
      setConnections(prev => 
        prev.map(conn => {
          let newProgress = conn.progress;
          let newPhase = conn.phase;
          let newShowHeart = conn.showHeart;
          let newHeartVisible = conn.heartVisible;
          
          if (conn.phase === 'approaching') {
            newProgress = Math.min(conn.progress + 0.008, 1);
            if (newProgress >= 1) {
              newPhase = 'connected';
              newShowHeart = true;
              newHeartVisible = true;
            }
          } else if (conn.phase === 'connected') {
            // Stay connected for 1.5 seconds
            if (now - conn.createdAt > 3000) {
              newPhase = 'separating';
              newHeartVisible = false;
            }
          } else if (conn.phase === 'separating') {
            // Separation phase lasts 1 second
            if (now - conn.createdAt > 4000) {
              newPhase = 'completed';
            }
          }
          
          return {
            ...conn,
            progress: newProgress,
            phase: newPhase,
            showHeart: newShowHeart,
            heartVisible: newHeartVisible
          };
        }).filter(conn => conn.phase !== 'completed' || now - conn.createdAt < 5000)
      );
    };

    const interval = setInterval(animateConnections, 60);
    return () => clearInterval(interval);
  }, []);

  // Enhanced physics-based animation system
  useEffect(() => {
    const updateElements = () => {
      const now = Date.now();
      
      setConnections(currentConnections => {
        setElements(prev => {
          return prev.map(element => {
            let newVx = element.vx;
            let newVy = element.vy;
            
            // Base drift movement
            const time = now * 0.0001;
            const driftX = Math.cos(element.direction + time * element.speed) * 0.003;
            const driftY = Math.sin(element.direction + time * element.speed) * 0.003;
            
            newVx += driftX;
            newVy += driftY;
            
            // Connection-based forces
            const activeConnection = currentConnections.find(conn => 
              conn.from.id === element.id || conn.to.id === element.id
            );
            
            if (activeConnection) {
              const other = activeConnection.from.id === element.id ? activeConnection.to : activeConnection.from;
              const dx = other.x - element.x;
              const dy = other.y - element.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (activeConnection.phase === 'approaching') {
                // Attraction force
                if (distance > 2) {
                  const force = 0.004;
                  newVx += (dx / distance) * force;
                  newVy += (dy / distance) * force;
                }
              } else if (activeConnection.phase === 'separating') {
                // Separation force
                if (distance < 25) {
                  const force = 0.006;
                  newVx -= (dx / distance) * force;
                  newVy -= (dy / distance) * force;
                }
              }
            }
            
            // Collision avoidance
            const { forceX, forceY } = getAvoidanceForce(element, prev);
            newVx += forceX * 0.002;
            newVy += forceY * 0.002;
            
            // Exclusion zone avoidance
            if (isInExclusionZone(element.x, element.y)) {
              const zones = getExclusionZones();
              for (const zone of zones) {
                const centerX = zone.x + zone.width / 2;
                const centerY = zone.y + zone.height / 2;
                const dx = element.x - centerX;
                const dy = element.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < zone.width / 2 + 8) {
                  const force = 0.008;
                  newVx += (dx / distance) * force;
                  newVy += (dy / distance) * force;
                }
              }
            }
            
            // Boundary repulsion
            if (element.x < 8) newVx += 0.002;
            if (element.x > 92) newVx -= 0.002;
            if (element.y < 8) newVy += 0.002;
            if (element.y > 92) newVy -= 0.002;
            
            // Apply damping
            newVx *= 0.95;
            newVy *= 0.95;
            
            // Update position
            let newX = Math.max(5, Math.min(95, element.x + newVx));
            let newY = Math.max(5, Math.min(95, element.y + newVy));
            
            return {
              ...element,
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy,
              direction: element.direction + (Math.random() - 0.5) * 0.002
            };
          });
        });
        return currentConnections;
      });
    };

    const interval = setInterval(updateElements, 80);
    return () => clearInterval(interval);
  }, [getAvoidanceForce, isInExclusionZone, getExclusionZones]);

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

      {/* Enhanced connection lines with white styling */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection) => {
          if (typeof window === 'undefined') return null;
          
          const fromX = (connection.from.x / 100) * window.innerWidth;
          const fromY = (connection.from.y / 100) * window.innerHeight;
          const toX = (connection.to.x / 100) * window.innerWidth;
          const toY = (connection.to.y / 100) * window.innerHeight;
          
          const currentX = fromX + (toX - fromX) * connection.progress;
          const currentY = fromY + (toY - fromY) * connection.progress;
          
          // Heart position at center of connection line
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
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: connection.progress,
                  opacity: connection.visible ? 0.7 : 0
                }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))'
                }}
              />
              
              {/* White outlined heart animation */}
              {connection.heartVisible && connection.phase === 'connected' && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: connection.heartVisible ? [0, 1.5, 1] : [1, 0],
                    opacity: connection.heartVisible ? [0, 1, 0.8] : [0.8, 0]
                  }}
                  transition={{ 
                    duration: connection.heartVisible ? 1.2 : 0.8,
                    ease: "easeOut"
                  }}
                >
                  {/* Heart shape using path */}
                  <path
                    d={`M${heartX},${heartY + 4} 
                        C${heartX},${heartY - 2} ${heartX - 8},${heartY - 6} ${heartX - 8},${heartY - 2}
                        C${heartX - 8},${heartY + 2} ${heartX},${heartY + 8} ${heartX},${heartY + 8}
                        C${heartX},${heartY + 8} ${heartX + 8},${heartY + 2} ${heartX + 8},${heartY - 2}
                        C${heartX + 8},${heartY - 6} ${heartX},${heartY - 2} ${heartX},${heartY + 4} Z`}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))'
                    }}
                  />
                </motion.g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
