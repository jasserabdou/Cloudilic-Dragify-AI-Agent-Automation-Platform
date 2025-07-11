from fastapi import APIRouter, Depends
from typing import Dict, Any

from app.core.config import settings
from app.services.auth import get_current_active_user
from app.models.schemas import AgentConfigUpdate

router = APIRouter()


@router.get("/", response_model=Dict[str, Any])
async def get_agent_config(_current_user: dict = Depends(get_current_active_user)):
    """Get the current agent configuration settings."""
    # current_user is required for authentication but not used in function body
    return {
        "crm_max_retries": settings.CRM_MAX_RETRIES,
        "crm_retry_delay": settings.CRM_RETRY_DELAY,
    }


@router.post("/update", response_model=Dict[str, Any])
async def update_agent_config(
    config_update: AgentConfigUpdate,
    _current_user: dict = Depends(get_current_active_user),
):

    if config_update.crm_max_retries is not None:
        settings.CRM_MAX_RETRIES = config_update.crm_max_retries

    if config_update.crm_retry_delay is not None:
        settings.CRM_RETRY_DELAY = config_update.crm_retry_delay

    return {
        "crm_max_retries": settings.CRM_MAX_RETRIES,
        "crm_retry_delay": settings.CRM_RETRY_DELAY,
    }
