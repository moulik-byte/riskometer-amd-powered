'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ComplianceCard } from '@/components/ComplianceCard';
import { checkCompliance, type ComplianceReport } from '@/lib/compliance_engine';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

const COMPLIANCE_STANDARDS = ['GDPR', 'CCPA', 'HIPAA'];

export default function CompliancePage() {
  const [uploadedText, setUploadedText] = useState('');
  const [selectedStandards, setSelectedStandards] = useState<string[]>(['GDPR']);
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contractName, setContractName] = useState('Uploaded Contract');

  const handleFileUpload = (content: string, fileName: string) => {
    setContractName(fileName);
    setUploadedText(content);
  };

  const handleAnalyze = () => {
    if (!uploadedText) {
      alert('Please upload a contract first');
      return;
    }

    setIsAnalyzing(true);
    // Simulate processing delay
    setTimeout(() => {
      const results = checkCompliance(uploadedText, selectedStandards);
      setReports(results);
      setIsAnalyzing(false);
    }, 1500);
  };

  const toggleStandard = (standard: string) => {
    setSelectedStandards(prev =>
      prev.includes(standard)
        ? prev.filter(s => s !== standard)
        : [...prev, standard]
    );
  };

  const averageScore = reports.length > 0
    ? Math.round(reports.reduce((sum, r) => sum + r.overallScore, 0) / reports.length)
    : 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Compliance Checker</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Verify your contracts against regulatory standards including GDPR, CCPA, and HIPAA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              {/* File Upload Card */}
              <Card className="border border-border bg-card rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Upload Contract</h2>
                <FileUploader onFileSelected={handleFileUpload} />
                {uploadedText && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded">
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Contract loaded: {contractName}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {uploadedText.length} characters
                    </div>
                  </div>
                )}
              </Card>

              {/* Standards Selection */}
              <Card className="border border-border bg-card rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Select Standards</h2>
                <div className="space-y-3">
                  {COMPLIANCE_STANDARDS.map(standard => (
                    <label key={standard} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStandards.includes(standard)}
                        onChange={() => toggleStandard(standard)}
                        className="w-4 h-4 rounded border border-border bg-card checked:bg-primary checked:border-primary cursor-pointer"
                      />
                      <span className="text-foreground font-medium">{standard}</span>
                    </label>
                  ))}
                </div>
              </Card>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={!uploadedText || isAnalyzing || selectedStandards.length === 0}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold text-base rounded-lg"
              >
                {isAnalyzing ? 'Analyzing...' : 'Run Compliance Check'}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {reports.length > 0 ? (
              <div className="space-y-6">
                {/* Overall Score Summary */}
                <Card className="border border-border bg-card rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Overall Compliance</h2>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${averageScore >= 80 ? 'text-green-500' : averageScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {averageScore}%
                      </div>
                      <p className="text-xs text-muted-foreground">Average Score</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                      style={{ width: `${averageScore}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Checking compliance across {reports.length} standard{reports.length !== 1 ? 's' : ''}
                  </p>
                </Card>

                {/* Individual Reports */}
                {reports.map(report => (
                  <ComplianceCard key={report.standard} report={report} />
                ))}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      const reportText = reports
                        .map(r => `${r.standard}: ${r.summary}`)
                        .join('\n');
                      navigator.clipboard.writeText(reportText);
                      alert('Report copied to clipboard');
                    }}
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg"
                  >
                    Copy Report
                  </Button>
                  <Button
                    onClick={() => {
                      const jsonStr = JSON.stringify(reports, null, 2);
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(new Blob([jsonStr], { type: 'application/json' }));
                      link.download = 'compliance-report.json';
                      link.click();
                    }}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg"
                  >
                    Download JSON
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="border border-border bg-card rounded-lg p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Analysis Yet</h3>
                <p className="text-muted-foreground">
                  Upload a contract and select compliance standards to begin analysis
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
