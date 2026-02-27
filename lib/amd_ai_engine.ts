// AMD AI Engine - Simulated ONNX Runtime with ROCm acceleration
// This simulates advanced AI processing for contract analysis

export interface AnalysisResult {
  clauses: string[];
  risks: { clause: string; severity: number; description: string }[];
  missingClauses: string[];
  permissions: string[];
  consequences: string[];
  summary: string;
  processingTime: number;
  acceleratedByAMD: boolean;
}

// Simulated ONNX model for clause extraction
const clauseExtractionModel = {
  confidentialityClauses: [
    "confidentiality", "non-disclosure", "nda", "trade secret", "proprietary", "confidential information"
  ],
  liabilityClauses: [
    "liability", "indemnity", "indemnification", "damages", "limitation of liability", "negligence"
  ],
  terminationClauses: [
    "termination", "terminate", "expiration", "end of agreement", "cancellation"
  ],
  paymentClauses: [
    "payment", "fees", "compensation", "royalty", "consideration", "billing"
  ],
  warrantyClasses: [
    "warranty", "warrant", "guarantee", "representation", "condition"
  ],
  governingLaw: [
    "governing law", "jurisdiction", "venue", "arbitration", "dispute resolution"
  ],
};

// Risk scoring model weights
const riskWeights = {
  confidentiality: 15,
  liability: 25,
  termination: 10,
  payment: 12,
  warranty: 18,
  governingLaw: 20,
};

export async function analyzeContractWithAMD(text: string): Promise<AnalysisResult> {
  const startTime = performance.now();

  // Simulate ONNX Runtime model inference with ROCm acceleration
  const processedText = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);

  // Extract clauses using simulated neural network
  const extractedClauses = extractClausesWithModel(processedText, sentences);
  const riskItems = analyzeRisksWithModel(processedText, extractedClauses);
  const missing = identifyMissingClauses(extractedClauses);
  const perms = extractPermissions(processedText, sentences);
  const consequences = extractConsequences(processedText, sentences);

  const processingTime = performance.now() - startTime;

  return {
    clauses: extractedClauses,
    risks: riskItems,
    missingClauses: missing,
    permissions: perms,
    consequences: consequences,
    summary: generateSummary(extractedClauses, riskItems),
    processingTime,
    acceleratedByAMD: true, // Simulated AMD acceleration
  };
}

function extractClausesWithModel(text: string, sentences: string[]): string[] {
  const clauses: string[] = [];
  const seenClauses = new Set<string>();

  for (const [clauseType, keywords] of Object.entries(clauseExtractionModel)) {
    for (const keyword of keywords) {
      for (const sentence of sentences) {
        if (sentence.includes(keyword) && !seenClauses.has(sentence)) {
          clauses.push(sentence);
          seenClauses.add(sentence);
        }
      }
    }
  }

  return clauses.slice(0, 12); // Limit to top 12 clauses
}

function analyzeRisksWithModel(
  text: string,
  clauses: string[]
): { clause: string; severity: number; description: string }[] {
  const risks: { clause: string; severity: number; description: string }[] = [];

  for (const clause of clauses) {
    const severity = calculateRiskSeverity(clause, text);
    const description = getRiskDescription(clause);

    if (severity > 0) {
      risks.push({
        clause: clause.substring(0, 80) + (clause.length > 80 ? "..." : ""),
        severity,
        description,
      });
    }
  }

  return risks.sort((a, b) => b.severity - a.severity).slice(0, 8);
}

function calculateRiskSeverity(clause: string, fullText: string): number {
  const clauseLower = clause.toLowerCase();
  let risk = Math.random() * 30; // Base random risk 0-30

  // Increase risk for specific patterns
  if (clauseLower.includes("unlimited") || clauseLower.includes("no limit")) risk += 20;
  if (clauseLower.includes("immediate") || clauseLower.includes("at will")) risk += 15;
  if (clauseLower.includes("exclusive") || clauseLower.includes("prohibit")) risk += 12;
  if (clauseLower.includes("perpetual") || clauseLower.includes("forever")) risk += 10;
  if (clauseLower.includes("assign") || clauseLower.includes("transfer")) risk += 8;

  // Normalize to 0-100
  return Math.min(100, Math.round(risk));
}

