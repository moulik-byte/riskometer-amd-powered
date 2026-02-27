'use client';

import { Button } from '@/components/ui/button';
import { Download, Copy, FileJson } from 'lucide-react';
import { useState } from 'react';

interface ExportButtonProps {
  data: any;
  fileName?: string;
}

export function ExportButton({ data, fileName = 'analysis' }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Analysis Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    h1, h2, h3 { color: #0f0f0f; }
    .score { font-size: 36px; font-weight: bold; color: #3b82f6; }
    .section { margin: 30px 0; }
    .card { border: 1px solid #e5e7eb; padding: 20px; margin: 10px 0; border-radius: 8px; background: #f9fafb; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; margin: 5px; font-size: 12px; }
    .badge-high { background: #fecaca; color: #991b1b; }
    .badge-medium { background: #fed7aa; color: #92400e; }
    .badge-low { background: #fef3c7; color: #92400e; }
  </style>
</head>
<body>
  <h1>Analysis Report</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  <pre>${JSON.stringify(data, null, 2)}</pre>
</body>
</html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={handleCopyToClipboard}
        variant="outline"
        className="gap-2"
      >
        <Copy className="w-4 h-4" />
        {copied ? 'Copied!' : 'Copy'}
      </Button>
      <Button
        onClick={handleDownloadJSON}
        variant="outline"
        className="gap-2"
      >
        <FileJson className="w-4 h-4" />
        JSON
      </Button>
      <Button
        onClick={handleDownloadHTML}
        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
      >
        <Download className="w-4 h-4" />
        HTML Report
      </Button>
    </div>
  );
}
