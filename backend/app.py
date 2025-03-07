
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from datetime import datetime, timedelta
import random
import uuid
import os
from models import Base, Product, MaintenanceRecord, MaintenanceRecommendation, Person, Contractor, Notification
from models import ProductType, MaintenanceType, HealthStatus, NotificationType
from models import init_db, get_session

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize database
engine = init_db('sqlite:///data.db')
Session = get_session(engine)

# Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    session = Session()
    products = session.query(Product).all()
    result = [product.to_dict() for product in products]
    session.close()
    return jsonify(result)

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    session = Session()
    product = session.query(Product).filter(Product.id == product_id).first()
    
    if product:
        result = product.to_dict()
        session.close()
        return jsonify(result)
    else:
        session.close()
        return jsonify({"error": "Product not found"}), 404

@app.route('/api/products/<product_id>/recommendations', methods=['GET'])
def get_recommendations(product_id):
    session = Session()
    product = session.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        session.close()
        return jsonify({"error": "Product not found"}), 404
    
    product_type = product.type
    recommendations = session.query(MaintenanceRecommendation).filter(
        MaintenanceRecommendation.product_type == product_type
    ).all()
    
    result = [recommendation.to_dict() for recommendation in recommendations]
    session.close()
    return jsonify(result)

@app.route('/api/predict/<product_id>', methods=['GET'])
def predict_maintenance(product_id):
    """Predict maintenance needs based on product data"""
    session = Session()
    product = session.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        session.close()
        return jsonify({"error": "Product not found"}), 404
    
    # Get recommendations for this product type
    product_type = product.type
    recommendations = session.query(MaintenanceRecommendation).filter(
        MaintenanceRecommendation.product_type == product_type
    ).all()
    
    # Convert product to dict for prediction function
    product_dict = product.to_dict()
    recommendation_dicts = [rec.to_dict() for rec in recommendations]
    
    # Calculate maintenance predictions
    predictions = calculate_predictions(product_dict, recommendation_dicts)
    session.close()
    
    return jsonify(predictions)

# Contractor routes
@app.route('/api/contractors', methods=['GET'])
def get_contractors():
    session = Session()
    contractors = session.query(Contractor).all()
    result = [contractor.to_dict() for contractor in contractors]
    session.close()
    return jsonify(result)

@app.route('/api/contractors/<contractor_id>', methods=['GET'])
def get_contractor(contractor_id):
    session = Session()
    contractor = session.query(Contractor).filter(Contractor.id == contractor_id).first()
    
    if contractor:
        result = contractor.to_dict()
        session.close()
        return jsonify(result)
    else:
        session.close()
        return jsonify({"error": "Contractor not found"}), 404

@app.route('/api/contractors/<contractor_id>/products', methods=['GET'])
def get_contractor_products(contractor_id):
    session = Session()
    contractor = session.query(Contractor).filter(Contractor.id == contractor_id).first()
    
    if not contractor:
        session.close()
        return jsonify({"error": "Contractor not found"}), 404
    
    products = session.query(Product).filter(Product.contractor_id == contractor_id).all()
    result = [product.to_dict() for product in products]
    session.close()
    return jsonify(result)

@app.route('/api/contractors/<contractor_id>/send-notification', methods=['POST'])
def send_notification(contractor_id):
    session = Session()
    data = request.get_json()
    
    if not data or 'type' not in data or 'title' not in data or 'message' not in data or 'recipientType' not in data:
        session.close()
        return jsonify({"error": "Invalid notification data"}), 400
    
    contractor = session.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not contractor:
        session.close()
        return jsonify({"error": "Contractor not found"}), 404
    
    recipient_type = data['recipientType']  # 'homeowners', 'installers', or 'both'
    recipients = []
    
    if recipient_type in ['homeowners', 'both']:
        recipients.extend(contractor.homeowners)
    
    if recipient_type in ['installers', 'both']:
        recipients.extend(contractor.installers)
    
    notification = Notification(
        id=f'notif-{uuid.uuid4()}',
        type=data['type'],
        title=data['title'],
        message=data['message'],
        product_id=data.get('productId'),
        created_at=datetime.now(),
        read=False,
        scheduled_for=datetime.fromisoformat(data['scheduledFor']) if data.get('scheduledFor') else None
    )
    
    for recipient in recipients:
        notification.recipients.append(recipient)
    
    session.add(notification)
    session.commit()
    
    result = notification.to_dict()
    session.close()
    return jsonify({"message": "Notification sent successfully", "notification": result})

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    session = Session()
    recipient_id = request.args.get('recipientId')
    
    if recipient_id:
        person = session.query(Person).filter(Person.id == recipient_id).first()
        if person:
            notifications = person.notifications
            result = [notification.to_dict() for notification in notifications]
        else:
            result = []
    else:
        notifications = session.query(Notification).all()
        result = [notification.to_dict() for notification in notifications]
    
    session.close()
    return jsonify(result)

