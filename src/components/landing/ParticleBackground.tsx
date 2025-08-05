import { useEffect, useRef } from 'react';

interface FloatingElement {
  id: string;
  type: 'logo' | 'avatar';
  src: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  speed: number;
  direction: number;
  directionChangeTimer: number;
  isConnecting: boolean;
  originalX: number | null;
  originalY: number | null;
  targetId: string | null;
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  phase: 'approaching' | 'connected' | 'separating' | 'completed';
  createdAt: number;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<FloatingElement[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const lastConnectionTimeRef = useRef(0);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Configuration
    const config = {
      logoCount: 3,
      avatarCount: 3,
      connectionInterval: 3000,
      heartDuration: 2000,
      separationDelay: 4000,
      elementLifetime: 15000,
      fadeInDuration: 2000,
      fadeOutDuration: 2000
    };

    // Créer les éléments initiaux avec sources uniques
    const createElements = () => {
      elementsRef.current = [];
      const usedLogos = new Set<string>();
      const usedAvatars = new Set<string>();

      // Créer 3 logos uniques
      for (let i = 0; i < config.logoCount; i++) {
        createElement('logo', i, usedLogos, usedAvatars);
      }

      // Créer 3 avatars uniques
      for (let i = 0; i < config.avatarCount; i++) {
        createElement('avatar', i, usedLogos, usedAvatars);
      }
    };

    const createElement = (type: 'logo' | 'avatar', index: number, usedLogos?: Set<string>, usedAvatars?: Set<string>) => {
      // Sélectionner une source unique
      let src: string;
      if (type === 'logo') {
        const availableLogos = LOGO_ASSETS.filter(logo => !usedLogos?.has(logo));
        if (availableLogos.length === 0) {
          // Si toutes les sources sont utilisées, on peut répéter
          src = LOGO_ASSETS[Math.floor(Math.random() * LOGO_ASSETS.length)];
        } else {
          src = availableLogos[Math.floor(Math.random() * availableLogos.length)];
        }
        usedLogos?.add(src);
      } else {
        const availableAvatars = AVATAR_ASSETS.filter(avatar => !usedAvatars?.has(avatar));
        if (availableAvatars.length === 0) {
          // Si toutes les sources sont utilisées, on peut répéter
          src = AVATAR_ASSETS[Math.floor(Math.random() * AVATAR_ASSETS.length)];
        } else {
          src = availableAvatars[Math.floor(Math.random() * availableAvatars.length)];
        }
        usedAvatars?.add(src);
      }

      const element: FloatingElement = {
        id: `${type}-${index}`,
        type: type,
        src: src,
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 70,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: type === 'logo' ? 40 : 65,
        speed: 0.02 + Math.random() * 0.03,
        direction: Math.random() * Math.PI * 2,
        directionChangeTimer: 1000 + Math.random() * 2000,
        isConnecting: false,
        originalX: null,
        originalY: null,
        targetId: null
      };

      const div = document.createElement('div');
      div.className = `particle ${type} fading-in`;
      div.id = element.id;
      div.style.width = element.size + 'px';
      div.style.height = element.size + 'px';
      div.style.left = element.x + '%';
      div.style.top = element.y + '%';
      div.style.transform = 'translate(-50%, -50%)';
      div.style.position = 'absolute';
      div.style.zIndex = '2';
      div.style.transition = 'transform 0.1s ease-out, opacity 0.3s ease-in-out';
      div.style.animation = type === 'logo' 
        ? 'oscillate-logo 4s ease-in-out infinite'
        : 'oscillate 5s ease-in-out infinite';

      const img = document.createElement('img');
      img.src = element.src;
      img.alt = type === 'logo' ? 'Logo' : 'Avatar';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.filter = type === 'avatar'
        ? 'drop-shadow(0 0 15px rgba(147, 51, 234, 0.5))'
        : 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))';
      img.style.opacity = '0.8';

      div.appendChild(img);
      container.appendChild(div);
      elementsRef.current.push(element);

