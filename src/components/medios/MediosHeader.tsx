
import { Building2, Shield, Globe } from 'lucide-react';

const MediosHeader = () => {
  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center justify-center space-x-4">
          <div className="geometric-logo w-14 h-14 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-geometric-primary to-primary/80 rounded-asymmetric animate-geometric-float"></div>
            <div className="absolute inset-3 bg-white rounded-sm shadow-geometric flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-primary via-geometric-primary to-primary bg-clip-text text-transparent">Medios</span>
          </h1>
        </div>
      </div>

      <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
        
        
        
      </div>
    </div>
  );
};

export default MediosHeader;
