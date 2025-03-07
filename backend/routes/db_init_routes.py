
from flask import Blueprint, jsonify, request
from datetime import datetime
import json
from models import Session, Product, MaintenanceRecord, MaintenanceRecommendation, Person, Contractor, Notification

db_init_bp = Blueprint('db_init_routes', __name__)

@db_init_bp.route('/initialize', methods=['POST'])
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
    
    # ... keep existing code (importing recommendations, contractors, people, and notifications)
    
    session.commit()
    session.close()
    
    return jsonify({"message": "Data initialized successfully"})
