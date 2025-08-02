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
  collisionRadius: number;
  waypoint?: { x: number; y: number };
  directionChangeTimer: number;
  gridX: number;
  gridY: number;
}

interface ExclusionZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  buffer: number;
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

// Remove rigid grid system for more natural movement
const TARGET_ELEMENTS = 24; // 12 logos + 12 avatars for better density

export function ParticleBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const lastConnectionTime = useRef(0);
  const animationFrameRef = useRef<number>();

  // Smaller exclusion zones for UI elements
  const getExclusionZones = useCallback((): ExclusionZone[] => [
    { id: 'header', x: 20, y: 0, width: 60, height: 12, buffer: 2 },
    { id: 'hero-title', x: 25, y: 15, width: 50, height: 15, buffer: 2 },
    { id: 'hero-buttons', x: 35, y: 32, width: 30, height: 8, buffer: 2 }
  ], []);

  // Reduced repulsion force to allow closer proximity
  const getRepulsionForce = useCallback((element: FloatingElement, others: FloatingElement[]) => {
    let forceX = 0;
    let forceY = 0;
    
    others.forEach(other => {
      if (other.id === element.id) return;
      
      const dx = element.x - other.x;
      const dy = element.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = 8; // Reduced minimum distance
      
      if (distance < minDistance && distance > 0) {
        const force = ((minDistance - distance) / minDistance) * 0.3; // Reduced force
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        
        forceX += normalizedX * force;
        forceY += normalizedY * force;
      }
    });
    
    return { forceX, forceY };
  }, []);

  // Central attraction force to prevent edge clustering
  const getCentralAttraction = useCallback((element: FloatingElement) => {
    const centerX = 50;
    const centerY = 50;
    const dx = centerX - element.x;
    const dy = centerY - element.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const force = Math.min(distance / 2000, 0.001); // Much weaker attraction
      return {
        forceX: (dx / distance) * force,
        forceY: (dy / distance) * force
      };
    }
    return { forceX: 0, forceY: 0 };
  }, []);

  // Check if position is in exclusion zone
  const isInExclusionZone = useCallback((x: number, y: number): boolean => {
    const zones = getExclusionZones();
    return zones.some(zone => 
      x >= zone.x - zone.buffer && 
      x <= (zone.x + zone.width + zone.buffer) &&
      y >= zone.y - zone.buffer && 
      y <= (zone.y + zone.height + zone.buffer)
    );
  }, [getExclusionZones]);

  // Generate random position avoiding exclusion zones
  const getRandomPosition = useCallback(() => {
    let attempts = 0;
    let position;
    
    do {
      position = {
        x: 10 + Math.random() * 80, // Stay away from edges
        y: 10 + Math.random() * 80
      };
      attempts++;
    } while (isInExclusionZone(position.x, position.y) && attempts < 20);
    
    return position;
  }, [isInExclusionZone]);

  // Initialize elements with improved distribution and more avatars
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
      '/logos/McDonald\'s_SVG_logo.svg',
      '/logos/PlayStation_logo.svg',
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
      '/avatars/avatar8.svg',
      '/avatars/avatar9.svg',
      '/avatars/avatar10.svg',
      '/avatars/avatar11.svg',
      '/avatars/avatar1.svg' // Repeat some for more avatars
    ];

    const initialElements: FloatingElement[] = [];

    // Add 12 logos with random positioning
    for (let i = 0; i < 12; i++) {
      const src = logos[i % logos.length];
      const position = getRandomPosition();
      
      initialElements.push({
        id: `logo-${i}`,
        type: 'logo',
        src,
        x: position.x,
        y: position.y,
        size: 32, // Slightly smaller logos
        speed: 0.025 + Math.random() * 0.04,
        direction: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.04, // More initial velocity
        vy: (Math.random() - 0.5) * 0.04,
        collisionRadius: 40,
        waypoint: undefined, // Remove waypoints for simpler movement
        directionChangeTimer: 800 + Math.random() * 1200, // Faster direction changes
        gridX: 0,
        gridY: 0
      });
    }

    // Add 12 avatars with random positioning (larger size)
    for (let i = 0; i < 12; i++) {
      const src = avatars[i % avatars.length];
      const position = getRandomPosition();
      
      initialElements.push({
        id: `avatar-${i}`,
        type: 'avatar',
        src,
        x: position.x,
        y: position.y,
        size: 58, // Significantly larger avatars (was 40)
        speed: 0.02 + Math.random() * 0.035,
        direction: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.035,
        vy: (Math.random() - 0.5) * 0.035,
        collisionRadius: 65,
        waypoint: undefined,
        directionChangeTimer: 600 + Math.random() * 1000, // Even faster changes
        gridX: 0,
        gridY: 0
      });
    }

    setElements(initialElements);
  }, [getRandomPosition]);

  // Fixed connection creation with current element positions
  const createConnection = useCallback(() => {
    const now = Date.now();
    if (now - lastConnectionTime.current < 800) return; // More frequent attempts
    
    setConnections(prevConnections => {
      const activeConnections = prevConnections.filter(conn => 
        conn.phase !== 'completed' && now - conn.createdAt < 6000 // Shorter connection lifespan
      );
      
      if (activeConnections.length >= 6) return prevConnections; // Allow more simultaneous connections
      
      // Get current elements inside the callback to ensure fresh positions
      setElements(currentElements => {
        const availableElements = currentElements.filter(el => 
          !activeConnections.some(conn => conn.fromId === el.id || conn.toId === el.id)
        );
        
        if (availableElements.length < 2) return currentElements;

        // More aggressive connection finding
        let bestPair = null;
        let bestDistance = Infinity;
        
        for (let i = 0; i < availableElements.length && !bestPair; i++) {
          for (let j = i + 1; j < availableElements.length; j++) {
            const element1 = availableElements[i];
            const element2 = availableElements[j];
            
            const dx = element1.x - element2.x;
            const dy = element1.y - element2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Increased connection range for more connections
            if (distance < 90 && distance > 10 && distance < bestDistance) {
              bestPair = { from: element1, to: element2 };
              bestDistance = distance;
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
          
          setConnections(prev => [...prev.filter(conn => 
            conn.phase !== 'completed' && now - conn.createdAt < 6000
          ), newConnection]);
        }
        
        return currentElements;
      });
      
      return prevConnections;
    });
  }, []);

  // Much more frequent connection attempts
  useEffect(() => {
    if (elements.length === 0) return;

    const connectionTimer = setTimeout(() => {
      createConnection();
      const interval = setInterval(() => createConnection(), 1200); // More frequent
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(connectionTimer);
  }, [elements.length, createConnection]);

  // Enhanced connection animation
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
            newProgress = Math.min(conn.progress + 0.025, 1);
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
            heartVisible: newHeartVisible
          };
        }).filter(conn => conn.phase !== 'completed')
      );
    };

    const interval = setInterval(animateConnections, 40);
    return () => clearInterval(interval);
  }, []);

  // Improved movement system with better randomness and central attraction
  useEffect(() => {
    const updateElements = () => {
      setElements(prev => {
        return prev.map(element => {
          let newVx = element.vx;
          let newVy = element.vy;
          let newDirection = element.direction;
          let newDirectionChangeTimer = element.directionChangeTimer - 40;

          // More frequent and random direction changes
          if (newDirectionChangeTimer <= 0) {
            newDirection = Math.random() * Math.PI * 2;
            newDirectionChangeTimer = 500 + Math.random() * 1000; // Much more frequent
          }

          // Smoother random movement with reduced chaos
          const time = Date.now() * 0.0002;
          const primaryChaos = Math.cos(newDirection + time * element.speed) * 0.008;
          const secondaryChaos = Math.sin(newDirection * 1.3 + time * element.speed * 0.7) * 0.006;
          
          newVx += primaryChaos + (Math.random() - 0.5) * 0.006; // Reduced randomness
          newVy += secondaryChaos + (Math.random() - 0.5) * 0.006;

          // Add some elements with random burst movement for screen traversal
          if (Math.random() < 0.002) { // 0.2% chance per frame
            newVx += (Math.random() - 0.5) * 0.08; // Burst movement
            newVy += (Math.random() - 0.5) * 0.08;
          }

          // Reduced repulsion force
          const { forceX, forceY } = getRepulsionForce(element, prev);
          newVx += forceX * 0.005; // Reduced from 0.01
          newVy += forceY * 0.005;

          // Central attraction to prevent edge clustering
          const { forceX: centerForceX, forceY: centerForceY } = getCentralAttraction(element);
          newVx += centerForceX;
          newVy += centerForceY;

          // Gentler exclusion zone avoidance
          if (isInExclusionZone(element.x, element.y)) {
            const zones = getExclusionZones();
            for (const zone of zones) {
              const centerX = zone.x + zone.width / 2;
              const centerY = zone.y + zone.height / 2;
              const dx = element.x - centerX;
              const dy = element.y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 0) {
                const force = 0.005; // Reduced force
                newVx += (dx / distance) * force;
                newVy += (dy / distance) * force;
              }
            }
          }

          // Stronger boundary forces to keep elements moving inward
          const margin = 8;
          const boundaryForce = 0.008;
          if (element.x < margin) newVx += (margin - element.x) * boundaryForce;
          if (element.x > 100 - margin) newVx -= (element.x - (100 - margin)) * boundaryForce;
          if (element.y < margin) newVy += (margin - element.y) * boundaryForce;
          if (element.y > 100 - margin) newVy -= (element.y - (100 - margin)) * boundaryForce;

          // Reduced damping for more fluid movement
          newVx *= 0.94; // Less damping
          newVy *= 0.94;

          // Update position with wider bounds
          const newX = Math.max(2, Math.min(98, element.x + newVx));
          const newY = Math.max(2, Math.min(98, element.y + newVy));

          return {
            ...element,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            direction: newDirection,
            directionChangeTimer: newDirectionChangeTimer
          };
        });
      });
    };

    const interval = setInterval(updateElements, 40); // Slightly faster updates
    return () => clearInterval(interval);
  }, [getRepulsionForce, getCentralAttraction, isInExclusionZone, getExclusionZones]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating elements with different styles for logos and avatars */}
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
            rotate: element.type === 'logo' ? [0, 360] : [0, 15, 0, -15, 0],
            scale: element.type === 'avatar' ? [0.95, 1.15, 0.95] : [0.9, 1.1, 0.9]
          }}
          transition={{
            rotate: { 
              duration: element.type === 'avatar' ? 8 : 30, 
              repeat: Infinity, 
              ease: element.type === 'avatar' ? "easeInOut" : "linear"
            },
            scale: { 
              duration: element.type === 'avatar' ? 6 : 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={element.src} 
              alt={element.type === 'avatar' ? 'User avatar' : 'Company logo'} 
              className="w-full h-full object-contain"
              style={{ 
                filter: element.type === 'avatar' 
                  ? 'drop-shadow(0 0 12px rgba(147, 51, 234, 0.4))' 
                  : 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
                opacity: element.type === 'avatar' ? 0.8 : 0.7,
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              onError={(e) => {
                console.warn(`Failed to load ${element.type}:`, element.src);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* Enhanced connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection) => {
          if (typeof window === 'undefined') return null;
          
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

          const isAvatarConnection = fromElement.type === 'avatar' || toElement.type === 'avatar';

          return (
            <g key={connection.id}>
              <motion.line
                x1={fromX}
                y1={fromY}
                x2={currentX}
                y2={currentY}
                stroke={isAvatarConnection ? "#9333ea" : "white"}
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: connection.progress,
                  opacity: connection.visible ? 0.8 : 0
                }}
                transition={{ 
                  duration: 0.4,
                  ease: "easeInOut"
                }}
                style={{
                  filter: isAvatarConnection 
                    ? 'drop-shadow(0 0 6px rgba(147, 51, 234, 0.5))' 
                    : 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))'
                }}
              />
              
              {/* Enhanced heart animation */}
              {connection.heartVisible && connection.phase === 'connected' && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: connection.heartVisible ? [0, 1.8, 1.2] : [1.2, 0],
                    opacity: connection.heartVisible ? [0, 1, 0.9] : [0.9, 0]
                  }}
                  transition={{ 
                    duration: connection.heartVisible ? 1.2 : 0.6,
                    ease: "easeOut"
                  }}
                >
                  <path
                    d={`M${heartX},${heartY + 4} 
                        C${heartX},${heartY - 3} ${heartX - 10},${heartY - 7} ${heartX - 10},${heartY - 3}
                        C${heartX - 10},${heartY + 3} ${heartX},${heartY + 10} ${heartX},${heartY + 10}
                        C${heartX},${heartY + 10} ${heartX + 10},${heartY + 3} ${heartX + 10},${heartY - 3}
                        C${heartX + 10},${heartY - 7} ${heartX},${heartY - 3} ${heartX},${heartY + 4} Z`}
                    fill={isAvatarConnection ? "#9333ea" : "white"}
                    stroke={isAvatarConnection ? "#7c3aed" : "#f1f5f9"}
                    strokeWidth="1"
                    style={{
                      filter: isAvatarConnection 
                        ? 'drop-shadow(0 0 12px rgba(147, 51, 234, 0.8))' 
                        : 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))'
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