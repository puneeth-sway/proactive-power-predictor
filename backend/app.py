
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from datetime import datetime, timedelta
import random
from models import Product, MaintenanceRecord, MaintenanceRecommendation, ProductType, MaintenanceType, HealthStatus

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load data from JSON files
def load_data():
    try:
        with open('data/products.json', 'r') as f:
            products_data = json.load(f)
        
        with open('data/maintenance_recommendations.json', 'r') as f:
            recommendations_data = json.load(f)
            
        return products_data, recommendations_data
    except FileNotFoundError:
        # If files don't exist, create sample data
        return [], []

# Save data to JSON files
def save_data(products, recommendations):
    with open('data/products.json', 'w') as f:
        json.dump(products, f, default=str, indent=2)
    
    with open('data/maintenance_recommendations.json', 'w') as f:
        json.dump(recommendations, f, default=str, indent=2)

# Convert datetime strings to Python datetime objects
def parse_dates(product):
    if 'installDate' in product:
        product['installDate'] = datetime.fromisoformat(product['installDate'].replace('Z', '+00:00'))
    
    if 'lastServiceDate' in product and product['lastServiceDate']:
        product['lastServiceDate'] = datetime.fromisoformat(product['lastServiceDate'].replace('Z', '+00:00'))
    
    if 'nextMaintenanceDate' in product and product['nextMaintenanceDate']:
        product['nextMaintenanceDate'] = datetime.fromisoformat(product['nextMaintenanceDate'].replace('Z', '+00:00'))
    
    if 'maintenanceHistory' in product and product['maintenanceHistory']:
        for record in product['maintenanceHistory']:
            if 'datePerformed' in record and record['datePerformed']:
                record['datePerformed'] = datetime.fromisoformat(record['datePerformed'].replace('Z', '+00:00'))
    
    return product

# Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    products, _ = load_data()
    return jsonify(products)

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    products, _ = load_data()
    product = next((p for p in products if p['id'] == product_id), None)
    
    if product:
        return jsonify(product)
    else:
        return jsonify({"error": "Product not found"}), 404

@app.route('/api/products/<product_id>/recommendations', methods=['GET'])
def get_recommendations(product_id):
    products, recommendations = load_data()
    product = next((p for p in products if p['id'] == product_id), None)
    
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    product_type = product['type']
    product_recommendations = [r for r in recommendations if r['productType'] == product_type]
    
    return jsonify(product_recommendations)

@app.route('/api/predict/<product_id>', methods=['GET'])
def predict_maintenance(product_id):
    """Predict maintenance needs based on product data"""
    products, recommendations = load_data()
    product = next((p for p in products if p['id'] == product_id), None)
    
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    # Parse dates
    product = parse_dates(product)
    
    # Get recommendations for this product type
    product_type = product['type']
    product_recommendations = [r for r in recommendations if r['productType'] == product_type]
    
    # Calculate maintenance predictions
    predictions = calculate_predictions(product, product_recommendations)
    
    return jsonify(predictions)

def calculate_predictions(product, recommendations):
    """
    Calculate predictive maintenance information based on:
    - Usage patterns
    - Hours run
    - Manufacturer recommendations
    """
    # Get routine maintenance recommendation
    routine_rec = next((r for r in recommendations if r['maintenanceType'] == 'Routine'), None)
    
    if not routine_rec:
        return {
            "status": "No maintenance data available",
            "predictions": []
        }
    
    # Get hours interval from recommendation
    hours_interval = routine_rec.get('hoursInterval', 100)
    
    # Calculate hours until next maintenance
    hours_run = product['totalHoursRun']
    hours_remaining = max(0, hours_interval - (hours_run % hours_interval))
    
    # Calculate date of next maintenance
    # Assuming average usage of 1 hour per day
    next_maintenance_date = datetime.now() + timedelta(days=hours_remaining)
    
    # Calculate health status
    health_status = calculate_health_status(product, hours_remaining)
    
    # Generate warning message based on status
    warning_message = None
    if health_status == "Critical":
        warning_message = f"URGENT: {product['name']} requires immediate maintenance! System at risk of failure."
    elif health_status == "Warning":
        warning_message = f"ATTENTION: {product['name']} is showing signs of degradation. Schedule maintenance soon."
    elif hours_remaining < 50:
        warning_message = f"NOTIFICATION: {product['name']} will need routine maintenance in {hours_remaining} hours."
    
    # Add some randomness to predictions to simulate real-world variability
    efficiency_impact = random.randint(-5, -1) if health_status != "Healthy" else random.randint(-2, 0)
    reliability_impact = random.randint(-8, -3) if health_status == "Critical" else random.randint(-4, -1) if health_status == "Warning" else 0
    
    return {
        "status": health_status,
        "hoursUntilMaintenance": hours_remaining,
        "nextMaintenanceDate": next_maintenance_date.isoformat(),
        "warningMessage": warning_message,
        "predictions": [
            {
                "component": "Overall System",
                "healthScore": 100 + efficiency_impact + reliability_impact,
                "maintenanceRecommendation": "Schedule routine maintenance" if hours_remaining < 50 else "No immediate action needed",
                "potentialIssues": ["Performance degradation", "Reduced efficiency"] if health_status != "Healthy" else []
            },
            {
                "component": "Engine",
                "healthScore": 100 + efficiency_impact * 1.5,
                "maintenanceRecommendation": "Check oil levels and condition",
                "potentialIssues": ["Oil degradation", "Combustion inefficiency"] if health_status != "Healthy" else []
            },
            {
                "component": "Filter System",
                "healthScore": 100 + reliability_impact * 1.2,
                "maintenanceRecommendation": "Inspect air filter" if hours_run > 50 else "No action needed",
                "potentialIssues": ["Reduced airflow", "Increased fuel consumption"] if health_status != "Healthy" else []
            }
        ]
    }

def calculate_health_status(product, hours_remaining):
    """Calculate health status based on multiple factors"""
    # Get days since installation
    install_date = product['installDate']
    days_since_install = (datetime.now() - install_date).days
    
    # Get days since last service
    last_service_date = product.get('lastServiceDate')
    days_since_service = (datetime.now() - last_service_date).days if last_service_date else days_since_install
    
    # Calculate health status based on hours, time since service, etc.
    if product['totalHoursRun'] > 350 and days_since_service > 300:
        return "Critical"
    elif (product['totalHoursRun'] > 200 and days_since_service > 180) or (product['totalHoursRun'] > 300):
        return "Warning"
    else:
        return "Healthy"

@app.route('/api/initialize', methods=['POST'])
def initialize_data():
    """Initialize the database with sample data from the frontend"""
    data = request.get_json()
    
    if not data or 'products' not in data or 'recommendations' not in data:
        return jsonify({"error": "Invalid data format"}), 400
    
    save_data(data['products'], data['recommendations'])
    
    return jsonify({"message": "Data initialized successfully"})

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    import os
    os.makedirs('data', exist_ok=True)
    
    # Start the server
    app.run(debug=True, port=5000)
