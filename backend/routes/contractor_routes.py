from flask import Blueprint, jsonify, request
from datetime import datetime
import uuid
from models import Contractor, Product, Notification, Session

contractor_bp = Blueprint('contractor_routes', __name__)

@contractor_bp.route('/contractors', methods=['GET'])
def get_contractors():
    session = Session()
    contractors = session.query(Contractor).all()
    result = [contractor.to_dict() for contractor in contractors]
    session.close()
    return jsonify(result)

@contractor_bp.route('/contractors/<contractor_id>', methods=['GET'])
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

@contractor_bp.route('/contractors/<contractor_id>/products', methods=['GET'])
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

@contractor_bp.route('/contractors/<contractor_id>/send-notification', methods=['POST'])
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
