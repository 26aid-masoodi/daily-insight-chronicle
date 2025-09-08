import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const hasNote = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    const content = localStorage.getItem(`monitor-note-${dateKey}`);
    return content && content.trim().length > 0;
  };
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  const days = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2" />);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const noteExists = hasNote(date);
    
    days.push(
      <Button
        key={day}
        variant={isSelected ? "default" : "ghost"}
        className={cn(
          "h-12 w-12 p-0 font-mono text-sm transition-all duration-300 relative group",
          "hover:bg-primary/10 hover:shadow-glow hover:scale-105",
          isToday && "ring-2 ring-accent animate-pulse",
          isSelected && "bg-gradient-primary shadow-neural scale-105",
          noteExists && !isSelected && "bg-monitor-surface border border-primary/30",
          "transform-gpu" // GPU acceleration for smooth animations
        )}
        onClick={() => onDateSelect(date)}
      >
        <span className="relative z-10">{day}</span>
        
        {/* Neural grid effect on hover */}
        <div className="absolute inset-0 bg-grid-pattern opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded" />
        
        {/* Activity indicator */}
        {noteExists && (
          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
        )}
        
        {/* Glow effect for today */}
        {isToday && (
          <div className="absolute inset-0 bg-accent/10 rounded animate-glow-pulse" />
        )}
      </Button>
    );
  }
  
  return (
    <Card className="p-6 bg-gradient-surface border-monitor-grid shadow-elevated overflow-hidden relative animate-fade-in-up">
      {/* Background neural pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid-fade" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-primary animate-neural-pulse" />
            <h2 className="text-2xl font-bold text-monitor-highlight font-mono">
              {monthName} {year}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-primary/10 hover:shadow-glow transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="hover:bg-primary/10 hover:shadow-glow transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
            <div key={day} className="text-center text-xs font-bold text-primary-glow p-2 tracking-wider">
              <div className="relative">
                {day}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-px bg-primary/30" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced calendar grid */}
        <div className="grid grid-cols-7 gap-2 relative">
          {days}
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-monitor-grid">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span>Has Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-3 w-3 text-primary" />
              <span>Neural Tracking Active</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Calendar;