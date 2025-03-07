
from sqlalchemy import Column, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base
from .associations import notification_recipient

class Notification(Base):
    __tablename__ = 'notifications'
    
    id = Column(String, primary_key=True)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    product_id = Column(String, ForeignKey('products.id'))
    created_at = Column(DateTime, default=datetime.now)
    read = Column(Boolean, default=False)
    scheduled_for = Column(DateTime)
    
    # Relationships
    recipients = relationship("Person", secondary=notification_recipient, back_populates="notifications")
    product = relationship("Product", back_populates="notifications")
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'productId': self.product_id,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'read': self.read,
            'scheduledFor': self.scheduled_for.isoformat() if self.scheduled_for else None,
            'recipients': [recipient.id for recipient in self.recipients]
        }
