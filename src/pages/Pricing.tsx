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
    period: '/mois',
    icon: <Star className="w-6 h-6" />,
    popular: false,
    features: [
      '3 matchings par mois',
      'Profil basique',
      'Recherche standard',
      'Support communautaire'
    ],
    limitations: [
      'Pas d\'accès aux ghost profiles',
      'Analytics limités',
      'Pas de priority matching'
    ]
  },
  {
    name: 'Creator Pro',
    price: '29',
    currency: '€',
    period: '/mois',
    icon: <Zap className="w-6 h-6" />,
    popular: true,
    features: [
      'Matchings illimités',
      'Analytics avancés',
      'Accès aux ghost profiles',
      'Priority matching',
      'Support prioritaire',
      'Optimisation AI du profil'
    ],
    limitations: []
  },
  {
    name: 'Creator Elite',
    price: '99',
    currency: '€',
    period: '/mois',
    icon: <Crown className="w-6 h-6" />,
    popular: false,
    features: [
      'Tout de Creator Pro',
      'Ghost matching avancé',
      'Simulation de campagnes',
      'Priority AI analysis',
      'Support dédié',
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
    period: '/mois',
    icon: <Star className="w-6 h-6" />,
    popular: false,
    features: [
      '10 campagnes actives',
      'Basic AI matching',
      'Analytics standards',
      'Support email'
    ],
    limitations: [
      'Pas de ROI predictor',
      'Pas d\'accès ghost profiles'
    ]
  },
  {
    name: 'Business',
    price: '499',
    currency: '€',
    period: '/mois',
    icon: <Zap className="w-6 h-6" />,
    popular: true,
    features: [
      'Campagnes illimitées',
      'ROI predictor avancé',
      'Ghost profiles discovery',
      'Analytics temps réel',
      'Support prioritaire',
      'Cerebras AI insights'
    ],
    limitations: []
  },
  {
    name: 'Enterprise',
    price: 'Sur devis',
    currency: '',
    period: '',
    icon: <Crown className="w-6 h-6" />,
    popular: false,
    features: [
      'Tout de Business',
      'API complète',
      'White label',
      'Real-time Cerebras analysis',
      'Account manager dédié',
      'SLA garantis',
      'Intégrations custom'
    ],
    limitations: []
  }
];

export default function Pricing() {
  const { profile } = useAuth();

  const plans = profile?.user_type === 'sponsor' ? sponsorPlans : creatorPlans;
  const currentUserType = profile?.user_type === 'sponsor' ? 'Sponsor' : 'Créateur';

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Plans & Tarifs {currentUserType}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choisissez le plan qui correspond à vos besoins. Toutes nos analyses sont alimentées par Cerebras AI pour des résultats ultra-rapides.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Bot className="w-4 h-4" />
          <span>Powered by Cerebras ultra-fast inference</span>
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
              <h3 className="font-semibold">Intelligence Artificielle Cerebras</h3>
              <p className="text-sm text-muted-foreground">
                Analyse de compatibilité en moins de 100ms
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Matching ultra-rapide</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Analyse prédictive avancée</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Optimisation continue</span>
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
                  Le plus populaire
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
                  {plan.name === 'Creator Free' ? 'Plan actuel' : 
                   plan.name === 'Enterprise' ? 'Nous contacter' : 
                   'Choisir ce plan'}
                </Button>
              </div>

              {/* AI Badge */}
              <div className="text-center pt-2">
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                  <Bot className="w-3 h-3 mr-1" />
                  Cerebras AI inclus
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Questions fréquentes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qu'est-ce que Cerebras AI ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cerebras AI est notre moteur d'intelligence artificielle ultra-rapide qui analyse 
                la compatibilité entre créateurs et sponsors en moins de 100ms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Puis-je changer de plan ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
                Les changements prennent effet immédiatement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qu'est-ce que les Ghost Profiles ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Les Ghost Profiles sont des créateurs découverts par notre IA sur les réseaux sociaux 
                mais pas encore inscrits sur VibeMatch. Vous pouvez les inviter !
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support inclus ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tous les plans incluent un support. Les plans Pro et Elite bénéficient 
                d'un support prioritaire avec des temps de réponse garantis.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}