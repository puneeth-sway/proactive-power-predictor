
from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy import String
from .base import Base

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
