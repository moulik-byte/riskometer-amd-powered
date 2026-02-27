'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparisonDiffProps {
  similarities: string[];
  differences: string[];
  contract1Name: string;
  contract2Name: string;
}

export function ComparisonDiff({
  similarities,
  differences,
  contract1Name,
  contract2Name,
}: ComparisonDiffProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Similarities */}
      <Card className="bg-green-500/5 border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-green-500">Similarities</CardTitle>
        </CardHeader>
        <CardContent>
          {similarities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No similarities found</p>
          ) : (
            <ul className="space-y-2">
              {similarities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Differences */}
      <Card className="bg-orange-500/5 border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-orange-500">Differences</CardTitle>
        </CardHeader>
        <CardContent>
          {differences.length === 0 ? (
            <p className="text-sm text-muted-foreground">No differences found</p>
          ) : (
            <ul className="space-y-2">
              {differences.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-orange-500 font-bold flex-shrink-0">!</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Side by side comparison header */}
      <div className="col-span-full">
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Card className="bg-card/30">
            <CardHeader>
              <CardTitle className="text-sm text-primary">
                {contract1Name}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card/30">
            <CardHeader>
              <CardTitle className="text-sm text-accent">
                {contract2Name}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
