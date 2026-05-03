-- Compliance Guard Database Seed Data
-- This file is automatically executed by Quarkus on application startup in dev mode

-- ============================================
-- USERS
-- ============================================
-- Password: admin123 (hashed with BCrypt)
INSERT INTO users (id, username, email, password, name, role, created_at, active) VALUES
(1, 'admin', 'admin@complianceguard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Administrator', 'ADMIN', NOW(), true),
(2, 'analyst1', 'analyst1@complianceguard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Analyst', 'ANALYST', NOW(), true),
(3, 'analyst2', 'analyst2@complianceguard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sarah Compliance', 'ANALYST', NOW(), true),
(4, 'viewer', 'viewer@complianceguard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mike Viewer', 'VIEWER', NOW(), true);

-- ============================================
-- COMPLIANCE RULES
-- ============================================
INSERT INTO compliance_rules (id, name, description, category, severity, enabled, conditions, threshold_value, threshold_operator, created_at, updated_at, created_by) VALUES
('RULE_AML_001', 'Large Cash Transaction', 'Flags transactions over $10,000 in cash', 'AML', 'HIGH', true, '{"type":"CASH","amountThreshold":10000}', '10000', 'GT', NOW(), NOW(), 1),
('RULE_AML_002', 'Structuring Detection', 'Multiple transactions just below reporting threshold', 'AML', 'CRITICAL', true, '{"pattern":"STRUCTURING","timeWindow":"24h"}', '9000', 'GT', NOW(), NOW(), 1),
('RULE_AML_003', 'High-Risk Country Transfer', 'Transactions to/from high-risk jurisdictions', 'AML', 'HIGH', true, '{"countries":["IR","KP","SY"]}', null, null, NOW(), NOW(), 1),
('RULE_KYC_001', 'Incomplete KYC Documentation', 'Customer missing required KYC documents', 'KYC', 'MEDIUM', true, '{"requiredDocs":["ID","PROOF_ADDRESS"]}', null, null, NOW(), NOW(), 1),
('RULE_KYC_002', 'Expired KYC Documents', 'KYC documents older than 12 months', 'KYC', 'MEDIUM', true, '{"maxAge":"12M"}', null, null, NOW(), NOW(), 1),
('RULE_BASEL_001', 'Capital Adequacy Ratio', 'Bank capital ratio below regulatory minimum', 'BASEL', 'CRITICAL', true, '{"ratio":"CAR","minimum":8}', '8', 'LT', NOW(), NOW(), 1),
('RULE_BASEL_002', 'Liquidity Coverage Ratio', 'Insufficient liquid assets', 'BASEL', 'HIGH', true, '{"ratio":"LCR","minimum":100}', '100', 'LT', NOW(), NOW(), 1),
('RULE_SANC_001', 'OFAC Sanctions Screening', 'Transaction involves sanctioned entity', 'SANCTIONS', 'CRITICAL', true, '{"lists":["OFAC","UN","EU"]}', null, null, NOW(), NOW(), 1),
('RULE_FRAUD_001', 'Unusual Transaction Pattern', 'Deviation from normal transaction behavior', 'FRAUD', 'MEDIUM', true, '{"deviationThreshold":3}', '3', 'GT', NOW(), NOW(), 1),
('RULE_FRAUD_002', 'Rapid Succession Transactions', 'Multiple transactions in short time', 'FRAUD', 'HIGH', true, '{"count":5,"timeWindow":"1h"}', '5', 'GT', NOW(), NOW(), 1);