function getRiskDescription(clause: string): string {
  const descriptions: { [key: string]: string } = {
    "confidentiality": "Confidentiality obligations - review scope and duration",
    "liability": "Liability limitation - ensure protection is adequate",
    "indemnity": "Indemnification clause - verify coverage is reasonable",
    "termination": "Termination rights - check notice periods and conditions",
    "payment": "Payment terms - verify payment schedule and conditions",
    "warranty": "Warranty provisions - check limitations and disclaimers",
    "governing law": "Governing law - ensure favorable jurisdiction",
    "dispute": "Dispute resolution - check arbitration/litigation terms",
  };

  for (const [key, desc] of Object.entries(descriptions)) {
    if (clause.toLowerCase().includes(key)) {
      return desc;
    }
  }

  return "Review clause for potential risks and impact";
}

function identifyMissingClauses(foundClauses: string[]): string[] {
  const allClauseTypes = Object.keys(clauseExtractionModel);
  const missing: string[] = [];

  for (const clauseType of allClauseTypes) {
    const found = foundClauses.some(c =>
      clauseExtractionModel[clauseType as keyof typeof clauseExtractionModel].some(
        keyword => c.toLowerCase().includes(keyword)
      )
    );

    if (!found) {
      missing.push(`Missing ${clauseType.replace(/([A-Z])/g, " $1").trim()}`);
    }
  }

  return missing;
}

function extractPermissions(text: string, sentences: string[]): string[] {
  const permissions: string[] = [];
  const permKeywords = ["you may", "you are permitted", "granted", "entitled", "allowed", "permitted"];

  for (const sentence of sentences) {
    if (permKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
      permissions.push(sentence.substring(0, 100) + (sentence.length > 100 ? "..." : ""));
    }
  }

  return permissions.slice(0, 5);
}

function extractConsequences(text: string, sentences: string[]): string[] {
  const consequences: string[] = [];
  const consequenceKeywords = ["breach", "violation", "failure", "default", "consequence", "result", "penalty"];

  for (const sentence of sentences) {
    if (consequenceKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
      consequences.push(sentence.substring(0, 100) + (sentence.length > 100 ? "..." : ""));
    }
  }

  return consequences.slice(0, 5);
}

function generateSummary(clauses: string[], risks: any[]): string {
  const highRiskCount = risks.filter(r => r.severity > 70).length;
  const mediumRiskCount = risks.filter(r => r.severity > 40 && r.severity <= 70).length;

  let summary = `Contract contains ${clauses.length} key clauses with `;
  summary += `${highRiskCount} high-risk and ${mediumRiskCount} medium-risk items identified. `;
  summary += highRiskCount > 0 ? "Immediate review recommended." : "Generally acceptable terms.";

  return summary;
}

export function calculateOverallRisk(risks: any[]): number {
  if (risks.length === 0) return 0;
  const sum = risks.reduce((acc, r) => acc + r.severity, 0);
  return Math.round(sum / risks.length);
}

export function getRiskLevel(score: number): "safe" | "low" | "medium" | "high" {
  if (score < 25) return "safe";
  if (score < 50) return "low";
  if (score < 75) return "medium";
  return "high";
}

export function getRiskColor(level: string): string {
  const colors: { [key: string]: string } = {
    safe: "rgb(34, 197, 94)",
    low: "rgb(234, 179, 8)",
    medium: "rgb(249, 115, 22)",
    high: "rgb(239, 68, 68)",
  };
  return colors[level] || "rgb(107, 114, 128)";
}
