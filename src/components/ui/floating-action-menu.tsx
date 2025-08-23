
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingActionMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
  }[];
  className?: string;
  children?: React.ReactNode;
};

const FloatingActionMenu = ({
  options,
  className,
  children,
}: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("fixed bottom-8 right-8", className)}>
      <Button
        onClick={toggleMenu}
        className="w-10 h-10 rounded-full bg-blue-500/90 hover:bg-blue-600/90 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-400/30"
      >
        <div
          style={{
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <Plus className="w-6 h-6 text-white" />
        </div>
      </Button>

      {isOpen && (
        <div
          className="absolute bottom-12 right-0 mb-2"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translate(0, 0)' : 'translate(10px, 10px)',
            filter: isOpen ? 'blur(0px)' : 'blur(10px)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="flex flex-col items-end gap-2">
            {children ? (
              <div
                className="bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-geometric border border-border min-w-[280px]"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'all 0.3s ease-out 0.05s'
                }}
              >
                {children}
              </div>
            ) : (
              options.map((option, index) => (
                <div
                  key={index}
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
                    transition: `all 0.3s ease-out ${index * 0.05}s`
                  }}
                >
                  <Button
                    onClick={option.onClick}
                    size="sm"
                    className="flex items-center gap-2 bg-background/95 hover:bg-background border border-border shadow-geometric backdrop-blur-sm rounded-xl text-foreground"
                  >
                    {option.Icon}
                    <span>{option.label}</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingActionMenu;