@app.route('/api/initialize', methods=['POST'])
def initialize_data():
    """Initialize the database with sample data from the frontend"""
    session = Session()
    data = request.get_json()
    
    if not data:
        session.close()
        return jsonify({"error": "Invalid data format"}), 400
    
    # Clear existing data
    session.query(Notification).delete()
    session.query(MaintenanceRecord).delete()
    session.query(Product).delete()
    session.query(MaintenanceRecommendation).delete()
    session.query(Contractor).delete()
    session.query(Person).delete()
    
    # Import products
    for product_data in data.get('products', []):
        product = Product(
            id=product_data['id'],
            serial_number=product_data['serialNumber'],
            name=product_data['name'],
            type=product_data['type'],
            manufacturer=product_data['manufacturer'],
            model=product_data['model'],
            install_date=datetime.fromisoformat(product_data['installDate']) if product_data.get('installDate') else None,
            total_hours_run=product_data['totalHoursRun'],
            status=product_data['status'],
            contractor_id=product_data.get('contractorId'),
            location=json.dumps(product_data.get('location', {})),
            weekly_usage=json.dumps(product_data.get('weeklyUsage', [])),
            performance_metrics=json.dumps(product_data.get('performanceMetrics', {})),
            last_service_date=datetime.fromisoformat(product_data['lastServiceDate']) if product_data.get('lastServiceDate') else None,
            next_maintenance_date=datetime.fromisoformat(product_data['nextMaintenanceDate']) if product_data.get('nextMaintenanceDate') else None,
            hours_until_maintenance=product_data.get('hoursUntilMaintenance', 0)
        )
        session.add(product)
    
    # Import recommendations
    for rec_data in data.get('recommendations', []):
        recommendation = MaintenanceRecommendation(
            id=rec_data['id'],
            product_type=rec_data['productType'],
            maintenance_type=rec_data['maintenanceType'],
            description=rec_data['description'],
            interval_description=rec_data['intervalDescription'],
            hours_interval=rec_data.get('hoursInterval'),
            time_interval=rec_data.get('timeInterval')
        )
        session.add(recommendation)
    
    # Import contractors and people
    for contractor_data in data.get('contractors', []):
        contractor = Contractor(
            id=contractor_data['id'],
            name=contractor_data['name'],
            email=contractor_data['email'],
            phone=contractor_data['phone'],
            company=contractor_data['company']
        )
        session.add(contractor)
    
    # Import notifications
    for notif_data in data.get('notifications', []):
        notification = Notification(
            id=notif_data['id'],
            type=notif_data['type'],
            title=notif_data['title'],
            message=notif_data['message'],
            product_id=notif_data.get('productId'),
            created_at=datetime.fromisoformat(notif_data['createdAt']) if notif_data.get('createdAt') else datetime.now(),
            read=notif_data.get('read', False),
            scheduled_for=datetime.fromisoformat(notif_data['scheduledFor']) if notif_data.get('scheduledFor') else None
        )
        session.add(notification)
    
    session.commit()
    session.close()
    
    return jsonify({"message": "Data initialized successfully"})

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
    install_date = datetime.fromisoformat(product['installDate']) if isinstance(product['installDate'], str) else product['installDate']
    days_since_install = (datetime.now() - install_date).days
    
    # Get days since last service
    last_service_date = None
    if product.get('lastServiceDate'):
        last_service_date = datetime.fromisoformat(product['lastServiceDate']) if isinstance(product['lastServiceDate'], str) else product['lastServiceDate']
        days_since_service = (datetime.now() - last_service_date).days
    else:
        days_since_service = days_since_install
    
    # Calculate health status based on hours, time since service, etc.
    if product['totalHoursRun'] > 350 and days_since_service > 300:
        return "Critical"
    elif (product['totalHoursRun'] > 200 and days_since_service > 180) or (product['totalHoursRun'] > 300):
        return "Warning"
    else:
        return "Healthy"

if __name__ == '__main__':
    # Create data directory if it doesn't exist (for SQLite database)
    os.makedirs('data', exist_ok=True)
    
    # Start the server
    app.run(debug=True, port=5000)
