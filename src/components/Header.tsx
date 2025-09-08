import React from 'react';
import { Activity, Shield } from 'lucide-react';
import monitorLogo from '@/assets/monitor-logo.png';

const Header: React.FC = () => {
  return (
    <header className="border-b border-monitor-grid bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={monitorLogo} 
              alt="MONITOR" 
              className="h-8 w-8 object-contain"
            />
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-monitor-highlight tracking-wider">
                MONITOR
              </h1>
              <Shield className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4 text-accent animate-pulse" />
              <span className="font-mono">SYSTEM ACTIVE</span>
            </div>
            <div className="h-6 w-px bg-monitor-grid" />
            <div className="text-sm font-mono text-muted-foreground">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;