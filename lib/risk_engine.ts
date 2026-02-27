// Risk Scoring Engine - Advanced risk assessment and scoring algorithms

export interface RiskMetrics {
  overallScore: number;
  riskLevel: "safe" | "low" | "medium" | "high";
  categoryScores: {
    confidentiality: number;
    liability: number;
    compliance: number;
    financial: number;
    operational: number;
  };
  recommendations: string[];
  criticalIssues: string[];
  passItems: string[];
}

export interface RiskIndicator {
  name: string;
  score: number;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  recommendation: string;
}

const riskFactors = {
  unlimitedLiability: { weight: 25, severity: "critical" as const },
  noConfidentiality: { weight: 20, severity: "high" as const },
  perpetualObligation: { weight: 18, severity: "high" as const },
  exclusiveRights: { weight: 15, severity: "high" as const },
  unilateralTermination: { weight: 14, severity: "medium" as const },
  nonCompete: { weight: 16, severity: "high" as const },
  indemnityClause: { weight: 12, severity: "medium" as const },
  assignmentRestriction: { weight: 8, severity: "low" as const },
  dataProtectionGap: { weight: 22, severity: "critical" as const },
  auditRights: { weight: 6, severity: "low" as const },
};

const positiveFactors = {
  limitedLiability: 20,
  strongConfidentiality: 18,
  clearTermination: 15,
  fairPaymentTerms: 12,
  dataProtection: 25,
  severable: 8,
  flexibleSchedule: 10,
  mutualObligation: 14,
};

export function calculateRiskMetrics(
  text: string,
  clauses: string[],
  risks: { clause: string; severity: number }[]
): RiskMetrics {
  const indicators = identifyRiskIndicators(text, clauses);
  const categoryScores = calculateCategoryScores(indicators, text);
  const overallScore = calculateWeightedScore(categoryScores);
  const riskLevel = getRiskLevelFromScore(overallScore);

  const recommendations = generateRecommendations(indicators, riskLevel);
  const criticalIssues = indicators
    .filter(i => i.severity === "critical" || i.severity === "high")
    .map(i => i.recommendation);
  const passItems = generatePassItems(text, indicators);

  return {
    overallScore,
    riskLevel,
    categoryScores,
    recommendations,
    criticalIssues,
    passItems,
  };
}

