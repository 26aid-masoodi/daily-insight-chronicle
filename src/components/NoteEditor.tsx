import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calendar as CalendarIcon } from 'lucide-react';
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
    }
  }, [dateKey]);
  
  const saveNote = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(`monitor-note-${dateKey}`, content);
      toast({
        title: "Note Saved",
        description: `Activity log for ${formattedDate} has been saved.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save your note. Please try again.",
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
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [content, dateKey]);
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calendar
          </Button>
          
          <Button
            onClick={saveNote}
            disabled={isSaving}
            className="bg-gradient-primary hover:shadow-glow"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
        
        <Card className="p-8 bg-gradient-surface border-monitor-grid shadow-elevated">
          <div className="flex items-center gap-3 mb-6">
            <CalendarIcon className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-monitor-highlight">
                Activity Monitor
              </h1>
              <p className="text-muted-foreground font-mono">
                {formattedDate}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-monitor-surface border border-monitor-grid">
                <h3 className="font-medium text-accent">Status</h3>
                <p className="text-2xl font-bold text-accent-glow">Active</p>
              </div>
              <div className="p-4 rounded-lg bg-monitor-surface border border-monitor-grid">
                <h3 className="font-medium text-primary">Session</h3>
                <p className="text-2xl font-bold text-primary-glow font-mono">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-monitor-surface border border-monitor-grid">
                <h3 className="font-medium text-muted-foreground">Log Size</h3>
                <p className="text-2xl font-bold text-foreground font-mono">
                  {content.length} chars
                </p>
              </div>
            </div>
            
            <Textarea
              placeholder="Begin monitoring session... Document activities, thoughts, progress, and observations here."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] resize-none font-mono text-base bg-monitor-surface border-monitor-grid focus:ring-primary focus:border-primary"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NoteEditor;