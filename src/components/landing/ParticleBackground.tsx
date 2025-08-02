import { motion } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';

interface FloatingElement {
  id: string;
  type: 'logo';
  src: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  vx: number;
  vy: number;
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
  const connectionDebounce = useRef<{ [key: string]: number }>({});

  // Minimal exclusion zones with smaller areas
  const getExclusionZones = useCallback((): ExclusionZone[] => [
    { id: 'header', x: 20, y: 0, width: 60, height: 8, buffer: 1 },
    { id: 'hero-title', x: 25, y: 20, width: 50, height: 10, buffer: 1 },
    { id: 'hero-buttons', x: 35, y: 35, width: 30, height: 4, buffer: 1 }
  ], []);

  // Balanced preferred zones with weaker attraction
  const getPreferredZones = useCallback((): PreferredZone[] => [
    { id: 'left-area', x: 5, y: 20, width: 20, height: 60, attraction: 0.1 },
    { id: 'right-area', x: 75, y: 20, width: 20, height: 60, attraction: 0.1 },
    { id: 'center-bottom', x: 30, y: 70, width: 40, height: 25, attraction: 0.15 }
  ], []);

  // Simple collision detection
  const checkCollision = useCallback((element1: FloatingElement, element2: FloatingElement): boolean => {
    const dx = element1.x - element2.x;
    const dy = element1.y - element2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (element1.collisionRadius + element2.collisionRadius) / 20;
    return distance < minDistance;
  }, []);

  // Balanced avoidance force to prevent clustering
  const getAvoidanceForce = useCallback((element: FloatingElement, others: FloatingElement[]) => {
    let forceX = 0;
    let forceY = 0;
    
    others.forEach(other => {
      if (other.id === element.id) return;
      
      const dx = element.x - other.x;
      const dy = element.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const safeDistance = (element.collisionRadius + other.collisionRadius) / 18;
      
      if (distance < safeDistance && distance > 0) {
        const force = ((safeDistance - distance) / safeDistance) * 0.3;
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        
        forceX += normalizedX * force;
        forceY += normalizedY * force;
      }
    });
    
    return { forceX, forceY };
  }, []);

  // Simple exclusion zone checking
  const isInExclusionZone = useCallback((x: number, y: number, elementSize: number = 50): boolean => {
    const zones = getExclusionZones();
    
    return zones.some(zone => 
      x >= zone.x && 
      x <= (zone.x + zone.width) &&
      y >= zone.y && 
      y <= (zone.y + zone.height)
    );
  }, [getExclusionZones]);

  // Gentle attraction force from preferred zones
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
      
