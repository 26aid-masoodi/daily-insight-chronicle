import React, { useState } from 'react';
import Header from '@/components/Header';
import Calendar from '@/components/Calendar';
import NoteEditor from '@/components/NoteEditor';
import { Card } from '@/components/ui/card';
import { FileText, Calendar as CalendarIcon } from 'lucide-react';

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
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const content = localStorage.getItem(`monitor-note-${dateKey}`);
      
      if (content && content.trim()) {
        notes.push({
          date: date,
          content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
          charCount: content.length
        });
      }
    }
    
    return notes;
  };

  if (view === 'editor' && selectedDate) {
    return <NoteEditor date={selectedDate} onBack={handleBackToCalendar} />;
  }

  const recentNotes = getRecentNotes();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-monitor-highlight mb-2">
                Activity Calendar
              </h2>
              <p className="text-muted-foreground">
                Select any date to monitor and log your activities
              </p>
            </div>
            
            <Calendar 
              onDateSelect={handleDateSelect} 
              selectedDate={selectedDate || undefined}
            />
          </div>
          
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-surface border-monitor-grid">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-monitor-highlight">
                  Recent Activity
                </h3>
              </div>
              
              {recentNotes.length > 0 ? (
                <div className="space-y-3">
                  {recentNotes.map((note, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg bg-monitor-surface border border-monitor-grid cursor-pointer hover:bg-primary/5 transition-colors"
                      onClick={() => handleDateSelect(note.date)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-primary">
                          {note.date.toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {note.charCount} chars
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No recent activity logs found. Start by selecting a date.
                </p>
              )}
            </Card>
            
            <Card className="p-6 bg-gradient-surface border-monitor-grid">
              <div className="flex items-center gap-3 mb-4">
                <CalendarIcon className="h-5 w-5 text-accent" />
                <h3 className="text-xl font-semibold text-monitor-highlight">
                  System Status
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Storage</span>
                  <span className="text-sm font-mono text-accent-glow">
                    {Object.keys(localStorage).filter(key => key.startsWith('monitor-note-')).length} entries
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-mono text-accent-glow">OPERATIONAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Access</span>
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
  );
};

export default Index;
