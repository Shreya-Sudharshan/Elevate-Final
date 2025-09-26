import React, { useState } from 'react';
import { Award, Star, Trophy, Target, Flame, BookOpen, Users, Calendar, Lock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: 'Learning' | 'Social' | 'Streak' | 'Milestone' | 'Special';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xpReward: number;
  earnedAt?: string;
  progress?: number;
  maxProgress?: number;
  requirements: string[];
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    code: 'FIRST_STEPS',
    name: 'First Steps',
    description: 'Complete your first learning module',
    icon: '🎯',
    category: 'Learning',
    rarity: 'Common',
    xpReward: 50,
    earnedAt: '2024-12-10',
    requirements: ['Complete 1 learning module']
  },
  {
    id: '2',
    code: 'KNOWLEDGE_SEEKER',
    name: 'Knowledge Seeker',
    description: 'Complete 5 learning modules',
    icon: '📚',
    category: 'Learning',
    rarity: 'Rare',
    xpReward: 200,
    progress: 3,
    maxProgress: 5,
    requirements: ['Complete 5 learning modules']
  },
  {
    id: '3',
    code: 'LEARNING_MASTER',
    name: 'Learning Master',
    description: 'Complete 20 learning modules',
    icon: '🎓',
    category: 'Learning',
    rarity: 'Epic',
    xpReward: 500,
    progress: 3,
    maxProgress: 20,
    requirements: ['Complete 20 learning modules']
  },
  {
    id: '4',
    code: 'WEEK_WARRIOR',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    category: 'Streak',
    rarity: 'Common',
    xpReward: 100,
    earnedAt: '2024-12-11',
    requirements: ['Maintain 7-day streak']
  },
  {
    id: '5',
    code: 'STREAK_LEGEND',
    name: 'Streak Legend',
    description: 'Maintain a 30-day learning streak',
    icon: '⚡',
    category: 'Streak',
    rarity: 'Epic',
    xpReward: 750,
    progress: 7,
    maxProgress: 30,
    requirements: ['Maintain 30-day streak']
  },
  {
    id: '6',
    code: 'EARLY_BIRD',
    name: 'Early Bird',
    description: 'Complete a module before 9 AM',
    icon: '🌅',
    category: 'Special',
    rarity: 'Rare',
    xpReward: 150,
    requirements: ['Complete module before 9 AM']
  },
  {
    id: '7',
    code: 'NIGHT_OWL',
    name: 'Night Owl',
    description: 'Complete a module after 10 PM',
    icon: '🦉',
    category: 'Special',
    rarity: 'Rare',
    xpReward: 150,
    requirements: ['Complete module after 10 PM']
  },
  {
    id: '8',
    code: 'SOCIAL_BUTTERFLY',
    name: 'Social Butterfly',
    description: 'Give kudos to 10 colleagues',
    icon: '🦋',
    category: 'Social',
    rarity: 'Common',
    xpReward: 100,
    progress: 3,
    maxProgress: 10,
    requirements: ['Give kudos to 10 colleagues']
  },
  {
    id: '9',
    code: 'MENTOR',
    name: 'Mentor',
    description: 'Help 5 new employees with their onboarding',
    icon: '👨‍🏫',
    category: 'Social',
    rarity: 'Epic',
    xpReward: 400,
    progress: 1,
    maxProgress: 5,
    requirements: ['Help 5 new employees']
  },
  {
    id: '10',
    code: 'LEVEL_UP',
    name: 'Level Up',
    description: 'Reach level 5',
    icon: '⬆️',
    category: 'Milestone',
    rarity: 'Common',
    xpReward: 250,
    requirements: ['Reach level 5']
  },
  {
    id: '11',
    code: 'HIGH_ACHIEVER',
    name: 'High Achiever',
    description: 'Reach level 10',
    icon: '🏆',
    category: 'Milestone',
    rarity: 'Rare',
    xpReward: 500,
    requirements: ['Reach level 10']
  },
  {
    id: '12',
    code: 'ELITE_PERFORMER',
    name: 'Elite Performer',
    description: 'Reach level 20',
    icon: '👑',
    category: 'Milestone',
    rarity: 'Legendary',
    xpReward: 1000,
    requirements: ['Reach level 20']
  },
  {
    id: '13',
    code: 'QUIZ_MASTER',
    name: 'Quiz Master',
    description: 'Score 100% on 10 quizzes',
    icon: '🧠',
    category: 'Learning',
    rarity: 'Rare',
    xpReward: 300,
    progress: 4,
    maxProgress: 10,
    requirements: ['Score 100% on 10 quizzes']
  },
  {
    id: '14',
    code: 'WEEKEND_LEARNER',
    name: 'Weekend Learner',
    description: 'Complete modules on 5 weekends',
    icon: '📅',
    category: 'Special',
    rarity: 'Rare',
    xpReward: 200,
    progress: 2,
    maxProgress: 5,
    requirements: ['Complete modules on 5 weekends']
  },
  {
    id: '15',
    code: 'COMPANY_EXPERT',
    name: 'Company Expert',
    description: 'Complete all company culture modules',
    icon: '🏢',
    category: 'Learning',
    rarity: 'Epic',
    xpReward: 600,
    progress: 2,
    maxProgress: 3,
    requirements: ['Complete all company culture modules']
  }
];

