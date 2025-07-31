import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StreakCounter } from '@/components/gamification/StreakCounter';

export function AppHeader() {
  const { profile, signOut } = useAuth();

  const userTypeLabel = profile?.user_type === 'creator' ? 'Creator' : 'Sponsor';
  const gradientClass = profile?.user_type === 'creator' 
    ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
    : 'bg-gradient-to-r from-blue-600 to-cyan-600';

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${gradientClass} flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-bold">VibeMatch</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Streak Counter - only for creators */}
        {profile?.user_type === 'creator' && <StreakCounter />}
        
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mode</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            profile?.user_type === 'creator' 
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
          }`}>
            {userTypeLabel}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                <AvatarFallback>
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}