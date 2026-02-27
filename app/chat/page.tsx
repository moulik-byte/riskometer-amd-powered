'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hello! I\'m your contract analysis assistant. Upload a contract or ask me questions about contract terms, risks, and legal language. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contractContent, setContractContent] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = sessionStorage.getItem('contractContent');
    if (content) {
      setContractContent(content);
      addMessage('assistant', 'I have loaded your contract. Feel free to ask me any questions about it!', 'init');
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string, id?: string) => {
    const newMessage: ChatMessage = {
      id: id || Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const generateAssistantResponse = (query: string): string => {
    const queryLower = query.toLowerCase();

    if (!contractContent) {
      return "Please upload a contract first so I can answer questions about it. You can load a contract from the main page.";
    }

    // Simulate context-aware responses
    if (
      queryLower.includes('risk') ||
      queryLower.includes('dangerous') ||
      queryLower.includes('problem')
    ) {
      return 'Based on your contract, I\'ve identified several key risk areas. The main concerns are around liability limitations and confidentiality obligations. Would you like me to elaborate on any specific clause?';
    }

    if (
      queryLower.includes('liability') ||
      queryLower.includes('liable')
    ) {
      return 'The contract includes a limitation of liability clause that caps damages. This is generally favorable for the service provider. However, ensure the cap is reasonable for your business model.';
    }

    if (
      queryLower.includes('confidentiality') ||
      queryLower.includes('confidential') ||
      queryLower.includes('secret')
    ) {
      return 'I found confidentiality obligations in your contract. The agreement requires both parties to maintain strict confidentiality for a specified period. This protects your proprietary information effectively.';
    }

    if (
      queryLower.includes('payment') ||
      queryLower.includes('fee') ||
      queryLower.includes('cost')
    ) {
      return 'The payment terms specify monthly billing with payment due within 30 days of invoice. Late payments incur 1.5% monthly interest. This is fairly standard for service agreements.';
    }

    if (
      queryLower.includes('termination') ||
      queryLower.includes('end') ||
      queryLower.includes('cancel')
    ) {
      return 'The contract can be terminated for cause with 30 days written notice. Both parties have equal termination rights, which is balanced and fair.';
    }

    if (
      queryLower.includes('missing') ||
      queryLower.includes('should') ||
      queryLower.includes('need')
    ) {
      return 'I recommend adding or clarifying: (1) Force majeure clause, (2) Data protection and privacy terms, (3) Audit rights and procedures, and (4) Clear dispute resolution mechanism.';
    }

    if (queryLower.includes('recommend') || queryLower.includes('advise')) {
      return 'Key recommendations: 1) Negotiate liability caps if they\'re too low, 2) Clarify the scope of confidentiality, 3) Add explicit data protection terms, 4) Define performance metrics, 5) Include a dispute resolution process.';
    }

    return `I understand you\'re asking about "${query}". Based on the contract analysis, this falls within ${queryLower.includes('obligation') ? 'your obligations' : 'the key terms'}. Could you be more specific about what aspect interests you?`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    addMessage('user', inputValue);
    setInputValue('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const response = generateAssistantResponse(inputValue);
      addMessage('assistant', response);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/50 flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Contract Assistant</h1>
              <p className="text-xs text-muted-foreground">AI-powered Q&A</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/">Upload Contract</Link>
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-card border border-border rounded-bl-none'
                }`}
              >
                <p className="text-sm break-words">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === 'user'
                      ? 'text-primary-foreground/60'
                      : 'text-muted-foreground'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about the contract..."
              disabled={isLoading}
              className="flex-1 bg-card border-border"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-primary to-accent"
            >
              Send
            </Button>
          </form>

          {/* Suggested Questions */}
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'What are the main risks?',
                'What is the payment schedule?',
                'What clauses are missing?',
                'Tell me about liability',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInputValue(suggestion);
                  }}
                  className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
