from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.db.init_db import get_db
from app.services.auth import get_current_active_user
from app.models.schemas import EventResponse

router = APIRouter()


@router.get("/", response_model=List[EventResponse])
async def read_events(
    skip: int = 0,
    limit: int = 100,
    cursor=Depends(get_db),
    current_user: dict = Depends(get_current_active_user),
):
    """Get all events for the current user."""
    cursor.execute(
        """
        SELECT id, event_type, event_id, user_id, payload, status, created_at
        FROM events
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT %s OFFSET %s
        """,
        (current_user["id"], limit, skip),
    )
    events = cursor.fetchall()
    return events


@router.get("/{event_id}", response_model=EventResponse)
async def read_event(
    event_id: str,
    cursor=Depends(get_db),
    current_user: dict = Depends(get_current_active_user),
):
    """Get a specific event by ID."""
    cursor.execute(
        """
        SELECT id, event_type, event_id, user_id, payload, status, created_at
        FROM events
        WHERE event_id = %s AND user_id = %s
        """,
        (event_id, current_user["id"]),
    )
    event = cursor.fetchone()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event
