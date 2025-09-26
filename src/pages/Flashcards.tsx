import React, { useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Star, Brain, Filter, Search, Check, X } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { useAuthStore } from '../stores/authStore';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 1 | 2 | 3;
  tags: string[];
}

interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  category: string;
  cards: Flashcard[];
  xpReward: number;
}

const mockFlashcardSets: FlashcardSet[] = [
  {
    id: '1',
    title: 'Company Policies & Procedures',
    description: 'Essential company policies every employee should know',
    category: 'HR',
    xpReward: 50,
    cards: [
      {
        id: '1-1',
        question: 'What is our company\'s policy on remote work?',
        answer: 'Employees can work remotely up to 3 days per week with manager approval. Full remote work requires special arrangement.',
        category: 'HR',
        difficulty: 1,
        tags: ['remote work', 'policy']
      },
      {
        id: '1-2',
        question: 'How many vacation days do new employees get?',
        answer: 'New employees receive 15 vacation days per year, increasing to 20 days after 3 years of service.',
        category: 'HR',
        difficulty: 1,
        tags: ['vacation', 'benefits']
      },
      {
        id: '1-3',
        question: 'What is the process for requesting time off?',
        answer: 'Submit requests through the HR portal at least 2 weeks in advance. Manager approval is required for all time off.',
        category: 'HR',
        difficulty: 1,
        tags: ['time off', 'process']
      }
    ]
  },
  {
    id: '2',
    title: 'Security Best Practices',
    description: 'Critical security knowledge for protecting company data',
    category: 'Security',
    xpReward: 75,
    cards: [
      {
        id: '2-1',
        question: 'What makes a strong password?',
        answer: 'At least 12 characters with a mix of uppercase, lowercase, numbers, and symbols. Use unique passwords for each account.',
        category: 'Security',
        difficulty: 2,
        tags: ['password', 'security']
      },
      {
        id: '2-2',
        question: 'How should you handle suspicious emails?',
        answer: 'Never click links or download attachments. Report to IT security team immediately. When in doubt, verify sender through alternate communication.',
        category: 'Security',
        difficulty: 2,
        tags: ['phishing', 'email']
      },
      {
        id: '2-3',
        question: 'What is two-factor authentication (2FA)?',
        answer: 'An extra security layer requiring two forms of verification: something you know (password) and something you have (phone/token).',
        category: 'Security',
        difficulty: 2,
        tags: ['2FA', 'authentication']
      }
    ]
  },
  {
    id: '3',
    title: 'Product Knowledge',
    description: 'Key facts about our products and services',
    category: 'Product',
    xpReward: 60,
    cards: [
      {
        id: '3-1',
        question: 'What is our main product offering?',
        answer: 'We provide cloud-based enterprise software solutions that help businesses streamline their operations and improve efficiency.',
        category: 'Product',
        difficulty: 1,
        tags: ['product', 'overview']
      },
      {
        id: '3-2',
        question: 'Who are our primary target customers?',
        answer: 'Mid to large-size enterprises (500+ employees) in manufacturing, healthcare, and financial services sectors.',
        category: 'Product',
        difficulty: 2,
        tags: ['customers', 'target market']
      },
      {
        id: '3-3',
        question: 'What sets us apart from competitors?',
        answer: 'Our AI-powered analytics, 99.9% uptime guarantee, and dedicated customer success team provide superior value and reliability.',
        category: 'Product',
        difficulty: 2,
        tags: ['competitive advantage', 'differentiation']
      }
    ]
  },
  {
    id: '4',
    title: 'Leadership Fundamentals',
    description: 'Essential leadership skills and principles for career growth',
    category: 'Leadership',
    xpReward: 80,
    cards: [
      {
        id: '4-1',
        question: 'What are the key qualities of an effective leader?',
        answer: 'Effective leaders demonstrate integrity, empathy, clear communication, decision-making skills, and the ability to inspire and motivate others toward common goals.',
        category: 'Leadership',
        difficulty: 2,
        tags: ['leadership', 'qualities']
      },
      {
        id: '4-2',
        question: 'How do you handle conflict within a team?',
        answer: 'Address conflicts early, listen to all parties, focus on the issue not personalities, find common ground, and work collaboratively toward a solution that benefits the team.',
        category: 'Leadership',
        difficulty: 2,
        tags: ['conflict resolution', 'team management']
      },
      {
        id: '4-3',
        question: 'What is the difference between management and leadership?',
        answer: 'Management focuses on processes, systems, and maintaining status quo. Leadership focuses on vision, inspiration, change, and developing people to reach their potential.',
        category: 'Leadership',
        difficulty: 2,
        tags: ['management', 'leadership', 'difference']
      },
      {
        id: '4-4',
        question: 'How do you motivate team members?',
        answer: 'Understand individual motivations, provide clear goals, offer recognition, create growth opportunities, give autonomy, and connect work to meaningful purpose.',
        category: 'Leadership',
        difficulty: 2,
        tags: ['motivation', 'team building']
      }
    ]
  },
  {
    id: '5',
    title: 'Communication Excellence',
    description: 'Master professional communication skills for workplace success',
    category: 'Communication',
    xpReward: 65,
    cards: [
      {
        id: '5-1',
        question: 'What are the key elements of effective communication?',
        answer: 'Clear message, appropriate medium, active listening, empathy, feedback, non-verbal awareness, and adapting style to your audience.',
        category: 'Communication',
        difficulty: 1,
        tags: ['communication', 'effectiveness']
      },
      {
        id: '5-2',
        question: 'How do you give constructive feedback?',
        answer: 'Be specific, focus on behavior not personality, use "I" statements, provide examples, suggest improvements, and create a safe environment for dialogue.',
        category: 'Communication',
        difficulty: 2,
        tags: ['feedback', 'constructive']
      },
      {
        id: '5-3',
        question: 'What is active listening?',
        answer: 'Fully concentrating on the speaker, understanding their message, responding thoughtfully, and remembering key points without interrupting or judging.',
        category: 'Communication',
        difficulty: 1,
        tags: ['listening', 'active listening']
      },
      {
        id: '5-4',
        question: 'How do you handle difficult conversations?',
        answer: 'Prepare beforehand, stay calm, listen actively, acknowledge emotions, focus on solutions, be honest but respectful, and follow up afterward.',
        category: 'Communication',
        difficulty: 3,
        tags: ['difficult conversations', 'conflict']
      }
    ]
  },
  {
    id: '6',
    title: 'Time Management & Productivity',
    description: 'Optimize your time and boost productivity in the workplace',
    category: 'Productivity',
    xpReward: 55,
    cards: [
      {
        id: '6-1',
        question: 'What is the Eisenhower Matrix?',
        answer: 'A prioritization tool that categorizes tasks into four quadrants: Urgent & Important (Do), Important & Not Urgent (Schedule), Urgent & Not Important (Delegate), Neither (Eliminate).',
        category: 'Productivity',
        difficulty: 2,
        tags: ['prioritization', 'eisenhower matrix']
      },
      {
        id: '6-2',
        question: 'How do you avoid procrastination?',
        answer: 'Break large tasks into smaller steps, set deadlines, eliminate distractions, use time-blocking, reward progress, and understand your peak energy hours.',
        category: 'Productivity',
        difficulty: 2,
        tags: ['procrastination', 'time management']
      },
      {
        id: '6-3',
        question: 'What is the Pomodoro Technique?',
        answer: 'A time management method using 25-minute focused work intervals followed by 5-minute breaks, with longer breaks after every 4 cycles.',
        category: 'Productivity',
        difficulty: 1,
        tags: ['pomodoro', 'focus']
      },
      {
        id: '6-4',
        question: 'How do you manage multiple priorities?',
        answer: 'List all tasks, assess urgency and importance, communicate with stakeholders, delegate when possible, and regularly review and adjust priorities.',
        category: 'Productivity',
        difficulty: 2,
        tags: ['priorities', 'multitasking']
      }
    ]
  }
];

