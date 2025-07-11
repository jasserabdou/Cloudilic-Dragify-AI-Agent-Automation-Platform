from fastapi import APIRouter
from app.api.endpoints import (
    webhook,
    auth,
    users,
    leads,
    events,
    config,
    dashboard,
    health,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(webhook.router, prefix="/webhook", tags=["Webhook"])
api_router.include_router(leads.router, prefix="/leads", tags=["Leads"])
api_router.include_router(events.router, prefix="/events", tags=["Events"])
api_router.include_router(config.router, prefix="/config", tags=["Configuration"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(health.router, prefix="/health", tags=["Health"])
