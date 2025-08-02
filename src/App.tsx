import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreatorOnboarding from "./pages/CreatorOnboarding";
import NotFound from "./pages/NotFound";
import Matches from "./pages/Matches";
import Pricing from "./pages/Pricing";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import Discovery from "./pages/Discovery";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Campaigns from "./pages/Campaigns";
import Market from "./pages/Market";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={
              <ProtectedRoute requireOnboarding={false}>
                <CreatorOnboarding />
              </ProtectedRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/matches" element={
              <ProtectedRoute>
                <AppLayout>
                  <Matches />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/pricing" element={
              <ProtectedRoute>
                <AppLayout>
                  <Pricing />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <AppLayout>
                  <Admin />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Leaderboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/discover" element={
              <ProtectedRoute>
                <AppLayout>
                  <Discovery />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/messages" element={
              <ProtectedRoute>
                <AppLayout>
                  <Messages />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AppLayout>
                  <Analytics />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <AppLayout>
                  <Campaigns />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/market" element={
              <ProtectedRoute>
                <AppLayout>
                  <Market />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
