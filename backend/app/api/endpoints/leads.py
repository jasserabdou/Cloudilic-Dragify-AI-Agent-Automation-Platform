from fastapi import APIRouter, Depends, HTTPException
from typing import List


from app.db.init_db import get_db
from app.services.auth import get_current_active_user
from app.services.crm_service import CRMService
from app.models.schemas import LeadResponse

router = APIRouter()


@router.get("/", response_model=List[LeadResponse])
async def read_leads(
    skip: int = 0,
    limit: int = 100,
    cursor=Depends(get_db),
    current_user: dict = Depends(get_current_active_user),
):
    """Get all leads for the current user."""
    cursor.execute(
        """
        SELECT id, name, email, company, raw_message, created_at, updated_at, user_id
        FROM leads 
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT %s OFFSET %s
        """,
        (current_user["id"], limit, skip),
    )
    leads = cursor.fetchall()
    return leads


@router.get("/{lead_id}", response_model=LeadResponse)
async def read_lead(
    lead_id: int,
    cursor=Depends(get_db),
    current_user: dict = Depends(get_current_active_user),
):
    """Get a specific lead by ID."""
    cursor.execute(
        """
        SELECT id, name, email, company, raw_message, created_at, updated_at, user_id
        FROM leads 
        WHERE id = %s AND user_id = %s
        """,
        (lead_id, current_user["id"]),
    )
    lead = cursor.fetchone()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.post("/{lead_id}/retry-crm", response_model=LeadResponse)
async def retry_crm_save(
    lead_id: int,
    cursor=Depends(get_db),
    current_user: dict = Depends(get_current_active_user),
):
    """Retry saving a lead to CRM."""
    cursor.execute(
        "SELECT id FROM leads WHERE id = %s AND user_id = %s",
        (lead_id, current_user["id"]),
    )
    lead = cursor.fetchone()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    crm_service = CRMService(cursor.connection)
    success = await crm_service.save_lead_to_crm(lead_id)

    if not success:
        raise HTTPException(status_code=500, detail="Failed to save to CRM after retry")

    # Get the updated lead
    cursor.execute(
        """
        SELECT id, name, email, company, raw_message, created_at, updated_at, user_id
        FROM leads 
        WHERE id = %s
        """,
        (lead_id,),
    )
    updated_lead = cursor.fetchone()

    return updated_lead
