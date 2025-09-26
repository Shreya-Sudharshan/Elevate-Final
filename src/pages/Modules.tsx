import React, { useEffect, useState } from "react";
import {
  Play,
  Clock,
  Star,
  BookOpen,
  Search,
  Award,
} from "lucide-react";
import { ProgressRing } from "../components/ui/ProgressRing";
import { useGameStore } from "../stores/gameStore";
import { useAuthStore } from "../stores/authStore";
import { useModuleStore, defaultModules } from "../stores/moduleStore";

export const Modules: React.FC = () => {
  const { modules, updateModule, resetModules } = useModuleStore();
  const effectiveModules = modules.length === 0 ? defaultModules : modules;
  // Seed defaults if storage is empty after hydration
  useEffect(() => {
    if (modules.length === 0) {
      resetModules();
    }
  }, [modules.length, resetModules]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const triggerXpGain = useGameStore((state) => state.triggerXpGain);
  const { user, updateUser } = useAuthStore();

  // Backend-fetched modules based on role with progress
  const [apiModules, setApiModules] = useState(effectiveModules);
  useEffect(() => {
    const role = user?.role || "";
    const controller = new AbortController();
    (async () => {
      try {
        const q = role ? `?role=${encodeURIComponent(role)}` : "";
        const res = await fetch(`http://localhost:3001/api/modules${q}`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.modules) && data.modules.length > 0) {
            let modules = data.modules;
            
            // Load user progress and merge with modules
            if (user?.id) {
              try {
                const progressRes = await fetch(`http://localhost:3001/api/user-modules/${user.id}`, { signal: controller.signal });
                if (progressRes.ok) {
                  const progressData = await progressRes.json();
                  if (progressData.success && Array.isArray(progressData.progress)) {
                    modules = modules.map((module: any) => {
                      const userProgress = progressData.progress.find((p: any) => p.module_id === module.id);
                      return userProgress ? { ...module, progress: userProgress.progress } : module;
                    });
                  }
                }
              } catch (e) {
                console.error('Failed to load user progress:', e);
              }
            }
            
            setApiModules(modules);
            return;
          }
        }
        setApiModules(effectiveModules);
      } catch {
        setApiModules(effectiveModules);
      }
    })();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, user?.id]);

  const saveProgress = async (moduleId: string, progress: number) => {
    try {
      if (!user?.id) return;
      await fetch("http://localhost:3001/api/user-modules/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, moduleId, progress, lastOpenedAt: new Date().toISOString() }),
      });
    } catch {}
  };

  const handleStartModule = (id: string) => {
    updateModule(id, { lastOpenedAt: new Date().toISOString().split("T")[0] });
    saveProgress(id, 0);
    setSelectedModule(id);
  };

  const handleCompleteModule = async (id: string) => {
    const source = apiModules.length ? apiModules : effectiveModules;
    const module = source.find((m) => m.id === id);
    if (!module) return;

    if (user) {
      const newXp = user.currentXp + module.xpReward;
      const newLevel = Math.floor(newXp / 150) + 1;
      updateUser({
        currentXp: newXp,
        level: Math.max(newLevel, user.level),
      });

      setTimeout(() => {
        triggerXpGain(module.xpReward);
      }, 100);
    }

    updateModule(id, { progress: 100 });
    setApiModules((prev) => prev.map((m) => (m.id === id ? { ...m, progress: 100 } : m)));
    await saveProgress(id, 100);
    setSelectedModule(null);
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = {
      1: "bg-green-50 text-green-700",
      2: "bg-yellow-50 text-yellow-700",
      3: "bg-red-50 text-red-700",
    };
    return colors[difficulty as 1 | 2 | 3];
  };

  const getDifficultyText = (difficulty: number) => {
    const texts = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" };
    return texts[difficulty as 1 | 2 | 3];
  };

  const userRole = user?.role || '';
  const source = apiModules.length ? apiModules : effectiveModules;
  const filteredModules = source.filter((m) => {
    // Role filtering
    const roleMatch = userRole === 'Business Analyst' ? m.id.startsWith('ba-') : 
                     userRole === 'Data Scientist' ? m.id.startsWith('ds-') :
                     userRole.includes('Business') ? m.id.startsWith('ba-') : m.id.startsWith('ds-');
    
    const matchesCategory =
      categoryFilter === "all" || m.category === categoryFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || m.difficulty.toString() === difficultyFilter;
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return roleMatch && matchesCategory && matchesDifficulty && matchesSearch;
  });

  if (selectedModule) {
    const module = source.find((m) => m.id === selectedModule)!;
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedModule(null)}
          className="text-[#0A6ED1] hover:underline mb-4"
        >
          ← Back to Modules
        </button>
        <h1 className="text-3xl font-bold text-[#0B2447] mb-2">
          {module.title}
        </h1>
        <p className="text-[#4A5568] mb-4">{module.description}</p>

        {/* Video */}
        <div className="aspect-video mb-6">
          <iframe
            src={module.videoUrl}
            title={module.title}
            className="w-full h-full rounded-xl"
            allowFullScreen
          />
        </div>

        <button
          onClick={() => handleCompleteModule(module.id)}
          disabled={module.progress === 100}
          className={`px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition ${
            module.progress === 100
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#0A6ED1] hover:bg-[#0859ab] text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          {module.progress === 100
            ? "Completed"
            : `Complete (+${module.xpReward} XP)`}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B2447] mb-2">
          Learning Modules
        </h1>
        <p className="text-[#4A5568]">
          Expand your skills with our comprehensive learning modules
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-[#4A5568] absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#D6D9E0] rounded-xl focus:ring-2 focus:ring-[#0A6ED1]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-[#D6D9E0] rounded-xl"
        >
          <option value="all">All Categories</option>
          {[...new Set(source.map((m) => m.category))].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-4 py-2 border border-[#D6D9E0] rounded-xl"
        >
          <option value="all">All Levels</option>
          <option value="1">Beginner</option>
          <option value="2">Intermediate</option>
          <option value="3">Advanced</option>
        </select>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl shadow overflow-hidden"
          >
            <div className="aspect-video">
              <img
                src={m.thumbnail}
                alt={m.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-[#0B2447] mb-2">{m.title}</h3>
              <p className="text-sm text-[#4A5568] mb-4 line-clamp-2">
                {m.description}
              </p>
              {m.progress > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#4A5568]">Progress</span>
                    <span className="text-[#0A6ED1]">{m.progress}%</span>
                  </div>
                  <div className="w-full bg-[#E8EAF6] rounded-full h-2">
                    <div
                      className="bg-[#0A6ED1] h-2 rounded-full"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              )}
              <button
                onClick={() => handleStartModule(m.id)}
                disabled={m.progress === 100}
                className={`w-full font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2 ${
                  m.progress === 100
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#0A6ED1] hover:bg-[#0859ab] text-white"
                }`}
              >
                <Play className="w-4 h-4" />
                {m.progress === 100
                  ? "Completed"
                  : m.progress > 0
                  ? "Continue"
                  : "Start Module"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
