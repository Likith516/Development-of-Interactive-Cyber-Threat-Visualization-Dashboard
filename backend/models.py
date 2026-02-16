from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from database import Base
import datetime

class ThreatFeed(Base):
    __tablename__ = "threat_feeds"

    id = Column(String, primary_key=True, index=True) # Feed ID (e.g., abuseipdb-date)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    author_name = Column(String)
    created = Column(DateTime)
    is_active = Column(Boolean, default=True)
    
    # Pulse level location is less precise, but we keep it for aggregation if needed
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    
    indicators = relationship("Indicator", back_populates="feed")

class Indicator(Base):
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True, index=True)
    indicator = Column(String, index=True) # The IP or Domain
    type = Column(String) # IPv4, Domain, etc.
    feed_id = Column(String, ForeignKey("threat_feeds.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Geolocation & Enrichment
    country = Column(String, nullable=True)
    city = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    isp = Column(String, nullable=True) # Organization/ASN
    severity = Column(String, default="medium") # low, medium, high, critical

    feed = relationship("ThreatFeed", back_populates="indicators")

class Device(Base):
    __tablename__ = "devices"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    ip_address = Column(String, unique=True, index=True)
    status = Column(String, default="safe") 
    last_seen = Column(DateTime, default=datetime.datetime.utcnow)
