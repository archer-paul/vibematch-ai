import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target_value: number;
  current_progress: number;
  reward_type: 'super_likes' | 'streak_bonus' | 'badge';
  reward_value: number;
  expires_at: string;
  completed: boolean;
  icon: string;
}

export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  display_name: string;
  user_type: 'creator' | 'sponsor';
  total_matches: number;
  streak_days: number;
  achievements_count: number;
  total_score: number;
  rank: number;
  avatar_url?: string;
}

export function useAdvancedGamification() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChallenges();
      fetchLeaderboard();
    }
  }, [user]);

  const fetchChallenges = async () => {
    if (!user) return;

    try {
      // For demo purposes, create static challenges
      const demoChallenges: Challenge[] = [
        {
          id: 'daily-1',
          title: 'Daily Explorer',
          description: 'Découvrez 5 nouveaux sponsors aujourd\'hui',
          type: 'daily',
          target_value: 5,
          current_progress: Math.floor(Math.random() * 5),
          reward_type: 'super_likes',
          reward_value: 2,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          icon: '🔍'
        },
        {
          id: 'weekly-1',
          title: 'Match Master',
          description: 'Obtenez 10 matches cette semaine',
          type: 'weekly',
          target_value: 10,
          current_progress: Math.floor(Math.random() * 10),
          reward_type: 'streak_bonus',
          reward_value: 3,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          icon: '🎯'
        },
        {
          id: 'weekly-2',
          title: 'Streak Legend',
          description: 'Maintenez un streak de 7 jours',
          type: 'weekly',
          target_value: 7,
          current_progress: Math.floor(Math.random() * 7),
          reward_type: 'super_likes',
          reward_value: 5,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          icon: '🔥'
        },
        {
          id: 'monthly-1',
          title: 'AI Champion',
          description: 'Atteignez un score de compatibilité moyen de 85%',
          type: 'monthly',
          target_value: 85,
          current_progress: Math.floor(Math.random() * 85),
          reward_type: 'badge',
          reward_value: 1,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          icon: '🤖'
        },
        {
          id: 'weekly-3',
          title: 'Super Liker',
          description: 'Utilisez 15 Super Likes cette semaine',
          type: 'weekly',
          target_value: 15,
          current_progress: Math.floor(Math.random() * 15),
          reward_type: 'super_likes',
          reward_value: 10,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          icon: '⭐'
        }
      ];

      setChallenges(demoChallenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      // Create demo leaderboard data
      const demoLeaderboard: LeaderboardEntry[] = [
        {
          user_id: 'demo-leader-1',
          full_name: 'Emma Johnson',
          display_name: 'Emma J.',
          user_type: 'creator',
          total_matches: 45,
          streak_days: 15,
          achievements_count: 12,
          total_score: 920,
          rank: 1
        },
        {
          user_id: 'demo-leader-2',
          full_name: 'Alex Chen',
          display_name: 'Alex C.',
          user_type: 'creator',
          total_matches: 38,
          streak_days: 12,
          achievements_count: 9,
          total_score: 785,
          rank: 2
        },
        {
          user_id: 'demo-leader-3',
          full_name: 'Sarah Williams',
          display_name: 'Sarah W.',
          user_type: 'creator',
          total_matches: 32,
          streak_days: 8,
          achievements_count: 8,
          total_score: 680,
          rank: 3
        },
        {
          user_id: 'demo-leader-4',
          full_name: 'Thomas Martin',
          display_name: 'Thomas M.',
          user_type: 'sponsor',
          total_matches: 28,
          streak_days: 10,
          achievements_count: 7,
          total_score: 650,
          rank: 4
        },
        {
          user_id: 'demo-leader-5',
          full_name: 'Marie Dubois',
          display_name: 'Marie D.',
          user_type: 'sponsor',
          total_matches: 25,
          streak_days: 6,
          achievements_count: 6,
          total_score: 580,
          rank: 5
        },
        {
          user_id: 'demo-leader-6',
          full_name: 'David Kim',
          display_name: 'David K.',
          user_type: 'creator',
          total_matches: 22,
          streak_days: 9,
          achievements_count: 5,
          total_score: 520,
          rank: 6
        },
        {
          user_id: 'demo-leader-7',
          full_name: 'Sophie Laurent',
          display_name: 'Sophie L.',
          user_type: 'sponsor',
          total_matches: 20,
          streak_days: 5,
          achievements_count: 4,
          total_score: 450,
          rank: 7
        },
        {
          user_id: 'demo-leader-8',
          full_name: 'Julien Moreau',
          display_name: 'Julien M.',
          user_type: 'creator',
          total_matches: 18,
          streak_days: 7,
          achievements_count: 4,
          total_score: 420,
          rank: 8
        }
      ];

      // Add current user to leaderboard if not present
      if (user) {
        const userInLeaderboard = demoLeaderboard.find(entry => entry.user_id === user.id);
        if (!userInLeaderboard) {
          demoLeaderboard.push({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || 'Vous',
            display_name: 'Vous',
            user_type: 'creator',
            total_matches: Math.floor(Math.random() * 15) + 5,
            streak_days: Math.floor(Math.random() * 10) + 1,
            achievements_count: Math.floor(Math.random() * 5) + 1,
            total_score: Math.floor(Math.random() * 300) + 200,
            rank: demoLeaderboard.length + 1
          });
        }
      }

      setLeaderboard(demoLeaderboard);
      
      // Set user rank
      const userEntry = demoLeaderboard.find(entry => entry.user_id === user?.id);
      setUserRank(userEntry?.rank || 0);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const completeChallenge = async (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true, current_progress: challenge.target_value }
          : challenge
      )
    );
  };

  const updateChallengeProgress = (challengeId: string, progress: number) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { 
              ...challenge, 
              current_progress: Math.min(progress, challenge.target_value),
              completed: progress >= challenge.target_value
            }
          : challenge
      )
    );
  };

  return {
    challenges,
    leaderboard,
    userRank,
    loading,
    completeChallenge,
    updateChallengeProgress,
    refetch: () => {
      fetchChallenges();
      fetchLeaderboard();
    }
  };
}