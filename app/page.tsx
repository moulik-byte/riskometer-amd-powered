'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import Link from 'next/link';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileSelected = async (content: string, fileName: string) => {
    setIsLoading(true);
    try {
      // Store contract in sessionStorage for analysis
      sessionStorage.setItem('contractContent', content);
      sessionStorage.setItem('contractName', fileName);
      
      // Navigate to analysis page
      router.push('/analysis');
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/50">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-white">⚖️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PrivacyGuard AI</h1>
              <p className="text-xs text-muted-foreground">Contract Analysis Engine</p>
            </div>
          </div>
          <nav className="hidden sm:flex gap-6">
            <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground transition">
              Templates
            </Link>
            <Link href="/compliance" className="text-sm text-muted-foreground hover:text-foreground transition">
              Compliance
            </Link>
            <Link href="/comparison" className="text-sm text-muted-foreground hover:text-foreground transition">
              Compare
            </Link>
            <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition">
              Chat
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-balance text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Analyze Contracts Instantly
              </h2>
              <p className="text-pretty text-lg text-muted-foreground">
                Powered by AMD AI acceleration and advanced legal analysis. Identify risks, understand obligations, and negotiate with confidence.
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 font-bold text-xs">✓</div>
                <span className="text-muted-foreground">AI-powered clause extraction and analysis</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 font-bold text-xs">✓</div>
                <span className="text-muted-foreground">Real-time risk scoring (0-100)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 font-bold text-xs">✓</div>
                <span className="text-muted-foreground">Compare multiple contracts side-by-side</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 font-bold text-xs">✓</div>
                <span className="text-muted-foreground">Local processing with AMD acceleration</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500/50"></span>
                AMD Radeon GPU Acceleration Ready
              </p>
            </div>
          </div>

          {/* Right Column - File Upload */}
          <div className="space-y-4">
            <FileUploader
              onFileSelected={handleFileSelected}
              isLoading={isLoading}
              acceptedTypes={['.txt', '.pdf', '.doc', '.docx']}
            />

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-border hover:bg-card/80"
                onClick={() => {
                  // Sample contract
                  const sampleContract = `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of January 1, 2024, between Provider Corp ("Provider") and Client Inc. ("Client").

1. CONFIDENTIALITY
Both parties agree to maintain strict confidentiality of any proprietary information disclosed. Confidential information shall be protected for a period of 5 years after termination of this agreement.

2. LIABILITY
Provider's total liability shall not exceed the fees paid in the preceding 12 months. In no case shall Provider be liable for indirect, incidental, or consequential damages.

3. TERM AND TERMINATION
This agreement shall commence on the effective date and continue for one (1) year. Either party may terminate for cause with 30 days written notice.

4. PAYMENT TERMS
Client shall pay Provider a monthly fee of $10,000 due within 30 days of invoice. Late payments subject to 1.5% monthly interest.

5. INTELLECTUAL PROPERTY
All work product created under this agreement shall be owned by Provider. Client receives a non-exclusive license to use deliverables.

6. GOVERNING LAW
This agreement shall be governed by the laws of New York State, with disputes resolved through binding arbitration.`;
                  handleFileSelected(sampleContract, 'sample_agreement.txt');
                }}
              >
                Load Sample
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-card/80"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl font-bold text-center mb-12">
          Powerful Features for Contract Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: '🔍',
              title: 'Clause Detection',
              desc: 'Automatically identify and extract key contract clauses',
              link: '/analysis',
            },
            {
              icon: '⚠️',
              title: 'Risk Assessment',
              desc: 'Get detailed risk scores with recommendations',
              link: '/analysis',
            },
            {
              icon: '📊',
              title: 'Analytics Dashboard',
              desc: 'Visualize risk distribution across categories',
              link: '/analysis',
            },
            {
              icon: '🛡️',
              title: 'Compliance Checker',
              desc: 'Check GDPR, CCPA, and HIPAA compliance',
              link: '/compliance',
            },
            {
              icon: '📋',
              title: 'Template Library',
              desc: 'Pre-built templates for common contracts',
              link: '/templates',
            },
            {
              icon: '📄',
              title: 'PDF Export',
              desc: 'Generate professional analysis reports',
              link: '/analysis',
            },
            {
              icon: '🔄',
              title: 'Contract Comparison',
              desc: 'Compare multiple contracts side-by-side',
              link: '/comparison',
            },
            {
              icon: '💬',
              title: 'AI Chat Assistant',
              desc: 'Ask questions about your contracts in plain English',
              link: '/chat',
            },
            {
              icon: '⚡',
              title: 'AMD Acceleration',
              desc: 'Lightning-fast processing with ROCm/ONNX',
              link: '/',
            },
          ].map((feature, idx) => (
            <Link
              key={idx}
              href={feature.link}
              className="group p-6 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 PrivacyGuard AI. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition">Terms</Link>
              <Link href="#" className="hover:text-foreground transition">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
