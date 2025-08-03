import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ParticleBackground } from '@/components/landing/ParticleBackground';
import { AnimatedTitle } from '@/components/landing/AnimatedTitle';
import { InteractiveButton } from '@/components/landing/InteractiveButton';
import { ParticleField } from '@/components/landing/ParticleField';
import { Sparkles, Building2, Zap, Users, Target, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: 'AI Matching',
    description: 'Our algorithm analyzes profiles and finds perfect matches automatically.'
  },
  {
    icon: Users,
    title: 'Verified Community',
    description: 'Verified creators and sponsors for quality collaborations.'
  },
  {
    icon: Target,
    title: 'Targeted Campaigns',
    description: 'Create precise campaigns with measurable objectives.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track your performance with detailed metrics.'
  }
];

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen immersive-bg relative overflow-hidden">
      {/* Animated Background Effects */}
      <ParticleBackground />
      {/* Header */}
      <motion.header 
        className="relative z-40 border-b glass-card border-white/10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"></div>
        <div className="relative container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.img 
              src="/favicon.ico"
              alt="VibeMatch"
              className="w-8 h-8 rounded-lg shadow-lg shadow-purple-500/25"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.3)",
                  "0 0 30px rgba(236, 72, 153, 0.4)",
                  "0 0 20px rgba(139, 92, 246, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-bold text-xl text-white">VibeMatch</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild className="glass-button text-white border-white/20 hover:border-white/40">
              <a href="/auth">Get Started</a>
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-20 container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <AnimatedTitle />

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <InteractiveButton href="/auth" variant="primary" className="text-lg px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Content Creator
            </InteractiveButton>
            <InteractiveButton href="/auth" variant="secondary" className="text-lg px-8">
              <Building2 className="mr-2 h-5 w-5" />
              Sponsor / Brand
            </InteractiveButton>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="relative z-20 container mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center space-y-12">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              A revolutionary platform
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover how our AI transforms the world of influencer marketing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)"
                }}
              >
                <Card className="text-center bg-black/20 backdrop-blur-md border border-white/30 hover:border-white/40 hover:bg-black/30 transition-all duration-300 shadow-2xl h-full">
                  <CardHeader>
                    <motion.div 
                      className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-lg text-white font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/90 font-medium">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section 
        className="relative z-20 container mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center space-y-12">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              How it works
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              A simple 3-step process for successful collaborations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Create your profile',
                description: 'Fill in your information and AI automatically analyzes your social data',
                gradient: 'from-purple-400 to-pink-400',
                shadow: 'shadow-purple-500/25'
              },
              {
                step: 2,
                title: 'Smart matches',
                description: 'Our AI calculates compatibility scores and suggests the best matches',
                gradient: 'from-blue-400 to-cyan-400',
                shadow: 'shadow-blue-500/25'
              },
              {
                step: 3,
                title: 'Collaborate',
                description: 'Launch your campaigns with AI-generated communication plans',
                gradient: 'from-green-400 to-emerald-400',
                shadow: 'shadow-green-500/25'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="space-y-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className={`w-12 h-12 mx-auto bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${item.shadow}`}
                  animate={{ 
                    boxShadow: [
                      `0 4px 14px 0 ${item.shadow.includes('purple') ? 'rgba(139, 92, 246, 0.25)' : item.shadow.includes('blue') ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                      `0 8px 20px 0 ${item.shadow.includes('purple') ? 'rgba(139, 92, 246, 0.4)' : item.shadow.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                      `0 4px 14px 0 ${item.shadow.includes('purple') ? 'rgba(139, 92, 246, 0.25)' : item.shadow.includes('blue') ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {item.step}
                </motion.div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="relative z-20 container mx-auto px-4 py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-black/25 backdrop-blur-lg border border-white/30 shadow-2xl bg-gradient-to-r from-black/30 via-purple-500/20 to-pink-500/20">
            <CardContent className="text-center py-12">
              <div className="space-y-6">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Ready to revolutionize your collaborations?
                </motion.h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                  Join the platform that transforms influencer marketing with AI
                </p>
                <InteractiveButton href="/auth" className="text-lg px-12 py-4">
                  Start for free
                </InteractiveButton>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="relative z-20 border-t border-white/10 glass-card"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/60">
            <p>&copy; 2024 VibeMatch. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
