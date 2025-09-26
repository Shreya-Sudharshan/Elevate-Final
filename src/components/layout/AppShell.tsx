import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  BookOpen, 
  CreditCard, 
  Trophy, 
  Award,
  User,
  Search,
  Menu,
  X,
  MessageCircle,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { XpBadge } from '../ui/XpBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBot } from '../chat/ChatBot';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Checklist', href: '/checklist', icon: CheckSquare },
  { name: 'Modules', href: '/modules', icon: BookOpen },
  { name: 'Flashcards', href: '/flashcards', icon: CreditCard },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Achievements', href: '/achievements', icon: Award },
];

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFullscreen, setChatFullscreen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  // Keyboard shortcut for fullscreen toggle (F11 or Cmd/Ctrl + F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (chatOpen && (e.key === 'F11' || (e.metaKey && e.key === 'f') || (e.ctrlKey && e.key === 'f'))) {
        e.preventDefault();
        setChatFullscreen(!chatFullscreen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chatOpen, chatFullscreen]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Top Bar */}
      <header className="bg-white border-b border-[#D6D9E0] px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0A6ED1] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h1 className="text-xl font-bold text-[#0B2447]">Elevate</h1>
            </div>
          </div>

          {/* Center - Search (hidden on mobile) */}
          {/*
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-[#4A5568] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search modules, tasks..."
                className="w-full pl-10 pr-4 py-2 border border-[#D6D9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
              />
            </div>
          </div>
          */}

          {/* Right side */}
          <div className="flex items-center gap-4">
            <XpBadge xp={user.currentXp} level={user.level} />
            
            <div className="relative">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-[#0A6ED1] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
            <>
              {/* Mobile overlay */}
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
              )}
              
              <motion.nav
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="fixed lg:static top-0 left-0 h-full w-70 bg-white border-r border-[#D6D9E0] z-50 lg:z-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between lg:hidden mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0A6ED1] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">E</span>
                      </div>
                      <h1 className="text-xl font-bold text-[#0B2447]">Elevate</h1>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href;
                      const Icon = item.icon;
                      
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            navigate(item.href);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                            isActive
                              ? 'bg-[#0A6ED1]/10 text-[#0A6ED1] font-medium'
                              : 'text-[#4A5568] hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {item.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* User info at bottom */}
                  <div className="mt-8 pt-6 border-t border-[#D6D9E0]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#0A6ED1] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[#0B2447]">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-[#4A5568]">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="text-sm text-[#4A5568] hover:text-[#0A6ED1] transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          {children}
        </main>
      </div>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#0A6ED1] hover:bg-[#0859ab] text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <>
            {/* Backdrop - only show on mobile when not fullscreen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setChatOpen(false)}
              className={`fixed inset-0 bg-black/50 z-50 ${chatFullscreen ? 'hidden' : 'lg:hidden'}`}
            />
            
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 flex flex-col ${
                chatFullscreen 
                  ? 'w-full' 
                  : 'w-96'
              }`}
            >
              <div className="p-4 border-b border-[#D6D9E0] flex items-center justify-between">
                <h2 className="font-semibold text-[#0B2447]">AI Career Coach</h2>
                <div className="flex items-center gap-2">
                  {/* Fullscreen/Minimize Toggle */}
                  <button
                    onClick={() => setChatFullscreen(!chatFullscreen)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title={chatFullscreen ? 'Minimize (F11 or Cmd/Ctrl+F)' : 'Maximize (F11 or Cmd/Ctrl+F)'}
                  >
                    {chatFullscreen ? (
                      <Minimize2 className="w-5 h-5" />
                    ) : (
                      <Maximize2 className="w-5 h-5" />
                    )}
                  </button>
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setChatOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <ChatBot isFullscreen={chatFullscreen} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
