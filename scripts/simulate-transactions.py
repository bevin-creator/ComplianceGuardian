#!/usr/bin/env python3
"""
Transaction Simulation Script for ComplianceGuard
Streams various transaction scenarios to the system to demonstrate detection capabilities.
"""

import requests
import csv
import io
import time
import random
import argparse
from datetime import datetime, timedelta
from typing import List, Dict
import sys

# Configuration
API_BASE_URL = "http://localhost:8080/api"
AUTH_TOKEN = None  # Will be set after login

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def log(message, color=Colors.OKBLUE):
    """Print colored log message"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"{color}[{timestamp}] {message}{Colors.ENDC}")

def login(username="admin", password="admin123"):
    """Authenticate and get JWT token"""
    global AUTH_TOKEN
    log("Authenticating...", Colors.HEADER)
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/login",
            json={"username": username, "password": password}
        )
        if response.status_code == 200:
            data = response.json()
            AUTH_TOKEN = data.get('data', {}).get('token')
            log(f"✓ Authentication successful", Colors.OKGREEN)
            return True
        else:
            log(f"✗ Authentication failed: {response.status_code}", Colors.FAIL)
            return False
    except Exception as e:
        log(f"✗ Authentication error: {str(e)}", Colors.FAIL)
        return False

def upload_transactions(transactions: List[Dict], batch_name: str):
    """Upload transactions to the system"""
    if not AUTH_TOKEN:
        log("✗ Not authenticated", Colors.FAIL)
        return None
    
    # Create CSV in memory
    output = io.StringIO()
    if transactions:
        writer = csv.DictWriter(output, fieldnames=transactions[0].keys())
        writer.writeheader()
        writer.writerows(transactions)
    
    csv_content = output.getvalue()
    
    # Upload to API
    try:
        files = {
            'file': (f'{batch_name}.csv', csv_content, 'text/csv')
        }
        headers = {
            'Authorization': f'Bearer {AUTH_TOKEN}'
        }
        
        response = requests.post(
            f"{API_BASE_URL}/transactions/upload",
            files=files,
            headers=headers
        )
        
        if response.status_code == 200:
            result = response.json().get('data', {})
            return result
        else:
            log(f"✗ Upload failed: {response.status_code} - {response.text}", Colors.FAIL)
            return None
    except Exception as e:
        log(f"✗ Upload error: {str(e)}", Colors.FAIL)
        return None

def generate_normal_transaction():
    """Generate a compliant, normal transaction"""
    transaction_id = f"TXN{random.randint(100000, 999999)}"
    timestamp = datetime.now() - timedelta(minutes=random.randint(0, 60))
    amount = round(random.uniform(100, 5000), 2)
    
    currencies = ['USD', 'EUR', 'GBP', 'JPY']
    transaction_types = ['WIRE_TRANSFER', 'ACH', 'CARD_PAYMENT', 'CHECK']
    countries = ['US', 'GB', 'DE', 'FR', 'CA', 'AU', 'JP']
    
    return {
        'transaction_id': transaction_id,
        'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        'amount': amount,
        'currency': random.choice(currencies),
        'source_account': f"ACC{random.randint(10000, 99999)}",
        'destination_account': f"ACC{random.randint(10000, 99999)}",
        'transaction_type': random.choice(transaction_types),
        'country': random.choice(countries),
        'customer_name': f"Customer {random.randint(1000, 9999)}",
        'customer_id': f"CUST{random.randint(1000, 9999)}"
    }

def generate_high_value_transaction():
    """Generate high-value transaction (triggers threshold rule)"""
    transaction_id = f"TXN{random.randint(100000, 999999)}"
    timestamp = datetime.now() - timedelta(minutes=random.randint(0, 60))
    amount = round(random.uniform(15000, 50000), 2)  # Above $10k threshold
    
    return {
        'transaction_id': transaction_id,
        'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        'amount': amount,
        'currency': 'USD',
        'source_account': f"ACC{random.randint(10000, 99999)}",
        'destination_account': f"ACC{random.randint(10000, 99999)}",
        'transaction_type': 'WIRE_TRANSFER',
        'country': 'US',
        'customer_name': f"High Value Customer {random.randint(1000, 9999)}",
        'customer_id': f"CUST{random.randint(1000, 9999)}"
    }

def generate_structuring_pattern():
    """Generate structuring pattern (multiple transactions just below threshold)"""
    transactions = []
    customer_id = f"CUST{random.randint(1000, 9999)}"
    customer_name = f"Structuring Customer {random.randint(1000, 9999)}"
    source_account = f"ACC{random.randint(10000, 99999)}"
    
    # Generate 5-10 transactions just below $10k threshold
    num_transactions = random.randint(5, 10)
    base_time = datetime.now()
    
    for i in range(num_transactions):
        transaction_id = f"TXN{random.randint(100000, 999999)}"
        timestamp = base_time - timedelta(minutes=i * 15)  # 15 min apart
        amount = round(random.uniform(9000, 9900), 2)  # Just below threshold
        
        transactions.append({
            'transaction_id': transaction_id,
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'amount': amount,
            'currency': 'USD',
            'source_account': source_account,
            'destination_account': f"ACC{random.randint(10000, 99999)}",
            'transaction_type': 'WIRE_TRANSFER',
            'country': 'US',
            'customer_name': customer_name,
            'customer_id': customer_id
        })
    
    return transactions

def generate_sanctioned_country_transaction():
    """Generate transaction from/to sanctioned country"""
    transaction_id = f"TXN{random.randint(100000, 999999)}"
    timestamp = datetime.now() - timedelta(minutes=random.randint(0, 60))
    amount = round(random.uniform(1000, 10000), 2)
    
    sanctioned_countries = ['IR', 'KP', 'SY', 'CU']  # Iran, North Korea, Syria, Cuba
    
    return {
        'transaction_id': transaction_id,
        'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        'amount': amount,
        'currency': 'USD',
        'source_account': f"ACC{random.randint(10000, 99999)}",
        'destination_account': f"ACC{random.randint(10000, 99999)}",
        'transaction_type': 'WIRE_TRANSFER',
        'country': random.choice(sanctioned_countries),
        'customer_name': f"Sanctioned Customer {random.randint(1000, 9999)}",
        'customer_id': f"CUST{random.randint(1000, 9999)}"
    }

def generate_rapid_movement_pattern():
    """Generate rapid movement pattern (same customer, multiple quick transactions)"""
    transactions = []
    customer_id = f"CUST{random.randint(1000, 9999)}"
    customer_name = f"Rapid Customer {random.randint(1000, 9999)}"
    
    # Generate 8-12 transactions in quick succession
    num_transactions = random.randint(8, 12)
    base_time = datetime.now()
    
    for i in range(num_transactions):
        transaction_id = f"TXN{random.randint(100000, 999999)}"
        timestamp = base_time - timedelta(minutes=i * 2)  # 2 min apart
        amount = round(random.uniform(500, 3000), 2)
        
        transactions.append({
            'transaction_id': transaction_id,
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'amount': amount,
            'currency': 'USD',
            'source_account': f"ACC{random.randint(10000, 99999)}",
            'destination_account': f"ACC{random.randint(10000, 99999)}",
            'transaction_type': random.choice(['WIRE_TRANSFER', 'ACH']),
            'country': 'US',
            'customer_name': customer_name,
            'customer_id': customer_id
        })
    
    return transactions

def generate_round_amounts_pattern():
    """Generate suspicious round-number transactions"""
    transactions = []
    customer_id = f"CUST{random.randint(1000, 9999)}"
    customer_name = f"Round Amount Customer {random.randint(1000, 9999)}"
    
    round_amounts = [5000, 10000, 15000, 20000, 25000]
    
    for amount in random.sample(round_amounts, 3):
        transaction_id = f"TXN{random.randint(100000, 999999)}"
        timestamp = datetime.now() - timedelta(hours=random.randint(1, 24))
        
        transactions.append({
            'transaction_id': transaction_id,
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'amount': float(amount),
            'currency': 'USD',
            'source_account': f"ACC{random.randint(10000, 99999)}",
            'destination_account': f"ACC{random.randint(10000, 99999)}",
            'transaction_type': 'WIRE_TRANSFER',
            'country': 'US',
            'customer_name': customer_name,
            'customer_id': customer_id
        })
    
    return transactions

def run_simulation(mode, count, delay):
    """Run the simulation based on mode"""
    log(f"\n{'='*60}", Colors.HEADER)
    log(f"Starting Simulation: {mode.upper()}", Colors.HEADER)
    log(f"Transaction Count: {count} | Delay: {delay}ms", Colors.HEADER)
    log(f"{'='*60}\n", Colors.HEADER)
    
    scenarios = {
        'normal': {
            'generator': lambda: [generate_normal_transaction()],
            'description': 'Normal compliant transactions',
            'batch_size': 10
        },
        'high-value': {
            'generator': lambda: [generate_high_value_transaction()],
            'description': 'High-value transactions (>$10k threshold)',
            'batch_size': 5
        },
        'structuring': {
            'generator': generate_structuring_pattern,
            'description': 'Structuring pattern (multiple transactions below threshold)',
            'batch_size': 1  # Send entire pattern at once
        },
        'sanctioned': {
            'generator': lambda: [generate_sanctioned_country_transaction()],
            'description': 'Transactions from/to sanctioned countries',
            'batch_size': 5
        },
        'rapid-movement': {
            'generator': generate_rapid_movement_pattern,
            'description': 'Rapid movement pattern (quick succession)',
            'batch_size': 1  # Send entire pattern at once
        },
        'round-amounts': {
            'generator': generate_round_amounts_pattern,
            'description': 'Suspicious round-number transactions',
            'batch_size': 1  # Send entire pattern at once
        },
        'mixed': {
            'generator': None,  # Special handling
            'description': 'Mixed scenarios (all types)',
            'batch_size': 5
        }
    }
    
    if mode not in scenarios:
        log(f"✗ Unknown mode: {mode}", Colors.FAIL)
        return
    
    scenario = scenarios[mode]
    log(f"Scenario: {scenario['description']}", Colors.OKCYAN)
    
    total_uploaded = 0
    total_flagged = 0
    batch_num = 1
    
    if mode == 'mixed':
        # Mixed mode: cycle through all scenarios
        all_generators = [
            ('Normal', lambda: [generate_normal_transaction()]),
            ('High-Value', lambda: [generate_high_value_transaction()]),
            ('Structuring', generate_structuring_pattern),
            ('Sanctioned', lambda: [generate_sanctioned_country_transaction()]),
            ('Rapid-Movement', generate_rapid_movement_pattern),
            ('Round-Amounts', generate_round_amounts_pattern)
        ]
        
        transactions_generated = 0
        while transactions_generated < count:
            for scenario_name, generator in all_generators:
                if transactions_generated >= count:
                    break
                
                log(f"\n→ Generating {scenario_name} transactions...", Colors.WARNING)
                transactions = generator()
                
                batch_name = f"mixed_batch_{batch_num}_{scenario_name.lower()}"
                log(f"  Uploading batch: {batch_name} ({len(transactions)} transactions)", Colors.OKBLUE)
                
                result = upload_transactions(transactions, batch_name)
                
                if result:
                    total_uploaded += result.get('successCount', 0)
                    flagged = result.get('successCount', 0) - result.get('failureCount', 0)
                    total_flagged += flagged
                    
                    log(f"  ✓ Batch uploaded: {result.get('successCount', 0)} success, "
                        f"{result.get('failureCount', 0)} failed", Colors.OKGREEN)
                    
                    if result.get('errors'):
                        for error in result.get('errors', [])[:3]:
                            log(f"    ⚠ {error}", Colors.WARNING)
                
                transactions_generated += len(transactions)
                batch_num += 1
                time.sleep(delay / 1000.0)
    else:
        # Single scenario mode
        transactions_generated = 0
        while transactions_generated < count:
            transactions = scenario['generator']()
            
            # Limit to remaining count
            remaining = count - transactions_generated
            if len(transactions) > remaining:
                transactions = transactions[:remaining]
            
            batch_name = f"{mode}_batch_{batch_num}"
            log(f"\n→ Uploading batch {batch_num}: {batch_name} ({len(transactions)} transactions)", Colors.OKBLUE)
            
            result = upload_transactions(transactions, batch_name)
            
            if result:
                total_uploaded += result.get('successCount', 0)
                flagged = result.get('successCount', 0) - result.get('failureCount', 0)
                total_flagged += flagged
                
                log(f"  ✓ Batch uploaded: {result.get('successCount', 0)} success, "
                    f"{result.get('failureCount', 0)} failed", Colors.OKGREEN)
                
                if result.get('errors'):
                    for error in result.get('errors', [])[:3]:
                        log(f"    ⚠ {error}", Colors.WARNING)
            
            transactions_generated += len(transactions)
            batch_num += 1
            time.sleep(delay / 1000.0)
    
    # Summary
    log(f"\n{'='*60}", Colors.HEADER)
    log(f"Simulation Complete!", Colors.HEADER)
    log(f"Total Transactions Uploaded: {total_uploaded}", Colors.OKGREEN)
    log(f"Estimated Flagged: ~{total_flagged} (check dashboard for actual)", Colors.WARNING)
    log(f"{'='*60}\n", Colors.HEADER)

def main():
    parser = argparse.ArgumentParser(
        description='Simulate transactions for ComplianceGuard system',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Simulation Modes:
  normal          - Normal compliant transactions
  high-value      - High-value transactions (>$10k threshold)
  structuring     - Structuring pattern (multiple transactions below threshold)
  sanctioned      - Transactions from/to sanctioned countries
  rapid-movement  - Rapid movement pattern (quick succession)
  round-amounts   - Suspicious round-number transactions
  mixed           - Mixed scenarios (all types)

Examples:
  python simulate-transactions.py --mode normal --count 50 --delay 500
  python simulate-transactions.py --mode structuring --count 20 --delay 1000
  python simulate-transactions.py --mode mixed --count 100 --delay 300
        """
    )
    
    parser.add_argument('--mode', type=str, default='mixed',
                        choices=['normal', 'high-value', 'structuring', 'sanctioned', 
                                'rapid-movement', 'round-amounts', 'mixed'],
                        help='Simulation mode (default: mixed)')
    parser.add_argument('--count', type=int, default=50,
                        help='Number of transactions to generate (default: 50)')
    parser.add_argument('--delay', type=int, default=500,
                        help='Delay between batches in milliseconds (default: 500)')
    parser.add_argument('--url', type=str, default='http://localhost:8080/api',
                        help='API base URL (default: http://localhost:8080/api)')
    parser.add_argument('--username', type=str, default='admin',
                        help='Username for authentication (default: admin)')
    parser.add_argument('--password', type=str, default='admin123',
                        help='Password for authentication (default: admin123)')
    
    args = parser.parse_args()
    
    global API_BASE_URL
    API_BASE_URL = args.url
    
    # Authenticate
    if not login(args.username, args.password):
        log("✗ Failed to authenticate. Exiting.", Colors.FAIL)
        sys.exit(1)
    
    # Run simulation
    try:
        run_simulation(args.mode, args.count, args.delay)
    except KeyboardInterrupt:
        log("\n\n✗ Simulation interrupted by user", Colors.WARNING)
        sys.exit(0)
    except Exception as e:
        log(f"\n✗ Simulation error: {str(e)}", Colors.FAIL)
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()

# Made with Bob
