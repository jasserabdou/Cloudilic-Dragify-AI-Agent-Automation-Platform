from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm


from app.db.init_db import get_db
from app.services.auth import authenticate_user, create_access_token, get_password_hash
from app.core.config import settings
from app.models.schemas import Token, UserCreate, UserResponse

router = APIRouter()


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), cursor=Depends(get_db)
):
    user = authenticate_user(cursor, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=UserResponse)
async def register_user(user_create: UserCreate, cursor=Depends(get_db)):
    # Check if user exists
    cursor.execute("SELECT id FROM users WHERE username = %s", (user_create.username,))
    if cursor.fetchone():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    # Check if email exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (user_create.email,))
    if cursor.fetchone():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_create.password)
    cursor.execute(
        """
        INSERT INTO users (username, email, hashed_password, is_active)
        VALUES (%s, %s, %s, %s)
        RETURNING id, username, email, is_active, created_at
        """,
        (user_create.username, user_create.email, hashed_password, True),
    )

    # Get the created user
    new_user = cursor.fetchone()

    # Commit the transaction (since cursor is part of a connection)
    cursor.connection.commit()

    return new_user
