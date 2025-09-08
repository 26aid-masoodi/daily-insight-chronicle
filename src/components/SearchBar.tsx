import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, FileText, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SearchResult {
  date: Date;
  content: string;
  excerpt: string;
  charCount: number;
}

interface SearchBarProps {
  onDateSelect: (date: Date) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onDateSelect, className }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search through all stored notes
  const searchNotes = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = searchQuery.toLowerCase();

    // Get all monitor notes from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('monitor-note-')) {
        const content = localStorage.getItem(key);
        if (content && content.toLowerCase().includes(lowerQuery)) {
          const dateStr = key.replace('monitor-note-', '');
          const date = new Date(dateStr);
          
          // Create excerpt with highlighted text
          const index = content.toLowerCase().indexOf(lowerQuery);
          const start = Math.max(0, index - 50);
          const end = Math.min(content.length, index + searchQuery.length + 50);
          const excerpt = (start > 0 ? '...' : '') + 
                         content.substring(start, end) + 
                         (end < content.length ? '...' : '');

          results.push({
            date,
            content,
            excerpt,
            charCount: content.length
          });
        }
      }
    }

    // Sort by date (newest first)
    return results.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true);
        const searchResults = searchNotes(query);
        setResults(searchResults);
        setIsSearching(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index} className="bg-primary/30 text-primary-glow px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const handleResultClick = (result: SearchResult) => {
    onDateSelect(result.date);
    setIsOpen(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search activity logs... (⌘K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 bg-monitor-surface border-monitor-grid focus:border-primary focus:shadow-glow transition-all duration-300"
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-primary/10"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-0 bg-monitor-surface border-monitor-grid shadow-neural z-50 animate-fade-in-up">
          <div className="max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center">
                <div className="animate-pulse text-muted-foreground">
                  Scanning activity logs...
                </div>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="p-3 border-b border-monitor-grid">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{results.length} result{results.length !== 1 ? 's' : ''} found</span>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => handleResultClick(result)}
                      className="p-4 hover:bg-primary/5 cursor-pointer border-b border-monitor-grid/50 last:border-b-0 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-primary" />
                          <span className="text-sm font-mono text-primary-glow">
                            {result.date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{result.charCount} chars</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {highlightText(result.excerpt, query)}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No activity logs found for "{query}"</p>
                <p className="text-xs mt-1">Try different keywords or check your spelling</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;