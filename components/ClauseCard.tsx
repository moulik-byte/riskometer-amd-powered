'use client';

import { Card, CardContent } from '@/components/ui/card';

interface ClauseCardProps {
  title: string;
  content: string;
  severity?: number;
  type?: 'risk' | 'info' | 'success' | 'warning';
  showExpandable?: boolean;
}

export function ClauseCard({
  title,
  content,
  severity = 0,
  type = 'info',
  showExpandable = true,
}: ClauseCardProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'risk':
        return 'border-l-4 border-l-red-500 bg-red-500/5';
      case 'success':
        return 'border-l-4 border-l-green-500 bg-green-500/5';
      case 'warning':
        return 'border-l-4 border-l-yellow-500 bg-yellow-500/5';
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-500/5';
    }
  };

  const getSeverityColor = () => {
    if (severity < 25) return 'text-green-500';
    if (severity < 50) return 'text-yellow-500';
    if (severity < 75) return 'text-orange-500';
    return 'text-red-500';
  };

  const getSeverityBg = () => {
    if (severity < 25) return 'bg-green-500/10';
    if (severity < 50) return 'bg-yellow-500/10';
    if (severity < 75) return 'bg-orange-500/10';
    return 'bg-red-500/10';
  };

  return (
    <Card className={`${getTypeColor()} hover:shadow-md transition-shadow`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              {title}
              {severity > 0 && (
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${getSeverityBg()} ${getSeverityColor()}`}
                >
                  {Math.round(severity)}
                </span>
              )}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {content}
            </p>
          </div>
          {showExpandable && (
            <button
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
              aria-label="Expand clause"
            >
              →
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
