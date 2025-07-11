from fastapi import APIRouter, Depends, HTTPException

from app.db.init_db import get_db
from app.services.auth import get_current_active_user
from app.models.schemas import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_active_user)):
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: int,
    cursor=Depends(get_db),
    current_user: dict = Depends(get_current_active_user),
):
    # Only allow users to see their own profile
    if user_id != current_user["id"]:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this user"
        )

    # Execute query to find user
    cursor.execute(
        "SELECT id, username, email, is_active, created_at FROM users WHERE id = %s",
        (user_id,),
    )
    user = cursor.fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
