import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
};

// Made with Bob
