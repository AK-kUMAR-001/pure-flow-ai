#!/usr/bin/env python3
"""
Generate 10,000 Indian household training data records for AquaFlow-ML-2024
Training data includes water usage patterns, grey water production, and related metrics
"""

import json
import random
from datetime import datetime, timedelta

# Indian States and their average water usage
STATES_DATA = {
    'Andhra Pradesh': {'districts': ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Warangal'], 'avg_usage': 120},
    'Arunachal Pradesh': {'districts': ['Papum Pare', 'Lohit', 'Kameng'], 'avg_usage': 100},
    'Assam': {'districts': ['Kamrup', 'Nagaon', 'Barpeta', 'Sonitpur'], 'avg_usage': 110},
    'Bihar': {'districts': ['Patna', 'East Champaran', 'West Champaran', 'Nalanda'], 'avg_usage': 95},
    'Chhattisgarh': {'districts': ['Raipur', 'Bilaspur', 'Durg', 'Rajnandgaon'], 'avg_usage': 105},
    'Goa': {'districts': ['North Goa', 'South Goa'], 'avg_usage': 125},
    'Gujarat': {'districts': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'], 'avg_usage': 115},
    'Haryana': {'districts': ['Faridabad', 'Gurgaon', 'Hisar', 'Yamunanagar'], 'avg_usage': 118},
    'Himachal Pradesh': {'districts': ['Kangra', 'Mandi', 'Shimla', 'Solan'], 'avg_usage': 105},
    'Jharkhand': {'districts': ['Ranchi', 'Dhanbad', 'Giridih', 'Bokaro'], 'avg_usage': 100},
    'Karnataka': {'districts': ['Bengaluru', 'Mysore', 'Belgaum', 'Mangalore'], 'avg_usage': 120},
    'Kerala': {'districts': ['Ernakulam', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'], 'avg_usage': 130},
    'Madhya Pradesh': {'districts': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior'], 'avg_usage': 110},
    'Maharashtra': {'districts': ['Mumbai', 'Pune', 'Nagpur', 'Thane'], 'avg_usage': 122},
    'Manipur': {'districts': ['Imphal East', 'Imphal West', 'Bishnupur', 'Thoubal'], 'avg_usage': 105},
    'Meghalaya': {'districts': ['East Khasi Hills', 'West Khasi Hills', 'Ri Bhoi'], 'avg_usage': 108},
    'Mizoram': {'districts': ['Aizawl', 'Lunglei', 'Lawngtlai'], 'avg_usage': 102},
    'Nagaland': {'districts': ['Kohima', 'Dimapur', 'Mokokchung'], 'avg_usage': 100},
    'Odisha': {'districts': ['Cuttack', 'Khordha', 'Balasore', 'Dhenkanal'], 'avg_usage': 105},
    'Punjab': {'districts': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'], 'avg_usage': 125},
    'Rajasthan': {'districts': ['Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer'], 'avg_usage': 100},
    'Sikkim': {'districts': ['East Sikkim', 'West Sikkim', 'North Sikkim'], 'avg_usage': 105},
    'Tamil Nadu': {'districts': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'], 'avg_usage': 120},
    'Telangana': {'districts': ['Hyderabad', 'Rangareddy', 'Medchal', 'Nalgonda'], 'avg_usage': 118},
    'Tripura': {'districts': ['West Tripura', 'South Tripura', 'North Tripura'], 'avg_usage': 105},
    'Uttar Pradesh': {'districts': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'], 'avg_usage': 110},
    'Uttarakhand': {'districts': ['Almora', 'Nainital', 'Dehradun', 'Haridwar'], 'avg_usage': 105},
    'West Bengal': {'districts': ['Kolkata', 'Darjeeling', 'Howrah', 'Nadia'], 'avg_usage': 110},
}

def generate_training_data(num_records=10000):
    """Generate 10,000 training records"""
    records = []
    
    for record_id in range(1, num_records + 1):
        # Random state selection
        state = random.choice(list(STATES_DATA.keys()))
        state_info = STATES_DATA[state]
        district = random.choice(state_info['districts'])
        base_usage = state_info['avg_usage']
        
        # Household characteristics
        bhk = random.choice([1, 2, 3, 4])
        bathrooms = random.randint(1, 3)
        children = random.randint(0, 3)
        adults = random.randint(1, 4)
        elderly = random.randint(0, 2)
        family_size = children + adults + elderly
        
        # Age adjustment factors
        child_factor = children * 0.7
        adult_factor = adults * 1.0
        elderly_factor = elderly * 0.8
        age_adjustment = (child_factor + adult_factor + elderly_factor) / family_size if family_size > 0 else 1.0
        
        # BHK multiplier (1BHK: 0.85 to 4BHK: 1.3)
        bhk_multipliers = {1: 0.85, 2: 1.0, 3: 1.15, 4: 1.3}
        bhk_multiplier = bhk_multipliers.get(bhk, 1.0)
        
        # Bathroom adjustment (0.9 + 0.08 per bathroom)
        bathroom_adjustment = 0.9 + (0.08 * bathrooms)
        
        # Calculate total daily water usage
        adjusted_daily_usage = base_usage * age_adjustment * bhk_multiplier * bathroom_adjustment
        
        # Add some randomness (±15%)
        daily_water_usage = int(adjusted_daily_usage * random.uniform(0.85, 1.15))
        
        # Grey water is 65% of total (excluding drinking water)
        grey_water_percentage = 0.65
        daily_grey_water = int(daily_water_usage * grey_water_percentage)
        
        # Water breakdown (percentage of grey water)
        bathroom_pct = int(daily_grey_water * 0.50)
        kitchen_pct = int(daily_grey_water * 0.25)
        laundry_pct = int(daily_grey_water * 0.20)
        others_pct = daily_grey_water - bathroom_pct - kitchen_pct - laundry_pct
        
        # Annual calculations
        annual_grey_water = daily_grey_water * 365
        
        # Filter capacity and replacement
        filter_capacity = random.choice([10000, 12000, 15000, 18000, 20000])
        days_until_replacement = filter_capacity // (daily_grey_water + 1)  # Avoid division by zero
        
        # Annual savings (₹0.025 per liter of treated grey water)
        annual_savings_rs = int(annual_grey_water * 0.025)
        
        # Data quality assessment
        if family_size >= 2 and bathrooms >= 2 and daily_water_usage > 150:
            data_quality = "high"
        elif family_size > 0 and bathrooms >= 1:
            data_quality = "medium"
        else:
            data_quality = "low"
        
        record = {
            "id": record_id,
            "state": state,
            "district": district,
            "bhk": bhk,
            "bathrooms": bathrooms,
            "children": children,
            "adults": adults,
            "elderly": elderly,
            "family_size": family_size,
            "daily_water_usage": daily_water_usage,
            "daily_grey_water": daily_grey_water,
            "monthly_grey_water": daily_grey_water * 30,
            "annual_grey_water": annual_grey_water,
            "bathroom_usage": bathroom_pct,
            "kitchen_usage": kitchen_pct,
            "laundry_usage": laundry_pct,
            "others_usage": others_pct,
            "filter_capacity": filter_capacity,
            "days_until_replacement": days_until_replacement,
            "annual_savings_rs": annual_savings_rs,
            "data_quality": data_quality,
            "created_date": (datetime.now() - timedelta(days=random.randint(1, 730))).isoformat(),
        }
        
        records.append(record)
        
        # Progress indicator
        if record_id % 1000 == 0:
            print(f"Generated {record_id} records...")
    
    return records

# Generate data
print("Generating 10,000 household training records for AquaFlow-ML-2024...")
training_data = generate_training_data(10000)

# Save to JSON
output_path = r"C:\Users\rathn\OneDrive\Desktop\sih\pure-flow-ai-main\src\data\training-dataset.json"
with open(output_path, 'w') as f:
    json.dump(training_data, f, indent=2)

print(f"\n✅ Successfully created {output_path}")
print(f"Total records: {len(training_data)}")
print(f"File size: {len(json.dumps(training_data)) / (1024 * 1024):.2f} MB")
print(f"\nDataset includes:")
print(f"  - All 28 Indian states with {len(STATES_DATA)} districts")
print(f"  - BHK ranging from 1 to 4")
print(f"  - Family sizes from 1 to 9 members")
print(f"  - Daily water usage from {min([r['daily_water_usage'] for r in training_data])}L to {max([r['daily_water_usage'] for r in training_data])}L")
print(f"  - Grey water production calculations for all households")
print(f"  - Water usage breakdown (bathroom, kitchen, laundry, others)")
print(f"  - Filter replacement timelines")
print(f"  - Annual water savings estimates")
