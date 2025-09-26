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
    }),
    { name: 'auth-storage' }
  )
);