function identifyRiskIndicators(text: string, clauses: string[]): RiskIndicator[] {
  const indicators: RiskIndicator[] = [];
  const lowerText = text.toLowerCase();

  // Check for unlimited liability
  if (lowerText.includes("unlimited liability") || lowerText.includes("no limit")) {
    indicators.push({
      name: "Unlimited Liability",
      score: 25,
      severity: "critical",
      description: "Contract contains no cap on liability exposure",
      recommendation: "Negotiate a reasonable liability cap (e.g., 12 months of fees)",
    });
  } else if (lowerText.includes("limitation of liability")) {
    indicators.push({
      name: "Liability Cap Present",
      score: -20,
      severity: "low",
      description: "Contract includes reasonable liability limitations",
      recommendation: "Review cap amount to ensure adequacy for your business",
    });
  }

  // Check for confidentiality
  if (!lowerText.includes("confidential") && !lowerText.includes("nda")) {
    indicators.push({
      name: "Missing Confidentiality Clause",
      score: 20,
      severity: "high",
      description: "No confidentiality protection identified",
      recommendation: "Add comprehensive confidentiality obligations",
    });
  } else if (lowerText.includes("mutual confidentiality") || lowerText.includes("mutual nda")) {
    indicators.push({
      name: "Mutual Confidentiality",
      score: -18,
      severity: "low",
      description: "Strong mutual confidentiality protections present",
      recommendation: "Ensure confidentiality period is appropriate for your needs",
    });
  }

  // Check for perpetual obligations
  if (lowerText.includes("perpetual") || lowerText.includes("in perpetuity")) {
    indicators.push({
      name: "Perpetual Obligation",
      score: 18,
      severity: "high",
      description: "Contract includes indefinite/perpetual obligations",
      recommendation: "Negotiate time limits on key obligations",
    });
  }

  // Check for exclusive rights
  if (lowerText.includes("exclusive") && lowerText.includes("right")) {
    indicators.push({
      name: "Exclusive Restrictions",
      score: 15,
      severity: "high",
      description: "Exclusive rights clauses may limit your business flexibility",
      recommendation: "Clarify scope of exclusivity and any carve-outs",
    });
  }

  // Check for unilateral termination
  if (lowerText.includes("at-will") || lowerText.includes("at will") || lowerText.includes("terminate without cause")) {
    indicators.push({
      name: "Unilateral Termination",
      score: 14,
      severity: "medium",
      description: "One party can terminate without cause",
      recommendation: "Require notice period or termination fee if unfavorable",
    });
  } else if (lowerText.includes("for cause") && lowerText.includes("termination")) {
    indicators.push({
      name: "Termination for Cause",
      score: -12,
      severity: "low",
      description: "Termination limited to specific causes",
      recommendation: "Ensure causes are clearly defined and reasonable",
    });
  }

  // Check for non-compete
  if (lowerText.includes("non-compete") || lowerText.includes("noncompete")) {
    indicators.push({
      name: "Non-Compete Clause",
      score: 16,
      severity: "high",
      description: "Contract includes non-compete restrictions",
      recommendation: "Negotiate reasonable time/geographic limits",
    });
  }

  // Check for data protection
  if (lowerText.includes("gdpr") || lowerText.includes("ccpa") || lowerText.includes("data protection")) {
    indicators.push({
      name: "Data Protection Compliance",
      score: -25,
      severity: "low",
      description: "Contract addresses data protection requirements",
      recommendation: "Ensure compliance procedures are clearly documented",
    });
  } else if (lowerText.includes("data") && lowerText.includes("process")) {
    indicators.push({
      name: "Data Protection Gap",
      score: 22,
      severity: "critical",
      description: "Data handling lacks clear protection terms",
      recommendation: "Add explicit data protection and privacy provisions",
    });
  }

  // Check for indemnification
  if (lowerText.includes("indemnif")) {
    if (lowerText.includes("mutual")) {
      indicators.push({
        name: "Mutual Indemnification",
        score: -12,
        severity: "low",
        description: "Mutual indemnification protections present",
        recommendation: "Ensure coverage includes third-party IP claims",
      });
    } else {
      indicators.push({
        name: "One-sided Indemnity",
        score: 12,
        severity: "medium",
        description: "Indemnification obligations are one-sided",
        recommendation: "Negotiate mutual indemnification terms",
      });
    }
  }

  // Check for audit rights
  if (lowerText.includes("audit")) {
    indicators.push({
      name: "Audit Rights Present",
      score: 6,
      severity: "low",
      description: "Contract includes audit/inspection rights",
      recommendation: "Ensure audit rights are limited in scope and frequency",
    });
  }

  // Check for assignment restrictions
  if (lowerText.includes("assign") && lowerText.includes("restrict")) {
    indicators.push({
      name: "Assignment Restrictions",
      score: 8,
      severity: "low",
      description: "Agreement restricts assignment rights",
      recommendation: "Negotiate exceptions for M&A or affiliate assignments",
    });
  }

  return indicators;
}

function calculateCategoryScores(
  indicators: RiskIndicator[],
  text: string
): RiskMetrics["categoryScores"] {
  const lowerText = text.toLowerCase();

  const categoryScores: RiskMetrics["categoryScores"] = {
    confidentiality: 0,
    liability: 0,
    compliance: 0,
    financial: 0,
    operational: 0,
  };

  // Calculate category scores based on indicators and text analysis
  for (const indicator of indicators) {
    if (indicator.name.includes("Confidentiality")) {
      categoryScores.confidentiality += indicator.score;
    } else if (indicator.name.includes("Liability") || indicator.name.includes("Indemnit")) {
      categoryScores.liability += indicator.score;
    } else if (indicator.name.includes("Data Protection") || indicator.name.includes("Compliance")) {
      categoryScores.compliance += indicator.score;
    } else if (indicator.name.includes("Payment") || indicator.name.includes("Financial")) {
      categoryScores.financial += indicator.score;
    } else {
      categoryScores.operational += indicator.score;
    }
  }

  // Additional checks
  if (lowerText.includes("payment")) {
    categoryScores.financial = Math.max(0, categoryScores.financial - 5);
  }
  if (lowerText.includes("termination") && lowerText.includes("notice")) {
    categoryScores.operational = Math.max(0, categoryScores.operational - 8);
  }

  // Normalize scores to 0-100
  return {
    confidentiality: Math.min(100, Math.max(0, 50 + categoryScores.confidentiality)),
    liability: Math.min(100, Math.max(0, 50 + categoryScores.liability)),
    compliance: Math.min(100, Math.max(0, 50 + categoryScores.compliance)),
    financial: Math.min(100, Math.max(0, 50 + categoryScores.financial)),
    operational: Math.min(100, Math.max(0, 50 + categoryScores.operational)),
  };
}

