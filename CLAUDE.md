# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Frontend (Vite + React + TypeScript):**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

**Backend (Node.js + Express):**
```bash
cd backend
node server.js   # Start backend server (port 3001)
```

## Architecture Overview

This is a full-stack employee onboarding and career development platform with gamification features:

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM with protected routes
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS with custom components
- **API**: TanStack Query for server state management

### Key Frontend Stores (Zustand)
- `authStore`: User authentication and profile state
- `gameStore`: XP, badges, levels, and gamification features
- `taskStore`: Task management and completion tracking
- `moduleStore`: Learning modules and progress

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI GPT-4 with function calling for career coaching
- **Authentication**: Custom auth via Supabase

### Database Schema (Supabase)
Key tables:
- `users`: Employee profiles, XP, levels, roles, departments
- `tasks`: Onboarding tasks and assignments
- `modules`: Learning content and progress tracking

## Application Structure

### Frontend Pages
- **Authentication**: Login/Register with employee validation
- **Onboarding**: Multi-step intro slides for new employees
- **Dashboard**: Main hub with progress overview and AI coach
- **Checklist**: Task management and completion tracking
- **Modules**: Learning content and skill development
- **Profile**: User stats, achievements, and gamification elements

### Key Components
- `AppShell`: Main layout with navigation and protected routing
- `ChatBot`: AI-powered career coach with OpenAI integration
- `XpGainNotification`: Gamification feedback system
- Authentication forms with role-based registration

### AI Career Coach Features
The backend includes a sophisticated AI agent with function calling capabilities:
- Performance trend analysis
- Skill gap assessment
- Learning plan generation
- Peer benchmarking
- Career trajectory prediction
- Action plan creation

## Development Notes

### Environment Setup
Frontend requires:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Backend requires:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### API Proxy
Vite proxies `/api/*` requests to `localhost:3001` for backend communication.

### State Persistence
Game state (XP, levels) persists to localStorage via Zustand middleware.

### Routing Strategy
- Unauthenticated users → Login/Register
- Authenticated without intro → Onboarding slides
- Full access after intro completion
- Protected routes wrapped in AppShell

### Gamification System
- XP earned from task completion
- Visual feedback with confetti animations
- Level progression and badge unlocking
- Progress tracking across learning modules