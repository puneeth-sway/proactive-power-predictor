from flask import Blueprint, jsonify, request
from models import Notification, Person, Session

notification_bp = Blueprint('notification_routes', __name__)

@notification_bp.route('/notifications', methods=['GET'])
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
