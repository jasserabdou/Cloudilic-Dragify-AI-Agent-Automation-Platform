import sys
from app.db.init_db import create_tables

if __name__ == "__main__":
    print("==== Cloudilic Database Setup ====")
    try:
        create_tables()
        print("Database setup completed successfully!")
    except Exception as e:
        print(f"Error creating database: {e}")
        sys.exit(1)
