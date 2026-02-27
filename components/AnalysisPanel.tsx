'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClauseCard } from './ClauseCard';

interface AnalysisPanelProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    content: string;
    severity?: number;
  }>;
  isEmpty?: boolean;
  emptyText?: string;
  icon?: React.ReactNode;
}

export function AnalysisPanel({
  title,
  items,
  isEmpty = false,
  emptyText = 'No items found',
  icon,
}: AnalysisPanelProps) {
  return (
    <Card className="bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <CardTitle className="text-base">{title}</CardTitle>
          {items.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {items.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty || items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">{emptyText}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <ClauseCard
                key={item.id || index}
                title={item.title}
                content={item.content}
                severity={item.severity}
                type={item.severity && item.severity > 70 ? 'risk' : item.severity && item.severity > 40 ? 'warning' : 'info'}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
