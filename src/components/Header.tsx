import React from 'react';
import { Activity, Shield, Zap } from 'lucide-react';
import monitorLogo from '@/assets/monitor-logo.png';
import SearchBar from './SearchBar';

interface HeaderProps {
  onDateSelect?: (date: Date) => void;
}

const Header: React.FC<HeaderProps> = ({ onDateSelect = () => {} }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-monitor-grid bg-gradient-surface/95 backdrop-blur-md">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 animate-grid-fade" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="relative">
              <img 
                src={monitorLogo} 
                alt="MONITOR" 
                className="h-8 w-8 object-contain animate-neural-pulse"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-glow-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-monitor-highlight tracking-wider">
                MONITOR
              </h1>
              <Shield className="h-5 w-5 text-primary animate-pulse" />
            </div>
          </div>
          
          {/* Enhanced Search Bar */}
          <div className="flex-1 max-w-md animate-slide-in-right">
            <SearchBar onDateSelect={onDateSelect} />
          </div>
          
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="relative">
                <Activity className="h-4 w-4 text-accent" />
                <div className="absolute inset-0 animate-ping">
                  <Activity className="h-4 w-4 text-accent/40" />
                </div>
              </div>
              <span className="font-mono">NEURAL ACTIVE</span>
            </div>
            
            <div className="h-6 w-px bg-monitor-grid" />
            
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-primary-glow" />
              <div className="text-sm font-mono text-muted-foreground">
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-accent-glow rounded-full animate-pulse delay-200" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;