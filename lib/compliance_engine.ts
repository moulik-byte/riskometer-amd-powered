// Compliance Engine - Checks contracts against regulatory standards
// GDPR, CCPA, HIPAA, SOC2 compliance verification

export interface ComplianceRequirement {
  id: string;
  standard: string;
  requirement: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  keywords: string[];
  found: boolean;
  evidence?: string;
  recommendation?: string;
}

export interface ComplianceReport {
  standard: string;
  overallScore: number;
  passed: number;
  failed: number;
  warnings: number;
  requirements: ComplianceRequirement[];
  summary: string;
}

// GDPR Requirements
const gdprRequirements: Omit<ComplianceRequirement, 'found' | 'evidence'>[] = [
  {
    id: 'gdpr-1',
    standard: 'GDPR',
    requirement: 'Lawful Basis for Processing',
    description: 'Contract must specify lawful basis for personal data processing',
    severity: 'critical',
    keywords: ['lawful basis', 'consent', 'processing', 'data', 'legitimate interest'],
    recommendation: 'Add explicit statement of lawful basis (consent, contract, legal obligation, vital interests, public task, or legitimate interests)'
  },
  {
    id: 'gdpr-2',
    standard: 'GDPR',
    requirement: 'Data Subject Rights',
    description: 'Must acknowledge right to access, rectification, erasure, and portability',
    severity: 'critical',
    keywords: ['data subject rights', 'access', 'rectification', 'erasure', 'right to be forgotten', 'portability'],
    recommendation: 'Include specific section detailing how data subjects can exercise their rights'
  },
  {
    id: 'gdpr-3',
    standard: 'GDPR',
    requirement: 'Data Protection Officer',
    description: 'Should mention DPO contact if applicable',
    severity: 'medium',
    keywords: ['data protection officer', 'dpo', 'privacy officer'],
    recommendation: 'Add DPO contact information if organization processes large volumes of personal data'
  },
  {
    id: 'gdpr-4',
    standard: 'GDPR',
    requirement: 'Data Breach Notification',
    description: 'Must include data breach notification procedures',
    severity: 'high',
    keywords: ['breach', 'notification', 'incident', 'personal data breach'],
    recommendation: 'Define clear breach notification timelines and procedures (72 hours to authorities)'
  },
  {
    id: 'gdpr-5',
    standard: 'GDPR',
    requirement: 'International Transfer Mechanism',
    description: 'If transferring data internationally, must have transfer mechanism',
    severity: 'high',
    keywords: ['international transfer', 'standard contractual clauses', 'adequacy decision', 'binding corporate rules'],
    recommendation: 'Use Standard Contractual Clauses (SCCs) or approved transfer mechanisms'
  }
];

// CCPA Requirements
const ccpaRequirements: Omit<ComplianceRequirement, 'found' | 'evidence'>[] = [
  {
    id: 'ccpa-1',
    standard: 'CCPA',
    requirement: 'Right to Know',
    description: 'Must disclose what personal information is collected and how it is used',
    severity: 'critical',
    keywords: ['right to know', 'personal information', 'collection', 'disclosure'],
    recommendation: 'Add clear disclosure of what data is collected and used for'
  },
  {
    id: 'ccpa-2',
    standard: 'CCPA',
    requirement: 'Right to Delete',
    description: 'Must allow consumers to request deletion of personal information',
    severity: 'critical',
    keywords: ['right to delete', 'deletion request', 'opt-out'],
    recommendation: 'Include mechanism for consumers to request data deletion'
  },
  {
    id: 'ccpa-3',
    standard: 'CCPA',
    requirement: 'Right to Opt-Out',
    description: 'Must allow opting out of sale or sharing of personal information',
    severity: 'high',
    keywords: ['opt-out', 'sale', 'sharing', 'do not sell'],
    recommendation: 'Add clear opt-out mechanism and "Do Not Sell My Personal Information" link'
  },
  {
    id: 'ccpa-4',
    standard: 'CCPA',
    requirement: 'Privacy Notice',
    description: 'Must maintain comprehensive privacy notice',
    severity: 'critical',
    keywords: ['privacy notice', 'privacy policy', 'notice'],
    recommendation: 'Ensure detailed privacy policy is linked and accessible'
  }
];

