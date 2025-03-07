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
    
    # Import recommendations
    for recommendation_data in data.get('maintenanceRecommendations', []):
        recommendation = MaintenanceRecommendation(
            id=recommendation_data['id'],
            product_type=recommendation_data['productType'],
            maintenance_type=recommendation_data['maintenanceType'],
            description=recommendation_data['description'],
            interval_description=recommendation_data['intervalDescription'],
            hours_interval=recommendation_data.get('hoursInterval'),
            time_interval=recommendation_data.get('timeInterval')
        )
        session.add(recommendation)
    
    # Import contractors
    for contractor_data in data.get('contractors', []):
        contractor = Contractor(
            id=contractor_data['id'],
            name=contractor_data['name'],
            email=contractor_data['email'],
            phone=contractor_data['phone'],
            company=contractor_data['company']
        )
        session.add(contractor)
    
    # Import people
    for person_data in data.get('persons', []):
        person = Person(
            id=person_data['id'],
            name=person_data['name'],
            email=person_data['email'],
            phone=person_data['phone'],
            address=person_data['address'],
            role=person_data['role']
        )
        session.add(person)
        
        # Associate homeowners and installers with contractors
        contractor_id = person_data.get('contractorId')
        if contractor_id:
            contractor = session.query(Contractor).filter(Contractor.id == contractor_id).first()
            if contractor:
                if person_data['role'] == 'homeowner':
                    contractor.homeowners.append(person)
                elif person_data['role'] == 'installer':
                    contractor.installers.append(person)
    
    # Import notifications
    for notification_data in data.get('notifications', []):
        notification = Notification(
            id=notification_data['id'],
            type=notification_data['type'],
            title=notification_data['title'],
            message=notification_data['message'],
            product_id=notification_data.get('productId'),
            created_at=datetime.fromisoformat(notification_data['createdAt']) if notification_data.get('createdAt') else None,
            read=notification_data['read'],
            scheduled_for=datetime.fromisoformat(notification_data['scheduledFor']) if notification_data.get('scheduledFor') else None
        )
        session.add(notification)
        
        # Associate recipients with notifications
        recipient_ids = notification_data.get('recipients', [])
        for recipient_id in recipient_ids:
            person = session.query(Person).filter(Person.id == recipient_id).first()
            if person:
                notification.recipients.append(person)
    
    session.commit()
    session.close()
    
    return jsonify({"message": "Data initialized successfully"})
