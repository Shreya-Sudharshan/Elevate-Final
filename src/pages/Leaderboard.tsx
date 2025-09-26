import React, { useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Users, Star, Filter } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface LeaderboardEntry {
  id: string;
  name: string;
  department: string;
  role: string;
  level: number;
  xp: number;
  weeklyXp: number;
  monthlyXp: number;
  streakDays: number;
  avatar?: string;
  badges: number;
}

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    level: 15,
    xp: 8450,
    weeklyXp: 320,
    monthlyXp: 1250,
    streakDays: 28,
    badges: 12
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    department: 'Product',
    role: 'Product Manager',
    level: 14,
    xp: 7890,
    weeklyXp: 280,
    monthlyXp: 1180,
    streakDays: 21,
    badges: 10
  },
  {
    id: '3',
    name: 'Emily Watson',
    department: 'Design',
    role: 'UX Designer',
    level: 13,
    xp: 7320,
    weeklyXp: 350,
    monthlyXp: 1320,
    streakDays: 35,
    badges: 11
  },
  {
    id: '4',
    name: 'David Kim',
    department: 'Engineering',
    role: 'DevOps Engineer',
    level: 12,
    xp: 6850,
    weeklyXp: 290,
    monthlyXp: 1100,
    streakDays: 14,
    badges: 9
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    department: 'Marketing',
    role: 'Marketing Manager',
    level: 11,
    xp: 6200,
    weeklyXp: 240,
    monthlyXp: 980,
    streakDays: 18,
    badges: 8
  },
  {
    id: '6',
    name: 'Alex Johnson',
    department: 'Sales',
    role: 'Sales Representative',
    level: 10,
    xp: 5750,
    weeklyXp: 200,
    monthlyXp: 850,
    streakDays: 12,
    badges: 7
  },
  {
    id: '7',
    name: 'Rachel Green',
    department: 'HR',
    role: 'HR Specialist',
    level: 9,
    xp: 5200,
    weeklyXp: 180,
    monthlyXp: 720,
    streakDays: 25,
    badges: 6
  },
  {
    id: '8',
    name: 'Michael Brown',
    department: 'Finance',
    role: 'Financial Analyst',
    level: 8,
    xp: 4650,
    weeklyXp: 160,
    monthlyXp: 640,
    streakDays: 8,
    badges: 5
  },
  {
    id: 'jane',
    name: 'Jane Patel',
    department: 'Engineering',
    role: 'Software Engineer I',
    level: 3,
    xp: 485,
    weeklyXp: 85,
    monthlyXp: 485,
    streakDays: 7,
    badges: 2
  },
  {
    id: 'admin',
    name: 'Admin User',
    department: 'IT',
    role: 'System Administrator',
    level: 12,
    xp: 4850,
    weeklyXp: 150,
    monthlyXp: 600,
    streakDays: 42,
    badges: 15
  }
];

export const Leaderboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const user = useAuthStore(state => state.user);

  const getSortedData = () => {
    let sortedData = [...mockLeaderboardData];
    
    if (timeFilter === 'weekly') {
      sortedData.sort((a, b) => b.weeklyXp - a.weeklyXp);
    } else if (timeFilter === 'monthly') {
      sortedData.sort((a, b) => b.monthlyXp - a.monthlyXp);
    } else {
      sortedData.sort((a, b) => b.xp - a.xp);
    }

    if (departmentFilter !== 'all') {
      sortedData = sortedData.filter(entry => entry.department === departmentFilter);
    }

    return sortedData;
  };

  const getXpValue = (entry: LeaderboardEntry) => {
    if (timeFilter === 'weekly') return entry.weeklyXp;
    if (timeFilter === 'monthly') return entry.monthlyXp;
    return entry.xp;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-[#FFD23F]" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-[#C0C0C0]" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-[#CD7F32]" />;
    return <span className="w-6 h-6 flex items-center justify-center text-[#4A5568] font-bold">#{rank}</span>;
  };

  const sortedData = getSortedData();
  const currentUserRank = sortedData.findIndex(entry => entry.id === user?.id) + 1;
  const currentUserData = sortedData.find(entry => entry.id === user?.id);
  
  const departments = [...new Set(mockLeaderboardData.map(entry => entry.department))];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B2447] mb-2">Leaderboard</h1>
        <p className="text-[#4A5568]">See how you stack up against your colleagues</p>
      </div>

      {/* Current User Stats */}
      {currentUserData && (
        <div className="bg-gradient-to-r from-[#0A6ED1] to-[#00A0AF] rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">
                  {user?.firstName[0]}{user?.lastName[0]}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Ranking</h2>
                <p className="opacity-90">#{currentUserRank} out of {sortedData.length}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{getXpValue(currentUserData).toLocaleString()} XP</div>
              <div className="opacity-90">Level {currentUserData.level}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                timeFilter === 'all'
                  ? 'bg-[#0A6ED1] text-white'
                  : 'bg-[#E8EAF6] text-[#0A6ED1] hover:bg-[#0A6ED1] hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('monthly')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                timeFilter === 'monthly'
                  ? 'bg-[#0A6ED1] text-white'
                  : 'bg-[#E8EAF6] text-[#0A6ED1] hover:bg-[#0A6ED1] hover:text-white'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeFilter('weekly')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                timeFilter === 'weekly'
                  ? 'bg-[#0A6ED1] text-white'
                  : 'bg-[#E8EAF6] text-[#0A6ED1] hover:bg-[#0A6ED1] hover:text-white'
              }`}
            >
              This Week
            </button>
          </div>
          
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-[#D6D9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {sortedData.slice(0, 3).map((entry, index) => (
          <div key={entry.id} className={`bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6 text-center ${
            index === 0 ? 'ring-2 ring-[#FFD23F] ring-opacity-50' : ''
          }`}>
            <div className="mb-4">
              {getRankIcon(index + 1)}
            </div>
            <div className="w-16 h-16 bg-[#0A6ED1] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">
                {entry.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="font-semibold text-[#0B2447] mb-1">{entry.name}</h3>
            <p className="text-sm text-[#4A5568] mb-2">{entry.role}</p>
            <p className="text-sm text-[#4A5568] mb-3">{entry.department}</p>
            <div className="text-xl font-bold text-[#0A6ED1] mb-2">
              {getXpValue(entry).toLocaleString()} XP
            </div>
            <div className="text-sm text-[#4A5568]">Level {entry.level}</div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="p-6 border-b border-[#D6D9E0]">
          <h2 className="text-xl font-semibold text-[#0B2447] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#0A6ED1]" />
            Full Rankings
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F7FA]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">XP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Streak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6D9E0]">
              {sortedData.map((entry, index) => (
                <tr key={entry.id} className={`hover:bg-[#F5F7FA] ${entry.id === user?.id ? 'bg-[#E8EAF6]' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRankIcon(index + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0A6ED1] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {entry.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[#0B2447]">{entry.name}</div>
                        <div className="text-sm text-[#4A5568]">{entry.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-[#E8EAF6] text-[#0A6ED1] rounded-full text-sm">
                      {entry.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#0B2447] font-medium">
                    {entry.level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#FFD23F]" />
                      <span className="font-medium text-[#0B2447]">
                        {getXpValue(entry).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-[#2BA84A]" />
                      <span className="text-[#4A5568]">{entry.streakDays} days</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-[#0A6ED1]" />
                      <span className="text-[#4A5568]">{entry.badges}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-[#D6D9E0] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#4A5568] mb-2">No results found</h3>
          <p className="text-[#4A5568]">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};