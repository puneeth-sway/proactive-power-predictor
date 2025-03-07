
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import Base

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(String, primary_key=True)
    serial_number = Column(String, nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    manufacturer = Column(String, nullable=False)
    model = Column(String, nullable=False)
    install_date = Column(DateTime, nullable=False)
    total_hours_run = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    
    # Foreign keys
    owner_id = Column(String, ForeignKey('persons.id'))
    installer_id = Column(String, ForeignKey('persons.id'))
    contractor_id = Column(String, ForeignKey('contractors.id'))
    
    # JSON fields (stored as Text)
    location = Column(Text)  # JSON string
    weekly_usage = Column(Text)  # JSON string
    performance_metrics = Column(Text)  # JSON string
    
    # Other fields
    last_service_date = Column(DateTime)
    next_maintenance_date = Column(DateTime)
    hours_until_maintenance = Column(Integer)
    
    # Relationships
    owner = relationship("Person", foreign_keys=[owner_id])
    installer = relationship("Person", foreign_keys=[installer_id])
    contractor = relationship("Contractor", back_populates="products")
    maintenance_history = relationship("MaintenanceRecord", back_populates="product")
    notifications = relationship("Notification", back_populates="product")
    
    def to_dict(self):
        import json
        return {
            'id': self.id,
            'serialNumber': self.serial_number,
            'name': self.name,
            'type': self.type,
            'manufacturer': self.manufacturer,
            'model': self.model,
            'installDate': self.install_date.isoformat() if self.install_date else None,
            'totalHoursRun': self.total_hours_run,
            'status': self.status,
            'owner': self.owner.to_dict() if self.owner else None,
            'installer': self.installer.to_dict() if self.installer else None,
            'contractorId': self.contractor_id,
            'location': json.loads(self.location) if self.location else {},
            'weeklyUsage': json.loads(self.weekly_usage) if self.weekly_usage else [],
            'lastServiceDate': self.last_service_date.isoformat() if self.last_service_date else None,
            'nextMaintenanceDate': self.next_maintenance_date.isoformat() if self.next_maintenance_date else None,
            'hoursUntilMaintenance': self.hours_until_maintenance,
            'performanceMetrics': json.loads(self.performance_metrics) if self.performance_metrics else {},
            'maintenanceHistory': [record.to_dict() for record in self.maintenance_history]
        }
