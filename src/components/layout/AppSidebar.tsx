import { useAuth } from '@/hooks/useAuth';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Home, 
  Users, 
  Target, 
  BarChart3, 
  Settings,
  Sparkles,
  Building2,
  UserPlus,
  MessageSquare,
  Award,
  Briefcase
} from 'lucide-react';

const creatorNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home, demoId: 'nav-dashboard' },
  { title: 'AI Matches', url: '/matches', icon: Sparkles, demoId: 'nav-ai-matches' },
  { title: 'My campaigns', url: '/campaigns', icon: Briefcase, demoId: 'nav-campaigns' },
  { title: 'All Campaigns', url: '/market', icon: Target, demoId: 'nav-all-campaigns' },
  { title: 'Profile', url: '/profile', icon: Users, demoId: 'nav-profile' },
  { title: 'Leaderboard', url: '/leaderboard', icon: Award, demoId: 'nav-leaderboard' },
  { title: 'Analytics', url: '/analytics', icon: BarChart3, demoId: 'nav-analytics' },
  { title: 'Messages', url: '/messages', icon: MessageSquare, demoId: 'nav-messages' },
];

const sponsorNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home, demoId: 'nav-dashboard' },
  { title: 'Company', url: '/profile', icon: Building2, demoId: 'nav-company' },
  { title: 'Discover', url: '/discover', icon: UserPlus, demoId: 'nav-discover' },
  { title: 'AI Matches', url: '/matches', icon: Sparkles, demoId: 'nav-ai-matches' },
  { title: 'Leaderboard', url: '/leaderboard', icon: Award, demoId: 'nav-leaderboard' },
  { title: 'Analytics', url: '/analytics', icon: BarChart3, demoId: 'nav-analytics' },
  { title: 'Messages', url: '/messages', icon: MessageSquare, demoId: 'nav-messages' },
];

const commonItems = [
  { title: 'Settings', url: '/settings', icon: Settings, demoId: 'nav-settings' },
];

export function AppSidebar() {
  const { profile } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground';

  // Filter out creator-only items for sponsors
  const getNavItems = () => {
    if (profile?.user_type === 'creator') {
      return creatorNavItems;
    } else {
      // Remove AI Matches and Leaderboards for sponsors
      return sponsorNavItems.filter(item => 
        !item.title.includes('AI Matches') && !item.title.includes('Leaderboard')
      );
    }
  };
  
  const navItems = getNavItems();
  const userTypeLabel = profile?.user_type === 'creator' ? 'Creator' : 'Sponsor';

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{userTypeLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls} data-demo={item.demoId || undefined}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls} data-demo={item.demoId || undefined}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}