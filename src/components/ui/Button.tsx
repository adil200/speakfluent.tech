import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-primary/20 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary:
        'bg-[#1C1917] text-[#FAF8F5] shadow-xs hover:bg-[#2E2A27] active:scale-[0.99] border border-[#1C1917]',
      secondary:
        'bg-[#FFFFFF] text-[#1C1917] border border-[#E8E3DA] hover:bg-[#F5F1EB] hover:border-[#D1C9BE] shadow-xs active:scale-[0.99]',
      outline:
        'bg-transparent text-[#1C1917] border border-[#E8E3DA] hover:border-[#D1C9BE] hover:bg-[#1C1917]/[0.03] active:scale-[0.99]',
      ghost:
        'bg-transparent text-[#57534E] hover:text-[#1C1917] hover:bg-[#1C1917]/[0.04]',
      danger:
        'bg-[#881337] text-white hover:bg-[#9F1239] shadow-xs active:scale-[0.99]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5 tracking-wide',
      md: 'text-sm px-4 py-2.5 rounded-lg gap-2 tracking-normal',
      lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 tracking-normal',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
