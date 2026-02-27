'use client';

import { ContractTemplate, getRiskLevelBgColor, getRiskLevelColor } from '@/lib/template_library';
import { Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TemplateCardProps {
  template: ContractTemplate;
  onSelect?: (template: ContractTemplate) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([template.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  return (
    <>
      <div className="border border-border bg-card rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
            <p className="text-xs text-accent mt-1">{template.category}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${getRiskLevelColor(template.riskLevel)} ${getRiskLevelBgColor(template.riskLevel)}`}>
            {template.riskLevel} Risk
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{template.description}</p>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {template.keyPoints.slice(0, 2).map((point, idx) => (
              <span key={idx} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                {point}
              </span>
            ))}
            {template.keyPoints.length > 2 && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                +{template.keyPoints.length - 2} more
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {template.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-xs border border-border text-muted-foreground px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              setShowPreview(true);
            }}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button
            onClick={handleDownload}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          >
            <Download className="w-4 h-4" />
            Use Template
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto border border-border">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{template.name}</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-muted-foreground hover:text-foreground text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <pre className="bg-muted p-4 rounded text-sm text-muted-foreground overflow-auto max-h-96">
                  {template.content}
                </pre>
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload();
                    setShowPreview(false);
                  }}
                  className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
