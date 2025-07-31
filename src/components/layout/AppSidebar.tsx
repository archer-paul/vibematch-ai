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
  MessageSquare
} from 'lucide-react';

const creatorNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'My Profile', url: '/profile', icon: Users },
  { title: 'AI Matches', url: '/matches', icon: Sparkles },
  { title: 'Campaigns', url: '/campaigns', icon: Target },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Messages', url: '/messages', icon: MessageSquare },
];

const sponsorNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Company', url: '/profile', icon: Building2 },
  { title: 'Discover', url: '/discover', icon: UserPlus },
  { title: 'AI Matches', url: '/matches', icon: Sparkles },
  { title: 'Campaigns', url: '/campaigns', icon: Target },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Messages', url: '/messages', icon: MessageSquare },
];

const commonItems = [
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { profile } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-accent hover:text-accent-foreground';

  const navItems = profile?.user_type === 'creator' ? creatorNavItems : sponsorNavItems;
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
                    <NavLink to={item.url} className={getNavCls}>
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
                    <NavLink to={item.url} className={getNavCls}>
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