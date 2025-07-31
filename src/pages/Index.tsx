import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-xl">VibeMatch</span>
          </div>
          
          <Button asChild>
            <a href="/auth">Get Started</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              AI that connects creators and sponsors
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The first platform that fully automates the matching process 
              between influencers and brands through artificial intelligence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <a href="/auth">
                <Sparkles className="mr-2 h-5 w-5" />
                Content Creator
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <a href="/auth">
                <Building2 className="mr-2 h-5 w-5" />
                Sponsor / Brand
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              A revolutionary platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how our AI transforms the world of influencer marketing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              How it works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple 3-step process for successful collaborations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold">Create your profile</h3>
              <p className="text-muted-foreground">
                Fill in your information and AI automatically analyzes your social data
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold">Smart matches</h3>
              <p className="text-muted-foreground">
                Our AI calculates compatibility scores and suggests the best matches
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold">Collaborate</h3>
              <p className="text-muted-foreground">
                Launch your campaigns with AI-generated communication plans
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-0">
          <CardContent className="text-center py-12">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to revolutionize your collaborations?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join the platform that transforms influencer marketing with AI
              </p>
              <Button size="lg" asChild className="text-lg px-8">
                <a href="/auth">
                  Start for free
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 VibeMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
