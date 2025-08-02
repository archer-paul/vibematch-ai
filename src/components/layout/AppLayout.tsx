import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDataPersistence } from '@/hooks/useDataPersistence';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { profile } = useAuth();
  
  // Initialize data persistence for demo data
  useDataPersistence();

  // Apply theme based on user type
  useEffect(() => {
    if (profile?.user_type) {
      document.documentElement.className = `${profile.user_type}-theme`;
    }
  }, [profile?.user_type]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <AppHeader />
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}