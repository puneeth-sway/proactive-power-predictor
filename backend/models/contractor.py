
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from .base import Base
from .associations import contractor_installer, contractor_homeowner

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
