import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.routes import api_router
from app.core.config import settings
from app.db.init_db import create_tables
from app.db.database import get_db_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Setup and teardown operations for the FastAPI app."""
    # Startup: create database tables
    create_tables()

    # Log that the application is starting
    app.state.startup_message = "Application startup completed"
    print(f"Starting {app.title} v{app.version}")

    # Check database connection and create demo user if needed
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check users table exists and has at least one user
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]

        if user_count == 0:
            print("Creating demo user...")
            from app.services.auth import get_password_hash

            hashed_password = get_password_hash("password")
            cursor.execute(
                """
                INSERT INTO users (username, email, hashed_password, is_active)
                VALUES (%s, %s, %s, %s)
                """,
                ("demo", "demo@example.com", hashed_password, True),
            )
            conn.commit()
            print("Demo user created with username 'demo' and password 'password'")
        else:
            print(f"Database check passed: {user_count} users found")
    except Exception as e:
        print(f"Database check failed: {e}")
    finally:
        cursor.close()
        conn.close()

    yield
    # Shutdown: cleanup operations can go here


app = FastAPI(
    title="Cloudilic AI Agent",
    description="AI Agent for lead capture and processing",
    version="1.0.0",
    lifespan=lifespan,
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=86400,  # Cache preflight requests for 24 hours
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
