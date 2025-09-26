export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  department: string;
  role: string;
  managerName: string;
  startDate: string;
  level: number;
  currentXp: number;
  streakDays: number;
  introCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'HR' | 'IT' | 'Compliance' | 'General';
  dueDate: string;
  points: number;
  isMandatory: boolean;
  status: 'todo' | 'done' | 'snoozed';
  completedAt?: string;
}

export interface Module {
  id: string;
  title: string;
  category: string;
  difficulty: 1 | 2 | 3;
  estimatedMinutes: number;
  totalLessons: number;
  xpReward: number;
  description: string;
  tags: string[];
  progress: number;
  lastOpenedAt?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  orderIndex: number;
  type: 'article' | 'video' | 'scenario' | 'flashcards' | 'quiz';
  title: string;
  content: any;
  completed: boolean;
}

export interface Quiz {
  id: string;
  moduleId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true_false' | 'multi_select';
  question: string;
  options: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  department: string;
  level: number;
  xp: number;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}