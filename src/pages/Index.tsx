import React, { useState } from 'react';
import Header from '@/components/Header';
import Calendar from '@/components/Calendar';
import NoteEditor from '@/components/NoteEditor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar as CalendarIcon, TrendingUp, Database, Zap, Brain } from 'lucide-react';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'calendar' | 'editor'>('calendar');

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setView('editor');
  };

  const handleBackToCalendar = () => {
    setView('calendar');
  };

  const getRecentNotes = () => {
    const notes = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const content = localStorage.getItem(`monitor-note-${dateKey}`);
      
      if (content && content.trim()) {
        notes.push({
          date: date,
          content: content.substring(0, 120) + (content.length > 120 ? '...' : ''),
          charCount: content.length,
          wordCount: content.split(/\s+/).filter(word => word.length > 0).length
        });
      }
    }
    
    return notes;
  };

  const getAnalytics = () => {
    const allNotes = Object.keys(localStorage).filter(key => key.startsWith('monitor-note-'));
    const totalEntries = allNotes.length;
    const totalChars = allNotes.reduce((acc, key) => {
      const content = localStorage.getItem(key);
      return acc + (content ? content.length : 0);
    }, 0);
    
    const avgCharsPerEntry = totalEntries > 0 ? Math.round(totalChars / totalEntries) : 0;
    
    return { totalEntries, totalChars, avgCharsPerEntry };
  };

  if (view === 'editor' && selectedDate) {
    return <NoteEditor date={selectedDate} onBack={handleBackToCalendar} />;
  }

  const recentNotes = getRecentNotes();
  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Advanced Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 animate-grid-fade" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="relative z-10">
        <Header onDateSelect={handleDateSelect} />
        
        <main className="max-w-7xl mx-auto p-6">
          {/* Enhanced Hero Section */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Brain className="h-12 w-12 text-primary animate-neural-pulse" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-glow-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-monitor-highlight mb-2">
                  Neural Activity Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Advanced cognitive monitoring and data visualization system
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Calendar Section */}
            <div className="xl:col-span-2 space-y-6">
              <div className="animate-fade-in-up">
                <Calendar 
                  onDateSelect={handleDateSelect} 
                  selectedDate={selectedDate || undefined}
                />
              </div>
              
              {/* Analytics Overview */}
              <Card className="p-6 bg-gradient-surface border-monitor-grid shadow-elevated animate-fade-in-up delay-100">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-accent animate-pulse" />
                  <h3 className="text-xl font-semibold text-monitor-highlight">
                    Neural Analytics
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-monitor-surface border border-monitor-grid hover:border-primary/30 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-medium text-primary text-sm">Total Sessions</h4>
                        <p className="text-2xl font-bold text-primary-glow font-mono">
                          {analytics.totalEntries}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-monitor-surface border border-monitor-grid hover:border-accent/30 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-medium text-accent text-sm">Data Volume</h4>
                        <p className="text-2xl font-bold text-accent-glow font-mono">
                          {(analytics.totalChars / 1000).toFixed(1)}K
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-monitor-surface border border-monitor-grid hover:border-monitor-highlight/30 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-monitor-highlight group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-medium text-monitor-highlight text-sm">Avg. Session</h4>
                        <p className="text-2xl font-bold text-foreground font-mono">
                          {analytics.avgCharsPerEntry}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card className="p-6 bg-gradient-surface border-monitor-grid shadow-elevated animate-slide-in-right">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-5 w-5 text-primary animate-neural-pulse" />
                  <h3 className="text-xl font-semibold text-monitor-highlight">
                    Recent Neural Activity
                  </h3>
                </div>
                
                {recentNotes.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {recentNotes.map((note, index) => (
                      <div 
                        key={index}
                        className="group p-4 rounded-lg bg-monitor-surface border border-monitor-grid cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 transform hover:scale-[1.02]"
                        onClick={() => handleDateSelect(note.date)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-mono text-primary-glow">
                            {note.date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{note.wordCount} words</span>
                            <span>{note.charCount}B</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {note.content}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Click to access neural session →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-sm mb-4">
                      No neural activity detected
                    </p>
                    <Button 
                      onClick={() => handleDateSelect(new Date())}
                      variant="outline"
                      className="hover:bg-primary/10 hover:border-primary"
                    >
                      Initialize Today's Session
                    </Button>
                  </div>
                )}
              </Card>
              
              {/* System Status */}
              <Card className="p-6 bg-gradient-surface border-monitor-grid shadow-elevated animate-slide-in-right delay-100">
                <div className="flex items-center gap-3 mb-6">
                  <CalendarIcon className="h-5 w-5 text-accent animate-pulse" />
                  <h3 className="text-xl font-semibold text-monitor-highlight">
                    System Status
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-monitor-grid/50">
                    <span className="text-sm text-muted-foreground">Neural Network</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      <span className="text-sm font-mono text-accent-glow">ACTIVE</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-monitor-grid/50">
                    <span className="text-sm text-muted-foreground">Data Sync</span>
                    <span className="text-sm font-mono text-accent-glow">REAL-TIME</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-monitor-grid/50">
                    <span className="text-sm text-muted-foreground">Storage</span>
                    <span className="text-sm font-mono text-primary-glow">
                      {analytics.totalEntries} entries
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-monitor-grid/50">
                    <span className="text-sm text-muted-foreground">Encryption</span>
                    <span className="text-sm font-mono text-accent-glow">AES-256</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Session Time</span>
                    <span className="text-sm font-mono text-primary-glow">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
