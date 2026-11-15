import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'optimal' | 'warning' | 'critical' | 'neutral' | 'ink';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium tracking-wide uppercase transition-colors';

  const variants = {
    optimal: 'bg-[#EBF4F0] text-[#1E3A2F] border border-[#C6E7D7]',
    warning: 'bg-[#FEF3C7] text-[#78350F] border border-[#FDE68A]',
    critical: 'bg-[#FFE4E6] text-[#881337] border border-[#FECDD3]',
    neutral: 'bg-[#F5F1EB] text-[#57534E] border border-[#E8E3DA]',
    ink: 'bg-[#1C1917] text-[#FAF8F5] border border-[#1C1917]',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded-full gap-1 tracking-wider',
    md: 'text-xs px-2.5 py-1 rounded-full gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
