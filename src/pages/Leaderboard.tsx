import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Zap } from 'lucide-react';

export default function Leaderboard() {
  const topCreators = [
    { name: 'Emma Johnson', matches: 45, streak: 12, achievements: 8 },
    { name: 'Alex Chen', matches: 38, streak: 8, achievements: 6 },
    { name: 'Sarah Williams', matches: 32, streak: 5, achievements: 7 }
  ];

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h1>
      
      <div className="space-y-4">
        {topCreators.map((creator, index) => (
          <Card key={creator.name} className={index === 0 ? 'border-yellow-400 bg-yellow-50' : ''}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="text-2xl font-bold">#{index + 1}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{creator.name}</h3>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {creator.matches} matches
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {creator.streak} jours
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {creator.achievements} achievements
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}