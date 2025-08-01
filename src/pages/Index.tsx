import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloatingBubbles } from '@/components/ui/floating-bubbles';
import { Sparkles, Building2, Zap, Users, Target, BarChart3 } from 'lucide-react';

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
    <div className="min-h-screen immersive-bg">
      <FloatingBubbles />
      {/* Header */}
      <header className="relative z-10 border-b glass-card border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"></div>
        <div className="relative container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-xl text-white">VibeMatch</span>
          </div>
          
          <Button asChild className="glass-button text-white border-white/20 hover:border-white/40">
            <a href="/auth">Get Started</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl">
              AI that connects creators and sponsors
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              The first platform that fully automates the matching process 
              between influencers and brands through artificial intelligence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 glass-button text-white border-white/20 hover:border-white/40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30">
              <a href="/auth">
                <Sparkles className="mr-2 h-5 w-5" />
                Content Creator
              </a>
            </Button>
            <Button size="lg" asChild className="text-lg px-8 glass-button text-white border-white/20 hover:border-white/40 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30">
              <a href="/auth">
                <Building2 className="mr-2 h-5 w-5" />
                Sponsor / Brand
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              A revolutionary platform
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover how our AI transforms the world of influencer marketing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center glass-card border-white/20 hover:border-white/30 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              How it works
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              A simple 3-step process for successful collaborations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/25">
                1
              </div>
              <h3 className="text-xl font-semibold text-white">Create your profile</h3>
              <p className="text-white/70">
                Fill in your information and AI automatically analyzes your social data
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
                2
              </div>
              <h3 className="text-xl font-semibold text-white">Smart matches</h3>
              <p className="text-white/70">
                Our AI calculates compatibility scores and suggests the best matches
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-500/25">
                3
              </div>
              <h3 className="text-xl font-semibold text-white">Collaborate</h3>
              <p className="text-white/70">
                Launch your campaigns with AI-generated communication plans
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <Card className="glass-card border-white/20 bg-gradient-to-r from-white/5 via-purple-500/10 to-pink-500/10">
          <CardContent className="text-center py-12">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                Ready to revolutionize your collaborations?
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Join the platform that transforms influencer marketing with AI
              </p>
              <Button size="lg" asChild className="text-lg px-8 glass-button text-white border-white/30 hover:border-white/50 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40">
                <a href="/auth">
                  Start for free
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 glass-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/60">
            <p>&copy; 2024 VibeMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
