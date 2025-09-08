import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="p-8 max-w-md w-full bg-gradient-surface border-monitor-grid shadow-elevated text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>
        
        <h1 className="text-4xl font-bold text-monitor-highlight mb-4 font-mono">
          404
        </h1>
        
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Access Denied
        </h2>
        
        <p className="text-muted-foreground mb-8">
          The requested resource could not be located in the MONITOR system.
        </p>
        
        <Button 
          asChild 
          className="bg-gradient-primary hover:shadow-glow"
        >
          <a href="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Base
          </a>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
