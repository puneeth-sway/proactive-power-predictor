
from enum import Enum
from dataclasses import dataclass
from typing import List, Dict, Optional, Any, Union
from datetime import datetime

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

# Data classes
@dataclass
class MaintenanceRecord:
    id: str
    productId: str
    type: str
    description: str
    datePerformed: Optional[datetime] = None
    hoursAtService: Optional[int] = None
    technician: Optional[str] = None
    notes: Optional[str] = None

@dataclass
class MaintenanceRecommendation:
    id: str
    productType: str
    maintenanceType: str
    description: str
    intervalDescription: str
    hoursInterval: Optional[int] = None
    timeInterval: Optional[int] = None  # in months

@dataclass
class Person:
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    role: Optional[str] = None  # 'homeowner', 'installer', 'contractor'

@dataclass
class Contractor:
    id: str
    name: str
    email: str
    phone: str
    company: str
    installers: List[str]  # List of installer IDs managed by this contractor
    homeowners: List[str]  # List of homeowner IDs managed by this contractor

@dataclass
class Notification:
    id: str
    type: str
    title: str
    message: str
    recipients: List[str]  # List of person IDs
    productId: Optional[str] = None
    createdAt: datetime = datetime.now()
    read: bool = False
    scheduledFor: Optional[datetime] = None

@dataclass
class Product:
    id: str
    serialNumber: str
    name: str
    type: str
    manufacturer: str
    model: str
    installDate: datetime
    totalHoursRun: int
    status: str
    owner: Dict[str, Any]
    installer: Dict[str, Any]
    location: Dict[str, Any]
    weeklyUsage: List[int]
    contractorId: Optional[str] = None  # ID of the contractor managing this product
    lastServiceDate: Optional[datetime] = None
    maintenanceHistory: Optional[List[MaintenanceRecord]] = None
    nextMaintenanceDate: Optional[datetime] = None
    hoursUntilMaintenance: Optional[int] = None
    performanceMetrics: Optional[Dict[str, int]] = None
