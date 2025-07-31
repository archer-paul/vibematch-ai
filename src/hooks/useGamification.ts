import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface UserQuota {
  super_likes_today: number;
  super_likes_used_today: number;
  matches_this_month: number;
  streak_days: number;
  last_login: string;
}

export interface Achievement {
  id: string;
  achievement_type: string;
  achievement_data: any;
  unlocked_at: string;
}

export interface UserSubscription {
  id?: string;
  user_id?: string;
  plan_type: 'free' | 'pro' | 'elite' | 'starter' | 'business' | 'enterprise';
  status: 'active' | 'canceled' | 'expired';
  expires_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useGamification() {
  const { user } = useAuth();
  const [quotas, setQuotas] = useState<UserQuota | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
      updateLoginStreak();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch quotas
      const { data: quotaData } = await supabase
        .from('user_quotas')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (quotaData) {
        setQuotas(quotaData);
      } else {
        // Create initial quotas
        await createInitialQuotas();
      }

      // Fetch achievements
      const { data: achievementData } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (achievementData) {
        setAchievements(achievementData);
      }

      // Fetch subscription
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriptionData) {
        setSubscription(subscriptionData as UserSubscription);
      } else {
        // Create free subscription
        await createFreeSubscription();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInitialQuotas = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_quotas')
      .insert([{
        user_id: user.id,
        super_likes_today: 3,
        super_likes_used_today: 0,
        matches_this_month: 0,
        streak_days: 1,
        last_login: new Date().toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (!error && data) {
      setQuotas(data);
    }
  };

  const createFreeSubscription = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert([{
        user_id: user.id,
        plan_type: 'free',
        status: 'active'
      }])
      .select()
      .single();

    if (!error && data) {
      setSubscription(data as UserSubscription);
    }
  };

  const updateLoginStreak = async () => {
    if (!user || !quotas) return;

    const today = new Date().toISOString().split('T')[0];
    const lastLogin = quotas.last_login;

    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreakDays = 1;
      if (lastLogin === yesterdayStr) {
        newStreakDays = quotas.streak_days + 1;
      }

      // Update quotas
      const { data, error } = await supabase
        .from('user_quotas')
        .update({
          last_login: today,
          streak_days: newStreakDays,
          super_likes_used_today: 0, // Reset daily usage
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (!error && data) {
        setQuotas(data);

        // Check for streak achievements
        if (newStreakDays >= 7) {
          await unlockAchievement('streak_master', {
            streak_days: newStreakDays,
            description: `Maintained a ${newStreakDays}-day login streak!`
          });
        }
      }
    }
  };

  const useSuperLike = async (): Promise<boolean> => {
    if (!user || !quotas) return false;

    const planLimits = {
      free: 3,
      pro: 10,
      elite: 25,
      starter: 15,
      business: 30,
      enterprise: 100
    };

    const limit = planLimits[subscription?.plan_type || 'free'];
    const bonusLikes = Math.floor(quotas.streak_days / 3); // +1 per 3 days streak

    if (quotas.super_likes_used_today >= limit + bonusLikes) {
      toast({
        title: "Super Likes utilisés",
        description: `Limite quotidienne atteinte. Upgrade ton plan pour plus !`,
        variant: "destructive"
      });
      return false;
    }

    const { data, error } = await supabase
      .from('user_quotas')
      .update({
        super_likes_used_today: quotas.super_likes_used_today + 1
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error && data) {
      setQuotas(data);
      return true;
    }

    return false;
  };

  const incrementMatches = async () => {
    if (!user || !quotas) return;

    const { data, error } = await supabase
      .from('user_quotas')
      .update({
        matches_this_month: quotas.matches_this_month + 1
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error && data) {
      setQuotas(data);

      // Check for match achievements
      if (data.matches_this_month === 1) {
        await unlockAchievement('first_match', {
          description: 'Completed your first successful match!'
        });
      }

      if (data.matches_this_month >= 10) {
        await unlockAchievement('super_matcher', {
          matches: data.matches_this_month,
          description: `Achieved ${data.matches_this_month} matches this month!`
        });
      }
    }
  };

  const unlockAchievement = async (type: string, data: any) => {
    if (!user) return;

    // Check if already unlocked
    const existing = achievements.find(a => a.achievement_type === type);
    if (existing) return;

    const { data: newAchievement, error } = await supabase
      .from('achievements')
      .insert([{
        user_id: user.id,
        achievement_type: type,
        achievement_data: data
      }])
      .select()
      .single();

    if (!error && newAchievement) {
      setAchievements(prev => [newAchievement, ...prev]);
      
      // Show achievement notification
      toast({
        title: "🏆 Achievement Unlocked!",
        description: data.description,
        duration: 5000,
      });
    }
  };

  const canUseSuperLike = () => {
    if (!quotas || !subscription) return false;

    const planLimits = {
      free: 3,
      pro: 10,
      elite: 25,
      starter: 15,
      business: 30,
      enterprise: 100
    };

    const limit = planLimits[subscription.plan_type];
    const bonusLikes = Math.floor(quotas.streak_days / 3);
    
    return quotas.super_likes_used_today < (limit + bonusLikes);
  };

  const getSuperLikesRemaining = () => {
    if (!quotas || !subscription) return 0;

    const planLimits = {
      free: 3,
      pro: 10,
      elite: 25,
      starter: 15,
      business: 30,
      enterprise: 100
    };

    const limit = planLimits[subscription.plan_type];
    const bonusLikes = Math.floor(quotas.streak_days / 3);
    
    return Math.max(0, (limit + bonusLikes) - quotas.super_likes_used_today);
  };

  return {
    quotas,
    achievements,
    subscription,
    loading,
    useSuperLike,
    incrementMatches,
    unlockAchievement,
    canUseSuperLike,
    getSuperLikesRemaining,
    refetch: fetchUserData
  };
}