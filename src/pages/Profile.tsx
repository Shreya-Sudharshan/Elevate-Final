import React, { useState } from 'react';
import { User, Mail, Building, Calendar, Star, Trophy, Flame, Edit2, Save, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { ProgressRing } from '../components/ui/ProgressRing';
import { XpBadge } from '../components/ui/XpBadge';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  if (!user) return null;

  const nextLevelXp = (user.level + 1) * 150;
  const progressToNextLevel = (user.currentXp / nextLevelXp) * 100;

  const handleSave = () => {
    updateUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Current Level', value: user.level, icon: Star, color: 'text-[#0A6ED1]' },
    { label: 'Total XP', value: user.currentXp.toLocaleString(), icon: Trophy, color: 'text-[#FFD23F]' },
    { label: 'Learning Streak', value: `${user.streakDays} days`, icon: Flame, color: 'text-[#F59E0B]' },
    { label: 'Start Date', value: new Date(user.startDate).toLocaleDateString(), icon: Calendar, color: 'text-[#2BA84A]' },
  ];

  const recentAchievements = [
    { name: 'First Steps', description: 'Completed first learning module', earnedAt: '2024-12-10', icon: '🎯' },
    { name: 'Week Warrior', description: 'Maintained 7-day learning streak', earnedAt: '2024-12-11', icon: '🔥' },
    { name: 'Knowledge Seeker', description: 'Completed 5 learning modules', earnedAt: '2024-12-12', icon: '📚' },
  ];

  const learningProgress = [
    { module: 'Company Values & Culture', progress: 75, category: 'Company Values' },
    { module: 'Information Security Basics', progress: 100, category: 'Compliance' },
    { module: 'Product Overview', progress: 25, category: 'Product' },
    { module: 'Communication Skills', progress: 50, category: 'Soft Skills' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B2447] mb-2">Profile</h1>
        <p className="text-[#4A5568]">Manage your account and track your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#0B2447]">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-[#0A6ED1] hover:underline"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#0A6ED1] text-white px-3 py-1 rounded-lg hover:bg-[#0859ab]"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 text-[#4A5568] px-3 py-1 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-[#0A6ED1] rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4A5568] mb-1">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#D6D9E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]"
                      />
                    ) : (
                      <p className="text-[#0B2447] font-medium">{user.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A5568] mb-1">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#D6D9E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]"
                      />
                    ) : (
                      <p className="text-[#0B2447] font-medium">{user.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4A5568] mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#D6D9E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]"
                    />
                  ) : (
                    <p className="text-[#0B2447] font-medium">{user.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4A5568] mb-1">Employee ID</label>
                    <p className="text-[#0B2447] font-medium">{user.employeeId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A5568] mb-1">Department</label>
                    <p className="text-[#0B2447] font-medium">{user.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4A5568] mb-1">Role</label>
                    <p className="text-[#0B2447] font-medium">{user.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A5568] mb-1">Manager</label>
                    <p className="text-[#0B2447] font-medium">{user.managerName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
            <h2 className="text-xl font-semibold text-[#0B2447] mb-6">Learning Progress</h2>
            <div className="space-y-4">
              {learningProgress.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#0B2447] mb-1">{item.module}</h4>
                    <p className="text-sm text-[#4A5568]">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <div className="w-full bg-[#E8EAF6] rounded-full h-2">
                        <div 
                          className="bg-[#0A6ED1] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#0A6ED1] w-12 text-right">
                      {item.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
            <h2 className="text-xl font-semibold text-[#0B2447] mb-6">Recent Achievements</h2>
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-[#F5F7FA] rounded-xl">
                  <div className="w-12 h-12 bg-[#2BA84A]/10 rounded-xl flex items-center justify-center text-2xl">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#0B2447]">{achievement.name}</h4>
                    <p className="text-sm text-[#4A5568]">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#4A5568]">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Level Progress */}
          <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6 text-center">
            <h3 className="font-semibold text-[#0B2447] mb-4">Level Progress</h3>
            <ProgressRing progress={progressToNextLevel} size={120} className="mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0A6ED1]">{user.level}</div>
                <div className="text-xs text-[#4A5568]">Level</div>
              </div>
            </ProgressRing>
            <p className="text-sm text-[#4A5568] mb-2">
              {user.currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
            </p>
            <XpBadge xp={user.currentXp} level={user.level} className="mx-auto" />
          </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-[#4A5568]">{stat.label}</p>
                      <p className="font-semibold text-[#0B2447]">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};