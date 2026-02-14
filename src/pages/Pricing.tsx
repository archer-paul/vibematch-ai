import { Check, Star, Zap, Crown, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const creatorPlans = [
  {
    name: 'Creator Free',
    price: '0',
    currency: '€',
    period: '/mo',
    icon: <Star className="w-6 h-6" />,
    popular: false,
    features: [
      '3 matchings per month',
      'Basic profile',
      'Standard search',
      'Community support'
    ],
    limitations: [
      'No ghost profiles access',
      'Limited analytics',
      'No priority matching'
    ]
  },
  {
    name: 'Creator Pro',
    price: '29',
    currency: '€',
    period: '/mo',
    icon: <Zap className="w-6 h-6" />,
    popular: true,
    features: [
      'Unlimited matchings',
      'Advanced analytics',
      'Ghost profiles access',
      'Priority matching',
      'Priority support',
      'AI profile optimization'
    ],
    limitations: []
  },
  {
    name: 'Creator Elite',
    price: '99',
    currency: '€',
    period: '/mo',
    icon: <Crown className="w-6 h-6" />,
    popular: false,
    features: [
      'Everything in Creator Pro',
      'Advanced ghost matching',
      'Campaign simulation',
      'Priority AI analysis',
      'Dedicated support',
      'White label options',
      'API access'
    ],
    limitations: []
  }
];

const sponsorPlans = [
  {
    name: 'Starter',
    price: '199',
    currency: '€',
    period: '/mo',
    icon: <Star className="w-6 h-6" />,
    popular: false,
    features: [
      '10 active campaigns',
      'Basic AI matching',
      'Standard analytics',
      'Email support'
    ],
    limitations: [
      'No ROI predictor',
      'No ghost profiles access'
    ]
  },
  {
    name: 'Business',
    price: '499',
    currency: '€',
    period: '/mo',
    icon: <Zap className="w-6 h-6" />,
    popular: true,
    features: [
      'Unlimited campaigns',
      'Advanced ROI predictor',
      'Ghost profiles discovery',
      'Real-time analytics',
      'Priority support',
      'VibeMatch AI insights'
    ],
    limitations: []
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    currency: '',
    period: '',
    icon: <Crown className="w-6 h-6" />,
    popular: false,
    features: [
      'Everything in Business',
      'Full API access',
      'White label',
      'Real-time VibeMatch AI analysis',
      'Dedicated account manager',
      'Guaranteed SLAs',
      'Custom integrations'
    ],
    limitations: []
  }
];

export default function Pricing() {
  const { profile } = useAuth();

  const plans = profile?.user_type === 'sponsor' ? sponsorPlans : creatorPlans;
  const currentUserType = profile?.user_type === 'sponsor' ? 'Sponsor' : 'Creator';

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">{currentUserType} Plans & Pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. All our analyses are powered by VibeMatch AI for ultra-fast results.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Bot className="w-4 h-4" />
          <span>Powered by VibeMatch AI ultra-fast inference</span>
        </div>
      </div>

      {/* AI Features Highlight */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">VibeMatch AI Engine</h3>
              <p className="text-sm text-muted-foreground">
                Compatibility analysis in under 100ms
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Ultra-fast matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Advanced predictive analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Continuous optimization</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={plan.name} 
            className={`relative ${
              plan.popular 
                ? 'border-primary shadow-lg scale-105' 
                : 'border-border'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">
                  Most popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                plan.popular 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {plan.icon}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-lg text-muted-foreground">{plan.currency}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Features */}
              <div className="space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Limitations */}
              {plan.limitations.length > 0 && (
                <div className="border-t pt-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Limitations:</p>
                  {plan.limitations.map((limitation, limitIndex) => (
                    <div key={limitIndex} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              <div className="pt-4">
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'variant-outline'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.name === 'Creator Free' ? 'Current plan' :
                   plan.name === 'Enterprise' ? 'Contact us' :
                   'Choose this plan'}
                </Button>
              </div>

              {/* AI Badge */}
              <div className="text-center pt-2">
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                  <Bot className="w-3 h-3 mr-1" />
                  VibeMatch AI included
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What is VibeMatch AI?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                VibeMatch AI is our ultra-fast artificial intelligence engine that analyzes
                compatibility between creators and sponsors in under 100ms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I change my plan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time.
                Changes take effect immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What are Ghost Profiles?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ghost Profiles are creators discovered by our AI on social media
                but not yet registered on VibeMatch. You can invite them!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is support included?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All plans include support. Pro and Elite plans benefit from
                priority support with guaranteed response times.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}