'use client';

import { useEffect, useState } from 'react';

interface RiskMeterProps {
  score: number;
  level: 'safe' | 'low' | 'medium' | 'high';
  animated?: boolean;
}

export function RiskMeter({ score, level, animated = true }: RiskMeterProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    let start = 0;
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayScore(Math.round(progress * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score, animated]);

  const getColor = () => {
    switch (level) {
      case 'safe':
        return 'rgb(34, 197, 94)';
      case 'low':
        return 'rgb(234, 179, 8)';
      case 'medium':
        return 'rgb(249, 115, 22)';
      case 'high':
        return 'rgb(239, 68, 68)';
      default:
        return 'rgb(107, 114, 128)';
    }
  };

  const getLabel = () => {
    switch (level) {
      case 'safe':
        return 'Safe';
      case 'low':
        return 'Low Risk';
      case 'medium':
        return 'Medium Risk';
      case 'high':
        return 'High Risk';
      default:
        return 'Unknown';
    }
  };

  const rotation = (displayScore / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-48 h-24">
        {/* Background arc */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 100"
          style={{ overflow: 'visible' }}
        >
          {/* Gray background arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            stroke="rgb(64, 64, 64)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Colored progress arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            stroke={getColor()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${(displayScore / 100) * 282.7} 282.7`}
            style={{ transition: 'stroke-dasharray 0.1s ease-out' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold" style={{ color: getColor() }}>
            {displayScore}
          </div>
          <div className="text-xs text-muted-foreground font-medium">/ 100</div>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <div
          className="text-lg font-semibold"
          style={{ color: getColor() }}
        >
          {getLabel()}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Risk Assessment Score
        </div>
      </div>

      {/* Risk indicators */}
      <div className="flex gap-2 mt-2">
        {['safe', 'low', 'medium', 'high'].map((l) => (
          <div
            key={l}
            className={`w-2 h-2 rounded-full transition-opacity ${
              l === level ? 'opacity-100' : 'opacity-20'
            }`}
            style={{
              backgroundColor:
                l === 'safe'
                  ? 'rgb(34, 197, 94)'
                  : l === 'low'
                  ? 'rgb(234, 179, 8)'
                  : l === 'medium'
                  ? 'rgb(249, 115, 22)'
                  : 'rgb(239, 68, 68)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
