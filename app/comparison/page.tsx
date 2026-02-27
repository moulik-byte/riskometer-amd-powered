'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from '@/components/FileUploader';
import { ComparisonDiff } from '@/components/ComparisonDiff';
import { RiskMeter } from '@/components/RiskMeter';
import { analyzeContractWithAMD, calculateOverallRisk, getRiskLevel } from '@/lib/amd_ai_engine';
import { compareContracts } from '@/lib/legal_engine';

export default function ComparisonPage() {
  const router = useRouter();
  const [contract1, setContract1] = useState<{ content: string; name: string } | null>(null);
  const [contract2, setContract2] = useState<{ content: string; name: string } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  const handleFileSelected = async (content: string, fileName: string, isFirst: boolean) => {
    if (isFirst) {
      setContract1({ content, name: fileName });
    } else {
      setContract2({ content, name: fileName });
    }
  };

  const performComparison = async () => {
    if (!contract1 || !contract2) return;

    setAnalyzing(true);
    try {
      // Analyze both contracts
      const [result1, result2] = await Promise.all([
        analyzeContractWithAMD(contract1.content),
        analyzeContractWithAMD(contract2.content),
      ]);

      // Compare
      const comparison = compareContracts(contract1.content, contract2.content);

      const score1 = calculateOverallRisk(result1.risks);
      const score2 = calculateOverallRisk(result2.risks);

      setComparisonResult({
        contract1: {
          name: contract1.name,
          score: score1,
          level: getRiskLevel(score1),
          analysis: result1,
        },
        contract2: {
          name: contract2.name,
          score: score2,
          level: getRiskLevel(score2),
          analysis: result2,
        },
        comparison,
      });
    } catch (error) {
      console.error('Comparison error:', error);
      alert('Error comparing contracts');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/50">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Compare Contracts</h1>
              <p className="text-xs text-muted-foreground">Side-by-side analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!comparisonResult ? (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">First Contract</h2>
                <FileUploader
                  onFileSelected={(content, name) => handleFileSelected(content, name, true)}
                  isLoading={false}
                />
                {contract1 && (
                  <div className="mt-2 p-3 rounded bg-green-500/10 border border-green-500/20 text-xs">
                    <p className="font-medium text-green-500">✓ Loaded: {contract1.name}</p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Second Contract</h2>
                <FileUploader
                  onFileSelected={(content, name) => handleFileSelected(content, name, false)}
                  isLoading={false}
                />
                {contract2 && (
                  <div className="mt-2 p-3 rounded bg-green-500/10 border border-green-500/20 text-xs">
                    <p className="font-medium text-green-500">✓ Loaded: {contract2.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Compare Button */}
            {contract1 && contract2 && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={performComparison}
                  disabled={analyzing}
                  className="bg-gradient-to-r from-primary to-accent px-8"
                >
                  {analyzing ? 'Comparing...' : 'Compare Contracts'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Comparison Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">{comparisonResult.contract1.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-4">
                  <RiskMeter
                    score={comparisonResult.contract1.score}
                    level={comparisonResult.contract1.level}
                    animated={false}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">{comparisonResult.contract2.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-4">
                  <RiskMeter
                    score={comparisonResult.contract2.score}
                    level={comparisonResult.contract2.level}
                    animated={false}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Comparison Results */}
            <ComparisonDiff
              similarities={comparisonResult.comparison.similarities}
              differences={comparisonResult.comparison.differences}
              contract1Name={comparisonResult.contract1.name}
              contract2Name={comparisonResult.contract2.name}
            />

            {/* Detailed Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-sm">Contract 1 Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Clauses Found:</span>
                    <span className="font-medium">{comparisonResult.contract1.analysis.clauses.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">High Risk Items:</span>
                    <span className="font-medium text-red-500">
                      {comparisonResult.contract1.analysis.risks.filter(r => r.severity > 70).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Missing Clauses:</span>
                    <span className="font-medium text-yellow-500">
                      {comparisonResult.contract1.analysis.missingClauses.length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-sm">Contract 2 Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Clauses Found:</span>
                    <span className="font-medium">{comparisonResult.contract2.analysis.clauses.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">High Risk Items:</span>
                    <span className="font-medium text-red-500">
                      {comparisonResult.contract2.analysis.risks.filter(r => r.severity > 70).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Missing Clauses:</span>
                    <span className="font-medium text-yellow-500">
                      {comparisonResult.contract2.analysis.missingClauses.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Difference */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm">Comparison Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  <span className="text-muted-foreground">Risk Difference Score:</span>
                  <span className="font-bold text-primary ml-2">
                    {comparisonResult.comparison.riskDifference.toFixed(1)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {comparisonResult.contract1.score > comparisonResult.contract2.score
                    ? `${comparisonResult.contract1.name} has higher risk exposure`
                    : `${comparisonResult.contract2.name} has higher risk exposure`}
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setComparisonResult(null)}>
                Compare Another
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-accent">
                <Link href="/">Analyze New Contract</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
