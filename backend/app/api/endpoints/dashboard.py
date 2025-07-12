from fastapi import APIRouter, Depends
from datetime import datetime, timedelta, timezone


from app.db.init_db import get_db
from app.services.auth import get_current_active_user
from app.models.schemas import DashboardStats

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    cursor=Depends(get_db), current_user: dict = Depends(get_current_active_user)
):
    """Get dashboard statistics for the current user."""
    # Total leads count
    cursor.execute(
        "SELECT COUNT(*) as count FROM leads WHERE user_id = %s", (current_user["id"],)
    )
    total_leads = cursor.fetchone()["count"]

    # CRM success/failure stats
    # Get the latest attempt for each lead with success status
    cursor.execute(
        """
        WITH latest_attempts AS (
            SELECT lead_id, MAX(attempt_number) as max_attempt
            FROM crm_attempts
            GROUP BY lead_id
        )
        SELECT ca.success, COUNT(*) as count
        FROM crm_attempts ca
        JOIN latest_attempts la ON ca.lead_id = la.lead_id AND ca.attempt_number = la.max_attempt
        JOIN leads l ON l.id = ca.lead_id
        WHERE l.user_id = %s
        GROUP BY ca.success
        """,
        (current_user["id"],),
    )

    crm_results = cursor.fetchall()

    successful_crm_saves = 0
    failed_crm_saves = 0

    for result in crm_results:
        if result["success"]:
            successful_crm_saves = result["count"]
        else:
            failed_crm_saves = result["count"]

    # Leads per hour for the last 24 hours
    now = datetime.now(timezone.utc)
    leads_per_time = {}

    # Get leads per hour for the last 24 hours
    for i in range(24):
        hour_start = now - timedelta(hours=i + 1)
        hour_end = now - timedelta(hours=i)

        cursor.execute(
            """
            SELECT COUNT(*) as count
            FROM leads
            WHERE user_id = %s AND created_at >= %s AND created_at < %s
            """,
            (current_user["id"], hour_start, hour_end),
        )

        count = cursor.fetchone()["count"]
        hour_label = hour_end.strftime("%H:00")
        leads_per_time[hour_label] = count

    # Get events by type
    cursor.execute(
        """
        SELECT event_type, COUNT(*) as count
        FROM events
        WHERE user_id = %s
        GROUP BY event_type
        """,
        (current_user["id"],),
    )

    events_per_type = cursor.fetchall()
    events_per_type_dict = {row["event_type"]: row["count"] for row in events_per_type}

    return DashboardStats(
        total_leads=total_leads,
        successful_crm_saves=successful_crm_saves,
        failed_crm_saves=failed_crm_saves,
        leads_per_time=leads_per_time,
        events_per_type=events_per_type_dict,
    )
