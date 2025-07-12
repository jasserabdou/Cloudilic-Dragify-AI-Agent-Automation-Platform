from fastapi import APIRouter, Depends
from app.db.init_db import get_db

router = APIRouter()


@router.get("/")
async def health_check(cursor=Depends(get_db)):
    """Simple health check endpoint to verify backend is running"""

    cursor.execute("SELECT 1")
    return {"status": "healthy", "message": "Backend server is running"}
