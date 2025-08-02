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
            background: `linear-gradient(${gradientPosition}deg, hsl(262 83% 58%), hsl(330 81% 60%), hsl(221 83% 53%), hsl(262 83% 58%))`,
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))'
          }}
        >
          <motion.span
            custom={0}
            variants={wordVariants}
            className="inline-block mr-4"
          >
            <span className="text-blue-400 font-extrabold">AI</span> that connects
          </motion.span>{' '}
          <motion.span
            custom={1}
            variants={wordVariants}
            className="inline-block mr-4"
          >
            <span className="text-pink-400 font-extrabold">creators</span> and
          </motion.span>{' '}
          <motion.span
            custom={2}
            variants={wordVariants}
            className="inline-block"
          >
            <span className="text-purple-400 font-extrabold">sponsors</span>
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