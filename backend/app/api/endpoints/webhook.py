from fastapi import APIRouter, Depends, HTTPException, Request
import uuid
from datetime import datetime, timezone


import logging

from app.db.init_db import get_db
from app.services.lead_extractor import LeadExtractor
from app.services.crm_service import CRMService
from app.services.auth import get_current_active_user
from app.models.schemas import WebhookMessage, LeadExtracted

logger = logging.getLogger(__name__)
router = APIRouter()

lead_extractor = LeadExtractor()


@router.post("/", response_model=LeadExtracted)
async def process_webhook(
    webhook_message: WebhookMessage,
    cursor=Depends(get_db),
    current_user: dict = Depends(get_current_active_user),
):
    """
    Process an incoming webhook message.

    Steps:
    1. Log the incoming event
    2. Extract lead information using LLM
    3. Save the lead to the database
    4. Attempt to save to CRM
    5. Return the extracted lead info
    """
    # Log the received message
    logger.info(f"Received webhook message: {webhook_message.message[:100]}...")

    # Create event record
    event_id = str(uuid.uuid4())
    cursor.execute(
        """
        INSERT INTO events (event_type, event_id, user_id, payload, status, created_at)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        (
            "webhook",
            event_id,
            current_user["id"],
            webhook_message.message,
            "processing",
            datetime.now(timezone.utc),
        ),
    )
    event_db_id = cursor.fetchone()["id"]
    cursor.connection.commit()

    try:
        # Extract lead info using LangChain with free model
        try:
            extracted_info = await lead_extractor.extract_lead_info(
                webhook_message.message
            )
        except ValueError as ve:
            # Model error
            cursor.execute(
                "UPDATE events SET status = %s WHERE id = %s", ("failed", event_db_id)
            )
            cursor.connection.commit()

            error_detail = str(ve)
            logger.error(f"Lead extraction error: {error_detail}")

            raise HTTPException(
                status_code=400, detail=f"Error processing request: {error_detail}"
            )

        # Create lead record
        cursor.execute(
            """
            INSERT INTO leads (name, email, company, raw_message, user_id, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                extracted_info["name"],
                extracted_info["email"],
                extracted_info["company"],
                webhook_message.message,
                current_user["id"],
                datetime.now(timezone.utc),
            ),
        )
        lead_id = cursor.fetchone()["id"]
        cursor.connection.commit()

        # Save to CRM with retry logic
        crm_service = CRMService(cursor.connection)
        crm_result = await crm_service.save_lead_to_crm(lead_id)

        # Update event status
        cursor.execute(
            "UPDATE events SET status = %s WHERE id = %s",
            ("success" if crm_result else "partial_success", event_db_id),
        )
        cursor.connection.commit()

        return extracted_info

    except Exception as e:
        cursor.execute(
            "UPDATE events SET status = %s WHERE id = %s", ("failed", event_db_id)
        )
        cursor.connection.commit()

        # Log the error for debugging
        logger.error(f"Webhook processing error: {str(e)}")
        logger.exception(e)

        # Return a more detailed error message
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during request processing: {str(e)}",
        )


@router.options("/")
async def webhook_options(request: Request):
    """Handle OPTIONS preflight requests for the webhook endpoint"""
    logger.info(
        f"Received OPTIONS request for webhook endpoint from {request.client.host if request.client else 'unknown'}"
    )
    return {}