      if (distance > 0 && distance < 30) {
        const force = zone.attraction * (1 - distance / 30);
        forceX += (dx / distance) * force * 0.0005;
        forceY += (dy / distance) * force * 0.0005;
      }
    });
    
    return { forceX, forceY };
  }, [getPreferredZones]);

  // Simple random positioning with collision avoidance
  const generateSafePosition = useCallback((existingElements: FloatingElement[] = [], elementSize: number = 50): { x: number; y: number } => {
    let attempts = 0;
    let x: number, y: number;
    
    do {
      x = 10 + Math.random() * 80;
      y = 10 + Math.random() * 80;
      attempts++;
      
      const collision = existingElements.some(existing => {
        const dx = x - existing.x;
        const dy = y - existing.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (elementSize + existing.size) / 25;
        return distance < minDistance;
      });
      
      if (!collision && !isInExclusionZone(x, y, elementSize)) {
        break;
      }
    } while (attempts < 20);
    
    return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
  }, [isInExclusionZone]);

  // Initialize with logos only (fix non-existent avatars)
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
      '/logos/Starbucks_Coffee_Logo.svg',
      '/logos/McDonald\'s_SVG_logo.svg',
      '/logos/PlayStation_logo.svg',
      '/logos/Zara_Logo.svg',
      '/logos/WWF_logo_2000.svg'
    ];

    const initialElements: FloatingElement[] = [];
    
    // Add logos with simple positioning
    logos.forEach((src, index) => {
      const position = generateSafePosition(initialElements, 40);
      initialElements.push({
        id: `logo-${index}`,
        type: 'logo' as const,
        src,
        x: position.x,
        y: position.y,
        size: 40,
        speed: 0.01 + Math.random() * 0.015,
        direction: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.001,
        vy: (Math.random() - 0.5) * 0.001,
        collisionRadius: 50
      });
    });

    setElements(initialElements);
  }, [generateSafePosition]);

  // Enhanced connection creation with better logic
  const createConnection = useCallback((currentElements: FloatingElement[]) => {
    const now = Date.now();
    if (now - lastConnectionTime.current < 2000) return;
    
    setConnections(prevConnections => {
      const activeConnections = prevConnections.filter(conn => 
        conn.phase !== 'completed' && now - conn.createdAt < 6000
      );
      
      if (activeConnections.length >= 3) return prevConnections;
      
      const availableElements = currentElements.filter(el => 
        !activeConnections.some(conn => conn.fromId === el.id || conn.toId === el.id)
      );
      
      if (availableElements.length < 2) return prevConnections;

      // Find any reasonable pair within distance
      let bestPair = null;
      let shortestDistance = Infinity;
      
      for (let i = 0; i < availableElements.length; i++) {
        for (let j = i + 1; j < availableElements.length; j++) {
          const element1 = availableElements[i];
          const element2 = availableElements[j];
          
          const dx = element1.x - element2.x;
          const dy = element1.y - element2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < shortestDistance && distance < 35) {
            shortestDistance = distance;
            bestPair = { from: element1, to: element2 };
          }
        }
      }
      
      if (bestPair) {
        lastConnectionTime.current = now;
        
        const newConnection: Connection = {
          id: `connection-${now}-${Math.random()}`,
          fromId: bestPair.from.id,
          toId: bestPair.to.id,
          progress: 0,
          visible: true,
          showHeart: false,
          heartVisible: false,
          phase: 'approaching',
          createdAt: now
        };
        
        return [...activeConnections, newConnection];
      }
      
      return prevConnections;
    });
  }, []);

  // Connection management with current elements
  useEffect(() => {
    if (elements.length === 0) return;

    const connectionTimer = setTimeout(() => {
      createConnection(elements);
      const interval = setInterval(() => createConnection(elements), 3000);
      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(connectionTimer);
  }, [elements, createConnection]);

  // Simple connection animation
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
            newProgress = Math.min(conn.progress + 0.02, 1);
            if (newProgress >= 1) {
              newPhase = 'connected';
              newShowHeart = true;
              newHeartVisible = true;
            }
          } else if (conn.phase === 'connected') {
            if (now - conn.createdAt > 2000) {
              newPhase = 'separating';
              newHeartVisible = false;
            }
          } else if (conn.phase === 'separating') {
            if (now - conn.createdAt > 3000) {
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
        }).filter(conn => conn.phase !== 'completed')
      );
    };

    const interval = setInterval(animateConnections, 50);
    return () => clearInterval(interval);
  }, []);

  // Simplified fluid movement system
  useEffect(() => {
    const updateElements = () => {
      setElements(prev => {
        return prev.map(element => {
          let newVx = element.vx;
          let newVy = element.vy;
          
          // Base drift movement with smooth rotation
          const time = Date.now() * 0.0001;
          const driftX = Math.cos(element.direction + time * element.speed) * 0.003;
          const driftY = Math.sin(element.direction + time * element.speed) * 0.003;
          
          newVx += driftX;
          newVy += driftY;
          
          // Balanced collision avoidance
          const { forceX, forceY } = getAvoidanceForce(element, prev);
          newVx += forceX * 0.002;
          newVy += forceY * 0.002;
          
          // Zone attraction
          const { forceX: zoneForceX, forceY: zoneForceY } = getZoneAttraction(element);
          newVx += zoneForceX;
          newVy += zoneForceY;
          
          // Gentle exclusion zone avoidance
          if (isInExclusionZone(element.x, element.y, element.size)) {
            const zones = getExclusionZones();
            for (const zone of zones) {
              const centerX = zone.x + zone.width / 2;
              const centerY = zone.y + zone.height / 2;
              const dx = element.x - centerX;
              const dy = element.y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 0) {
                const force = 0.002; // Much weaker force
                newVx += (dx / distance) * force;
                newVy += (dy / distance) * force;
              }
            }
          }
          
          // Gentle boundary repulsion
          const margin = 8;
          if (element.x < margin) newVx += (margin - element.x) * 0.001;
          if (element.x > 100 - margin) newVx -= (element.x - (100 - margin)) * 0.001;
          if (element.y < margin) newVy += (margin - element.y) * 0.001;
          if (element.y > 100 - margin) newVy -= (element.y - (100 - margin)) * 0.001;
          
          // Apply damping for smooth movement
          newVx *= 0.95;
          newVy *= 0.95;
          
          // Update position
          const newX = Math.max(2, Math.min(98, element.x + newVx));
          const newY = Math.max(2, Math.min(98, element.y + newVy));
          
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
    };

    const interval = setInterval(updateElements, 50);
    return () => clearInterval(interval);
  }, [getAvoidanceForce, isInExclusionZone, getZoneAttraction]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Company logos only */}
      {elements.map((element) => (
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
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { 
              duration: 8, 
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
              style={{ 
                filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              onError={(e) => {
                console.warn('Failed to load logo:', element.src);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection) => {
          if (typeof window === 'undefined') return null;
          
          // Find current positions of connected elements
          const fromElement = elements.find(el => el.id === connection.fromId);
          const toElement = elements.find(el => el.id === connection.toId);
          
          if (!fromElement || !toElement) return null;
          
          const fromX = (fromElement.x / 100) * window.innerWidth;
          const fromY = (fromElement.y / 100) * window.innerHeight;
          const toX = (toElement.x / 100) * window.innerWidth;
          const toY = (toElement.y / 100) * window.innerHeight;
          
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
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: connection.progress,
                  opacity: connection.visible ? 0.6 : 0
                }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))'
                }}
              />
              
              {/* Heart at connection midpoint */}
              {connection.heartVisible && connection.phase === 'connected' && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: connection.heartVisible ? [0, 1.5, 1] : [1, 0],
                    opacity: connection.heartVisible ? [0, 1, 0.8] : [0.8, 0]
                  }}
                  transition={{ 
                    duration: connection.heartVisible ? 1 : 0.5,
                    ease: "easeOut"
                  }}
                >
                  <path
                    d={`M${heartX},${heartY + 3} 
                        C${heartX},${heartY - 2} ${heartX - 8},${heartY - 6} ${heartX - 8},${heartY - 2}
                        C${heartX - 8},${heartY + 2} ${heartX},${heartY + 8} ${heartX},${heartY + 8}
                        C${heartX},${heartY + 8} ${heartX + 8},${heartY + 2} ${heartX + 8},${heartY - 2}
                        C${heartX + 8},${heartY - 6} ${heartX},${heartY - 2} ${heartX},${heartY + 3} Z`}
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