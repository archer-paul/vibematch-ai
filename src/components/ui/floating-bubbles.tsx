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
      for (let i = 0; i < 15; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 60 + 20, // 20-80px
          left: Math.random() * 100, // 0-100%
          top: Math.random() * 100, // 0-100%
          animationDelay: Math.random() * 6, // 0-6s delay
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