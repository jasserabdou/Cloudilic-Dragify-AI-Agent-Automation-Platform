from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.models.schemas import TokenData
from app.core.config import settings
from app.db.init_db import get_db

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(cursor, username: str):
    cursor.execute(
        "SELECT id, username, email, hashed_password, is_active, created_at FROM users WHERE username = %s",
        (username,),
    )
    return cursor.fetchone()


def authenticate_user(cursor, username: str, password: str):
    print(f"Attempting to authenticate user: {username}")
    user = get_user(cursor, username)
    if not user:
        print(f"User not found: {username}")
        return False

    print(f"User found: {username}, verifying password")
    password_matches = verify_password(password, user["hashed_password"])
    if not password_matches:
        print(f"Password verification failed for user: {username}")
        return False

    print(f"Authentication successful for user: {username}")
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


async def get_current_user(cursor=Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            print(f"JWT token is missing 'sub' claim: {payload}")
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError as e:
        print(f"JWT decode error: {str(e)}")
        raise credentials_exception
    user = get_user(cursor, username=token_data.username)
    if user is None:
        print(f"User not found in database: {token_data.username}")
        raise credentials_exception
    return user


async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    if not current_user["is_active"]:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
