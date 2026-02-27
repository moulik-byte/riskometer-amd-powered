// Legal Analysis Engine - Specialized clause extraction and analysis

export interface LegalAnalysis {
  confidentialityClauses: string[];
  liabilityClauses: string[];
  terminationClauses: string[];
  paymentClauses: string[];
  warranties: string[];
  governingLaw: string[];
  specialClauses: string[];
  severityAssessment: Map<string, number>;
}

const clausePatterns = {
  confidentiality: {
    patterns: [
      /confidential(ity)?.*information/gi,
      /non[\s-]?disclosure/gi,
      /nda/gi,
      /trade secrets?/gi,
      /proprietary/gi,
    ],
    importance: 8,
  },
  liability: {
    patterns: [
      /liability|indemnif(ication|y)/gi,
      /damages/gi,
      /limitation of liability/gi,
      /cap on liability/gi,
      /negligence/gi,
    ],
    importance: 9,
  },
  termination: {
    patterns: [
      /terminat(ion|e)/gi,
      /expir(ation|e)/gi,
      /end of .*agreement/gi,
      /termination for cause/gi,
      /at-?will/gi,
    ],
    importance: 7,
  },
  payment: {
    patterns: [
      /payment.*terms?/gi,
      /fees|royalt(y|ies)/gi,
      /compensation/gi,
      /billing/gi,
      /invoice/gi,
    ],
    importance: 8,
  },
  warranty: {
    patterns: [
      /warrant(y|ies)/gi,
      /warrant(s)?/gi,
      /guarantee(s)?/gi,
      /represent(ation|s)/gi,
      /condition(s)?/gi,
    ],
    importance: 7,
  },
  governingLaw: {
    patterns: [
      /governing law/gi,
      /jurisdiction/gi,
      /arbitration/gi,
      /dispute resolution/gi,
      /venue/gi,
    ],
    importance: 6,
  },
};

export function analyzeLegalDocument(text: string): LegalAnalysis {
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  const analysis: LegalAnalysis = {
    confidentialityClauses: extractClausesByType(paragraphs, "confidentiality"),
    liabilityClauses: extractClausesByType(paragraphs, "liability"),
    terminationClauses: extractClausesByType(paragraphs, "termination"),
    paymentClauses: extractClausesByType(paragraphs, "payment"),
    warranties: extractClausesByType(paragraphs, "warranty"),
    governingLaw: extractClausesByType(paragraphs, "governingLaw"),
    specialClauses: extractSpecialClauses(paragraphs),
    severityAssessment: assessClauseSeverity(sentences),
  };

  return analysis;
}

function extractClausesByType(
  paragraphs: string[],
  clauseType: keyof typeof clausePatterns
): string[] {
  const patterns = clausePatterns[clauseType].patterns;
  const clauses: string[] = [];

  for (const paragraph of paragraphs) {
    for (const pattern of patterns) {
      if (pattern.test(paragraph)) {
        clauses.push(paragraph.substring(0, 150) + (paragraph.length > 150 ? "..." : ""));
        break;
      }
    }
  }

  return clauses.slice(0, 5);
}

function extractSpecialClauses(paragraphs: string[]): string[] {
  const specialPatterns = [
    /force majeure/gi,
    /audit.*right/gi,
    /insurance/gi,
    /export.*control/gi,
    /compliance/gi,
    /data protection/gi,
    /privacy/gi,
    /security/gi,
  ];

  const clauses: string[] = [];

  for (const paragraph of paragraphs) {
    for (const pattern of specialPatterns) {
      if (pattern.test(paragraph)) {
        clauses.push(paragraph.substring(0, 120) + (paragraph.length > 120 ? "..." : ""));
        break;
      }
    }
  }

  return clauses.slice(0, 4);
}

function assessClauseSeverity(sentences: string[]): Map<string, number> {
  const severity = new Map<string, number>();

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();

    for (const [clauseType, config] of Object.entries(clausePatterns)) {
      for (const pattern of config.patterns) {
        if (pattern.test(sentence)) {
          const existingScore = severity.get(clauseType) || 0;

          // Calculate severity based on keywords and context
          let score = config.importance * 10;

          if (lowerSentence.includes("unlimited")) score += 15;
          if (lowerSentence.includes("perpetual")) score += 12;
          if (lowerSentence.includes("exclusive")) score += 10;
          if (lowerSentence.includes("prohibit")) score += 8;
          if (lowerSentence.includes("must") || lowerSentence.includes("shall")) score += 5;

          severity.set(clauseType, Math.max(existingScore, Math.min(100, score)));
          break;
        }
      }
    }
  }

  return severity;
}

export function compareContracts(
  contract1: string,
  contract2: string
): { similarities: string[]; differences: string[]; riskDifference: number } {
  const analysis1 = analyzeLegalDocument(contract1);
  const analysis2 = analyzeLegalDocument(contract2);

  const similarities: string[] = [];
  const differences: string[] = [];

  // Compare clause types
  const clauseKeys = Object.keys(clausePatterns);
  for (const key of clauseKeys) {
    const key1 = key as keyof typeof analysis1;
    const clauses1 = analysis1[key1];
    const clauses2 = analysis2[key1];

    if (
      Array.isArray(clauses1) &&
      Array.isArray(clauses2) &&
      clauses1.length > 0 &&
      clauses2.length > 0
    ) {
      similarities.push(`Both contracts include ${key} clauses`);
    } else if (
      (Array.isArray(clauses1) && clauses1.length > 0) ||
      (Array.isArray(clauses2) && clauses2.length > 0)
    ) {
      differences.push(`Only one contract includes detailed ${key} clauses`);
    }
  }

  // Calculate risk difference
  const getSeverity = (severity: Map<string, number>) => {
    const values = Array.from(severity.values());
    return values.length > 0 ? values.reduce((a, b) => a + b) / values.length : 0;
  };

  const riskDifference = Math.abs(
    getSeverity(analysis1.severityAssessment) -
    getSeverity(analysis2.severityAssessment)
  );

  return { similarities, differences, riskDifference };
}

export function extractKeyTerms(text: string): string[] {
  const terms: string[] = [];
  const patterns = [
    /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, // Capitalized terms
    /\b(?:party|parties|term|term duration|effective date)\b/gi,
    /\d+\s*(?:days?|months?|years?)/g, // Time periods
    /\$\s*\d+(?:,\d{3})*(?:\.\d{2})?/g, // Monetary amounts
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern) || [];
    terms.push(...matches);
  }

  return [...new Set(terms)].slice(0, 20);
}

export function identifyCriticalClauses(text: string): string[] {
  const criticalKeywords = [
    "must", "shall", "required", "mandatory", "prohibited", "forbidden",
    "unlimited liability", "perpetual", "irrevocable", "exclusive", "non-compete"
  ];

  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const critical: string[] = [];

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    if (criticalKeywords.some(keyword => lowerSentence.includes(keyword))) {
      critical.push(sentence);
    }
  }

  return critical.slice(0, 10);
}