// HIPAA Requirements
const hipaaRequirements: Omit<ComplianceRequirement, 'found' | 'evidence'>[] = [
  {
    id: 'hipaa-1',
    standard: 'HIPAA',
    requirement: 'Business Associate Agreement',
    description: 'Required for any entity handling Protected Health Information',
    severity: 'critical',
    keywords: ['baa', 'business associate', 'protected health information', 'phi'],
    recommendation: 'Add comprehensive Business Associate Agreement if handling health data'
  },
  {
    id: 'hipaa-2',
    standard: 'HIPAA',
    requirement: 'Encryption Standards',
    description: 'PHI must be encrypted in transit and at rest',
    severity: 'critical',
    keywords: ['encryption', 'encrypted', 'aes', 'tls', 'ssl'],
    recommendation: 'Specify encryption standards (AES-256, TLS 1.2 minimum)'
  },
  {
    id: 'hipaa-3',
    standard: 'HIPAA',
    requirement: 'Breach Notification',
    description: 'Must specify breach notification procedures',
    severity: 'critical',
    keywords: ['breach notification', 'hipaa breach'],
    recommendation: 'Define breach notification timelines and procedures'
  }
];

export function checkCompliance(contractText: string, standards: string[]): ComplianceReport[] {
  const reports: ComplianceReport[] = [];

  if (standards.includes('GDPR')) {
    reports.push(checkGDPR(contractText));
  }
  if (standards.includes('CCPA')) {
    reports.push(checkCCPA(contractText));
  }
  if (standards.includes('HIPAA')) {
    reports.push(checkHIPAA(contractText));
  }

  return reports;
}

function checkGDPR(contractText: string): ComplianceReport {
  const lowerText = contractText.toLowerCase();
  const requirements = gdprRequirements.map(req => {
    const found = req.keywords.some(keyword => lowerText.includes(keyword));
    return {
      ...req,
      found,
      evidence: found ? extractEvidence(contractText, req.keywords) : undefined
    };
  });

  const passed = requirements.filter(r => r.found).length;
  const failed = requirements.filter(r => !r.found && r.severity === 'critical').length;
  const warnings = requirements.filter(r => !r.found && r.severity !== 'critical').length;
  const overallScore = Math.round((passed / requirements.length) * 100);

  return {
    standard: 'GDPR',
    overallScore,
    passed,
    failed,
    warnings,
    requirements,
    summary: `GDPR Compliance Score: ${overallScore}%. ${passed} of ${requirements.length} requirements met.${failed > 0 ? ` ${failed} critical requirements missing.` : ''}`
  };
}

function checkCCPA(contractText: string): ComplianceReport {
  const lowerText = contractText.toLowerCase();
  const requirements = ccpaRequirements.map(req => {
    const found = req.keywords.some(keyword => lowerText.includes(keyword));
    return {
      ...req,
      found,
      evidence: found ? extractEvidence(contractText, req.keywords) : undefined
    };
  });

  const passed = requirements.filter(r => r.found).length;
  const failed = requirements.filter(r => !r.found && r.severity === 'critical').length;
  const warnings = requirements.filter(r => !r.found && r.severity !== 'critical').length;
  const overallScore = Math.round((passed / requirements.length) * 100);

  return {
    standard: 'CCPA',
    overallScore,
    passed,
    failed,
    warnings,
    requirements,
    summary: `CCPA Compliance Score: ${overallScore}%. ${passed} of ${requirements.length} requirements met.${failed > 0 ? ` ${failed} critical requirements missing.` : ''}`
  };
}

function checkHIPAA(contractText: string): ComplianceReport {
  const lowerText = contractText.toLowerCase();
  const requirements = hipaaRequirements.map(req => {
    const found = req.keywords.some(keyword => lowerText.includes(keyword));
    return {
      ...req,
      found,
      evidence: found ? extractEvidence(contractText, req.keywords) : undefined
    };
  });

  const passed = requirements.filter(r => r.found).length;
  const failed = requirements.filter(r => !r.found && r.severity === 'critical').length;
  const warnings = requirements.filter(r => !r.found && r.severity !== 'critical').length;
  const overallScore = Math.round((passed / requirements.length) * 100);

  return {
    standard: 'HIPAA',
    overallScore,
    passed,
    failed,
    warnings,
    requirements,
    summary: `HIPAA Compliance Score: ${overallScore}%. ${passed} of ${requirements.length} requirements met.${failed > 0 ? ` ${failed} critical requirements missing.` : ''}`
  };
}

function extractEvidence(text: string, keywords: string[]): string {
  const lowerText = text.toLowerCase();
  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword);
    if (index !== -1) {
      const start = Math.max(0, index - 50);
      const end = Math.min(text.length, index + keyword.length + 50);
      return `...${text.slice(start, end)}...`;
    }
  }
  return '';
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-red-500';
    case 'high':
      return 'text-orange-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

export function getSeverityBgColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/10 border-red-500/20';
    case 'high':
      return 'bg-orange-500/10 border-orange-500/20';
    case 'medium':
      return 'bg-yellow-500/10 border-yellow-500/20';
    case 'low':
      return 'bg-green-500/10 border-green-500/20';
    default:
      return 'bg-gray-500/10 border-gray-500/20';
  }
}