      setTimeout(() => {
        if (div.classList.contains('fading-in')) {
          div.classList.remove('fading-in');
        }
      }, config.fadeInDuration);
    };

    const getRepulsionForce = (element: FloatingElement, others: FloatingElement[]) => {
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
    };

    const getUIAvoidanceForce = (element: FloatingElement) => {
      let forceX = 0;
      let forceY = 0;

      const zones = [
        { x: 40, y: 20, width: 20, height: 25 },
        { x: 35, y: 55, width: 30, height: 10 },
      ];

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
    };

    const updateElements = () => {
      elementsRef.current.forEach(element => {
        if (element.isConnecting) {
          updateConnectingElement(element);
        } else {
          updateFloatingElement(element);
        }

        updateElementDOM(element);
      });
    };

    const updateConnectingElement = (element: FloatingElement) => {
      const target = elementsRef.current.find(e => e.id === element.targetId);
      if (!target) {
        element.isConnecting = false;
        element.targetId = null;
        element.originalX = null;
        element.originalY = null;
        return;
      }

      const connection = connectionsRef.current.find(c =>
        (c.fromId === element.id || c.toId === element.id) && c.phase !== 'completed'
      );

      if (!connection) {
        element.isConnecting = false;
        element.targetId = null;
        element.originalX = null;
        element.originalY = null;
        return;
      }

      if (connection.phase === 'approaching') {
        const dx = target.x - element.x;
        const dy = target.y - element.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 8) {
          const moveSpeed = 0.5;
          const moveX = (dx / distance) * moveSpeed;
          const moveY = (dy / distance) * moveSpeed;

          element.x += moveX;
          element.y += moveY;
          element.vx = moveX;
          element.vy = moveY;
        }
      } else if (connection.phase === 'separating') {
        if (element.originalX !== null && element.originalY !== null) {
          const dx = element.originalX - element.x;
          const dy = element.originalY - element.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 1) {
            const moveSpeed = 0.2;
            const moveX = (dx / distance) * moveSpeed;
            const moveY = (dy / distance) * moveSpeed;

            element.x += moveX;
            element.y += moveY;
            element.vx = moveX;
            element.vy = moveY;
          } else {
            const separationForce = 0.8;
            const randomAngle = Math.random() * Math.PI * 2;
            const separationVx = Math.cos(randomAngle) * separationForce;
            const separationVy = Math.sin(randomAngle) * separationForce;

            element.isConnecting = false;
            element.targetId = null;
            element.originalX = null;
            element.originalY = null;
            element.vx = separationVx;
            element.vy = separationVy;
          }
        } else {
          element.isConnecting = false;
          element.targetId = null;
          element.originalX = null;
          element.originalY = null;
        }
      } else if (connection.phase === 'completed') {
        element.isConnecting = false;
        element.targetId = null;
        element.originalX = null;
        element.originalY = null;
      }
    };

    const updateFloatingElement = (element: FloatingElement) => {
      let newVx = element.vx;
      let newVy = element.vy;
      let newDirection = element.direction;
      let newDirectionChangeTimer = element.directionChangeTimer - 50;

      // Changement de direction aléatoire
      if (newDirectionChangeTimer <= 0) {
        newDirection = Math.random() * Math.PI * 2;
        newDirectionChangeTimer = 1000 + Math.random() * 2000;
      }

      // Mouvement très doux et zen
      const time = Date.now() * 0.0004;
      const chaos1 = Math.cos(newDirection + time * element.speed) * 0.012;
      const chaos2 = Math.sin(newDirection * 1.3 + time * element.speed * 0.7) * 0.01;

      newVx += chaos1 + (Math.random() - 0.5) * 0.01;
      newVy += chaos2 + (Math.random() - 0.5) * 0.01;

      // Mouvement de base très doux
      newVx += Math.cos(newDirection) * 0.005;
      newVy += Math.sin(newDirection) * 0.005;

      const repulsion = getRepulsionForce(element, elementsRef.current);
      newVx += repulsion.forceX * 0.025;
      newVy += repulsion.forceY * 0.025;

      const uiAvoidance = getUIAvoidanceForce(element);
      newVx += uiAvoidance.forceX;
      newVy += uiAvoidance.forceY;

      // Force anti-concentration au centre
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

      // Forces de bordure
      const margin = 10;
      const boundaryForce = 0.02;
      if (element.x < margin) newVx += (margin - element.x) * boundaryForce;
      if (element.x > 100 - margin) newVx -= (element.x - (100 - margin)) * boundaryForce;
      if (element.y < margin) newVy += (margin - element.y) * boundaryForce;
      if (element.y > 100 - margin) newVy -= (element.y - (100 - margin)) * boundaryForce;

      // Amortissement augmenté pour un mouvement zen
      newVx *= 0.95;
      newVy *= 0.95;

      // Mise à jour position
      element.x = Math.max(5, Math.min(95, element.x + newVx));
      element.y = Math.max(5, Math.min(95, element.y + newVy));
      element.vx = newVx;
      element.vy = newVy;
      element.direction = newDirection;
      element.directionChangeTimer = newDirectionChangeTimer;
    };

    const updateElementDOM = (element: FloatingElement) => {
      const div = document.getElementById(element.id);
      if (div) {
        div.style.left = element.x + '%';
        div.style.top = element.y + '%';

        if (element.isConnecting) {
          div.classList.add('connecting');
        } else {
          div.classList.remove('connecting');
        }
      }
    };

    const createConnection = () => {
      const now = Date.now();
      if (now - lastConnectionTimeRef.current < 2000) return;

      // Filtrer les éléments disponibles
      const availableLogos = elementsRef.current.filter(e =>
        e.type === 'logo' &&
        !e.isConnecting &&
        document.getElementById(e.id) &&
        !document.getElementById(e.id)!.classList.contains('fading-in') &&
        !document.getElementById(e.id)!.classList.contains('fading-out')
      );
      const availableAvatars = elementsRef.current.filter(e =>
        e.type === 'avatar' &&
        !e.isConnecting &&
        document.getElementById(e.id) &&
        !document.getElementById(e.id)!.classList.contains('fading-in') &&
        !document.getElementById(e.id)!.classList.contains('fading-out')
      );

      if (availableLogos.length === 0 || availableAvatars.length === 0) return;

      const logo = availableLogos[Math.floor(Math.random() * availableLogos.length)];
      const avatar = availableAvatars[Math.floor(Math.random() * availableAvatars.length)];

      const dx = logo.x - avatar.x;
      const dy = logo.y - avatar.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 80) {
        lastConnectionTimeRef.current = now;

        logo.isConnecting = true;
        logo.targetId = avatar.id;
        logo.originalX = logo.x;
        logo.originalY = logo.y;

        avatar.isConnecting = true;
        avatar.targetId = logo.id;
        avatar.originalX = avatar.x;
        avatar.originalY = avatar.y;

        const connection: Connection = {
          id: `connection-${now}`,
          fromId: logo.id,
          toId: avatar.id,
          phase: 'approaching',
          createdAt: now
        };

        connectionsRef.current.push(connection);
        animateConnection(connection);
      }
    };

    const animateConnection = (connection: Connection) => {
      const line = document.createElement('div');
      line.className = 'connection-line';
      line.id = connection.id + '-line';
      line.style.position = 'absolute';
      line.style.height = '2px';
      line.style.background = 'white';
      line.style.transformOrigin = 'left center';
      line.style.opacity = '0.8';
      line.style.filter = 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))';
      line.style.zIndex = '5';
      container.appendChild(line);

      setTimeout(() => {
        connection.phase = 'connected';
        showHeart(connection);
      }, 1500);

      setTimeout(() => {
        connection.phase = 'separating';
        
        // Supprimer la ligne IMMÉDIATEMENT quand l'explosion commence
        const line = document.getElementById(connection.id + '-line');
        if (line && line.parentNode) {
          line.parentNode.removeChild(line);
        }
        
        hideHeart(connection);

        const fromElement = elementsRef.current.find(e => e.id === connection.fromId);
        const toElement = elementsRef.current.find(e => e.id === connection.toId);

        if (fromElement && toElement) {
          const angle1 = Math.random() * Math.PI * 2;
          const angle2 = angle1 + Math.PI + (Math.random() - 0.5) * Math.PI;

          const separationSpeed = 1.0;
          fromElement.vx = Math.cos(angle1) * separationSpeed;
          fromElement.vy = Math.sin(angle1) * separationSpeed;
          toElement.vx = Math.cos(angle2) * separationSpeed;
          toElement.vy = Math.sin(angle2) * separationSpeed;
        }
      }, 1500 + 2000); // 1500 (rapprochement) + 2000 (pause cœur) = 3500ms

      setTimeout(() => {
        connection.phase = 'completed';
        removeConnection(connection);
      }, 1500 + 2000 + 1000); // Après l'explosion du cœur

      const updateLine = () => {
        if (connection.phase === 'completed') return;

        const fromElement = elementsRef.current.find(e => e.id === connection.fromId);
        const toElement = elementsRef.current.find(e => e.id === connection.toId);

        if (fromElement && toElement && container) {
          const fromX = (fromElement.x / 100) * container.offsetWidth;
          const fromY = (fromElement.y / 100) * container.offsetHeight;
          const toX = (toElement.x / 100) * container.offsetWidth;
          const toY = (toElement.y / 100) * container.offsetHeight;

          const dx = toX - fromX;
          const dy = toY - fromY;
          const totalDistance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;

          const fromRadius = fromElement.type === 'logo' ? 20 : 32;
          const toRadius = toElement.type === 'logo' ? 20 : 32;

          const startOffsetX = (dx / totalDistance) * fromRadius;
          const startOffsetY = (dy / totalDistance) * fromRadius;
          const endOffsetX = (dx / totalDistance) * toRadius;
          const endOffsetY = (dy / totalDistance) * toRadius;

          const adjustedFromX = fromX + startOffsetX;
          const adjustedFromY = fromY + startOffsetY;
          const adjustedToX = toX - endOffsetX;
          const adjustedToY = toY - endOffsetY;

          const adjustedDx = adjustedToX - adjustedFromX;
          const adjustedDy = adjustedToY - adjustedFromY;
          const adjustedDistance = Math.sqrt(adjustedDx * adjustedDx + adjustedDy * adjustedDy);

          line.style.left = adjustedFromX + 'px';
          line.style.top = adjustedFromY + 'px';
          line.style.width = adjustedDistance + 'px';
          line.style.transform = `rotate(${angle}deg)`;
        }

        requestAnimationFrame(updateLine);
      };
      updateLine();
    };

    const showHeart = (connection: Connection) => {
      const fromElement = elementsRef.current.find(e => e.id === connection.fromId);
      const toElement = elementsRef.current.find(e => e.id === connection.toId);

      if (!fromElement || !toElement) return;

      const heart = document.createElement('img');
      heart.className = 'heart';
      heart.id = connection.id + '-heart';
      heart.src = '/heart-outline.svg';
      heart.alt = 'Heart';
      heart.style.position = 'absolute';
      heart.style.width = '60px'; // Plus grand pour englober
      heart.style.height = '60px';
      heart.style.transform = 'translate(-50%, -50%) scale(0)'; // Commencer à 0
      heart.style.zIndex = '15';
      heart.style.opacity = '0';
      heart.style.transition = 'none'; // Pas de transition par défaut
      heart.style.filter = 'brightness(0) saturate(100%) invert(100%) drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))';

      const centerX = (fromElement.x + toElement.x) / 2;
      const centerY = (fromElement.y + toElement.y) / 2;

      heart.style.left = centerX + '%';
      heart.style.top = centerY + '%';

      container.appendChild(heart);

      // Phase 1: Apparition rapide et croissance jusqu'à 1x (taille normale)
      setTimeout(() => {
        heart.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Transition rapide et fluide
        heart.style.opacity = '0.6'; // Plus transparent
        heart.style.transform = 'translate(-50%, -50%) scale(1)'; // Taille normale pour la pause
      }, 50);

      // Phase 2: Pause à taille normale (plus petite pour effet romantique)
      setTimeout(() => {
        // Maintenir la taille normale et l'opacité
        heart.style.transform = 'translate(-50%, -50%) scale(1)';
        heart.style.opacity = '0.6';
      }, 500);
    };

    const hideHeart = (connection: Connection) => {
      const heart = document.getElementById(connection.id + '-heart');
      if (heart) {
        // Debug: vérifier que l'élément existe
        console.log('Starting heart explosion for', connection.id);
        
        // Phase 3: Explosion finale - grossit massivement (x7) tout en s'estompant plus rapidement
        heart.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease-out'; // Opacity plus rapide
        heart.style.transform = 'translate(-50%, -50%) scale(7)'; // x7 au lieu de x8
        
        // Commencer à s'estomper après un petit délai pour voir la croissance
        setTimeout(() => {
          heart.style.opacity = '0';
        }, 80); // Délai réduit pour estompage plus rapide
        
        setTimeout(() => {
          if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
            console.log('Heart explosion completed for', connection.id);
          }
        }, 800); // Temps ajusté pour la transition plus longue
      } else {
        console.log('Heart element not found for', connection.id);
      }
    };

    const removeConnection = (connection: Connection) => {
      const fromElement = elementsRef.current.find(e => e.id === connection.fromId);
      const toElement = elementsRef.current.find(e => e.id === connection.toId);

      if (fromElement) {
        fromElement.isConnecting = false;
        fromElement.targetId = null;
        fromElement.originalX = null;
        fromElement.originalY = null;
      }

      if (toElement) {
        toElement.isConnecting = false;
        toElement.targetId = null;
        toElement.originalX = null;
        toElement.originalY = null;
      }

      const line = document.getElementById(connection.id + '-line');
      if (line && line.parentNode) {
        line.parentNode.removeChild(line);
      }

      // NE PAS supprimer le cœur ici - il se supprime tout seul après l'animation
      // const heart = document.getElementById(connection.id + '-heart');
      // if (heart && heart.parentNode) {
      //   heart.parentNode.removeChild(heart);
      // }

      const index = connectionsRef.current.indexOf(connection);
      if (index > -1) {
        connectionsRef.current.splice(index, 1);
      }
    };

    const replaceRandomElement = () => {
      if (elementsRef.current.length === 0) return;

      const randomIndex = Math.floor(Math.random() * elementsRef.current.length);
      const elementToReplace = elementsRef.current[randomIndex];

      if (elementToReplace.isConnecting) return;

      const div = document.getElementById(elementToReplace.id);
      if (div) {
        div.classList.add('fading-out');
        setTimeout(() => {
          if (div.parentNode) {
            div.parentNode.removeChild(div);
          }
          elementsRef.current.splice(randomIndex, 1);
          
          // Éviter les doublons lors du remplacement
          const existingSrcs = elementsRef.current
            .filter(e => e.type === elementToReplace.type)
            .map(e => e.src);
          
          const availableAssets = elementToReplace.type === 'logo' ? LOGO_ASSETS : AVATAR_ASSETS;
          const availableSrcs = availableAssets.filter(src => !existingSrcs.includes(src));
          
          // Créer des sets pour éviter les doublons
          const usedLogos = new Set(elementsRef.current.filter(e => e.type === 'logo').map(e => e.src));
          const usedAvatars = new Set(elementsRef.current.filter(e => e.type === 'avatar').map(e => e.src));
          
          createElement(elementToReplace.type, Date.now() + Math.random(), usedLogos, usedAvatars);
        }, config.fadeOutDuration);
      }
    };

    // Démarrer l'animation
    const animate = () => {
      updateElements();
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Initialiser
    createElements();
    animate();

    // Démarrer le système de connexions
    setTimeout(() => {
      createConnection();
      setInterval(createConnection, config.connectionInterval);
    }, 2000);

    // Démarrer le système de remplacement - rotation très fréquente
    setInterval(replaceRandomElement, 3000);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'transparent'
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .particle {
          transition: transform 0.1s ease-out, opacity 0.3s ease-in-out;
        }
        
        .particle.fading-in {
          opacity: 0 !important;
          animation: fadeInOscillate 2s ease-in-out forwards;
        }
        
        .particle.fading-out {
          animation: fadeOutOscillate 2s ease-in-out forwards;
        }
        
        @keyframes fadeInOscillate {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) rotate(0deg) scale(0.5); 
          }
          100% { 
            opacity: 1; 
            transform: translate(-50%, -50%) rotate(0deg) scale(1); 
          }
        }
        
        @keyframes fadeOutOscillate {
          0% { 
            opacity: 1; 
            transform: translate(-50%, -50%) rotate(0deg) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) rotate(0deg) scale(0.5); 
          }
        }
        
        @keyframes oscillate {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-50%, -50%) rotate(15deg); }
          75% { transform: translate(-50%, -50%) rotate(-15deg); }
        }
        
        @keyframes oscillate-logo {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-50%, -50%) rotate(20deg); }
          75% { transform: translate(-50%, -50%) rotate(-20deg); }
        }
        
        .connecting {
          transform: scale(1.1) !important;
          opacity: 0.9 !important;
          z-index: 10;
        }
        
        .heart.show {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.5);
        }
      `}} />
    </div>
  );
}