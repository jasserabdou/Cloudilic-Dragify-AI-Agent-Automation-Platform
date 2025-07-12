import logging
import time
import psycopg2
from app.core.config import settings
import random

logger = logging.getLogger(__name__)


class CRMService:
    """Service to handle CRM operations with retry logic."""

    def __init__(self, conn):
        self.conn = conn
        self.max_retries = settings.CRM_MAX_RETRIES
        self.retry_delay = settings.CRM_RETRY_DELAY

    async def save_lead_to_crm(self, lead_id: int) -> bool:
        """
        Save lead to CRM with retry logic.

        Args:
            lead_id: The ID of the lead to save to CRM

        Returns:
            True if successful, False otherwise
        """
        cursor = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        try:
            cursor.execute(
                "SELECT id, name, email, company FROM leads WHERE id = %s", (lead_id,)
            )
            lead = cursor.fetchone()

            if not lead:
                logger.error(f"Lead with ID {lead_id} not found")
                return False

            # Get the current attempt number
            cursor.execute(
                "SELECT COUNT(*) as count FROM crm_attempts WHERE lead_id = %s",
                (lead_id,),
            )
            attempt_count = cursor.fetchone()["count"]
            current_attempt = attempt_count + 1

            # Check if we've exceeded max retries
            if current_attempt > self.max_retries:
                logger.error(f"Max retries exceeded for lead {lead_id}")
                return False

            # Simulate CRM API call - 80% chance of success
            success = random.random() > 0.2

            if not success:
                error_message = "CRM API call failed (simulated failure)"
                logger.error(
                    f"Failed to save lead {lead_id} to CRM on attempt {current_attempt}: {error_message}"
                )

                # Record the failed attempt
                cursor.execute(
                    """
                    INSERT INTO crm_attempts (lead_id, success, attempt_number, error_message)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (lead_id, False, current_attempt, error_message),
                )
                self.conn.commit()

                # If we have more retries left, retry after a delay
                if current_attempt < self.max_retries:
                    logger.info(
                        f"Retrying lead {lead_id} after {self.retry_delay} seconds..."
                    )
                    time.sleep(self.retry_delay)
                    return await self.save_lead_to_crm(lead_id)

                return False
            else:
                # CRM call was successful
                cursor.execute(
                    """
                    INSERT INTO crm_attempts (lead_id, success, attempt_number)
                    VALUES (%s, %s, %s)
                    """,
                    (lead_id, True, current_attempt),
                )
                self.conn.commit()

                logger.info(
                    f"Successfully saved lead {lead_id} to CRM on attempt {current_attempt}"
                )
                return True

        finally:
            cursor.close()
