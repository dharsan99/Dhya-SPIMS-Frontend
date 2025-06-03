import React from 'react';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`p-4 ${className}`} {...props} />
));
CardContent.displayName = 'CardContent';
