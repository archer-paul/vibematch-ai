import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Users, Target, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function AIProfileScore() {
  const profileScore = 87;
  const weeklyChange = +5;
  
  const metrics = [
    { label: 'Content Quality', value: 92, icon: Sparkles },
    { label: 'Engagement Rate', value: 78, icon: Users },
    { label: 'Brand Alignment', value: 95, icon: Target },
    { label: 'Growth Potential', value: 85, icon: TrendingUp },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <TooltipProvider>
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Profile Score
              </CardTitle>
              <CardDescription>
                Your AI-powered creator potential rating
              </CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Score based on content quality, engagement, and brand potential</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Main Score */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold">
              <span className={getScoreColor(profileScore)}>{profileScore}</span>
              <span className="text-2xl text-muted-foreground">/100</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className={getScoreColor(profileScore)}>
                {getScoreLabel(profileScore)}
              </Badge>
              <Badge variant="outline" className="text-green-600">
                +{weeklyChange} this week
              </Badge>
            </div>
          </div>

          {/* Progress Ring Visual */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-muted/20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${(profileScore / 100) * 339.292} 339.292`}
                  className="text-purple-600 transition-all duration-1000 ease-in-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="text-lg font-bold">{profileScore}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Breakdown</h4>
            <div className="grid gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="flex items-center gap-3">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{metric.label}</span>
                      <span className="font-medium">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full" variant="outline" onClick={() => window.location.href = '/profile'}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Improve Score
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}