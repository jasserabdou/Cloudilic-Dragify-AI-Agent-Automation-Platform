import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT


# Database connection parameters
DB_PARAMS = {"host": "localhost", "user": "postgres", "password": "2006", "port": 5432}


def create_tables():
    """Create tables if they don't exist."""

    try:
        # First check if database exists, connect to postgres
        conn = psycopg2.connect(dbname="postgres", **DB_PARAMS)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        # Check if database already exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'cloudilic'")
        exists = cursor.fetchone()

        if not exists:
            print("Creating 'cloudilic' database...")
            cursor.execute("CREATE DATABASE cloudilic")
            print("Database 'cloudilic' created successfully!")
        else:
            print("Database 'cloudilic' already exists.")

        cursor.close()
        conn.close()

        # Now connect to the cloudilic database to create tables
        print("Setting up tables in 'cloudilic' database...")
        conn = psycopg2.connect(dbname="cloudilic", **DB_PARAMS)
        cursor = conn.cursor()

        # Create users table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR UNIQUE NOT NULL,
                email VARCHAR UNIQUE NOT NULL,
                hashed_password VARCHAR NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Create leads table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                name VARCHAR,
                email VARCHAR,
                company VARCHAR,
                raw_message TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE,
                user_id INTEGER REFERENCES users(id)
            )
        """
        )

        # Create crm_attempts table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS crm_attempts (
                id SERIAL PRIMARY KEY,
                lead_id INTEGER REFERENCES leads(id),
                success BOOLEAN DEFAULT FALSE,
                attempt_number INTEGER,
                error_message TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Create events table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                event_type VARCHAR,
                event_id VARCHAR UNIQUE,
                user_id INTEGER REFERENCES users(id),
                payload TEXT,
                status VARCHAR,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Create demo user if it doesn't exist
        from app.services.auth import get_password_hash

        # Check if demo user exists
        cursor.execute("SELECT id FROM users WHERE username = 'demo'")
        demo_user = cursor.fetchone()

        if not demo_user:
            print("Creating demo user...")
            # Create a demo user with password 'password'
            hashed_password = get_password_hash("password")
            cursor.execute(
                """
                INSERT INTO users (username, email, hashed_password, is_active)
                VALUES (%s, %s, %s, %s)
                """,
                ("demo", "demo@example.com", hashed_password, True),
            )
            print("Demo user created!")

        conn.commit()
        print("Database tables are ready!")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Database initialization error: {e}")
        raise


# This is a context manager for getting a database connection in FastAPI endpoints
def get_db():
    from app.db.database import get_db_connection

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        yield cursor
    finally:
        cursor.close()
        conn.close()
