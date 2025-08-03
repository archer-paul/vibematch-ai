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
  // États pour les connexions
  isConnecting: boolean;
  targetId?: string;
  originalX?: number;
  originalY?: number;
  connectionPhase?: 'moving' | 'connected' | 'separating';
  // États pour le cycle de vie
  isAlive: boolean;
  fadeState: 'in' | 'stable' | 'out';
  createdAt: number;
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
  phase: 'pausing' | 'heart-showing' | 'separating' | 'completed';
  createdAt: number;
  heartScale: number;
}

const LOGO_ASSETS = [
  '/logos/adidas.svg',
  '/logos/apple.svg',
  '/logos/coca-cola.svg',
  '/logos/playstation.svg',
  '/logos/loreal.svg',
  '/logos/mcdonalds.svg',
  '/logos/netflix.svg',
  '/logos/nike.svg',
  '/logos/revolut.svg',
  '/logos/samsung.svg',
  '/logos/sephora.svg',
  '/logos/starbucks.svg',
  '/logos/wwf.svg',
  '/logos/zara.svg'
];

const AVATAR_ASSETS = [
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
  '/avatars/avatar11.svg'
];

export function ParticleBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const lastConnectionTime = useRef(0);

  const getExclusionZones = useCallback((): ExclusionZone[] => [
    { id: 'header', x: 0, y: 0, width: 100, height: 12, buffer: 2 },
    { id: 'hero-title', x: 20, y: 20, width: 60, height: 30, buffer: 3 },
    { id: 'hero-buttons', x: 30, y: 55, width: 40, height: 12, buffer: 2 },
    { id: 'features', x: 0, y: 70, width: 100, height: 25, buffer: 2 }
  ], []);

  // Force de répulsion normale
  const getRepulsionForce = useCallback((element: FloatingElement, others: FloatingElement[]) => {
    let forceX = 0;
    let forceY = 0;
    
    others.forEach(other => {
      if (other.id === element.id) return;
      
      const dx = element.x - other.x;
      const dy = element.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = element.type === other.type ? 15 : 12;
      
      if (distance < minDistance && distance > 0) {
        const force = ((minDistance - distance) / minDistance) * 1.2;
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        
        forceX += normalizedX * force;
        forceY += normalizedY * force;
      }
    });
    
    return { forceX, forceY };
  }, []);

  // Évitement des zones UI
  const getUIAvoidanceForce = useCallback((element: FloatingElement) => {
    let forceX = 0;
    let forceY = 0;
    
    const zones = getExclusionZones();
    zones.forEach(zone => {
      const centerX = zone.x + zone.width / 2;
      const centerY = zone.y + zone.height / 2;
      const dx = element.x - centerX;
      const dy = element.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 25) {
        const force = 0.002 * (25 - distance) / 25;
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        
        forceX += normalizedX * force;
        forceY += normalizedY * force;
      }
    });
    
    return { forceX, forceY };
  }, [getExclusionZones]);

  const isInExclusionZone = useCallback((x: number, y: number): boolean => {
    const zones = getExclusionZones();
    return zones.some(zone => 
      x >= zone.x - zone.buffer && 
      x <= (zone.x + zone.width + zone.buffer) &&
      y >= zone.y - zone.buffer && 
      y <= (zone.y + zone.height + zone.buffer)
    );
  }, [getExclusionZones]);

  const getRandomPosition = useCallback(() => {
    let attempts = 0;
    let position;
    
    do {
      position = {
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 70
      };
      attempts++;
    } while (isInExclusionZone(position.x, position.y) && attempts < 30);
    
    return position;
  }, [isInExclusionZone]);

  // Initialiser les éléments avec des sources uniques
  useEffect(() => {
    const initialElements: FloatingElement[] = [];
    const usedLogos = new Set<string>();
    const usedAvatars = new Set<string>();

    // Ajouter 4 logos uniques
    for (let i = 0; i < 4; i++) {
      let src;
      do {
        src = LOGO_ASSETS[Math.floor(Math.random() * LOGO_ASSETS.length)];
      } while (usedLogos.has(src) && usedLogos.size < LOGO_ASSETS.length);
      usedLogos.add(src);

      const position = getRandomPosition();
      initialElements.push({
        id: `logo-${i}`, type: 'logo', src, x: position.x, y: position.y, size: 40,
        speed: 0.02 + Math.random() * 0.03, direction: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        collisionRadius: 45, directionChangeTimer: 1000 + Math.random() * 2000,
        isConnecting: false, isAlive: true, fadeState: 'stable', createdAt: Date.now(),
        gridX: 0, gridY: 0,
      });
    }

    // Ajouter 4 avatars uniques
    for (let i = 0; i < 4; i++) {
      let src;
      do {
        src = AVATAR_ASSETS[Math.floor(Math.random() * AVATAR_ASSETS.length)];
      } while (usedAvatars.has(src) && usedAvatars.size < AVATAR_ASSETS.length);
      usedAvatars.add(src);

      const position = getRandomPosition();
      initialElements.push({
        id: `avatar-${i}`, type: 'avatar', src, x: position.x, y: position.y, size: 120,
        speed: 0.02 + Math.random() * 0.03, direction: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        collisionRadius: 70, directionChangeTimer: 800 + Math.random() * 1500,
        isConnecting: false, isAlive: true, fadeState: 'stable', createdAt: Date.now(),
        gridX: 0, gridY: 0,
      });
    }

    setElements(initialElements);
  }, [getRandomPosition]);

  // Détection de proximité et création de connexions
  const detectProximity = useCallback(() => {
    const now = Date.now();
    if (now - lastConnectionTime.current < 5000) return; // Une connexion toutes les 5 secondes max

    setElements(currentElements => {
      // Trouver les éléments libres
      const availableLogos = currentElements.filter(el => 
        el.type === 'logo' && 
        !el.isConnecting && 
        el.fadeState === 'stable' &&
        !connections.some(conn => conn.fromId === el.id || conn.toId === el.id)
      );
      const availableAvatars = currentElements.filter(el => 
        el.type === 'avatar' && 
        !el.isConnecting && 
        el.fadeState === 'stable' &&
        !connections.some(conn => conn.fromId === el.id || conn.toId === el.id)
      );

      // Chercher des paires proches
      for (const logo of availableLogos) {
        for (const avatar of availableAvatars) {
          const dx = logo.x - avatar.x;
          const dy = logo.y - avatar.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Si ils sont assez proches (environ 20% de l'écran)
          if (distance < 25) {
            lastConnectionTime.current = now;

            // Créer la connexion
            const newConnection: Connection = {
              id: `connection-${now}`,
              fromId: logo.id,
              toId: avatar.id,
              progress: 0,
              visible: false, // Pas de ligne visible
              showHeart: false,
              heartVisible: false,
              phase: 'pausing',
              createdAt: now,
              heartScale: 0
            };

            setConnections(prev => [...prev.filter(conn => conn.phase !== 'completed'), newConnection]);

            // Marquer les éléments comme connectés et ralentir
            return currentElements.map(element => {
              if (element.id === logo.id || element.id === avatar.id) {
                return {
                  ...element,
                  isConnecting: true,
                  targetId: element.id === logo.id ? avatar.id : logo.id,
                  originalX: element.x,
                  originalY: element.y,
                  connectionPhase: 'connected',
                  vx: element.vx * 0.1, // Ralentir drastiquement
                  vy: element.vy * 0.1
                };
              }
              return element;
            });
          }
        }
      }

      return currentElements;
    });
  }, [connections]);

  // Animation des connexions (pas de ligne, juste coeur)
  useEffect(() => {
    const animateConnections = () => {
      const now = Date.now();
      
      setConnections(prev => 
        prev.map(conn => {
          const timeSinceCreation = now - conn.createdAt;
          let newPhase = conn.phase;
          let newHeartScale = conn.heartScale;
          
          switch (conn.phase) {
            case 'pausing':
              // Pause de 1 seconde avant le coeur
              if (timeSinceCreation > 1000) {
                newPhase = 'heart-showing';
                newHeartScale = 0;
              }
              break;
              
            case 'heart-showing':
              // Montrer le coeur pendant 3 secondes
              if (timeSinceCreation < 4000) {
                newHeartScale = Math.min(newHeartScale + 0.08, 1.5);
              } else {
                newPhase = 'separating';
                newHeartScale = Math.max(newHeartScale - 0.1, 0);
              }
              break;
              
            case 'separating':
              // Terminer la connexion
              if (timeSinceCreation > 5000) {
                newPhase = 'completed';
              }
              break;
          }
          
          return { ...conn, phase: newPhase, heartScale: newHeartScale };
        }).filter(conn => conn.phase !== 'completed')
      );
    };

    const interval = setInterval(animateConnections, 50);
    return () => clearInterval(interval);
  }, []);

  // Système de remplacement d'éléments
  useEffect(() => {
    const replaceElement = () => {
      setElements(currentElements => {
        if (currentElements.length === 0) return currentElements;
        
        const availableElements = currentElements.filter(el => !el.isConnecting);
        if (availableElements.length === 0) return currentElements;
        
        const elementToReplace = availableElements[Math.floor(Math.random() * availableElements.length)];
        
        const updatedElements = currentElements.map(el => 
          el.id === elementToReplace.id ? { ...el, fadeState: 'out' as 'out' } : el
        );
        
        setTimeout(() => {
          setElements(prevElements => {
            return prevElements.map(el => {
              if (el.id === elementToReplace.id) {
                const position = getRandomPosition();
                
                // Éviter les doublons
                const existingSrcs = prevElements
                  .filter(e => e.type === el.type && e.id !== el.id)
                  .map(e => e.src);
                
                const availableAssets = el.type === 'logo' ? LOGO_ASSETS : AVATAR_ASSETS;
                const availableSrcs = availableAssets.filter(src => !existingSrcs.includes(src));
                
                const newSrc = availableSrcs.length > 0 
                  ? availableSrcs[Math.floor(Math.random() * availableSrcs.length)]
                  : availableAssets[Math.floor(Math.random() * availableAssets.length)];
                
                return {
                  ...el,
                  src: newSrc,
                  x: position.x,
                  y: position.y,
                  fadeState: 'in' as 'in',
                  createdAt: Date.now(),
                  isConnecting: false,
                  targetId: undefined,
                  originalX: undefined,
                  originalY: undefined
                };
              }
              return el;
            });
          });
          
          setTimeout(() => {
            setElements(prev => prev.map(el => el.id === elementToReplace.id ? {...el, fadeState: 'stable' as 'stable'} : el));
          }, 2000);

        }, 2000);
        
        return updatedElements;
      });
    };

    const interval = setInterval(replaceElement, 12000); // Plus rare
    return () => clearInterval(interval);
  }, [getRandomPosition]);

  // Système de mouvement
  useEffect(() => {
    const updateElements = () => {
      // Détecter les proximités
      detectProximity();
      
      setElements(prev => {
        return prev.map(element => {
          const connection = connections.find(conn => 
            (conn.fromId === element.id || conn.toId === element.id) && 
            conn.phase !== 'completed'
          );

          // Si l'élément est en connexion
          if (element.isConnecting && connection) {
            // Phase de pause - mouvement très lent
            if (connection.phase === 'pausing' || connection.phase === 'heart-showing') {
              return {
                ...element,
                x: element.x + element.vx * 0.1, // Très lent
                y: element.y + element.vy * 0.1,
                vx: element.vx * 0.98, // Ralentir progressivement
                vy: element.vy * 0.98
              };
            }
            
            // Phase de séparation - reprendre le mouvement normal
            if (connection.phase === 'separating') {
              const separationForce = 0.8;
              const randomAngle = Math.random() * Math.PI * 2;
              return {
                ...element,
                isConnecting: false,
                targetId: undefined,
                originalX: undefined,
                originalY: undefined,
                vx: Math.cos(randomAngle) * separationForce,
                vy: Math.sin(randomAngle) * separationForce
              };
            }
            
            return element;
          }
          
          // Nettoyer les éléments orphelins
          if (element.isConnecting && !connection) {
             const separationForce = 0.8;
             const randomAngle = Math.random() * Math.PI * 2;
             return {
                ...element,
                isConnecting: false,
                targetId: undefined,
                originalX: undefined,
                originalY: undefined,
                vx: Math.cos(randomAngle) * separationForce,
                vy: Math.sin(randomAngle) * separationForce
             };
          }

          // Mouvement normal pour les éléments libres
          if (!element.isConnecting) {
            let newVx = element.vx;
            let newVy = element.vy;
            let newDirection = element.direction;
            let newDirectionChangeTimer = element.directionChangeTimer - 50;

            if (newDirectionChangeTimer <= 0) {
              newDirection = Math.random() * Math.PI * 2;
              newDirectionChangeTimer = 1000 + Math.random() * 2000;
            }

            const time = Date.now() * 0.0004;
            const primaryChaos = Math.cos(newDirection + time * element.speed) * 0.012;
            const secondaryChaos = Math.sin(newDirection * 1.3 + time * element.speed * 0.7) * 0.01;
            newVx += primaryChaos + (Math.random() - 0.5) * 0.01;
            newVy += secondaryChaos + (Math.random() - 0.5) * 0.01;
            newVx += Math.cos(newDirection) * 0.005;
            newVy += Math.sin(newDirection) * 0.005;

            const { forceX, forceY } = getRepulsionForce(element, prev);
            newVx += forceX * 0.025;
            newVy += forceY * 0.025;

            const { forceX: uiForceX, forceY: uiForceY } = getUIAvoidanceForce(element);
            newVx += uiForceX;
            newVy += uiForceY;

            const centerX = 50;
            const centerY = 50;
            const centerDx = element.x - centerX;
            const centerDy = element.y - centerY;
            const centerDistance = Math.sqrt(centerDx * centerDx + centerDy * centerDy);
            if (centerDistance < 20) {
              const disperseForce = 0.008 * (20 - centerDistance) / 20;
              if (centerDistance > 0) {
                newVx += (centerDx / centerDistance) * disperseForce;
                newVy += (centerDy / centerDistance) * disperseForce;
              }
            }

            const margin = 8;
            const boundaryForce = 0.02;
            if (element.x < margin) newVx += (margin - element.x) * boundaryForce;
            if (element.x > 100 - margin) newVx -= (element.x - (100 - margin)) * boundaryForce;
            if (element.y < margin) newVy += (margin - element.y) * boundaryForce;
            if (element.y > 100 - margin) newVy -= (element.y - (100 - margin)) * boundaryForce;

            newVx *= 0.95;
            newVy *= 0.95;

            const newX = Math.max(2, Math.min(98, element.x + newVx));
            const newY = Math.max(2, Math.min(98, element.y + newVy));

            return { ...element, x: newX, y: newY, vx: newVx, vy: newVy, direction: newDirection, directionChangeTimer: newDirectionChangeTimer };
          }

          return element;
        });
      });
    };

    const interval = setInterval(updateElements, 50);
    return () => clearInterval(interval);
  }, [getRepulsionForce, getUIAvoidanceForce, connections, detectProximity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Éléments flottants */}
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size,
            transform: 'translate(-50%, -50%)',
            zIndex: element.isConnecting ? 15 : 5
          }}
          animate={{
            rotate: element.type === 'logo' ? [0, 20, -20, 0] : [0, 15, -15, 0],
            scale: element.isConnecting ? 1.1 : [0.95, 1.05, 0.95],
            opacity: element.fadeState === 'in' ? [0, element.type === 'avatar' ? 0.6 : 0.8] 
                   : element.fadeState === 'out' ? [element.type === 'avatar' ? 0.6 : 0.8, 0] 
                   : (element.type === 'avatar' ? 0.6 : 0.8)
          }}
          transition={{
            rotate: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
            scale: { duration: element.isConnecting ? 0.3 : 4, repeat: element.isConnecting ? 0 : Infinity, ease: "easeInOut" },
            opacity: { duration: 2, ease: "easeInOut" }
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={element.src} 
              alt={element.type === 'avatar' ? 'Créateur' : 'Marque'} 
              className="w-full h-full object-contain"
              style={{ 
                filter: element.type === 'avatar' 
                  ? 'drop-shadow(0 0 15px rgba(147, 51, 234, 0.5))' 
                  : 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))'
              }}
              onError={(e) => {
                console.warn(`Failed to load ${element.type}:`, element.src);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* Cœurs seulement - pas de lignes */}
      {connections
        .filter(connection => connection.phase === 'heart-showing' && connection.heartScale > 0)
        .map((connection) => {
          if (typeof window === 'undefined') return null;
          const fromElement = elements.find(el => el.id === connection.fromId);
          const toElement = elements.find(el => el.id === connection.toId);
          if (!fromElement || !toElement) return null;

          return (
            <motion.div
              key={`${connection.id}-heart`}
              className="absolute"
              style={{
                left: `${((fromElement.x + toElement.x) / 2)}%`, 
                top: `${((fromElement.y + toElement.y) / 2)}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 25
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: connection.heartScale,
                opacity: connection.heartScale > 0 ? 0.6 : 0 
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <img 
                src="/heart-outline.svg" 
                alt="Heart"
                className="w-8 h-8"
                style={{ 
                  filter: 'brightness(0) saturate(100%) invert(100%) drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))',
                  opacity: 0.7
                }}
              />
            </motion.div>
          );
        })}
    </div>
  );
}