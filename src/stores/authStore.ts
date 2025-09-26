import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateUserXp: (xpGain: number, source: string) => Promise<void>;
  syncCompletedTasksXp: () => Promise<void>;
  syncCompletedModulesXp: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  role: string;
  learningProfile?: "Data Scientist" | "Business Analyst";
}

const mockUsers: User[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',  // fake UUID
    email: 'admin@acme.com',
    firstName: 'Admin',
    lastName: 'User',
    employeeId: 'E0001',
    department: 'IT',
    role: 'System Administrator',
    managerName: 'CTO',
    startDate: '2023-01-15',
    level: 12,
    currentXp: 4850,
    streakDays: 42,
    introCompleted: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000002', //fake
    email: 'jane@acme.com',
    firstName: 'Jane',
    lastName: 'Patel',
    employeeId: 'E0057',
    department: 'Engineering',
    role: 'Software Engineer I',
    managerName: 'A. Chen',
    startDate: '2024-11-01',
    level: 3,
    currentXp: 485,
    streakDays: 7,
    introCompleted: true,
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      // ✅ simple setter for hydrating user manually
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
        
        // Sync user data to backend when they log in
        if (typeof window !== 'undefined') {
          fetch('http://localhost:3001/api/users/upsert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              currentXp: user.currentXp,
              level: user.level,
              streakDays: user.streakDays
            })
          }).catch(error => {
            console.log('Backend sync on login failed:', error);
          });
          
          // Sync completed tasks XP
          setTimeout(() => {
            get().syncCompletedTasksXp();
          }, 1000);
        }
      },

      login: async (email: string, password: string) => {
        try {
          const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              const user: User = {
                id: data.user.id,
                email: data.user.email,
                firstName: data.user.first_name,
                lastName: data.user.last_name,
                employeeId: data.user.employee_id,
                department: data.user.department,
                role: data.user.role,
                managerName: data.user.manager_name,
                startDate: data.user.start_date,
                level: data.user.level,
                currentXp: data.user.current_xp,
                streakDays: data.user.streak_days,
                introCompleted: data.user.intro_completed,
              };
              set({ user, isAuthenticated: true });
              return user;
            }
          }

          const mockUser = mockUsers.find(u => u.email === email);
          if (mockUser) {
            set({ user: mockUser, isAuthenticated: true });
            return mockUser;
          }

          throw new Error('Invalid credentials');
        } catch (error) {
          console.error('Login error:', error);
          throw new Error('Login failed');
        }
      },

      register: async (data: RegisterData) => {
        try {
          const response = await fetch('http://localhost:3001/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (result.success && result.user) {
            const user: User = {
              id: result.user.id,
              email: result.user.email,
              firstName: result.user.first_name,
              lastName: result.user.last_name,
              employeeId: result.user.employee_id,
              department: result.user.department,
              role: result.user.role,
              managerName: result.user.manager_name,
              startDate: result.user.start_date,
              level: result.user.level,
              currentXp: result.user.current_xp,
              streakDays: result.user.streak_days,
              introCompleted: result.user.intro_completed,
            };

            set({ user, isAuthenticated: true });
            return user;
          } else {
            throw new Error(result.error || 'Registration failed');
          }
        } catch (error) {
          console.error('Registration error:', error);
          throw new Error('Registration failed');
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });

          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'auth-storage',
              JSON.stringify({
                state: { user: updatedUser, isAuthenticated: true },
                version: 0,
              })
            );
            window.dispatchEvent(new Event('storage'));
          }
        }
      },

      syncCompletedTasksXp: async () => {
        const currentUser = get().user;
        if (!currentUser?.id) return;

        try {
          // Get completed tasks from backend
          const response = await fetch(`http://localhost:3001/api/tasks/${currentUser.id}`);
          if (response.ok) {
            const data = await response.json();
            const completedTasks = data.data.completed_tasks || [];
            
            // Calculate total XP from completed tasks
            const totalXpFromTasks = completedTasks.reduce((sum: number, task: any) => {
              return sum + (task.points || 0);
            }, 0);
            
            // If the user's current XP is less than what they should have from completed tasks
            if (currentUser.currentXp < totalXpFromTasks) {
              const xpToAdd = totalXpFromTasks - currentUser.currentXp;
              const newXp = currentUser.currentXp + xpToAdd;
              const newLevel = Math.floor(newXp / 150) + 1;
              
              const updatedUser = {
                ...currentUser,
                currentXp: newXp,
                level: Math.max(newLevel, currentUser.level)
              };
              
              set({ user: updatedUser });
              
              if (typeof window !== 'undefined') {
                localStorage.setItem(
                  'auth-storage',
                  JSON.stringify({
                    state: { user: updatedUser, isAuthenticated: true },
                    version: 0,
                  })
                );
                window.dispatchEvent(new Event('storage'));
              }
              
              console.log(`Synced ${xpToAdd} XP from completed tasks. New total: ${newXp} XP`);
            }
          }
        } catch (error) {
          console.error('Failed to sync completed tasks XP:', error);
        }
      },

      syncCompletedModulesXp: async () => {
        const currentUser = get().user;
        if (!currentUser?.id) return;

        try {
          // Get user module progress from backend
          const response = await fetch(`http://localhost:3001/api/user-modules/${currentUser.id}`);
          if (response.ok) {
            const data = await response.json();
            const completedModules = data.progress || [];
            
            console.log('Completed modules from backend:', completedModules);
            
            // Calculate total XP from completed modules (100% progress)
            let totalXpFromModules = 0;
            const moduleXpDetails = [];
            
            for (const module of completedModules) {
              if (module.progress >= 100) {
                // Get module XP from the modules catalog
                const moduleData = require('../backend/modulesCatalog').defaultModules.find((m: any) => m.id === module.module_id);
                const xpReward = moduleData?.xpReward || 0;
                totalXpFromModules += xpReward;
                moduleXpDetails.push({
                  id: module.module_id,
                  xp: xpReward,
                  title: moduleData?.title || 'Unknown Module'
                });
              }
            }
            
            console.log('Module XP details:', moduleXpDetails);
            console.log(`Total XP from completed modules: ${totalXpFromModules}`);
            console.log(`Current user XP: ${currentUser.currentXp}`);
            
            // If the user's current XP is less than what they should have from completed modules
            if (currentUser.currentXp < totalXpFromModules) {
              const xpToAdd = totalXpFromModules - currentUser.currentXp;
              const newXp = currentUser.currentXp + xpToAdd;
              const newLevel = Math.floor(newXp / 150) + 1;
              
              const updatedUser = {
                ...currentUser,
                currentXp: newXp,
                level: Math.max(newLevel, currentUser.level)
              };
              
              set({ user: updatedUser });
              
              if (typeof window !== 'undefined') {
                localStorage.setItem(
                  'auth-storage',
                  JSON.stringify({
                    state: { user: updatedUser, isAuthenticated: true },
                    version: 0,
                  })
                );
                window.dispatchEvent(new Event('storage'));
              }
              
              console.log(`Synced ${xpToAdd} XP from completed modules. New total: ${newXp} XP, Level ${newLevel}`);
              console.log('Modules that contributed XP:', moduleXpDetails);
            } else {
              console.log('No XP sync needed - user already has correct XP from modules');
            }
          } else {
            console.log('Failed to fetch user module progress:', response.status);
          }
        } catch (error) {
          console.error('Failed to sync completed modules XP:', error);
        }
      },

      updateUserXp: async (xpGain: number, source: string) => {
        const currentUser = get().user;
        if (!currentUser?.id) {
          console.log('No user found for XP update');
          return;
        }

        console.log(`updateUserXp called: +${xpGain} XP from ${source}`);
        console.log(`Current user XP: ${currentUser.currentXp}`);

        try {
          const newXp = currentUser.currentXp + xpGain;
          const newLevel = Math.floor(newXp / 150) + 1;
          
          console.log(`Calculated new XP: ${newXp}, new level: ${newLevel}`);
          
          // Update local state immediately
          const updatedUser = {
            ...currentUser,
            currentXp: newXp,
            level: Math.max(newLevel, currentUser.level)
          };
          set({ user: updatedUser });

          console.log(`Updated user state: ${updatedUser.currentXp} XP, Level ${updatedUser.level}`);

          // Save to localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'auth-storage',
              JSON.stringify({
                state: { user: updatedUser, isAuthenticated: true },
                version: 0,
              })
            );
            window.dispatchEvent(new Event('storage'));
            console.log('XP saved to localStorage');
          }

          // Try to sync with backend (non-blocking)
          try {
            await fetch('http://localhost:3001/api/users/upsert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: currentUser.id,
                email: currentUser.email,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                role: currentUser.role,
                currentXp: newXp,
                level: newLevel,
                streakDays: currentUser.streakDays
              })
            });
            
            await fetch('http://localhost:3001/api/users/update-xp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: currentUser.id,
                xpGain,
                newXp,
                newLevel,
                source
              })
            });
            
            console.log(`XP synced to backend: +${xpGain} XP from ${source}`);
          } catch (backendError) {
            console.log('Backend sync failed, but XP updated locally:', backendError);
          }
        } catch (error) {
          console.error('Failed to update XP:', error);
        }
      },
    }),
    { name: 'auth-storage' }
  )
);