export const Flashcards: React.FC = () => {
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set());
  const [correctCards, setCorrectCards] = useState<Set<string>>(new Set());
  const [incorrectCards, setIncorrectCards] = useState<Set<string>>(new Set());
  const [showRecap, setShowRecap] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const triggerXpGain = useGameStore(state => state.triggerXpGain);
  const { user, updateUser } = useAuthStore();

  const handleSetComplete = () => {
    if (selectedSet) {
      // Update user XP and level
      if (user) {
        const newXp = user.currentXp + selectedSet.xpReward;
        const newLevel = Math.floor(newXp / 150) + 1;
        updateUser({ 
          currentXp: newXp,
          level: Math.max(newLevel, user.level)
        });
        
        // Trigger XP gain animation after state update
        setTimeout(() => {
          triggerXpGain(selectedSet.xpReward);
        }, 100);
      }
      
      // Show recap instead of going back to sets
      setShowRecap(true);
    }
  };

  const handleBackToSets = () => {
    setSelectedSet(null);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCompletedCards(new Set());
    setCorrectCards(new Set());
    setIncorrectCards(new Set());
    setShowRecap(false);
  };

  const nextCard = () => {
    if (selectedSet && currentCardIndex < selectedSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const markCardComplete = (isCorrect: boolean) => {
    if (selectedSet) {
      const cardId = selectedSet.cards[currentCardIndex].id;
      setCompletedCards(prev => new Set([...prev, cardId]));
      
      if (isCorrect) {
        setCorrectCards(prev => new Set([...prev, cardId]));
      } else {
        setIncorrectCards(prev => new Set([...prev, cardId]));
      }
      
      // Check if all cards are completed
      const allCardsCompleted = selectedSet.cards.every(card => 
        [...completedCards, cardId].includes(card.id)
      );
      
      if (allCardsCompleted) {
        // All cards completed, show recap
        setTimeout(() => {
          handleSetComplete();
        }, 500); // Small delay to show the button click feedback
      }
    }
  };

  const filteredSets = mockFlashcardSets.filter(set => {
    const matchesCategory = categoryFilter === 'all' || set.category === categoryFilter;
    const matchesSearch = set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         set.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [...new Set(mockFlashcardSets.map(s => s.category))];

  if (selectedSet && showRecap) {
    const correctCardsList = selectedSet.cards.filter(card => correctCards.has(card.id));
    const incorrectCardsList = selectedSet.cards.filter(card => incorrectCards.has(card.id));

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0B2447] mb-2">
            Recap for {selectedSet.title}
          </h1>
        </div>

        <div className="space-y-8">
          {/* Things you got right */}
          {correctCardsList.length > 0 && (
            <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Check className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-green-600">Things you got right</h2>
              </div>
              <ul className="space-y-3">
                {correctCardsList.map((card) => (
                  <li key={card.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-[#0B2447]">{card.question} — {card.answer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Things to review */}
          {incorrectCardsList.length > 0 && (
            <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <X className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-red-600">Things to review</h2>
              </div>
              <ul className="space-y-3">
                {incorrectCardsList.map((card) => (
                  <li key={card.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-[#0B2447]">{card.question} — {card.answer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Back to Flashcard Sets button */}
          <div className="text-center">
            <button
              onClick={handleBackToSets}
              className="bg-[#0A6ED1] hover:bg-[#0859ab] text-white font-medium py-3 px-8 rounded-xl transition-colors"
            >
              Back to Flashcard Sets
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedSet) {
    const currentCard = selectedSet.cards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / selectedSet.cards.length) * 100;

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setSelectedSet(null)}
            className="text-[#0A6ED1] hover:underline mb-4"
          >
            ← Back to Flashcard Sets
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0B2447] mb-2">{selectedSet.title}</h1>
              <p className="text-[#4A5568]">Card {currentCardIndex + 1} of {selectedSet.cards.length}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#4A5568] mb-1">Progress</div>
              <div className="w-32 bg-[#E8EAF6] rounded-full h-2">
                <div 
                  className="bg-[#0A6ED1] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <div 
            className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-8 min-h-[300px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="text-center">
              {!isFlipped ? (
                <>
                  <Brain className="w-12 h-12 text-[#0A6ED1] mx-auto mb-4" />
                  <p className="text-lg text-[#4A5568] leading-relaxed">{currentCard.question}</p>
                  <p className="text-sm text-[#4A5568] mt-6 opacity-75">Click to reveal answer</p>
                </>
              ) : (
                <>
                  <Star className="w-12 h-12 text-[#FFD23F] mx-auto mb-4" />
                  <p className="text-lg text-[#4A5568] leading-relaxed">{currentCard.answer}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className="flex items-center gap-2 px-4 py-2 border border-[#D6D9E0] rounded-xl hover:border-[#0A6ED1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-2 px-4 py-2 bg-[#E8EAF6] text-[#0A6ED1] rounded-xl hover:bg-[#0A6ED1] hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Flip Card
            </button>

            {isFlipped && !completedCards.has(currentCard.id) && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => markCardComplete(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2BA84A] text-white rounded-xl hover:bg-[#228B3A] transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Got it
                </button>
                <button
                  onClick={() => markCardComplete(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#E11D48] text-white rounded-xl hover:bg-[#C41E3A] transition-colors"
                >
                  <X className="w-4 h-4" />
                  Review Again
                </button>
              </div>
            )}
            
            {completedCards.has(currentCard.id) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#4A5568] flex items-center gap-2">
                  {correctCards.has(currentCard.id) ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Completed
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-600" />
                      Marked for review
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={nextCard}
            disabled={currentCardIndex === selectedSet.cards.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-[#0A6ED1] text-white rounded-xl hover:bg-[#0859ab] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card Tags */}
        <div className="mt-6 text-center">
          <div className="flex justify-center gap-2 flex-wrap">
            {currentCard.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-[#E8EAF6] text-[#0A6ED1] rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B2447] mb-2">Flashcards</h1>
        <p className="text-[#4A5568]">Test your knowledge with interactive flashcard sets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
          <div className="text-2xl font-bold text-[#0B2447]">{mockFlashcardSets.length}</div>
          <div className="text-sm text-[#4A5568]">Flashcard Sets</div>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
          <div className="text-2xl font-bold text-[#0A6ED1]">{mockFlashcardSets.reduce((sum, set) => sum + set.cards.length, 0)}</div>
          <div className="text-sm text-[#4A5568]">Total Cards</div>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
          <div className="text-2xl font-bold text-[#FFD23F]">{mockFlashcardSets.reduce((sum, set) => sum + set.xpReward, 0)}</div>
          <div className="text-sm text-[#4A5568]">Total XP Available</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-[#4A5568] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search flashcard sets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#D6D9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
              />
            </div>
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

      {/* Flashcard Sets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSets.map((set) => (
          <div key={set.id} className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-[#E8EAF6] text-[#0A6ED1] rounded-full text-xs font-medium">
                {set.category}
              </span>
              <span className="text-xs text-[#4A5568]">{set.cards.length} cards</span>
            </div>
            
            <h3 className="font-semibold text-[#0B2447] mb-2">{set.title}</h3>
            <p className="text-sm text-[#4A5568] mb-4">{set.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#4A5568] flex items-center gap-1">
                <Star className="w-4 h-4" />
                +{set.xpReward} XP
              </span>
              <button
                onClick={() => setSelectedSet(set)}
                className="bg-[#0A6ED1] hover:bg-[#0859ab] text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                Start Set
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSets.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-[#D6D9E0] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#4A5568] mb-2">No flashcard sets found</h3>
          <p className="text-[#4A5568]">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};