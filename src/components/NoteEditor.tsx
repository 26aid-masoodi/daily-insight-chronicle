import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calendar as CalendarIcon, Activity, BarChart3, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface NoteEditorProps {
  date: Date;
  onBack: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ date, onBack }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [sessionStart] = useState(new Date());
  
  const dateKey = date.toISOString().split('T')[0];
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Load existing content
  useEffect(() => {
    const saved = localStorage.getItem(`monitor-note-${dateKey}`);
    if (saved) {
      setContent(saved);
      setWordCount(saved.split(/\s+/).filter(word => word.length > 0).length);
    }
  }, [dateKey]);
  
  // Update word count
  useEffect(() => {
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
  }, [content]);
  
  const saveNote = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(`monitor-note-${dateKey}`, content);
      setLastSaved(new Date());
      toast({
        title: "Neural Link Established",
        description: `Activity log synchronized for ${formattedDate}`,
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Neural network connection lost. Retry synchronization.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Auto-save on content change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content !== (localStorage.getItem(`monitor-note-${dateKey}`) || '')) {
        localStorage.setItem(`monitor-note-${dateKey}`, content);
        setLastSaved(new Date());
      }
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [content, dateKey]);
  
  const getSessionDuration = () => {
    const now = new Date();
    const diff = now.getTime() - sessionStart.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden animate-fade-in">
      {/* Neural background pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 animate-grid-fade" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-8 animate-slide-in-left">
            <Button
              variant="ghost"
              onClick={onBack}
              className="hover:bg-primary/10 hover:shadow-glow transition-all duration-300 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Neural Interface
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground font-mono">
                SESSION: {getSessionDuration()}
              </div>
              <Button
                onClick={saveNote}
                disabled={isSaving}
                className="bg-gradient-primary hover:shadow-neural transition-all duration-300"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Syncing...' : 'Sync Data'}
              </Button>
            </div>
          </div>
          
          {/* Main Editor Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Editor Section */}
            <div className="xl:col-span-3 space-y-6">
              {/* Enhanced Title Card */}
              <Card className="p-8 bg-gradient-surface border-monitor-grid shadow-neural animate-fade-in-up">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <CalendarIcon className="h-8 w-8 text-primary animate-neural-pulse" />
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-glow-pulse" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-monitor-highlight mb-2">
                        NEURAL ACTIVITY LOG
                      </h1>
                      <div className="flex items-center gap-4">
                        <p className="text-muted-foreground font-mono text-lg">
                          {formattedDate}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                          <span className="text-xs text-accent-glow font-mono">RECORDING</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Advanced Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-monitor-surface border border-monitor-grid hover:border-primary/30 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                        <div>
                          <h3 className="font-medium text-accent text-sm">Neural State</h3>
                          <p className="text-xl font-bold text-accent-glow font-mono">ACTIVE</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-monitor-surface border border-monitor-grid hover:border-primary/30 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        <div>
                          <h3 className="font-medium text-primary text-sm">Session Time</h3>
                          <p className="text-xl font-bold text-primary-glow font-mono">
                            {getSessionDuration()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-monitor-surface border border-monitor-grid hover:border-primary/30 transition-colors group">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                        <div>
                          <h3 className="font-medium text-muted-foreground text-sm">Word Count</h3>
                          <p className="text-xl font-bold text-foreground font-mono">
                            {wordCount}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-monitor-surface border border-monitor-grid hover:border-primary/30 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-primary-glow group-hover:scale-110 transition-transform" />
                        <div>
                          <h3 className="font-medium text-primary-glow text-sm">Data Size</h3>
                          <p className="text-xl font-bold text-primary font-mono">
                            {content.length}B
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Enhanced Editor */}
              <Card className="p-6 bg-gradient-surface border-monitor-grid shadow-elevated animate-fade-in-up delay-100">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="relative z-10">
                  <Textarea
                    placeholder=">>> NEURAL INTERFACE ACTIVE: Begin data input for cognitive monitoring session...
>>> Document activities, thoughts, progress, and behavioral patterns
>>> All input is encrypted and stored in local neural cache
>>> Type freely - auto-sync enabled..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[500px] resize-none font-mono text-base bg-monitor-surface/50 border-monitor-grid focus:ring-primary focus:border-primary leading-relaxed backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </Card>
            </div>
            
            {/* Side Panel */}
            <div className="space-y-6">
              {/* Status Panel */}
              <Card className="p-6 bg-gradient-surface border-monitor-grid shadow-elevated animate-slide-in-right">
                <h3 className="text-lg font-semibold text-monitor-highlight mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent animate-pulse" />
                  System Status
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-monitor-grid/50">
                    <span className="text-sm text-muted-foreground">Neural Link</span>
                    <span className="text-sm font-mono text-accent-glow">ESTABLISHED</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-monitor-grid/50">
                    <span className="text-sm text-muted-foreground">Auto-Sync</span>
                    <span className="text-sm font-mono text-accent-glow">ENABLED</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-monitor-grid/50">
                    <span className="text-sm text-muted-foreground">Last Sync</span>
                    <span className="text-sm font-mono text-primary-glow">
                      {lastSaved ? lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Encryption</span>
                    <span className="text-sm font-mono text-accent-glow">AES-256</span>
                  </div>
                </div>
              </Card>
              
              {/* Quick Stats */}
              <Card className="p-6 bg-gradient-surface border-monitor-grid shadow-elevated animate-slide-in-right delay-100">
                <h3 className="text-lg font-semibold text-monitor-highlight mb-4">Session Metrics</h3>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-monitor-surface border border-monitor-grid">
                    <div className="text-xs text-muted-foreground mb-1">Characters</div>
                    <div className="text-2xl font-bold text-foreground font-mono">{content.length}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-monitor-surface border border-monitor-grid">
                    <div className="text-xs text-muted-foreground mb-1">Words</div>
                    <div className="text-2xl font-bold text-foreground font-mono">{wordCount}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-monitor-surface border border-monitor-grid">
                    <div className="text-xs text-muted-foreground mb-1">Lines</div>
                    <div className="text-2xl font-bold text-foreground font-mono">{content.split('\n').length}</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;