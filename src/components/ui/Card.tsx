import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hover = false, children, ...props }, ref) => {
    const baseStyles = 'bg-[var(--bg-card)] rounded-xl border border-[var(--border)]';
    const hoverStyles = hover ? 'transition-colors hover:bg-[var(--bg-card-hover)] cursor-pointer' : '';

    return (
      <div ref={ref} className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
