
import React from 'react';
import { cn } from '@/lib/utils';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'accent';
  glitched?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

const CyberButton = ({
  variant = 'default',
  size = 'default',
  glitched = false,
  className,
  children,
  ...props
}: CyberButtonProps) => {
  const baseClasses = 'cyber-button relative inline-flex items-center justify-center';
  
  const variantClasses = {
    default: '',
    primary: 'cyber-button-primary',
    accent: 'cyber-button-accent',
  };

  const sizeClasses = {
    default: 'py-2 px-4',
    sm: 'py-1 px-3 text-sm',
    lg: 'py-3 px-6 text-lg',
    icon: 'p-2'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glitched && 'after:content-[""] after:absolute after:inset-0 after:bg-cyber-purple/20 after:opacity-0 after:animate-glitch',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default CyberButton;
export type { CyberButtonProps };
