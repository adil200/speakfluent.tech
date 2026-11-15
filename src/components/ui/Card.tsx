import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverLift = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-[#FFFFFF] border border-[#E8E3DA] rounded-xl shadow-xs overflow-hidden transition-all duration-200',
          hoverLift && 'hover:border-[#D1C9BE] hover:shadow-sm hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-6 pb-4 flex flex-col gap-1.5', className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn('font-serif text-xl font-normal text-[#1C1917] tracking-tight', className)} {...props} />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-sm text-[#57534E] leading-relaxed', className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-6 pt-0 flex items-center justify-between border-t border-[#E8E3DA]/60 mt-4', className)} {...props} />
);
