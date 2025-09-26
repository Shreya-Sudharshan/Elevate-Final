import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';

export const XpGainNotification: React.FC = () => {
  const { showXpGain, xpGained } = useGameStore();

  return (
    <AnimatePresence>
      {showXpGain && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-[#0A6ED1] text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-semibold">+{xpGained} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};