'use client';

import { ComplianceReport, getSeverityBgColor, getSeverityColor } from '@/lib/compliance_engine';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ComplianceCardProps {
  report: ComplianceReport;
}

export function ComplianceCard({ report }: ComplianceCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="border border-border bg-card rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{report.standard}</h3>
          <p className="text-sm text-muted-foreground mt-1">{report.summary}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg border ${getScoreBgColor(report.overallScore)}`}>
          <div className={`text-2xl font-bold ${getScoreColor(report.overallScore)}`}>
            {report.overallScore}%
          </div>
          <div className="text-xs text-muted-foreground">Compliance</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{report.passed}</div>
          <div className="text-xs text-muted-foreground">Met</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500">{report.warnings}</div>
          <div className="text-xs text-muted-foreground">Warnings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{report.failed}</div>
          <div className="text-xs text-muted-foreground">Failed</div>
        </div>
      </div>

      <div className="space-y-3">
        {report.requirements.map((req) => (
          <div
            key={req.id}
            className={`p-3 rounded-lg border ${getSeverityBgColor(req.severity)} transition-all hover:shadow-md`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {req.found ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : req.severity === 'critical' ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{req.requirement}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{req.description}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${getSeverityColor(req.severity)} ${getSeverityBgColor(req.severity)}`}>
                    {req.severity}
                  </span>
                </div>

                {req.found && req.evidence && (
                  <div className="mt-2 p-2 bg-black/20 rounded text-xs text-muted-foreground overflow-hidden text-ellipsis">
                    <span className="font-semibold">Evidence:</span> {req.evidence}
                  </div>
                )}

                {!req.found && req.recommendation && (
                  <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400">
                    <span className="font-semibold">Recommendation:</span> {req.recommendation}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
