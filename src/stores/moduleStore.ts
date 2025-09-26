
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  videoUrl: string;
  thumbnail: string;
}

export const defaultModules: Module[] = [
  // ===== Data Scientist: Programming Skills =====
  { id: "ds-python-101", title: "Python Basics", category: "Programming Skills (DS)", difficulty: 1, estimatedMinutes: 35, totalLessons: 6, xpReward: 120, description: "Syntax, variables, control flow, functions, and data structures.", tags: ["Python","Beginner","Programming"], progress: 0, videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc", thumbnail: "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ds-python-201", title: "Python for Data (Pandas/Numpy)", category: "Programming Skills (DS)", difficulty: 2, estimatedMinutes: 50, totalLessons: 8, xpReward: 160, description: "Pandas, NumPy, cleaning data, transforms, basic viz.", tags: ["Python","Pandas","NumPy"], progress: 0, videoUrl: "https://www.youtube.com/embed/vmEHCJofslg", thumbnail: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ds-sql-101", title: "SQL for Analytics", category: "Programming Skills (DS)", difficulty: 2, estimatedMinutes: 40, totalLessons: 7, xpReward: 150, description: "SELECT, JOIN, GROUP BY, window functions.", tags: ["SQL","Analytics","Databases"], progress: 0, videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY", thumbnail: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400" },

  // ===== Data Scientist: Technical Skills =====
  { id: "ds-stats-101", title: "Statistics Fundamentals", category: "Technical Skills (DS)", difficulty: 2, estimatedMinutes: 45, totalLessons: 8, xpReward: 150, description: "Distributions, CI, hypothesis testing, p-values.", tags: ["Statistics","Hypothesis Testing","Data Science"], progress: 0, videoUrl: "https://www.youtube.com/embed/xxpc-HPKN28", thumbnail: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ds-ml-101", title: "ML Basics (Scikit-learn)", category: "Technical Skills (DS)", difficulty: 2, estimatedMinutes: 60, totalLessons: 9, xpReward: 200, description: "Train/test split, baseline models, evaluation.", tags: ["ML","scikit-learn","Evaluation"], progress: 0, videoUrl: "https://www.youtube.com/embed/0Lt9w-BxKFQ", thumbnail: "https://images.pexels.com/photos/373076/pexels-photo-373076.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ds-ml-201", title: "Feature Engineering & Pipelines", category: "Technical Skills (DS)", difficulty: 3, estimatedMinutes: 70, totalLessons: 10, xpReward: 240, description: "Pipelines, transformers, cross-validation, leakage.", tags: ["ML","Pipelines","CV"], progress: 0, videoUrl: "https://www.youtube.com/embed/IvG7K4aK4-4", thumbnail: "https://images.pexels.com/photos/669622/pexels-photo-669622.jpeg?auto=compress&cs=tinysrgb&w=400" },

  // ===== Data Scientist: Communication Skills =====
  { id: "ds-comm-101", title: "Presenting Insights", category: "Communication Skills (DS)", difficulty: 1, estimatedMinutes: 30, totalLessons: 5, xpReward: 100, description: "Tell stories with data, simple charts, key messages.", tags: ["Communication","Storytelling","Charts"], progress: 0, videoUrl: "https://www.youtube.com/embed/pxd2b4d9i3E", thumbnail: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ds-comm-201", title: "Dashboards & Stakeholders", category: "Communication Skills (DS)", difficulty: 2, estimatedMinutes: 45, totalLessons: 7, xpReward: 150, description: "Build dashboards, prioritize stakeholder needs.", tags: ["Dashboard","Stakeholders"], progress: 0, videoUrl: "https://www.youtube.com/embed/9H5Z6v1sOjc", thumbnail: "https://images.pexels.com/photos/669621/pexels-photo-669621.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ds-comm-202", title: "Writing Clear Tech Docs", category: "Communication Skills (DS)", difficulty: 2, estimatedMinutes: 40, totalLessons: 6, xpReward: 140, description: "One-pagers, PRFAQs, runbooks for data/ML work.", tags: ["Docs","Writing","ML"], progress: 0, videoUrl: "https://www.youtube.com/embed/UtQ1N7yG9xo", thumbnail: "https://images.pexels.com/photos/374820/pexels-photo-374820.jpeg?auto=compress&cs=tinysrgb&w=400" },

  // ===== Business Analyst: Programming/Tools =====
  { id: "ba-excel-101", title: "Excel for Analysis", category: "Programming/Tools (BA)", difficulty: 1, estimatedMinutes: 30, totalLessons: 5, xpReward: 100, description: "Formulas, pivot tables, charts, cleaning data.", tags: ["Excel","Spreadsheets","Charts"], progress: 0, videoUrl: "https://www.youtube.com/embed/rwbho0CgEAE", thumbnail: "https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ba-sql-101", title: "SQL Basics (BA)", category: "Programming/Tools (BA)", difficulty: 1, estimatedMinutes: 35, totalLessons: 6, xpReward: 120, description: "SELECT/WHERE/ORDER BY for business questions.", tags: ["SQL","Business","Data"], progress: 0, videoUrl: "https://www.youtube.com/embed/27axs9dO7AE", thumbnail: "https://images.pexels.com/photos/267614/pexels-photo-267614.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ba-bi-101", title: "BI Dashboards (Power BI/Looker)", category: "Programming/Tools (BA)", difficulty: 2, estimatedMinutes: 45, totalLessons: 7, xpReward: 150, description: "Metrics, visuals, filters, publishing basics.", tags: ["BI","Dashboards","PowerBI"], progress: 0, videoUrl: "https://www.youtube.com/embed/AGrl-H87pRU", thumbnail: "https://images.pexels.com/photos/6476584/pexels-photo-6476584.jpeg?auto=compress&cs=tinysrgb&w=400" },

  // ===== Business Analyst: Technical/Analytics =====
  { id: "ba-stats-101", title: "Business Stats Fundamentals", category: "Technical/Analytics (BA)", difficulty: 1, estimatedMinutes: 40, totalLessons: 6, xpReward: 130, description: "Descriptive stats, sampling, confidence.", tags: ["Statistics","Business"], progress: 0, videoUrl: "https://www.youtube.com/embed/r5iy-Sv1S7E", thumbnail: "https://images.pexels.com/photos/669616/pexels-photo-669616.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ba-abtest-101", title: "A/B Testing Basics", category: "Technical/Analytics (BA)", difficulty: 2, estimatedMinutes: 40, totalLessons: 7, xpReward: 150, description: "Test design, metrics, pitfalls, interpreting results.", tags: ["Experimentation","A/B Testing","Product"], progress: 0, videoUrl: "https://www.youtube.com/embed/0CpK4QW9DjI", thumbnail: "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ba-seg-201", title: "Segmentation & Cohorts", category: "Technical/Analytics (BA)", difficulty: 2, estimatedMinutes: 50, totalLessons: 8, xpReward: 160, description: "User segments, funnels, retention/cohorts.", tags: ["Segmentation","Cohorts","Funnels"], progress: 0, videoUrl: "https://www.youtube.com/embed/2oixYvNysZg", thumbnail: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400" },

  // ===== Business Analyst: Communication/Business =====
  { id: "ba-comm-101", title: "Stakeholder Communication", category: "Communication/Business (BA)", difficulty: 1, estimatedMinutes: 30, totalLessons: 5, xpReward: 100, description: "Clear updates, risks, and decisions.", tags: ["Stakeholders","Communication"], progress: 0, videoUrl: "https://www.youtube.com/embed/Ad6Y9VvS5wQ", thumbnail: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ba-comm-201", title: "Writing PRDs & Analyses", category: "Communication/Business (BA)", difficulty: 2, estimatedMinutes: 45, totalLessons: 7, xpReward: 150, description: "Problem, context, requirements, success metrics.", tags: ["PRD","Writing","Analysis"], progress: 0, videoUrl: "https://www.youtube.com/embed/8h5VnYxqX2w", thumbnail: "https://images.pexels.com/photos/6476588/pexels-photo-6476588.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ba-story-201", title: "Data Storytelling for Biz", category: "Communication/Business (BA)", difficulty: 2, estimatedMinutes: 40, totalLessons: 6, xpReward: 140, description: "Narratives, visuals, executive summaries.", tags: ["Storytelling","Business","Slides"], progress: 0, videoUrl: "https://www.youtube.com/embed/G8d3n9VBfWY", thumbnail: "https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg?auto=compress&cs=tinysrgb&w=400" },

  // ===== Data Scientist: Extras =====
  { id: "ds-ml-202", title: "Model Evaluation & Metrics", category: "Technical Skills (DS)", difficulty: 2, estimatedMinutes: 55, totalLessons: 7, xpReward: 180, description: "ROC-AUC, PR curves, calibration, error analysis.", tags: ["ML","Metrics","Evaluation"], progress: 0, videoUrl: "https://www.youtube.com/embed/85dtiMz9tSo", thumbnail: "https://images.pexels.com/photos/669623/pexels-photo-669623.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ds-ml-203", title: "Tree-Based Models (XGBoost)", category: "Technical Skills (DS)", difficulty: 2, estimatedMinutes: 60, totalLessons: 8, xpReward: 200, description: "Boosting, tuning, feature importance, pitfalls.", tags: ["XGBoost","Trees","Tuning"], progress: 0, videoUrl: "https://www.youtube.com/embed/OzZ7E2yZ0bU", thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ds-ml-301", title: "Neural Nets Basics (Keras)", category: "Technical Skills (DS)", difficulty: 3, estimatedMinutes: 70, totalLessons: 9, xpReward: 240, description: "Dense nets, activations, loss, overfitting.", tags: ["Deep Learning","Keras","NN"], progress: 0, videoUrl: "https://www.youtube.com/embed/wQ8BIBpya2k", thumbnail: "https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ds-sql-201", title: "Advanced SQL for DS", category: "Programming Skills (DS)", difficulty: 2, estimatedMinutes: 55, totalLessons: 8, xpReward: 180, description: "CTEs, window funcs, optimization, anti-joins.", tags: ["SQL","Advanced","CTE"], progress: 0, videoUrl: "https://www.youtube.com/embed/7S_tz1z_5bA", thumbnail: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ds-prod-101", title: "ML in Production Basics", category: "Technical Skills (DS)", difficulty: 2, estimatedMinutes: 45, totalLessons: 6, xpReward: 150, description: "Data drift, monitoring, versioning, pipelines.", tags: ["MLOps","Production","Monitoring"], progress: 0, videoUrl: "https://www.youtube.com/embed/cH-5J3N1s2Q", thumbnail: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400" },

  // ===== Business Analyst: Extras =====
  { id: "ba-sql-201", title: "Analyst SQL Patterns", category: "Programming/Tools (BA)", difficulty: 2, estimatedMinutes: 45, totalLessons: 7, xpReward: 150, description: "Cohorts, retention, percentiles, deduping.", tags: ["SQL","Analytics","Patterns"], progress: 0, videoUrl: "https://www.youtube.com/embed/7S_tz1z_5bA", thumbnail: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ba-bi-201", title: "Power BI Fundamentals", category: "Programming/Tools (BA)", difficulty: 2, estimatedMinutes: 50, totalLessons: 8, xpReward: 160, description: "Data model, DAX, visuals, publishing.", tags: ["Power BI","DAX","Dashboards"], progress: 0, videoUrl: "https://www.youtube.com/embed/AGrl-H87pRU", thumbnail: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ba-look-201", title: "Looker Studio Dashboards", category: "Programming/Tools (BA)", difficulty: 2, estimatedMinutes: 40, totalLessons: 6, xpReward: 140, description: "Connectors, charts, filters, sharing.", tags: ["Looker","Dashboards","Viz"], progress: 0, videoUrl: "https://www.youtube.com/embed/5aH2Ppj6F5M", thumbnail: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { id: "ba-comm-202", title: "Executive Summaries", category: "Communication/Business (BA)", difficulty: 2, estimatedMinutes: 35, totalLessons: 5, xpReward: 120, description: "Structure insights for leadership decisions.", tags: ["Executive","Communication","Strategy"], progress: 0, videoUrl: "https://www.youtube.com/embed/IJd3QzYVb6M", thumbnail: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400" },
];

interface ModuleState {
  modules: Module[];
  updateModule: (id: string, updates: Partial<Module>) => void;
  resetModules: () => void;
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      modules: defaultModules,
      updateModule: (id, updates) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      resetModules: () => set({ modules: defaultModules }),
    }),
    {
      name: "module-storage",
      // Ensure we never hydrate an empty array; fall back to defaults
      merge: (persisted, current) => {
        const p = persisted as Partial<ModuleState> | undefined;
        const merged = { ...current, ...p } as ModuleState;
        if (!p || !Array.isArray(p.modules) || p.modules.length === 0) {
          merged.modules = current.modules;
        }
        return merged;
      },
    }
  )
);
