from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class IndicatorBase(BaseModel):
    indicator: str
    type: str

class IndicatorSchema(BaseModel):
    id: int
    indicator: str
    type: str
    created_at: datetime
    country: Optional[str] = None
    city: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    isp: Optional[str] = None
    severity: Optional[str] = "medium"
    
    class Config:
        from_attributes = True

class ThreatFeedBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    author_name: str
    created: Optional[datetime] = None
    is_active: bool
    lat: Optional[float] = None
    lon: Optional[float] = None

class ThreatFeedSchema(ThreatFeedBase):
    indicators: List[IndicatorSchema] = []

    class Config:
        from_attributes = True

class DeviceBase(BaseModel):
    name: str
    ip_address: str
    status: str

class DeviceSchema(DeviceBase):
    id: int
    last_seen: datetime

    class Config:
        from_attributes = True
