import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    employeeId: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employeeData, setEmployeeData] = useState<any>(null);
  
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const roleOptions = ['Data Scientist', 'Business Analyst'];


  // Mock employee lookup
  const mockEmployeeData: Record<string, any> = {
    'E0058': { department: 'Engineering', role: 'Software Engineer II', manager: 'A. Chen' },
    'E0059': { department: 'Product', role: 'Product Manager I', manager: 'S. Kim' },
    'E0060': { department: 'Design', role: 'UX Designer I', manager: 'M. Rodriguez' },
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Employee ID lookup
    if (field === 'employeeId' && value.length >= 5) {
      const data = mockEmployeeData[value];
      setEmployeeData(data || null);
    }
  };

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const isPasswordValid = passwordValidation.length && passwordValidation.number && passwordValidation.symbol;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Registration failed');
        return;
      }

      const u = data.user;
      setUser({
        id: u.id,
        email: u.email,
        firstName: u.first_name,
        lastName: u.last_name,
        employeeId: u.employee_id,
        department: u.department,
        role: (formData.role || u.role),
        managerName: u.manager_name,
        startDate: u.start_date,
        level: u.level,
        currentXp: u.current_xp,
        streakDays: u.streak_days,
        introCompleted: u.intro_completed,
      });

      navigate('/onboarding/intro');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A6ED1] to-[#00A0AF] flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#0A6ED1]">E</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Elevate</h1>
          <p className="text-[#E8EAF6]">Create your account and start your journey</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <p className="text-rose-700 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A5568] mb-2">
                  First name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#D6D9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                  placeholder="Jane"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#4A5568] mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#D6D9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A5568] mb-2">
                Employee ID
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#D6D9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                placeholder="E0058"
              />
              {employeeData && (
                <div className="mt-3 p-3 bg-[#E8EAF6] rounded-lg">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-[#0A6ED1]/10 text-[#0A6ED1] rounded-full text-sm">
                      {employeeData.department}
                    </span>
                    <span className="px-2 py-1 bg-[#00A0AF]/10 text-[#00A0AF] rounded-full text-sm">
                      {employeeData.role}
                    </span>
                    <span className="px-2 py-1 bg-[#4A5568]/10 text-[#4A5568] rounded-full text-sm">
                      Manager: {employeeData.manager}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A5568] mb-2">
                Email address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#D6D9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                placeholder="jane.doe@acme.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A5568] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#D6D9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent pr-12"
                  placeholder="Create a secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A5568] hover:text-[#0A6ED1]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidation.length ? 
                      <Check className="w-4 h-4 text-green-500" /> : 
                      <X className="w-4 h-4 text-red-500" />
                    }
                    <span className={passwordValidation.length ? 'text-green-700' : 'text-red-700'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidation.number ? 
                      <Check className="w-4 h-4 text-green-500" /> : 
                      <X className="w-4 h-4 text-red-500" />
                    }
                    <span className={passwordValidation.number ? 'text-green-700' : 'text-red-700'}>
                      At least 1 number
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidation.symbol ? 
                      <Check className="w-4 h-4 text-green-500" /> : 
                      <X className="w-4 h-4 text-red-500" />
                    }
                    <span className={passwordValidation.symbol ? 'text-green-700' : 'text-red-700'}>
                      At least 1 symbol
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[#4A5568] mb-2">
                Job Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#D6D9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent bg-white"
              >
                <option value="" disabled>
                  Select your role
                </option>
                {roleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#4A5568] mt-1">
                This determines which learning modules you'll see
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full bg-[#0A6ED1] hover:bg-[#0859ab] text-white font-semibold rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A6ED1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#4A5568]">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-[#0A6ED1] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};