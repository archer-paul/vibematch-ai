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

const GRID_COLS = 8;
const GRID_ROWS = 6;

export function ParticleBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const lastConnectionTime = useRef(0);
  const animationFrameRef = useRef<number>();
  const gridOccupancy = useRef<boolean[][]>(Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(false)));

  // Smaller exclusion zones for UI elements
  const getExclusionZones = useCallback((): ExclusionZone[] => [
    { id: 'header', x: 20, y: 0, width: 60, height: 12, buffer: 2 },
    { id: 'hero-title', x: 25, y: 15, width: 50, height: 15, buffer: 2 },
    { id: 'hero-buttons', x: 35, y: 32, width: 30, height: 8, buffer: 2 }
  ], []);

  // Enhanced repulsion force to prevent clustering
  const getRepulsionForce = useCallback((element: FloatingElement, others: FloatingElement[]) => {
    let forceX = 0;
    let forceY = 0;
    
    others.forEach(other => {
      if (other.id === element.id) return;
      
      const dx = element.x - other.x;
      const dy = element.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = 15; // Minimum distance between elements
      
      if (distance < minDistance && distance > 0) {
        const force = ((minDistance - distance) / minDistance) * 0.8;
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        
        forceX += normalizedX * force;
        forceY += normalizedY * force;
      }
    });
    
    return { forceX, forceY };
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

  // Get grid position for uniform distribution
  const getGridPosition = useCallback((gridX: number, gridY: number) => {
    const cellWidth = 100 / GRID_COLS;
    const cellHeight = 100 / GRID_ROWS;
    
    const x = (gridX * cellWidth) + (cellWidth / 2) + (Math.random() - 0.5) * (cellWidth * 0.6);
    const y = (gridY * cellHeight) + (cellHeight / 2) + (Math.random() - 0.5) * (cellHeight * 0.6);
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  }, []);

  // Generate waypoint for chaotic movement
  const generateWaypoint = useCallback(() => {
    return {
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80
    };
  }, []);

  // Initialize elements with 50/50 mix of logos and avatars
  useEffect(() => {
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
    gridOccupancy.current = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(false));

    // Add logos
    logos.forEach((src, index) => {
      let gridX, gridY;
      do {
        gridX = Math.floor(Math.random() * GRID_COLS);
        gridY = Math.floor(Math.random() * GRID_ROWS);
      } while (gridOccupancy.current[gridY][gridX]);

      gridOccupancy.current[gridY][gridX] = true;
      const position = getGridPosition(gridX, gridY);

      // Skip if in exclusion zone
      if (!isInExclusionZone(position.x, position.y)) {
        initialElements.push({
          id: `logo-${index}`,
          type: 'logo',
          src,
          x: position.x,
          y: position.y,
          size: 35,
          speed: 0.02 + Math.random() * 0.03,
          direction: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.02,
          vy: (Math.random() - 0.5) * 0.02,
          collisionRadius: 45,
          waypoint: generateWaypoint(),
          directionChangeTimer: 2000 + Math.random() * 3000,
          gridX,
          gridY
        });
      }
    });

    // Add avatars
    avatars.forEach((src, index) => {
      let gridX, gridY;
      do {
        gridX = Math.floor(Math.random() * GRID_COLS);
        gridY = Math.floor(Math.random() * GRID_ROWS);
      } while (gridOccupancy.current[gridY][gridX]);

      gridOccupancy.current[gridY][gridX] = true;
      const position = getGridPosition(gridX, gridY);

      // Skip if in exclusion zone
      if (!isInExclusionZone(position.x, position.y)) {
        initialElements.push({
          id: `avatar-${index}`,
          type: 'avatar',
          src,
          x: position.x,
          y: position.y,
          size: 40,
          speed: 0.015 + Math.random() * 0.025,
          direction: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.015,
          vy: (Math.random() - 0.5) * 0.015,
          collisionRadius: 50,
          waypoint: generateWaypoint(),
          directionChangeTimer: 1500 + Math.random() * 2500,
          gridX,
          gridY
        });
      }
    });

    setElements(initialElements);
  }, [getGridPosition, generateWaypoint, isInExclusionZone]);

  // Enhanced connection creation - allow far connections
  const createConnection = useCallback((currentElements: FloatingElement[]) => {
    const now = Date.now();
    if (now - lastConnectionTime.current < 1500) return;
    
    setConnections(prevConnections => {
      const activeConnections = prevConnections.filter(conn => 
        conn.phase !== 'completed' && now - conn.createdAt < 8000
      );
      
      if (activeConnections.length >= 4) return prevConnections;
      
      const availableElements = currentElements.filter(el => 
        !activeConnections.some(conn => conn.fromId === el.id || conn.toId === el.id)
      );
      
      if (availableElements.length < 2) return prevConnections;

      // Allow connections across much larger distances
      let bestPair = null;
      let attempts = 0;
      
      while (attempts < 10 && !bestPair) {
        const element1 = availableElements[Math.floor(Math.random() * availableElements.length)];
        const element2 = availableElements[Math.floor(Math.random() * availableElements.length)];
        
        if (element1.id !== element2.id) {
          const dx = element1.x - element2.x;
          const dy = element1.y - element2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Much larger connection distance to show app's far-reaching connections
          if (distance < 80 && distance > 20) {
            bestPair = { from: element1, to: element2 };
          }
        }
        attempts++;
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

  // More frequent connection attempts
  useEffect(() => {
    if (elements.length === 0) return;

    const connectionTimer = setTimeout(() => {
      createConnection(elements);
      const interval = setInterval(() => createConnection(elements), 2000);
      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(connectionTimer);
  }, [elements, createConnection]);

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

  // Enhanced chaotic movement system
  useEffect(() => {
    const updateElements = () => {
      setElements(prev => {
        return prev.map(element => {
          let newVx = element.vx;
          let newVy = element.vy;
          let newDirection = element.direction;
          let newWaypoint = element.waypoint;
          let newDirectionChangeTimer = element.directionChangeTimer - 50;

          // Waypoint-based movement for more interesting paths
          if (element.waypoint) {
            const waypointDx = element.waypoint.x - element.x;
            const waypointDy = element.waypoint.y - element.y;
            const waypointDistance = Math.sqrt(waypointDx * waypointDx + waypointDy * waypointDy);
            
            if (waypointDistance < 8 || newDirectionChangeTimer <= 0) {
              newWaypoint = generateWaypoint();
              newDirectionChangeTimer = 2000 + Math.random() * 4000;
            } else {
              const waypointForce = 0.001;
              newVx += (waypointDx / waypointDistance) * waypointForce;
              newVy += (waypointDy / waypointDistance) * waypointForce;
            }
          }

          // Random direction changes for chaotic movement
          if (newDirectionChangeTimer <= 0) {
            newDirection = Math.random() * Math.PI * 2;
            newDirectionChangeTimer = 1500 + Math.random() * 3000;
          }

          // Base chaotic movement
          const time = Date.now() * 0.0001;
          const chaosX = Math.cos(newDirection + time * element.speed) * 0.008;
          const chaosY = Math.sin(newDirection + time * element.speed) * 0.008;
          
          newVx += chaosX + (Math.random() - 0.5) * 0.004;
          newVy += chaosY + (Math.random() - 0.5) * 0.004;

          // Strong repulsion to prevent clustering
          const { forceX, forceY } = getRepulsionForce(element, prev);
          newVx += forceX * 0.01;
          newVy += forceY * 0.01;

          // Exclusion zone avoidance
          if (isInExclusionZone(element.x, element.y)) {
            const zones = getExclusionZones();
            for (const zone of zones) {
              const centerX = zone.x + zone.width / 2;
              const centerY = zone.y + zone.height / 2;
              const dx = element.x - centerX;
              const dy = element.y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 0) {
                const force = 0.01;
                newVx += (dx / distance) * force;
                newVy += (dy / distance) * force;
              }
            }
          }

          // Boundary forces
          const margin = 5;
          if (element.x < margin) newVx += (margin - element.x) * 0.003;
          if (element.x > 100 - margin) newVx -= (element.x - (100 - margin)) * 0.003;
          if (element.y < margin) newVy += (margin - element.y) * 0.003;
          if (element.y > 100 - margin) newVy -= (element.y - (100 - margin)) * 0.003;

          // Damping
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
            direction: newDirection,
            waypoint: newWaypoint,
            directionChangeTimer: newDirectionChangeTimer
          };
        });
      });
    };

    const interval = setInterval(updateElements, 50);
    return () => clearInterval(interval);
  }, [getRepulsionForce, isInExclusionZone, generateWaypoint, getExclusionZones]);

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
            rotate: element.type === 'logo' ? [0, 360] : [0, -360],
            scale: element.type === 'avatar' ? [0.95, 1.15, 0.95] : [0.9, 1.1, 0.9]
          }}
          transition={{
            rotate: { 
              duration: element.type === 'avatar' ? 25 : 30, 
              repeat: Infinity, 
              ease: "linear" 
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