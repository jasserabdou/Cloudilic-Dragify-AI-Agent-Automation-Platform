from datetime import datetime
import uuid


class User:
    """User data class"""

    def __init__(
        self,
        id: int = None,
        username: str = None,
        email: str = None,
        hashed_password: str = None,
        is_active: bool = True,
        created_at: datetime = None,
    ):
        self.id = id
        self.username = username
        self.email = email
        self.hashed_password = hashed_password
        self.is_active = is_active
        self.created_at = created_at or datetime.utcnow()


class Lead:
    """Lead data class"""

    def __init__(
        self,
        id: int = None,
        name: str = None,
        email: str = None,
        company: str = None,
        raw_message: str = None,
        created_at: datetime = None,
        updated_at: datetime = None,
        user_id: int = None,
    ):
        self.id = id
        self.name = name
        self.email = email
        self.company = company
        self.raw_message = raw_message
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at
        self.user_id = user_id


class CRMAttempt:
    """CRM Attempt data class"""

    def __init__(
        self,
        id: int = None,
        lead_id: int = None,
        success: bool = False,
        attempt_number: int = None,
        error_message: str = None,
        created_at: datetime = None,
    ):
        self.id = id
        self.lead_id = lead_id
        self.success = success
        self.attempt_number = attempt_number
        self.error_message = error_message
        self.created_at = created_at or datetime.utcnow()


class Event:
    """Event data class"""

    def __init__(
        self,
        id: int = None,
        event_type: str = None,
        event_id: str = None,
        user_id: int = None,
        payload: str = None,
        status: str = None,
        created_at: datetime = None,
    ):
        self.id = id
        self.event_type = event_type
        self.event_id = event_id or str(uuid.uuid4())
        self.user_id = user_id
        self.payload = payload
        self.status = status
        self.created_at = created_at or datetime.utcnow()
