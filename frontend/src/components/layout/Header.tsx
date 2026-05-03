import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-white text-primary-700 rounded-lg p-2">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">ComplianceGuard</h1>
              <p className="text-sm text-primary-200">
                Compliance Management System
              </p>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-primary-200">v2.0.0</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Made with Bob
