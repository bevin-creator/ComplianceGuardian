import React from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>
            © 2024 ComplianceGuard. Powered by IBM watsonx Orchestrate & Instana
          </p>
        </div>
      </footer>
    </div>
  );
};

// Made with Bob
