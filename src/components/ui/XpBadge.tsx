import React from 'react';
import { Star } from 'lucide-react';

interface XpBadgeProps {
  xp: number;
  level: number;
  className?: string;
}

export const XpBadge: React.FC<XpBadgeProps> = ({ xp, level, className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2 bg-[#0A6ED1]/10 text-[#0A6ED1] rounded-full px-3 py-1 font-medium ${className}`}>
      <Star className="w-4 h-4 fill-current" />
      {xp.toLocaleString()} XP · Lv {level}
    </span>
  );
};