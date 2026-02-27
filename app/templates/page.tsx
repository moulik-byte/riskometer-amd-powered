'use client';

import { useState, useMemo } from 'react';
import { TemplateCard } from '@/components/TemplateCard';
import { contractTemplates, getCategories, searchTemplates } from '@/lib/template_library';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Search } from 'lucide-react';

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = useMemo(() => getCategories(), []);

  const filteredTemplates = useMemo(() => {
    let results = contractTemplates;

    if (searchQuery.trim()) {
      results = searchTemplates(searchQuery);
    }

    if (selectedCategory) {
      results = results.filter(t => t.category === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Template Library</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Choose from pre-built contract templates tailored to common business scenarios
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Search Bar */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates by name, category, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-end">
            <span className="text-sm text-muted-foreground">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-3">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full transition-all ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <Card className="border border-border bg-card rounded-lg p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Templates Found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or category filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Quick Start Section */}
        <div className="mt-16 p-8 bg-card border border-border rounded-lg">
          <h2 className="text-2xl font-semibold text-foreground mb-4">How to Use Templates</h2>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex gap-4">
              <span className="font-semibold text-primary">1.</span>
              <span>Browse templates or use the search bar to find what you need</span>
            </li>
            <li className="flex gap-4">
              <span className="font-semibold text-primary">2.</span>
              <span>Preview the template to ensure it meets your requirements</span>
            </li>
            <li className="flex gap-4">
              <span className="font-semibold text-primary">3.</span>
              <span>Download the template and customize it with your specific details</span>
            </li>
            <li className="flex gap-4">
              <span className="font-semibold text-primary">4.</span>
              <span>Upload the customized contract to PrivacyGuard for analysis</span>
            </li>
            <li className="flex gap-4">
              <span className="font-semibold text-primary">5.</span>
              <span>Review compliance and risk recommendations before signing</span>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
