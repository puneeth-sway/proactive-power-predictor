
from .base import Base, Session, init_db, get_session
from .enums import ProductType, MaintenanceType, HealthStatus, NotificationType
from .person import Person
from .contractor import Contractor
from .product import Product
from .maintenance import MaintenanceRecord, MaintenanceRecommendation
from .notification import Notification
from .associations import contractor_installer, contractor_homeowner, notification_recipient

# Re-export everything for backwards compatibility
__all__ = [
    'Base', 'Session', 'init_db', 'get_session',
    'ProductType', 'MaintenanceType', 'HealthStatus', 'NotificationType',
    'Person', 'Contractor', 'Product', 
    'MaintenanceRecord', 'MaintenanceRecommendation',
    'Notification',
    'contractor_installer', 'contractor_homeowner', 'notification_recipient'
]
