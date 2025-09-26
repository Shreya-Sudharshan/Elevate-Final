import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, Trophy, Clock, Star } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const dailyQuestions: Question[] = [
  {
    id: '1',
    question: 'What is our company\'s core mission?',
    options: [
      'To maximize profits for shareholders',
      'To empower businesses through innovative technology solutions',
      'To become the largest company in our industry',
      'To provide the cheapest services in the market'
    ],
    correctAnswer: 1,
    explanation: 'Our mission is to empower businesses through innovative technology solutions that drive growth and efficiency.'
  },
  {
    id: '2',
    question: 'How many vacation days do new employees receive per year?',
    options: ['10 days', '15 days', '20 days', '25 days'],
    correctAnswer: 1,
    explanation: 'New employees receive 15 vacation days per year, which increases to 20 days after 3 years of service.'
  },
  {
    id: '3',
    question: 'What is the minimum password length required by our security policy?',
    options: ['8 characters', '10 characters', '12 characters', '16 characters'],
    correctAnswer: 2,
    explanation: 'Our security policy requires passwords to be at least 12 characters long with a mix of uppercase, lowercase, numbers, and symbols.'
  }
];

export const DailyChallenge: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const triggerXpGain = useGameStore(state => state.triggerXpGain);
  const { user, updateUser } = useAuthStore();

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null && !showResult) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (!showResult) {
      setShowResult(true);
    }

    setTimeout(() => {
      if (currentQuestion < dailyQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz completed
        const correctAnswers = newAnswers.filter((answer, index) => 
          answer === dailyQuestions[index].correctAnswer
        ).length;
        
        const xpReward = correctAnswers * 10; // 10 XP per correct answer
        
        // Update user XP and level
        if (user) {
          const newXp = user.currentXp + xpReward;
          const newLevel = Math.max(Math.floor(newXp / 150) + 1, user.level);
          updateUser({ 
            currentXp: newXp,
            level: newLevel,
            streakDays: user.streakDays + 1
          });
          
          console.log('Daily Challenge XP Update:', { 
            oldXp: user.currentXp, 
            newXp, 
            xpReward, 
            correctAnswers 
          });
        }
        
        // Trigger XP gain animation
        triggerXpGain(xpReward);
        
        setCompleted(true);
      }
    }, showResult ? 2000 : 0);
  };

  const question = dailyQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const progress = ((currentQuestion + 1) / dailyQuestions.length) * 100;

  if (completed) {
    const correctAnswers = answers.filter((answer, index) => 
      answer === dailyQuestions[index].correctAnswer
    ).length;
    const score = Math.round((correctAnswers / dailyQuestions.length) * 100);

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#2BA84A] rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#0B2447] mb-4">Challenge Complete!</h1>
          <p className="text-[#4A5568] mb-8">Great job on today's daily challenge</p>
          
          <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-8 mb-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#0A6ED1] mb-2">{score}%</div>
                <div className="text-sm text-[#4A5568]">Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2BA84A] mb-2">{correctAnswers}/{dailyQuestions.length}</div>
                <div className="text-sm text-[#4A5568]">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#FFD23F] mb-2">+{correctAnswers * 10}</div>
                <div className="text-sm text-[#4A5568]">XP Earned</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[#0A6ED1] hover:bg-[#0859ab] text-white font-semibold rounded-2xl px-8 py-3 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#0A6ED1] hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#0B2447]">Daily Challenge</h1>
          <div className="flex items-center gap-2 text-[#4A5568]">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Question {currentQuestion + 1} of {dailyQuestions.length}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-[#E8EAF6] rounded-full h-2 mb-2">
          <div 
            className="bg-[#0A6ED1] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-[#4A5568]">Complete all questions to earn bonus XP!</p>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-8 mb-8">
        <h2 className="text-xl font-semibold text-[#0B2447] mb-6">{question.question}</h2>
        
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedAnswer === index
                  ? showResult
                    ? index === question.correctAnswer
                      ? 'border-[#2BA84A] bg-[#2BA84A]/10 text-[#2BA84A]'
                      : 'border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48]'
                    : 'border-[#0A6ED1] bg-[#0A6ED1]/10 text-[#0A6ED1]'
                  : showResult && index === question.correctAnswer
                    ? 'border-[#2BA84A] bg-[#2BA84A]/10 text-[#2BA84A]'
                    : 'border-[#D6D9E0] hover:border-[#0A6ED1] text-[#4A5568]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && (
                  <div>
                    {index === question.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-[#2BA84A]" />
                    ) : selectedAnswer === index ? (
                      <XCircle className="w-5 h-5 text-[#E11D48]" />
                    ) : null}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`p-4 rounded-xl mb-6 ${
            isCorrect ? 'bg-[#2BA84A]/10 border border-[#2BA84A]/20' : 'bg-[#E11D48]/10 border border-[#E11D48]/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-[#2BA84A]" />
              ) : (
                <XCircle className="w-5 h-5 text-[#E11D48]" />
              )}
              <span className={`font-medium ${isCorrect ? 'text-[#2BA84A]' : 'text-[#E11D48]'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
              {isCorrect && (
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="w-4 h-4 text-[#FFD23F]" />
                  <span className="text-sm font-medium text-[#FFD23F]">+10 XP</span>
                </div>
              )}
            </div>
            <p className="text-sm text-[#4A5568]">{question.explanation}</p>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className={`w-full font-semibold rounded-2xl px-6 py-3 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            selectedAnswer === null
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#0A6ED1] hover:bg-[#0859ab] text-white'
          }`}
        >
          {showResult && currentQuestion === dailyQuestions.length - 1 ? 'Complete Challenge' : 
           showResult ? 'Next Question' : 
           currentQuestion === dailyQuestions.length - 1 ? 'Show Final Result' : 'Show Result'}
        </button>
      </div>
    </div>
  );
};