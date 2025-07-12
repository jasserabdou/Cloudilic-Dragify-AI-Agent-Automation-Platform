from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# Request Schemas
class WebhookMessage(BaseModel):
    message: str


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    company: str
    raw_message: str
    user_id: int


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Response Schemas
class LeadExtracted(BaseModel):
    name: str
    email: str
    company: str


class CRMAttemptResponse(BaseModel):
    id: int
    lead_id: int
    success: bool
    attempt_number: int
    error_message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LeadResponse(BaseModel):
    id: int
    name: str
    email: str
    company: str
    raw_message: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    crm_attempts: List[CRMAttemptResponse] = []

    class Config:
        from_attributes = True


class EventResponse(BaseModel):
    id: int
    event_type: str
    event_id: str
    user_id: int
    payload: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_leads: int
    successful_crm_saves: int
    failed_crm_saves: int
    leads_per_time: dict
    events_per_type: dict


class AgentConfigUpdate(BaseModel):
    crm_max_retries: Optional[int] = None
    crm_retry_delay: Optional[int] = None
