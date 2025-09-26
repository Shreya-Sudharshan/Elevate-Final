import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from "./stores/authStore";
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { IntroSlides } from './components/onboarding/IntroSlides';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Checklist } from './pages/Checklist';
import { Modules } from './pages/Modules';
import { Flashcards } from './pages/Flashcards';
import { Leaderboard } from './pages/Leaderboard';
import { Achievements } from './pages/Achievements';
import { Profile } from './pages/Profile';
import { DailyChallenge } from './pages/DailyChallenge';
import { XpGainNotification } from './components/ui/XpGainNotification';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Auth routes */}
            <Route 
              path="/auth/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
            />
            <Route 
              path="/auth/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterForm />} 
            />
            
            {/* Onboarding */}
            <Route 
              path="/onboarding/intro" 
              element={
                isAuthenticated && !user?.introCompleted ? <IntroSlides /> : <Navigate to="/dashboard" replace />
              } 
            />
            
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Daily Challenge route */}
            <Route 
              path="/daily-challenge" 
              element={
                isAuthenticated ? (
                  user?.introCompleted ? (
                    <DailyChallenge />
                  ) : (
                    <Navigate to="/onboarding/intro" replace />
                  )
                ) : (
                  <Navigate to="/auth/login" replace />
                )
              } 
            />
            
            {/* Protected routes within AppShell */}
            <Route
              path="/*"
              element={
                isAuthenticated ? (
                  user?.introCompleted ? (
                    <AppShell>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/checklist" element={<Checklist />} />
                        <Route path="/modules" element={<Modules />} />
                        <Route path="/flashcards" element={<Flashcards />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/achievements" element={<Achievements />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </AppShell>
                  ) : (
                    <Navigate to="/onboarding/intro" replace />
                  )
                ) : (
                  <Navigate to="/auth/login" replace />
                )
              }
            />
          </Routes>
          
          {/* Global notifications */}
          <XpGainNotification />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;