// Template Library - Pre-built contract templates for common scenarios

export interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  keyPoints: string[];
  riskLevel: 'low' | 'medium' | 'high';
  tags: string[];
}

export const contractTemplates: ContractTemplate[] = [
  {
    id: 'nda-standard',
    name: 'Standard Non-Disclosure Agreement (NDA)',
    category: 'Legal Protection',
    description: 'A standard NDA template for protecting confidential business information',
    content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of [DATE] between [Company A] ("Disclosing Party") and [Company B] ("Receiving Party").

1. CONFIDENTIAL INFORMATION
Confidential Information means all non-public technical and business information, including but not limited to trade secrets, know-how, source code, documentation, and business plans disclosed by the Disclosing Party.

2. OBLIGATIONS
The Receiving Party agrees to:
- Keep Confidential Information in strict confidence
- Limit access to employees who have a legitimate need to know
- Protect the information using the same degree of care as its own confidential information
- Not disclose the information to third parties without written consent

3. PERMITTED DISCLOSURES
The Receiving Party may disclose Confidential Information only:
- As required by law, court order, or regulatory requirement (with notice to Disclosing Party)
- To legal counsel and accountants on a need-to-know basis
- With the prior written consent of the Disclosing Party

4. TERM
This Agreement shall remain in effect for [3-5] years from the date of disclosure.

5. RETURN OF INFORMATION
Upon request or termination, the Receiving Party shall return or destroy all Confidential Information.

6. NO LICENSE
Disclosure does not grant any license or rights to the Confidential Information.

7. REMEDIES
The Receiving Party acknowledges that breach would cause irreparable harm for which monetary damages are an inadequate remedy.

8. GOVERNING LAW
This Agreement shall be governed by the laws of [JURISDICTION].

IN WITNESS WHEREOF, the parties execute this Agreement as of the date first written above.

Signed: ___________________    Signed: ___________________
Date: _____________________    Date: _____________________`,
    keyPoints: [
      'Defines scope of confidential information',
      'Sets duration of confidentiality obligations',
      'Specifies permitted disclosures',
      'Includes return/destruction clause',
      'Addresses remedies for breach'
    ],
    riskLevel: 'low',
    tags: ['NDA', 'confidentiality', 'legal-protection', 'standard']
  },
  {
    id: 'employment-agreement',
    name: 'Employment Agreement',
    category: 'Employment',
    description: 'Standard employment contract template with terms and conditions',
    content: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into between [Company] ("Employer") and [Employee Name] ("Employee").

1. POSITION AND DUTIES
Employee is hired as [Job Title] and shall perform duties as assigned by Employer.

2. TERM
Employment shall commence on [DATE] and continue until terminated by either party with [30] days written notice.

3. COMPENSATION
Base Salary: $[AMOUNT] per [YEAR/MONTH], paid [FREQUENCY]
Bonus: [SPECIFY IF APPLICABLE]
Benefits: [SPECIFY BENEFITS]

4. CONFIDENTIALITY
Employee shall maintain confidentiality of all proprietary and business information and shall not disclose such information during or after employment.

5. INTELLECTUAL PROPERTY
All work product, inventions, and intellectual property created during employment shall belong to Employer.

6. NON-COMPETE
Employee agrees not to engage in competing business activities for [6-12] months following employment termination within [GEOGRAPHIC AREA].

7. NON-SOLICITATION
Employee shall not solicit Employer's clients or employees for [2] years post-employment.

8. AT-WILL EMPLOYMENT
Employment is at-will and may be terminated by either party at any time with [30] days notice.

9. SEVERANCE
In case of termination without cause, Employee shall receive [SPECIFY SEVERANCE TERMS].

10. GOVERNING LAW
This Agreement is governed by the laws of [JURISDICTION].

AGREED AND ACKNOWLEDGED:

Employee: _____________________    Employer: _____________________
Date: _________________________    Date: _________________________`,
    keyPoints: [
      'Defines job title and responsibilities',
      'Specifies compensation and benefits',
      'Includes IP assignment clause',
      'Contains non-compete and non-solicitation',
      'Addresses severance terms'
    ],
    riskLevel: 'medium',
    tags: ['employment', 'HR', 'standard-agreement']
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    category: 'Business',
    description: 'General service agreement for consulting and service providers',
    content: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of [DATE] between [Service Provider] ("Provider") and [Client Company] ("Client").

1. SERVICES
Provider shall provide the following services: [DESCRIBE SERVICES] in accordance with professional standards.

2. TERM
This Agreement begins on [DATE] and continues for [DURATION], unless terminated earlier.

3. FEES AND PAYMENT
Service Fees: $[AMOUNT] per [HOUR/PROJECT]
Payment Terms: Net [30] days from invoice
Expenses: Reimbursable at cost plus [X]%

4. DELIVERABLES
Provider shall deliver: [LIST DELIVERABLES]
Delivery Schedule: [SPECIFY TIMELINE]

5. INTELLECTUAL PROPERTY
All work product shall be owned by [CLIENT/PROVIDER] as specified below:
[SPECIFY IP OWNERSHIP]

6. CONFIDENTIALITY
Both parties agree to maintain confidentiality of sensitive business information.

7. TERMINATION
Either party may terminate with [30] days written notice.

8. LIABILITY
Provider's liability shall not exceed the total fees paid in the preceding [12] months.

9. INDEMNIFICATION
Provider shall indemnify Client against third-party claims arising from Provider's breach or negligence.

10. GOVERNING LAW
Governed by the laws of [JURISDICTION].

AGREED AND ACKNOWLEDGED:

Provider: _____________________    Client: _____________________
Date: _________________________    Date: _________________________`,
    keyPoints: [
      'Defines specific services to be provided',
      'Specifies compensation structure',
      'Includes deliverables and timeline',
      'Addresses IP ownership',
      'Contains liability limitations'
    ],
    riskLevel: 'medium',
    tags: ['service', 'consulting', 'contract']
  },
  {
    id: 'privacy-policy',
    name: 'Privacy Policy Template',
    category: 'Privacy & Compliance',
    description: 'GDPR and CCPA compliant privacy policy template',
    content: `PRIVACY POLICY

Effective Date: [DATE]

1. INFORMATION WE COLLECT
We collect the following types of personal information:
- Contact information (name, email, phone)
- Usage information (IP address, pages visited)
- Device information (browser type, operating system)
- Payment information (processed securely)

2. HOW WE USE YOUR INFORMATION
We use personal information for:
- Providing and improving our services
- Communicating with you
- Processing payments
- Legal compliance
- Marketing (with your consent)

3. LAWFUL BASIS FOR PROCESSING (GDPR)
We process personal information based on:
- Your explicit consent
- Contractual necessity
- Legal obligation
- Legitimate business interests

4. YOUR RIGHTS
You have the right to:
- Access your personal information
- Correct inaccurate data
- Request deletion (right to be forgotten)
- Data portability
- Object to processing

5. INTERNATIONAL TRANSFERS
If we transfer data internationally, we use Standard Contractual Clauses or ensure adequacy decisions.

6. DATA RETENTION
We retain personal information for as long as necessary for the purposes outlined, typically [X] years.

7. SECURITY
We implement industry-standard security measures to protect your information.

8. THIRD-PARTY SHARING
We do not sell personal information. We share data only with:
- Service providers who assist us
- As required by law
- With your explicit consent

9. CALIFORNIA RESIDENTS (CCPA)
You have the right to:
- Know what personal information is collected
- Delete personal information
- Opt-out of the sale or sharing of personal information

10. CONTACT US
For privacy concerns, contact: [CONTACT EMAIL]`,
    keyPoints: [
      'GDPR compliant',
      'CCPA compliant',
      'Defines data collection practices',
      'Specifies user rights',
      'Includes retention policies',
      'Data transfer mechanisms'
    ],
    riskLevel: 'low',
    tags: ['privacy', 'GDPR', 'CCPA', 'compliance', 'policy']
  },
  {
    id: 'terms-of-service',
    name: 'Terms of Service',
    category: 'Legal',
    description: 'Standard terms of service for SaaS and web applications',
    content: `TERMS OF SERVICE

Last Updated: [DATE]

1. ACCEPTANCE OF TERMS
By accessing and using this service, you accept and agree to be bound by these terms.

2. USE LICENSE
We grant you a limited, non-exclusive license to use our service. You may not:
- Reproduce or distribute the service
- Transmit viruses or malicious code
- Attempt to reverse engineer the service
- Use the service for illegal purposes

3. DISCLAIMER OF WARRANTIES
The service is provided "as is" without warranties of any kind, either express or implied.

4. LIMITATION OF LIABILITY
In no event shall we be liable for indirect, incidental, special, or consequential damages, even if advised of the possibility.

5. INDEMNIFICATION
You agree to indemnify and hold harmless our company from any claims arising from your use of the service.

6. USER ACCOUNTS
You are responsible for maintaining confidentiality of account credentials and for all activities under your account.

7. CONTENT OWNERSHIP
You retain ownership of content you create. You grant us a license to use, modify, and distribute your content.

8. TERMINATION
We reserve the right to terminate accounts that violate these terms.

9. MODIFICATIONS
We may modify these terms at any time. Continued use constitutes acceptance.

10. GOVERNING LAW
These terms are governed by the laws of [JURISDICTION].`,
    keyPoints: [
      'Defines permitted use',
      'Includes liability disclaimers',
      'Specifies user responsibilities',
      'Addresses content ownership',
      'Allows for modifications'
    ],
    riskLevel: 'low',
    tags: ['terms-of-service', 'legal', 'SaaS']
  },
  {
    id: 'vendor-agreement',
    name: 'Vendor/Supplier Agreement',
    category: 'Business',
    description: 'Agreement template for vendor and supplier relationships',
    content: `VENDOR/SUPPLIER AGREEMENT

This Vendor Agreement ("Agreement") is entered into between [Company] ("Buyer") and [Vendor Name] ("Vendor").

1. PRODUCTS/SERVICES
Vendor shall supply the following: [DESCRIBE PRODUCTS/SERVICES]

2. TERM
Commencing [DATE] and continuing for [DURATION].

3. PRICING AND PAYMENT
Price: $[AMOUNT] per unit or [FREQUENCY]
Payment Terms: Net [30] days from invoice
Price adjustments: [SPECIFY CONDITIONS]

4. DELIVERY
Delivery Terms: [FOB, CIF, etc.]
Delivery Schedule: [SPECIFY TIMING]
Quality Standards: [SPECIFY REQUIREMENTS]

5. MINIMUM ORDER QUANTITIES
Minimum order: [QUANTITY]
Lead time: [DAYS]

6. QUALITY ASSURANCE
Vendor warrants that all products shall meet specifications and industry standards.

7. LIABILITY AND INDEMNIFICATION
Vendor shall indemnify Buyer for product defects, recalls, and third-party claims.

8. TERMINATION
Either party may terminate with [60] days notice.

9. CONFIDENTIALITY
Both parties shall maintain confidentiality of business and financial information.

10. GOVERNING LAW
Governed by the laws of [JURISDICTION].

AGREED AND ACKNOWLEDGED:

Vendor: _____________________    Buyer: _____________________
Date: _________________________    Date: _________________________`,
    keyPoints: [
      'Specifies products/services',
      'Defines pricing and payment terms',
      'Includes quality requirements',
      'Addresses liability and indemnification',
      'Specifies termination conditions'
    ],
    riskLevel: 'medium',
    tags: ['vendor', 'supplier', 'business-agreement']
  }
];

export function searchTemplates(query: string): ContractTemplate[] {
  const lowerQuery = query.toLowerCase();
  return contractTemplates.filter(template =>
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.category.toLowerCase().includes(lowerQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getTemplatesByCategory(category: string): ContractTemplate[] {
  return contractTemplates.filter(template => template.category === category);
}

export function getCategories(): string[] {
  const categories = new Set(contractTemplates.map(t => t.category));
  return Array.from(categories).sort();
}

export function getRiskLevelColor(risk: 'low' | 'medium' | 'high'): string {
  switch (risk) {
    case 'low':
      return 'text-green-500';
    case 'medium':
      return 'text-yellow-500';
    case 'high':
      return 'text-red-500';
  }
}

export function getRiskLevelBgColor(risk: 'low' | 'medium' | 'high'): string {
  switch (risk) {
    case 'low':
      return 'bg-green-500/10 border-green-500/20';
    case 'medium':
      return 'bg-yellow-500/10 border-yellow-500/20';
    case 'high':
      return 'bg-red-500/10 border-red-500/20';
  }
}
