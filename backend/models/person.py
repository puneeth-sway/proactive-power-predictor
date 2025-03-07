
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from .base import Base
from .associations import notification_recipient

class Person(Base):
    __tablename__ = 'persons'
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String)
    address = Column(String)
    role = Column(String)  # 'homeowner', 'installer', 'contractor'
    
    # Relationships
    notifications = relationship("Notification", secondary=notification_recipient, back_populates="recipients")
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'role': self.role
        }
