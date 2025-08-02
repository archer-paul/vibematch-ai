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
      <motion.h1 className="text-5xl md:text-6xl font-bold text-center text-white">
        <motion.span
          custom={0}
          variants={wordVariants}
          className="inline-block mr-4"
        >
          <motion.span 
            className="font-extrabold bg-gradient-to-r from-violet-800 to-violet-700 bg-clip-text text-transparent"
          >
            AI
          </motion.span> that connects
        </motion.span>{' '}
        <motion.span
          custom={1}
          variants={wordVariants}
          className="inline-block mr-4"
        >
          <motion.span 
            className="font-extrabold bg-gradient-to-r from-violet-700 to-violet-600 bg-clip-text text-transparent"
          >
            creators
          </motion.span> and
        </motion.span>{' '}
        <motion.span
          custom={2}
          variants={wordVariants}
          className="inline-block"
        >
          <motion.span 
            className="font-extrabold bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text text-transparent"
          >
            sponsors
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