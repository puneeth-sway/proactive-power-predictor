
from enum import Enum

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
