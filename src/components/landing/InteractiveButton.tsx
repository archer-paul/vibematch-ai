import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';

interface InteractiveButtonProps {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'demo';
  size?: 'sm' | 'lg';
  className?: string;
  onClick?: () => void;
  'data-demo'?: string;
}

export function InteractiveButton({ 
  children, 
  href, 
  variant = 'primary', 
  size = 'lg',
  className = '',
  onClick,
  ...props
}: InteractiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const baseClasses = variant === 'primary' 
    ? "glass-button text-white border-white/20 hover:border-white/40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-2xl px-8 py-4 text-lg font-semibold"
    : variant === 'secondary'
    ? "glass-button text-white border-white/20 hover:border-white/40 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-2xl px-8 py-4 text-lg font-semibold"
    : "glass-button text-white border-white/40 hover:border-white/60 bg-white/20 hover:bg-white/30 rounded-2xl px-8 py-4 text-lg font-semibold";

  const buttonContent = (
    <motion.div
      className={`relative overflow-hidden ${baseClasses} ${className}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.3), 0 10px 10px -5px rgba(139, 92, 246, 0.2)"
      }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick || handleClick}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10"
        animate={{ 
          y: isHovered ? -1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ transform: 'translateX(-100%)' }}
        animate={{ 
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)'
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.div>
  );

  if (href) {
    return (
      <Button size={size} asChild className="p-0 h-auto bg-transparent border-none hover:bg-transparent">
        <a href={href}>
          {buttonContent}
        </a>
      </Button>
    );
  }

  return (
    <Button size={size} className="p-0 h-auto bg-transparent border-none hover:bg-transparent" onClick={onClick} {...props}>
      {buttonContent}
    </Button>
  );
}