-- ============================================
-- TRANSACTIONS
-- ============================================
INSERT INTO transactions (id, entity_id, type, amount, currency, from_account, to_account, from_country, to_country, status, risk_level, risk_score, description, flagged_rules, created_at, updated_at) VALUES
-- Normal transactions
('TXN_001', 'CUST_12345', 'WIRE_TRANSFER', 5000.00, 'USD', 'ACC_001', 'ACC_002', 'US', 'GB', 'APPROVED', 'LOW', 15.50, 'International wire transfer', null, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('TXN_002', 'CUST_12346', 'ACH', 2500.00, 'USD', 'ACC_003', 'ACC_004', 'US', 'US', 'APPROVED', 'LOW', 10.25, 'Domestic ACH payment', null, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('TXN_003', 'CUST_12347', 'CARD', 150.75, 'EUR', 'ACC_005', 'ACC_006', 'DE', 'FR', 'APPROVED', 'LOW', 5.00, 'Card payment', null, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- Flagged transactions
('TXN_004', 'CUST_12348', 'CASH', 15000.00, 'USD', 'ACC_007', 'ACC_008', 'US', 'US', 'FLAGGED', 'HIGH', 85.00, 'Large cash deposit', '["RULE_AML_001"]', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('TXN_005', 'CUST_12349', 'WIRE_TRANSFER', 50000.00, 'USD', 'ACC_009', 'ACC_010', 'US', 'IR', 'FLAGGED', 'CRITICAL', 95.00, 'Transfer to high-risk country', '["RULE_AML_003","RULE_SANC_001"]', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('TXN_006', 'CUST_12350', 'WIRE_TRANSFER', 9500.00, 'USD', 'ACC_011', 'ACC_012', 'US', 'US', 'FLAGGED', 'HIGH', 78.50, 'Potential structuring - Transaction 1', '["RULE_AML_002"]', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('TXN_007', 'CUST_12350', 'WIRE_TRANSFER', 9800.00, 'USD', 'ACC_011', 'ACC_013', 'US', 'US', 'FLAGGED', 'HIGH', 82.00, 'Potential structuring - Transaction 2', '["RULE_AML_002"]', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('TXN_008', 'CUST_12351', 'WIRE_TRANSFER', 100000.00, 'USD', 'ACC_014', 'ACC_015', 'CH', 'KY', 'PENDING', 'CRITICAL', 92.00, 'Large offshore transfer', '["RULE_AML_001","RULE_AML_003"]', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),

-- Recent transactions
('TXN_009', 'CUST_12352', 'ACH', 3200.00, 'USD', 'ACC_016', 'ACC_017', 'US', 'US', 'APPROVED', 'LOW', 12.00, 'Payroll payment', null, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
('TXN_010', 'CUST_12353', 'CARD', 450.00, 'USD', 'ACC_018', 'ACC_019', 'US', 'US', 'APPROVED', 'LOW', 8.50, 'Online purchase', null, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
('TXN_011', 'CUST_12354', 'WIRE_TRANSFER', 25000.00, 'EUR', 'ACC_020', 'ACC_021', 'DE', 'RU', 'FLAGGED', 'HIGH', 75.00, 'Transfer to Russia', '["RULE_AML_003"]', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('TXN_012', 'CUST_12355', 'CASH', 8500.00, 'USD', 'ACC_022', 'ACC_023', 'US', 'US', 'APPROVED', 'MEDIUM', 45.00, 'Cash withdrawal', null, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour');

-- ============================================
-- ALERTS
-- ============================================
INSERT INTO alerts (id, transaction_id, type, severity, status, message, description, rule_id, rule_name, risk_score, entity_id, entity_name, metadata, created_at, updated_at, assigned_to) VALUES
-- Critical alerts
('ALERT_001', 'TXN_005', 'SANCTIONS', 'CRITICAL', 'OPEN', 'Transaction to sanctioned country detected', 'Wire transfer of $50,000 to Iran flagged for sanctions screening', 'RULE_SANC_001', 'OFAC Sanctions Screening', 95.00, 'CUST_12349', 'Acme Corp', '{"matchType":"COUNTRY","sanctionList":"OFAC"}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 2),
('ALERT_002', 'TXN_008', 'AML', 'CRITICAL', 'IN_REVIEW', 'Large offshore transfer to tax haven', 'Transfer of $100,000 to Cayman Islands requires enhanced due diligence', 'RULE_AML_001', 'Large Cash Transaction', 92.00, 'CUST_12351', 'Global Investments LLC', '{"destination":"TAX_HAVEN","amount":100000}', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '6 hours', 2),

-- High severity alerts
('ALERT_003', 'TXN_004', 'AML', 'HIGH', 'RESOLVED', 'Large cash transaction detected', 'Cash deposit of $15,000 exceeds reporting threshold', 'RULE_AML_001', 'Large Cash Transaction', 85.00, 'CUST_12348', 'John Smith', '{"transactionType":"CASH_DEPOSIT","amount":15000}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 2),
('ALERT_004', 'TXN_006', 'AML', 'HIGH', 'OPEN', 'Potential structuring detected', 'Multiple transactions just below $10,000 threshold', 'RULE_AML_002', 'Structuring Detection', 78.50, 'CUST_12350', 'ABC Trading Inc', '{"pattern":"STRUCTURING","count":2,"timeWindow":"24h"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 3),
('ALERT_005', 'TXN_007', 'AML', 'HIGH', 'OPEN', 'Potential structuring detected', 'Second transaction in structuring pattern', 'RULE_AML_002', 'Structuring Detection', 82.00, 'CUST_12350', 'ABC Trading Inc', '{"pattern":"STRUCTURING","count":2,"timeWindow":"24h"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 3),
('ALERT_006', 'TXN_011', 'AML', 'HIGH', 'OPEN', 'High-risk country transfer', 'Transfer to Russia requires additional screening', 'RULE_AML_003', 'High-Risk Country Transfer', 75.00, 'CUST_12354', 'Tech Solutions GmbH', '{"destination":"RU","riskLevel":"HIGH"}', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', 2),

-- Medium severity alerts
('ALERT_007', 'TXN_012', 'AML', 'MEDIUM', 'FALSE_POSITIVE', 'Unusual cash withdrawal pattern', 'Large cash withdrawal flagged for review', 'RULE_FRAUD_001', 'Unusual Transaction Pattern', 45.00, 'CUST_12355', 'Restaurant Supply Co', '{"deviation":2.5,"normalAmount":3000}', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', 3);

-- ============================================
-- CASES
-- ============================================
INSERT INTO cases (id, title, description, type, status, severity, priority, entity_id, entity_name, assigned_to, assigned_to_name, created_by, created_by_name, created_at, updated_at, due_date, notes) VALUES
-- Critical cases
('CASE_001', 'Sanctions Violation Investigation', 'Investigate potential OFAC sanctions violation for transaction to Iran', 'SANCTIONS', 'IN_PROGRESS', 'CRITICAL', 'URGENT', 'CUST_12349', 'Acme Corp', 2, 'John Analyst', 1, 'System Administrator', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', NOW() + INTERVAL '3 days', 'Contacted customer for additional documentation. Awaiting response.'),
('CASE_002', 'Offshore Tax Haven Transfer', 'Review large transfer to Cayman Islands for tax evasion indicators', 'AML', 'UNDER_REVIEW', 'CRITICAL', 'URGENT', 'CUST_12351', 'Global Investments LLC', 2, 'John Analyst', 1, 'System Administrator', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '6 hours', NOW() + INTERVAL '2 days', 'Enhanced due diligence in progress. Requested beneficial ownership information.'),

-- High priority cases
('CASE_003', 'Structuring Pattern Analysis', 'Analyze multiple transactions for potential structuring activity', 'AML', 'OPEN', 'HIGH', 'HIGH', 'CUST_12350', 'ABC Trading Inc', 3, 'Sarah Compliance', 2, 'John Analyst', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 days', 'Two transactions identified. Monitoring for additional activity.'),
('CASE_004', 'Large Cash Deposit Review', 'Review large cash deposit for source of funds', 'AML', 'CLOSED', 'HIGH', 'MEDIUM', 'CUST_12348', 'John Smith', 2, 'John Analyst', 2, 'John Analyst', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'Verified legitimate business income. Case closed.'),

-- Medium priority cases
('CASE_005', 'KYC Documentation Update Required', 'Customer KYC documents expired, update required', 'KYC', 'OPEN', 'MEDIUM', 'MEDIUM', 'CUST_12356', 'XYZ Corporation', 3, 'Sarah Compliance', 1, 'System Administrator', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() + INTERVAL '7 days', 'Sent notification to customer. Awaiting updated documents.');

-- Link alerts to cases
INSERT INTO case_alert_ids (case_id, alert_id) VALUES
('CASE_001', 'ALERT_001'),
('CASE_002', 'ALERT_002'),
('CASE_003', 'ALERT_004'),
('CASE_003', 'ALERT_005'),
('CASE_004', 'ALERT_003');

-- Link transactions to cases
INSERT INTO case_transaction_ids (case_id, transaction_id) VALUES
('CASE_001', 'TXN_005'),
('CASE_002', 'TXN_008'),
('CASE_003', 'TXN_006'),
('CASE_003', 'TXN_007'),
('CASE_004', 'TXN_004');

-- Add tags to cases
INSERT INTO case_tags (case_id, tag) VALUES
('CASE_001', 'SANCTIONS'),
('CASE_001', 'OFAC'),
('CASE_001', 'HIGH_RISK_COUNTRY'),
('CASE_002', 'TAX_HAVEN'),
('CASE_002', 'LARGE_AMOUNT'),
('CASE_002', 'OFFSHORE'),
('CASE_003', 'STRUCTURING'),
('CASE_003', 'PATTERN_ANALYSIS'),
('CASE_004', 'CASH'),
('CASE_004', 'RESOLVED'),
('CASE_005', 'KYC'),
('CASE_005', 'DOCUMENTATION');

-- Made with Bob
