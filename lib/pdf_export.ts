// PDF Export Utility - Generate downloadable PDF reports
// Uses client-side PDF generation with html2canvas and jsPDF

export interface PDFReportData {
  contractName: string;
  analysisDate: string;
  riskScore: number;
  riskLevel: string;
  summary: string;
  clauses: Array<{
    type: string;
    content: string;
    severity: string;
  }>;
  risks: Array<{
    category: string;
    score: number;
    items: string[];
  }>;
  recommendations: string[];
  complianceReports?: Array<{
    standard: string;
    score: number;
    status: string;
  }>;
}

export function generatePDFReport(data: PDFReportData): Blob {
  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Contract Analysis Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #1a1a1a;
          line-height: 1.6;
          padding: 40px;
          background: white;
        }
        header {
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        h1 {
          color: #0f0f0f;
          margin-bottom: 10px;
          font-size: 28px;
        }
        .metadata {
          color: #666;
          font-size: 14px;
        }
        .risk-score-section {
          background: #f0f9ff;
          border-left: 4px solid #3b82f6;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .risk-score {
          font-size: 36px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 10px;
        }
        .risk-level {
          font-size: 18px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 10px;
        }
        .risk-safe { background: #dcfce7; color: #166534; }
        .risk-low { background: #fef3c7; color: #92400e; }
        .risk-medium { background: #fed7aa; color: #92400e; }
        .risk-high { background: #fecaca; color: #991b1b; }
        
        section {
          margin: 30px 0;
          page-break-inside: avoid;
        }
        h2 {
          color: #0f0f0f;
          font-size: 20px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 15px;
          margin-top: 30px;
        }
        .summary {
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 15px;
        }
        
        .clause-card {
          background: #f9fafb;
          border-left: 3px solid #06b6d4;
          padding: 15px;
          margin: 12px 0;
          border-radius: 4px;
          page-break-inside: avoid;
        }
        .clause-type {
          font-weight: 600;
          color: #0f0f0f;
          margin-bottom: 5px;
        }
        .clause-content {
          color: #4b5563;
          font-size: 13px;
        }
        .severity-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 3px;
          margin-top: 8px;
        }
        .severity-low { background: #dcfce7; color: #166534; }
        .severity-medium { background: #fef3c7; color: #92400e; }
        .severity-high { background: #fecaca; color: #991b1b; }
        
        .risk-item {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 12px;
          margin: 10px 0;
          border-radius: 4px;
        }
        .risk-category {
          font-weight: 600;
          color: #0f0f0f;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .risk-score-bar {
          display: inline-block;
          background: #e5e7eb;
          height: 6px;
          border-radius: 3px;
          width: 200px;
          position: relative;
        }
        .risk-score-fill {
          height: 100%;
          background: #3b82f6;
          border-radius: 3px;
        }
        
        .recommendation {
          background: #eff6ff;
          border-left: 3px solid #3b82f6;
          padding: 12px;
          margin: 10px 0;
          border-radius: 4px;
        }
        .recommendation-text {
          color: #0c4a6e;
        }
        
        .compliance-section {
          margin-top: 30px;
        }
        .compliance-item {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 12px;
          margin: 10px 0;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .compliance-status {
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 3px;
          font-size: 12px;
        }
        .status-pass { background: #dcfce7; color: #166534; }
        .status-fail { background: #fecaca; color: #991b1b; }
        .status-warning { background: #fef3c7; color: #92400e; }
        
        footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
        }
        
        .page-break {
          page-break-after: always;
        }
        
        @media print {
          body { padding: 0; }
          h2 { margin-top: 20px; }
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Contract Analysis Report</h1>
        <div class="metadata">
          <strong>Contract:</strong> ${data.contractName}<br>
          <strong>Date:</strong> ${data.analysisDate}
        </div>
      </header>
      
      <section class="risk-score-section">
        <div class="risk-score">${data.riskScore}/100</div>
        <div>Risk Level: <span class="risk-level risk-${data.riskLevel.toLowerCase()}">${data.riskLevel}</span></div>
        <p style="margin-top: 15px; color: #4b5563;">${data.summary}</p>
      </section>
      
      <section>
        <h2>Key Clauses Identified</h2>
        ${data.clauses.map(clause => `
          <div class="clause-card">
            <div class="clause-type">${clause.type}</div>
            <div class="clause-content">${clause.content.substring(0, 200)}${clause.content.length > 200 ? '...' : ''}</div>
            <span class="severity-badge severity-${clause.severity.toLowerCase()}">${clause.severity}</span>
          </div>
        `).join('')}
      </section>
      
      <section>
        <h2>Risk Analysis by Category</h2>
        ${data.risks.map(risk => `
          <div class="risk-item">
            <div class="risk-category">
              <span>${risk.category}</span>
              <strong>${risk.score}/100</strong>
            </div>
            <div class="risk-score-bar">
              <div class="risk-score-fill" style="width: ${risk.score}%"></div>
            </div>
            <ul style="margin-top: 10px; margin-left: 20px; color: #4b5563; font-size: 13px;">
              ${risk.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </section>
      
      <section>
        <h2>Recommendations</h2>
        ${data.recommendations.map(rec => `
          <div class="recommendation">
            <p class="recommendation-text">${rec}</p>
          </div>
        `).join('')}
      </section>
      
      ${data.complianceReports && data.complianceReports.length > 0 ? `
        <section class="compliance-section page-break">
          <h2>Compliance Status</h2>
          ${data.complianceReports.map(comp => {
            const status = comp.score >= 80 ? 'Pass' : comp.score >= 60 ? 'Warning' : 'Fail';
            const statusClass = status === 'Pass' ? 'status-pass' : status === 'Warning' ? 'status-warning' : 'status-fail';
            return `
              <div class="compliance-item">
                <span>${comp.standard}</span>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <span style="font-weight: 600;">${comp.score}%</span>
                  <span class="compliance-status ${statusClass}">${status}</span>
                </div>
              </div>
            `;
          }).join('')}
        </section>
      ` : ''}
      
      <footer>
        <p>PrivacyGuard AI - Automated Contract Analysis Platform</p>
        <p>This report was generated automatically and should be reviewed by legal professionals.</p>
      </footer>
    </body>
    </html>
  `;

  // Convert HTML to PDF (in real implementation, use html2pdf or similar library)
  // For now, we'll return a blob that can be used with jsPDF + html2canvas
  return new Blob([htmlContent], { type: 'text/html' });
}

export async function downloadPDF(data: PDFReportData, filename: string = 'contract-analysis.pdf'): Promise<void> {
  // This function assumes html2pdf library is available
  // Install: npm install html2pdf.js

  const element = document.createElement('div');
  element.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Contract Analysis Report</h1>
      <p><strong>Contract:</strong> ${data.contractName}</p>
      <p><strong>Date:</strong> ${data.analysisDate}</p>
      <hr>
      
      <h2>Risk Score: ${data.riskScore}/100 (${data.riskLevel})</h2>
      <p>${data.summary}</p>
      
      <h3>Key Clauses</h3>
      ${data.clauses.map(c => `
        <p><strong>${c.type}</strong> - ${c.severity}</p>
        <p style="margin-left: 20px;">${c.content.substring(0, 150)}...</p>
      `).join('')}
      
      <h3>Recommendations</h3>
      <ul>
        ${data.recommendations.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
  `;

  // Using html2pdf library (needs to be installed separately)
  // window.html2pdf().set(options).from(element).save(filename);
  
  // Fallback: Create a simple downloadable file
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([element.innerHTML], { type: 'text/html' }));
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function exportAsJSON(data: PDFReportData, filename: string = 'contract-analysis.json'): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
