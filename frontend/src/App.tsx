import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { TransactionPage } from './pages/TransactionPage';
import { ContractPage } from './pages/ContractPage';
import { KYCPage } from './pages/KYCPage';
import { ReportPage } from './pages/ReportPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/contract" element={<ContractPage />} />
          <Route path="/kyc" element={<KYCPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

// Made with Bob
