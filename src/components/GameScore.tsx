
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Zap } from 'lucide-react';

interface GameScoreProps {
  level: number;
  score: number;
  analysisCount: number;
}

const GameScore: React.FC<GameScoreProps> = ({ level, score, analysisCount }) => {
  const getLevelBadge = (level: number) => {
    if (level >= 10) return { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (level >= 5) return { icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/20' };
    return { icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20' };
  };

  const levelInfo = getLevelBadge(level);
  const IconComponent = levelInfo.icon;

  return (
    <div className="flex items-center space-x-3">
      <Badge 
        className={`${levelInfo.bg} ${levelInfo.color} border-0 px-3 py-1`}
      >
        <IconComponent className="h-3 w-3 mr-1" />
        Nível {level}
      </Badge>
      
      <div className="hidden sm:flex items-center space-x-2 text-sm">
        <span className="text-gray-400">Score:</span>
        <span className="text-neon-blue font-semibold">{score.toLocaleString()}</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-2 text-sm">
        <span className="text-gray-400">Análises:</span>
        <span className="text-white font-semibold">{analysisCount}</span>
      </div>
    </div>
  );
};

export default GameScore;
