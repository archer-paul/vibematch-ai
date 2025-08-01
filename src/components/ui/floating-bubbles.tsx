import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  size: number;
  left: number;
  top: number;
  animationDelay: number;
}

export function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < 12; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 100 + 40, // 40-140px for more variety
          left: Math.random() * 100, // 0-100%
          top: Math.random() * 100, // 0-100%
          animationDelay: Math.random() * 8, // 0-8s delay for more organic timing
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="floating-bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            animationDelay: `${bubble.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
}