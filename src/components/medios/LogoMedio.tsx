import { useState } from 'react';
import { Newspaper } from 'lucide-react';

interface LogoMedioProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

const LogoMedio = ({ 
  src, 
  alt, 
  className = "w-12 h-12 object-contain rounded-lg",
  fallbackIcon = <Newspaper className="w-12 h-12 text-muted-foreground" />
}: LogoMedioProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted rounded-lg`}>
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div className="relative">
      <img 
        src={src} 
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      {isLoading && (
        <div className={`${className} absolute inset-0 flex items-center justify-center bg-muted rounded-lg`}>
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default LogoMedio;
