#!/usr/bin/env python3
"""
Transaction Data Generator for ComplianceGuard Testing

Generates realistic transaction CSV files with configurable risk profiles.
"""

import csv
import random
from datetime import datetime, timedelta
from decimal import Decimal
import argparse

# Configuration
TRANSACTION_TYPES = ["WIRE_TRANSFER", "ACH", "CARD", "CHECK", "CASH"]
CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD"]
COUNTRIES = ["US", "GB", "DE", "FR", "JP", "CA", "AU", "CH"]
HIGH_RISK_COUNTRIES = ["IR", "KP", "MM", "SY", "YE"]

ENTITIES = [
    "ACME-CORP", "BETA-INC", "GAMMA-LLC", "DELTA-PARTNERS", "EPSILON-GROUP",
    "ZETA-HOLDINGS", "ETA-VENTURES", "THETA-CAPITAL", "IOTA-SYSTEMS", "KAPPA-TECH"
]

def generate_transaction_id(index):
    """Generate unique transaction ID"""
    return f"TXN-{datetime.now().strftime('%Y%m')}-{index:06d}"

def generate_account():
    """Generate random account number"""
    return f"ACC-{random.randint(10000, 99999)}"

def generate_customer_id():
    """Generate customer ID"""
    return f"CUST-{random.randint(1000, 9999)}"

def generate_amount(risk_profile):
    """Generate transaction amount based on risk profile"""
    if risk_profile == "low":
        return round(random.uniform(10, 5000), 2)
    elif risk_profile == "medium":
        return round(random.uniform(5000, 15000), 2)
    elif risk_profile == "high":
        return round(random.uniform(15000, 100000), 2)
    else:  # critical
        return round(random.uniform(100000, 2000000), 2)

def generate_timestamp(days_ago=0):
    """Generate ISO 8601 timestamp"""
    dt = datetime.now() - timedelta(days=days_ago, hours=random.randint(0, 23), 
                                     minutes=random.randint(0, 59))
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")

def generate_transaction(index, risk_profile="mixed"):
    """Generate a single transaction"""
    
    # Determine actual risk for this transaction
    if risk_profile == "mixed":
        actual_risk = random.choices(
            ["low", "medium", "high", "critical"],
            weights=[60, 25, 12, 3]
        )[0]
    else:
        actual_risk = risk_profile
    
    transaction = {
        "transaction_id": generate_transaction_id(index),
        "entity_id": random.choice(ENTITIES),
        "type": random.choice(TRANSACTION_TYPES),
        "amount": generate_amount(actual_risk),
        "currency": random.choice(CURRENCIES),
        "from_account": generate_account(),
        "to_account": generate_account(),
        "from_country": random.choice(COUNTRIES),
        "to_country": random.choice(COUNTRIES),
        "customer_id": generate_customer_id(),
        "timestamp": generate_timestamp(random.randint(0, 30)),
        "description": f"{random.choice(TRANSACTION_TYPES).replace('_', ' ').title()} payment"
    }
    
    # Introduce risk factors based on profile
    if actual_risk in ["high", "critical"]:
        # 50% chance of high-risk country
        if random.random() < 0.5:
            if random.random() < 0.5:
                transaction["from_country"] = random.choice(HIGH_RISK_COUNTRIES)
            else:
                transaction["to_country"] = random.choice(HIGH_RISK_COUNTRIES)
        
        # 30% chance of missing customer ID (KYC violation)
        if random.random() < 0.3:
            transaction["customer_id"] = ""
    
    return transaction

def generate_csv(filename, count, risk_profile="mixed"):
    """Generate CSV file with transactions"""
    
    fieldnames = [
        "transaction_id", "entity_id", "type", "amount", "currency",
        "from_account", "to_account", "from_country", "to_country",
        "customer_id", "timestamp", "description"
    ]
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for i in range(1, count + 1):
            transaction = generate_transaction(i, risk_profile)
            writer.writerow(transaction)
    
    print(f"✅ Generated {count} transactions in {filename}")
    
    # Print statistics
    print(f"\nFile Statistics:")
    print(f"  - Total Records: {count}")
    print(f"  - Risk Profile: {risk_profile}")
    print(f"  - File Size: {round(os.path.getsize(filename) / 1024, 2)} KB")

def main():
    parser = argparse.ArgumentParser(
        description="Generate test transaction data for ComplianceGuard"
    )
    parser.add_argument(
        "-n", "--count",
        type=int,
        default=100,
        help="Number of transactions to generate (default: 100)"
    )
    parser.add_argument(
        "-o", "--output",
        type=str,
        default="test_transactions.csv",
        help="Output filename (default: test_transactions.csv)"
    )
    parser.add_argument(
        "-r", "--risk",
        type=str,
        choices=["low", "medium", "high", "critical", "mixed"],
        default="mixed",
        help="Risk profile (default: mixed)"
    )
    
    args = parser.parse_args()
    
    print(f"🔧 Generating {args.count} transactions...")
    print(f"   Risk Profile: {args.risk}")
    print(f"   Output File: {args.output}\n")
    
    generate_csv(args.output, args.count, args.risk)
    
    print(f"\n📊 Sample Transactions:")
    print(f"   Low Risk: ~60% (amounts < $5,000)")
    print(f"   Medium Risk: ~25% (amounts $5,000-$15,000)")
    print(f"   High Risk: ~12% (amounts $15,000-$100,000)")
    print(f"   Critical Risk: ~3% (amounts > $100,000)")
    
    print(f"\n🎯 Upload this file to ComplianceGuard:")
    print(f"   Dashboard → Upload Transactions → Select {args.output}")

if __name__ == "__main__":
    import os
    main()

# Made with Bob
