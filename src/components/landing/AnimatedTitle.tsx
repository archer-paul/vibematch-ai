import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AnimatedTitle() {
  const [gradientPosition, setGradientPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.6, -0.05, 0.01, 0.99] as any
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as any
      }
    })
  };

  return (
    <motion.div
      variants={titleVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.h1 className="text-5xl md:text-6xl font-bold text-center">
        <motion.span
          style={{
            background: `linear-gradient(${gradientPosition}deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--secondary)), hsl(var(--primary)))`,
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))'
          }}
        >
          <motion.span
            custom={0}
            variants={wordVariants}
            className="inline-block mr-4"
          >
            <span 
              className="font-extrabold"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              AI
            </span> that connects
          </motion.span>{' '}
          <motion.span
            custom={1}
            variants={wordVariants}
            className="inline-block mr-4"
          >
            <span 
              className="font-extrabold"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              creators
            </span> and
          </motion.span>{' '}
          <motion.span
            custom={2}
            variants={wordVariants}
            className="inline-block"
          >
            <span 
              className="font-extrabold"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              sponsors
            </span>
          </motion.span>
        </motion.span>
      </motion.h1>
      
      <motion.p
        variants={wordVariants}
        custom={3}
        className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg text-center"
      >
        The first platform that fully automates the matching process 
        between influencers and brands through artificial intelligence.
      </motion.p>
    </motion.div>
  );
}