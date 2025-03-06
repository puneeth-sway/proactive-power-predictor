
from enum import Enum
from datetime import datetime
from typing import List, Dict, Optional, Any, Union
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Table, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

Base = declarative_base()

# Enums
class ProductType(str, Enum):
    HOME_STANDBY_GENERATOR = "Home Standby Generator"
    PORTABLE_GENERATOR = "Portable Generator"
    INVERTER_GENERATOR = "Inverter Generator"
    PRESSURE_WASHER = "Pressure Washer"
    WATER_TRASH_PUMP = "Water/Trash Pump"

class MaintenanceType(str, Enum):
    INITIAL = "Initial"
    ROUTINE = "Routine"
    LONG_TERM = "Long Term"
    SPECIAL = "Special Consideration"

class HealthStatus(str, Enum):
    HEALTHY = "Healthy"
    WARNING = "Warning"
    CRITICAL = "Critical"
    NEUTRAL = "Neutral"

class NotificationType(str, Enum):
    MAINTENANCE_DUE = "Maintenance Due"
    CRITICAL_ALERT = "Critical Alert"
    WARNING = "Warning"
    GENERAL = "General"

# Association tables for many-to-many relationships
contractor_installer = Table(
    'contractor_installer', Base.metadata,
    Column('contractor_id', String, ForeignKey('contractors.id')),
    Column('installer_id', String, ForeignKey('persons.id'))
)

contractor_homeowner = Table(
    'contractor_homeowner', Base.metadata,
    Column('contractor_id', String, ForeignKey('contractors.id')),
    Column('homeowner_id', String, ForeignKey('persons.id'))
)

notification_recipient = Table(
    'notification_recipient', Base.metadata,
    Column('notification_id', String, ForeignKey('notifications.id')),
    Column('person_id', String, ForeignKey('persons.id'))
)

# Database Models
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

class Contractor(Base):
    __tablename__ = 'contractors'
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    company = Column(String, nullable=False)
    
    # Relationships
    installers = relationship("Person", secondary=contractor_installer)
    homeowners = relationship("Person", secondary=contractor_homeowner)
    products = relationship("Product", back_populates="contractor")
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'company': self.company,
            'installers': [installer.id for installer in self.installers],
            'homeowners': [homeowner.id for homeowner in self.homeowners]
        }

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

# Database setup functions
def init_db(db_path='sqlite:///data.db'):
    engine = create_engine(db_path)
    Base.metadata.create_all(engine)
    return engine

def get_session(engine):
    Session = sessionmaker(bind=engine)
    return Session()