export const Achievements: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'earned' | 'available'>('all');
  const user = useAuthStore(state => state.user);

  const getRarityColor = (rarity: string) => {
    const colors = {
      'Common': 'bg-gray-50 text-gray-700 border-gray-200',
      'Rare': 'bg-blue-50 text-blue-700 border-blue-200',
      'Epic': 'bg-purple-50 text-purple-700 border-purple-200',
      'Legendary': 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    return colors[rarity as keyof typeof colors] || colors.Common;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Learning': <BookOpen className="w-5 h-5" />,
      'Social': <Users className="w-5 h-5" />,
      'Streak': <Flame className="w-5 h-5" />,
      'Milestone': <Target className="w-5 h-5" />,
      'Special': <Star className="w-5 h-5" />
    };
    return icons[category as keyof typeof icons] || <Award className="w-5 h-5" />;
  };

  const filteredAchievements = mockAchievements.filter(achievement => {
    const matchesCategory = categoryFilter === 'all' || achievement.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'earned' && achievement.earnedAt) ||
      (statusFilter === 'available' && !achievement.earnedAt);
    return matchesCategory && matchesStatus;
  });

  const earnedCount = mockAchievements.filter(a => a.earnedAt).length;
  const totalXpEarned = mockAchievements
    .filter(a => a.earnedAt)
    .reduce((sum, a) => sum + a.xpReward, 0);
  const categories = [...new Set(mockAchievements.map(a => a.category))];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B2447] mb-2">Achievements</h1>
        <p className="text-[#4A5568]">Track your progress and unlock rewards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
          <div className="text-2xl font-bold text-[#0B2447]">{earnedCount}</div>
          <div className="text-sm text-[#4A5568]">Achievements Earned</div>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
          <div className="text-2xl font-bold text-[#2BA84A]">{mockAchievements.length - earnedCount}</div>
          <div className="text-sm text-[#4A5568]">Available</div>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
          <div className="text-2xl font-bold text-[#FFD23F]">{totalXpEarned}</div>
          <div className="text-sm text-[#4A5568]">XP from Achievements</div>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
          <div className="text-2xl font-bold text-[#0A6ED1]">{Math.round((earnedCount / mockAchievements.length) * 100)}%</div>
          <div className="text-sm text-[#4A5568]">Completion Rate</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#0A6ED1] text-white'
                  : 'bg-[#E8EAF6] text-[#0A6ED1] hover:bg-[#0A6ED1] hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('earned')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                statusFilter === 'earned'
                  ? 'bg-[#0A6ED1] text-white'
                  : 'bg-[#E8EAF6] text-[#0A6ED1] hover:bg-[#0A6ED1] hover:text-white'
              }`}
            >
              Earned
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                statusFilter === 'available'
                  ? 'bg-[#0A6ED1] text-white'
                  : 'bg-[#E8EAF6] text-[#0A6ED1] hover:bg-[#0A6ED1] hover:text-white'
              }`}
            >
              Available
            </button>
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-[#D6D9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <div 
            key={achievement.id} 
            className={`bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6 transition-all hover:shadow-lg ${
              achievement.earnedAt ? 'ring-2 ring-[#2BA84A] ring-opacity-20' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  achievement.earnedAt ? 'bg-[#2BA84A]/10' : 'bg-gray-100'
                }`}>
                  {achievement.earnedAt ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getCategoryIcon(achievement.category)}
                    <span className="text-xs text-[#4A5568]">{achievement.category}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </span>
                </div>
              </div>
              {achievement.earnedAt && (
                <div className="text-[#2BA84A]">
                  <Trophy className="w-5 h-5" />
                </div>
              )}
            </div>

            <h3 className={`font-semibold mb-2 ${achievement.earnedAt ? 'text-[#0B2447]' : 'text-gray-500'}`}>
              {achievement.name}
            </h3>
            <p className={`text-sm mb-4 ${achievement.earnedAt ? 'text-[#4A5568]' : 'text-gray-400'}`}>
              {achievement.description}
            </p>

            {/* Progress Bar */}
            {achievement.progress !== undefined && achievement.maxProgress && !achievement.earnedAt && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#4A5568]">Progress</span>
                  <span className="text-[#0A6ED1]">{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                <div className="w-full bg-[#E8EAF6] rounded-full h-2">
                  <div 
                    className="bg-[#0A6ED1] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-[#4A5568] mb-2">Requirements:</h4>
              <ul className="space-y-1">
                {achievement.requirements.map((req, index) => (
                  <li key={index} className="text-xs text-[#4A5568] flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${achievement.earnedAt ? 'bg-[#2BA84A]' : 'bg-gray-300'}`} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#FFD23F]" />
                <span className="text-sm font-medium text-[#4A5568]">+{achievement.xpReward} XP</span>
              </div>
              {achievement.earnedAt && (
                <span className="text-xs text-[#2BA84A]">
                  Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-[#D6D9E0] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#4A5568] mb-2">No achievements found</h3>
          <p className="text-[#4A5568]">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};