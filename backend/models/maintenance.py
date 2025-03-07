
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import Base

class MaintenanceRecord(Base):
    __tablename__ = 'maintenance_records'
    
    id = Column(String, primary_key=True)
    product_id = Column(String, ForeignKey('products.id'), nullable=False)
    type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    date_performed = Column(DateTime)
    hours_at_service = Column(Integer)
    technician = Column(String)
    notes = Column(Text)
    
    # Relationships
    product = relationship("Product", back_populates="maintenance_history")
    
    def to_dict(self):
        return {
            'id': self.id,
            'productId': self.product_id,
            'type': self.type,
            'description': self.description,
            'datePerformed': self.date_performed.isoformat() if self.date_performed else None,
            'hoursAtService': self.hours_at_service,
            'technician': self.technician,
            'notes': self.notes
        }

class MaintenanceRecommendation(Base):
    __tablename__ = 'maintenance_recommendations'
    
    id = Column(String, primary_key=True)
    product_type = Column(String, nullable=False)
    maintenance_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    interval_description = Column(String, nullable=False)
    hours_interval = Column(Integer)
    time_interval = Column(Integer)  # in months
    
    def to_dict(self):
        return {
            'id': self.id,
            'productType': self.product_type,
            'maintenanceType': self.maintenance_type,
            'description': self.description,
            'intervalDescription': self.interval_description,
            'hoursInterval': self.hours_interval,
            'timeInterval': self.time_interval
        }
