
import React from 'react';
import { cn } from '@/lib/utils';

interface CyberCardProps {
  title?: string;
  borderGlow?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

const CyberCard = ({
  title,
  borderGlow = false,
  className,
  headerClassName,
  bodyClassName,
  children
}: CyberCardProps) => {
  return (
    <div 
      className={cn(
        'cyber-card relative overflow-hidden',
        borderGlow && 'shadow-neon-purple',
        className
      )}
    >
      {title && (
        <div className={cn('mb-4 pb-2 border-b border-cyber-purple/30', headerClassName)}>
          <h3 className="cyber-heading text-lg">{title}</h3>
        </div>
      )}
      <div className={cn('relative z-10', bodyClassName)}>
        {children}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-cyber-purple/30 -mr-8 -mt-8 rounded-tr-full"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyber-purple/30 -ml-4 -mb-4"></div>
    </div>
  );
};

export default CyberCard;
