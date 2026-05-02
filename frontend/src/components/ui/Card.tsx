import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = ({ 
  children, 
  className, 
  padding = 'md',
  hover = false 
}: CardProps) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={clsx(
        'card',
        paddingStyles[padding],
        hover && 'hover:border-dark-600 transition-colors cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;

// Made with Bob
