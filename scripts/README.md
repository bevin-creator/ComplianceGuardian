# Transaction Simulation Scripts

## Overview
Scripts for generating and simulating transaction data to demonstrate ComplianceGuard's detection capabilities.

## Scripts

### 1. simulate-transactions.py
Real-time transaction simulator that streams data to the system via the upload API endpoint.

**Features:**
- Multiple simulation modes showcasing different compliance scenarios
- Controlled flow with configurable delays
- Colored console output showing real-time progress
- Automatic authentication and batch upload
- Detailed logging of each scenario

**Installation:**
```bash
pip install -r requirements.txt
```

**Usage:**
```bash
# Basic usage with mixed scenarios
python simulate-transactions.py --mode mixed --count 100 --delay 500

# Specific scenario
python simulate-transactions.py --mode high-value --count 20 --delay 1000

# Custom API endpoint
python simulate-transactions.py --mode structuring --url http://localhost:8080/api
```

**Simulation Modes:**

| Mode | Description | Detection Target |
|------|-------------|------------------|
| `normal` | Compliant transactions | Baseline normal activity |
| `high-value` | Transactions >$10k | High-value threshold rule |
| `structuring` | Multiple transactions just below $10k | Structuring/smurfing pattern |
| `sanctioned` | Transactions from/to sanctioned countries | Sanctioned country rule |
| `rapid-movement` | Quick succession of transactions | Rapid movement pattern |
| `round-amounts` | Suspicious round-number transactions | Round amount pattern |
| `mixed` | All scenarios combined | Comprehensive demonstration |

**Command-Line Options:**
```
--mode          Simulation mode (default: mixed)
--count         Number of transactions (default: 50)
--delay         Delay between batches in ms (default: 500)
--url           API base URL (default: http://localhost:8080/api)
--username      Username for auth (default: admin)
--password      Password for auth (default: admin123)
```

**Example Output:**
```
[10:30:15] Authenticating...
[10:30:15] ✓ Authentication successful
============================================================
Starting Simulation: MIXED
Transaction Count: 100 | Delay: 500ms
============================================================

Scenario: Mixed scenarios (all types)

→ Generating Normal transactions...
  Uploading batch: mixed_batch_1_normal (10 transactions)
  ✓ Batch uploaded: 10 success, 0 failed

→ Generating High-Value transactions...
  Uploading batch: mixed_batch_2_high-value (5 transactions)
  ✓ Batch uploaded: 5 success, 0 failed

→ Generating Structuring transactions...
  Uploading batch: mixed_batch_3_structuring (8 transactions)
  ✓ Batch uploaded: 8 success, 0 failed

============================================================
Simulation Complete!
Total Transactions Uploaded: 100
Estimated Flagged: ~45 (check dashboard for actual)
============================================================
```

### 2. generate-test-transactions.py
Static CSV file generator for creating test transaction datasets.

**Usage:**
```bash
python generate-test-transactions.py --count 1000 --output test_data.csv
```

## Demonstration Workflow

### Quick Demo (5 minutes)
```bash
# 1. Start with normal transactions
python simulate-transactions.py --mode normal --count 20 --delay 300

# 2. Trigger high-value alerts
python simulate-transactions.py --mode high-value --count 10 --delay 500

# 3. Show structuring detection
python simulate-transactions.py --mode structuring --count 15 --delay 1000
```

### Full Demo (15 minutes)
```bash
# Comprehensive demonstration of all detection capabilities
python simulate-transactions.py --mode mixed --count 200 --delay 400
```

### Continuous Monitoring Demo
```bash
# Simulate ongoing transaction flow
python simulate-transactions.py --mode mixed --count 500 --delay 200
```

## Monitoring Results

After running simulations:

1. **Dashboard**: Check real-time metrics showing flagged transactions
2. **Transactions Page**: View individual transaction details and risk scores
3. **Alerts Page**: See triggered compliance alerts
4. **Cases Page**: Review auto-generated investigation cases
5. **Backend Logs**: Monitor rule engine evaluation in console output

## Detection Scenarios Explained

### High-Value Transactions
- **Pattern**: Single transactions >$10,000
- **Rule Triggered**: High-value threshold
- **Risk Score**: 70-85
- **Expected Behavior**: Flagged for review

### Structuring (Smurfing)
- **Pattern**: Multiple transactions just below $10k threshold
- **Rule Triggered**: Structuring detection
- **Risk Score**: 80-95
- **Expected Behavior**: High-priority alert, case creation

### Sanctioned Countries
- **Pattern**: Transactions from/to IR, KP, SY, CU
- **Rule Triggered**: Sanctioned country check
- **Risk Score**: 90-100
- **Expected Behavior**: Immediate flag, compliance review

### Rapid Movement
- **Pattern**: 8+ transactions in quick succession (2-min intervals)
- **Rule Triggered**: Rapid movement pattern
- **Risk Score**: 75-90
- **Expected Behavior**: Velocity alert

### Round Amounts
- **Pattern**: Exact round numbers ($5000, $10000, etc.)
- **Rule Triggered**: Suspicious round amount
- **Risk Score**: 60-75
- **Expected Behavior**: Pattern alert

## Troubleshooting

**Authentication Failed:**
- Ensure backend is running on correct port
- Verify username/password (default: admin/admin123)
- Check API URL is correct

**Upload Failed:**
- Verify backend transaction upload endpoint is active
- Check file format matches expected CSV structure
- Review backend logs for validation errors

**No Rules Triggered:**
- Ensure ComplianceRuleEngine is properly configured
- Check rule definitions in database
- Verify ScanAgent is processing events asynchronously

## Tips

- Use `--delay 1000` or higher for easier visual tracking
- Start with small `--count` values (20-50) for initial testing
- Use `mixed` mode for comprehensive demonstrations
- Monitor backend console for real-time rule evaluation logs
- Check dashboard metrics after each simulation run