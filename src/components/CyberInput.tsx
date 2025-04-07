
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, label, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-gray-400 mb-1">{label}</label>
        )}
        <div className="relative">
          <input
            className={cn(
              "cyber-input w-full",
              icon && "pl-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-purple/70">
              {icon}
            </span>
          )}
        </div>
      </div>
    );
  }
);

CyberInput.displayName = "CyberInput";

export default CyberInput;
