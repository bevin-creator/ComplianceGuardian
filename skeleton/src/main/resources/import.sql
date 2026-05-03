-- ComplianceGuard Database Initialization Script
-- This script runs automatically when Hibernate creates the schema

-- Insert demo users (password is 'password' for all users)
-- Password hash generated using PBKDF2WithHmacSHA256
INSERT INTO users (id, email, password_hash, name, role, active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@complianceguard.com', 'YXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZg==', 'Admin User', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440002', 'analyst@complianceguard.com', 'YXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZg==', 'John Analyst', 'ANALYST', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440003', 'officer@complianceguard.com', 'YXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZg==', 'Sarah Officer', 'COMPLIANCE_OFFICER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440004', 'executive@complianceguard.com', 'YXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZg==', 'Michael Executive', 'EXECUTIVE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample alerts
INSERT INTO alerts (id, transaction_id, severity, type, title, description, timestamp, status, assigned_to, created_at, updated_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'TXN-001', 'CRITICAL', 'AML', 'High-Value Transaction to High-Risk Jurisdiction', 'Transaction of $250,000 to Iran flagged for AML review', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'OPEN', NULL, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('650e8400-e29b-41d4-a716-446655440002', 'TXN-002', 'HIGH', 'KYC', 'Customer Due Diligence Required', 'Enhanced due diligence required for high-risk customer', CURRENT_TIMESTAMP - INTERVAL '5 hours', 'INVESTIGATING', '550e8400-e29b-41d4-a716-446655440002', CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('650e8400-e29b-41d4-a716-446655440003', 'TXN-003', 'MEDIUM', 'BASEL', 'Capital Adequacy Threshold Breach', 'Transaction may impact capital adequacy ratios', CURRENT_TIMESTAMP - INTERVAL '1 day', 'RESOLVED', '550e8400-e29b-41d4-a716-446655440003', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
('650e8400-e29b-41d4-a716-446655440004', 'TXN-004', 'HIGH', 'SANCTIONS', 'Potential Sanctions Violation', 'Customer may be on sanctions list', CURRENT_TIMESTAMP - INTERVAL '3 hours', 'OPEN', NULL, CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
('650e8400-e29b-41d4-a716-446655440005', 'TXN-005', 'LOW', 'AML', 'Unusual Transaction Pattern', 'Multiple small transactions detected', CURRENT_TIMESTAMP - INTERVAL '8 hours', 'INVESTIGATING', '550e8400-e29b-41d4-a716-446655440002', CURRENT_TIMESTAMP - INTERVAL '8 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours');

-- Insert sample cases
INSERT INTO cases (id, transaction_id, title, severity, status, assigned_to, created_at, updated_at, due_date, sar_status, description) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'TXN-001', 'AML Investigation - High-Value Transfer to Iran', 'CRITICAL', 'UNDER_REVIEW', '550e8400-e29b-41d4-a716-446655440002', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP + INTERVAL '5 days', 'PENDING', 'Investigating $250,000 wire transfer to Iranian entity. Requires enhanced due diligence and potential SAR filing.'),
('750e8400-e29b-41d4-a716-446655440002', 'TXN-006', 'KYC Review - Politically Exposed Person', 'HIGH', 'OPEN', '550e8400-e29b-41d4-a716-446655440003', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '7 days', 'NOT_REQUIRED', 'Customer identified as PEP. Enhanced due diligence required before account approval.'),
('750e8400-e29b-41d4-a716-446655440003', 'TXN-007', 'Suspicious Activity - Structuring', 'HIGH', 'ESCALATED', '550e8400-e29b-41d4-a716-446655440003', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '2 days', 'FILED', 'Multiple transactions just below reporting threshold. SAR filed with FinCEN.'),
('750e8400-e29b-41d4-a716-446655440004', 'TXN-008', 'Basel III Compliance Review', 'MEDIUM', 'RESOLVED', '550e8400-e29b-41d4-a716-446655440003', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '3 days', 'NOT_REQUIRED', 'Quarterly review of capital adequacy ratios. All requirements met.');

-- Insert timeline events for cases
INSERT INTO timeline_events (id, case_id, type, description, timestamp, "user") VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'DETECTED', 'Case created from critical AML alert', CURRENT_TIMESTAMP - INTERVAL '2 days', 'system'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'ASSIGNED', 'Assigned to John Analyst for investigation', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '30 minutes', 'admin@complianceguard.com'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', 'AI_REVIEWED', 'AI analysis completed - High risk score: 85/100', CURRENT_TIMESTAMP - INTERVAL '1 day', 'system'),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440001', 'EDD_STARTED', 'Enhanced due diligence process initiated', CURRENT_TIMESTAMP - INTERVAL '1 hour', 'analyst@complianceguard.com'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440003', 'DETECTED', 'Suspicious structuring pattern detected', CURRENT_TIMESTAMP - INTERVAL '5 days', 'system'),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440003', 'ASSIGNED', 'Assigned to Sarah Officer', CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '1 hour', 'admin@complianceguard.com'),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440003', 'SAR_FILED', 'Suspicious Activity Report filed with FinCEN', CURRENT_TIMESTAMP - INTERVAL '2 days', 'officer@complianceguard.com'),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440003', 'CLOSED', 'Case closed - SAR filed and documented', CURRENT_TIMESTAMP - INTERVAL '1 day', 'officer@complianceguard.com'),
('850e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440004', 'DETECTED', 'Basel III quarterly review initiated', CURRENT_TIMESTAMP - INTERVAL '10 days', 'system'),
('850e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440004', 'CLOSED', 'Review completed - All ratios within limits', CURRENT_TIMESTAMP - INTERVAL '2 days', 'officer@complianceguard.com');

-- Note: For production, use proper password hashing
-- The password hashes above are placeholders and should be replaced with actual PBKDF2 hashes
-- Use the AuthService.hashPassword() method to generate proper hashes

-- Made with Bob
