
from flask import Blueprint, jsonify, request
from models import Notification, Person, Session

notification_bp = Blueprint('notification_routes', __name__)

@notification_bp.route('/notifications', methods=['GET'])
def get_notifications():
    session = Session()
    recipient_id = request.args.get('recipientId')
    
    try:
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
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@notification_bp.route('/notifications/<notification_id>/read', methods=['PUT'])
def mark_notification_as_read(notification_id):
    session = Session()
    
    try:
        notification = session.query(Notification).filter(Notification.id == notification_id).first()
        
        if notification:
            notification.read = True
            session.commit()
            return jsonify({"message": "Notification marked as read", "notification": notification.to_dict()})
        else:
            return jsonify({"error": "Notification not found"}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@notification_bp.route('/notifications/<notification_id>', methods=['DELETE'])
def dismiss_notification(notification_id):
    session = Session()
    
    try:
        notification = session.query(Notification).filter(Notification.id == notification_id).first()
        
        if notification:
            session.delete(notification)
            session.commit()
            return jsonify({"message": "Notification dismissed successfully"})
        else:
            return jsonify({"error": "Notification not found"}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