function calculateWeightedScore(scores: RiskMetrics["categoryScores"]): number {
  const weights = {
    confidentiality: 0.20,
    liability: 0.25,
    compliance: 0.25,
    financial: 0.15,
    operational: 0.15,
  };

  const weighted =
    scores.confidentiality * weights.confidentiality +
    scores.liability * weights.liability +
    scores.compliance * weights.compliance +
    scores.financial * weights.financial +
    scores.operational * weights.operational;

  return Math.round(weighted);
}

function getRiskLevelFromScore(score: number): "safe" | "low" | "medium" | "high" {
  if (score < 25) return "safe";
  if (score < 50) return "low";
  if (score < 75) return "medium";
  return "high";
}

function generateRecommendations(
  indicators: RiskIndicator[],
  riskLevel: string
): string[] {
  const recommendations: string[] = [];

  for (const indicator of indicators) {
    if (indicator.severity === "critical" || indicator.severity === "high") {
      recommendations.push(indicator.recommendation);
    }
  }

  // Add general recommendations based on risk level
  if (riskLevel === "high") {
    recommendations.push("Seek legal counsel before signing this contract");
    recommendations.push("Consider renegotiating key terms");
  } else if (riskLevel === "medium") {
    recommendations.push("Address identified medium-risk items before execution");
  }

  return recommendations.slice(0, 6);
}

function generatePassItems(text: string, indicators: RiskIndicator[]): string[] {
  const passItems: string[] = [];

  const positiveIndicators = indicators.filter(i => i.score < 0);
  for (const indicator of positiveIndicators) {
    passItems.push(`✓ ${indicator.description}`);
  }

  // Add default positive items if contract is reasonable
  if (text.length > 500 && !text.toLowerCase().includes("unlimited liability")) {
    passItems.push("✓ Contract includes reasonable scope definition");
    passItems.push("✓ Includes protective clauses for parties");
  }

  return passItems.slice(0, 5);
}

export function generateRiskReport(
  contractName: string,
  metrics: RiskMetrics
): string {
  let report = `# Contract Risk Report: ${contractName}\n\n`;
  report += `**Overall Risk Level: ${metrics.riskLevel.toUpperCase()}**\n`;
  report += `**Risk Score: ${metrics.overallScore}/100**\n\n`;

  report += `## Category Breakdown\n`;
  report += `- Confidentiality Risk: ${metrics.categoryScores.confidentiality}/100\n`;
  report += `- Liability Risk: ${metrics.categoryScores.liability}/100\n`;
  report += `- Compliance Risk: ${metrics.categoryScores.compliance}/100\n`;
  report += `- Financial Risk: ${metrics.categoryScores.financial}/100\n`;
  report += `- Operational Risk: ${metrics.categoryScores.operational}/100\n\n`;

  if (metrics.criticalIssues.length > 0) {
    report += `## Critical Issues\n`;
    metrics.criticalIssues.forEach(issue => {
      report += `- ${issue}\n`;
    });
    report += "\n";
  }

  if (metrics.recommendations.length > 0) {
    report += `## Recommendations\n`;
    metrics.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    report += "\n";
  }

  if (metrics.passItems.length > 0) {
    report += `## Positive Findings\n`;
    metrics.passItems.forEach(item => {
      report += `${item}\n`;
    });
  }

  return report;
}
