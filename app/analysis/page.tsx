'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskMeter } from '@/components/RiskMeter';
import { AnalysisPanel } from '@/components/AnalysisPanel';
import { CategoryRiskChart } from '@/components/CategoryRiskChart';
import { analyzeContractWithAMD, calculateOverallRisk, getRiskLevel } from '@/lib/amd_ai_engine';
import { calculateRiskMetrics } from '@/lib/risk_engine';

export default function AnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contractName, setContractName] = useState('');
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    const loadAndAnalyze = async () => {
      const content = sessionStorage.getItem('contractContent');
      const name = sessionStorage.getItem('contractName');

      if (!content) {
        router.push('/');
        return;
      }

      setContractName(name || 'Unknown Contract');

      try {
        // Analyze with AMD engine
        const amdResult = await analyzeContractWithAMD(content);

        // Validate result
        if (!amdResult || !amdResult.clauses) {
          throw new Error('Invalid analysis result');
        }

        // Calculate risk metrics
        const riskMetrics = calculateRiskMetrics(content, amdResult.clauses || [], amdResult.risks || []);

        const overallScore = calculateOverallRisk(amdResult.risks || []);
        
        setAnalysisData({
          amd: amdResult,
          metrics: riskMetrics,
          overallScore: overallScore,
          riskLevel: getRiskLevel(overallScore),
        });
      } catch (error) {
        console.error('Analysis error:', error);
        setAnalysisData(null);
      } finally {
        setLoading(false);
      }
    };

    loadAndAnalyze();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-card/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl">⚙️</div>
          <p className="text-muted-foreground">Analyzing contract with AMD acceleration...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-card/50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Error loading analysis</p>
          <Button asChild className="mt-4">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { amd, metrics, overallScore, riskLevel } = analysisData;

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
              <h1 className="text-lg font-bold text-foreground">{contractName}</h1>
              <p className="text-xs text-muted-foreground">Analysis Results</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Download Report
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent">
              <Link href="/comparison">Compare Another</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Risk Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Risk Meter */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-card to-card/50 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Overall Risk</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <RiskMeter score={overallScore} level={riskLevel} animated />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="lg:col-span-2 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Clauses</p>
                    <p className="text-2xl font-bold text-primary">{amd.clauses.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">High Risk</p>
                    <p className="text-2xl font-bold text-red-500">
                      {amd.risks.filter(r => r.severity > 70).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Missing Clauses</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {amd.missingClauses.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Processing Time</p>
                    <p className="text-2xl font-bold text-accent">
                      {amd.processingTime.toFixed(0)}ms
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground pt-2 border-t border-border">
                  {amd.summary}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Risk Chart */}
        <div className="mb-8">
          <CategoryRiskChart scores={metrics.categoryScores} />
        </div>

        {/* Analysis Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalysisPanel
            title="Key Clauses"
            items={amd.clauses.map((clause, idx) => ({
              id: `clause-${idx}`,
              title: `Clause ${idx + 1}`,
              content: clause,
            }))}
            icon="📋"
          />

          <AnalysisPanel
            title="Risk Items"
            items={amd.risks.map((risk, idx) => ({
              id: `risk-${idx}`,
              title: risk.clause.substring(0, 40),
              content: risk.description,
              severity: risk.severity,
            }))}
            icon="⚠️"
          />
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalysisPanel
            title="Permissions & Rights"
            items={amd.permissions.map((perm, idx) => ({
              id: `perm-${idx}`,
              title: `Permission ${idx + 1}`,
              content: perm,
            }))}
            emptyText="No specific permissions identified"
            icon="✓"
          />

          <AnalysisPanel
            title="Consequences & Penalties"
            items={amd.consequences.map((cons, idx) => ({
              id: `cons-${idx}`,
              title: `Consequence ${idx + 1}`,
              content: cons,
            }))}
            emptyText="No specific consequences identified"
            icon="⚡"
          />

          <div className="lg:col-span-2">
            <AnalysisPanel
              title="Missing Clauses"
              items={amd.missingClauses.map((clause, idx) => ({
                id: `missing-${idx}`,
                title: clause,
                content: `Consider adding comprehensive ${clause.toLowerCase()} to the agreement`,
              }))}
              emptyText="All standard clauses appear to be present"
              icon="❌"
            />
          </div>
        </div>

        {/* Recommendations */}
        {metrics.recommendations.length > 0 && (
          <Card className="mt-8 bg-blue-500/5 border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-base text-blue-500">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {metrics.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="text-blue-500 flex-shrink-0">💡</span>
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* AMD Acceleration Badge */}
        <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <div>
              <p className="font-semibold text-sm">AMD Radeon Acceleration</p>
              <p className="text-xs text-muted-foreground">Analysis powered by AMD ROCm & ONNX Runtime</p>
            </div>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {amd.acceleratedByAMD ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </main>
    </div>
  );
}
