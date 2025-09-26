import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Target, Award, BookOpen, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

const slides = [
  {
    title: 'Welcome to Elevate',
    content: 'Your AI-powered learning companion designed to accelerate your journey from day one to future leader.',
    icon: <Star className="w-16 h-16 text-[#FFD23F]" />,
    color: 'bg-gradient-to-br from-[#0A6ED1] to-[#00A0AF]',
  },
  {
    title: 'Your Journey Map',
    content: 'Start as a contributor, grow into a leader. Every step is mapped with personalized learning paths and clear milestones.',
    icon: <Target className="w-16 h-16 text-[#00A0AF]" />,
    color: 'bg-gradient-to-br from-[#00A0AF] to-[#0A6ED1]',
  },
  {
    title: 'Earn XP & Unlock Achievements',
    content: 'Stay motivated with our gamification system. Earn XP, maintain streaks, and unlock badges as you progress.',
    icon: <Award className="w-16 h-16 text-[#FFD23F]" />,
    color: 'bg-gradient-to-br from-[#FFD23F] to-[#F59E0B]',
  },
  {
    title: 'Interactive Learning Modules',
    content: 'Engage with videos, articles, quizzes, and flashcards. Take on daily challenges to keep your skills sharp.',
    icon: <BookOpen className="w-16 h-16 text-[#0A6ED1]" />,
    color: 'bg-gradient-to-br from-[#E8EAF6] to-[#0A6ED1]',
  },
  {
    title: 'Meet Your AI Career Coach',
    content: 'Get personalized guidance, ask questions, and receive recommendations tailored to your learning style and goals.',
    icon: <MessageCircle className="w-16 h-16 text-[#00A0AF]" />,
    color: 'bg-gradient-to-br from-[#0B2447] to-[#0A6ED1]',
  },
];

export const IntroSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const updateUser = useAuthStore(state => state.updateUser);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleGetStarted = () => {
    updateUser({ introCompleted: true });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className={`w-full ${slides[currentSlide].color} flex items-center justify-center p-8`}
        >
          <div className="max-w-2xl text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8 flex justify-center"
            >
              {slides[currentSlide].icon}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              {slides[currentSlide].title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-12 leading-relaxed opacity-90"
            >
              {slides[currentSlide].content}
            </motion.p>

            {/* Navigation */}
            <div className="flex items-center justify-between max-w-md mx-auto">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Slide indicators */}
              <div className="flex space-x-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>

              {currentSlide === slides.length - 1 ? (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={handleGetStarted}
                  className="bg-white text-[#0A6ED1] font-semibold px-6 py-3 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  Start my journey
                </motion.button>
              ) : (
                <button
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};