import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager

# Database connection parameters
DB_PARAMS = {
    "host": "localhost",
    "dbname": "cloudilic",
    "user": "postgres",
    "password": "2006",
    "port": 5432,
}


def get_db_connection():
    """
    Create and return a database connection.
    Returns a connection object with RealDictCursor to return results as dictionaries.
    """
    try:
        conn = psycopg2.connect(**DB_PARAMS, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        # Create the database if it doesn't exist
        try:
            # Connect to default postgres database
            temp_params = DB_PARAMS.copy()
            temp_params["dbname"] = "postgres"
            conn = psycopg2.connect(**temp_params)
            conn.autocommit = True
            cur = conn.cursor()

            # Check if database exists
            cur.execute(
                f"SELECT 1 FROM pg_database WHERE datname = '{DB_PARAMS['dbname']}'"
            )
            if cur.fetchone() is None:
                # Create database
                cur.execute(f"CREATE DATABASE {DB_PARAMS['dbname']}")
                print(f"Created database {DB_PARAMS['dbname']}")

            cur.close()
            conn.close()

            # Try connecting again
            conn = psycopg2.connect(**DB_PARAMS, cursor_factory=RealDictCursor)
            return conn
        except Exception as inner_e:
            print(f"Failed to create database: {inner_e}")
            raise


@contextmanager
def db_connection():
    """Context manager for database connections"""
    conn = None
    try:
        conn = get_db_connection()
        yield conn
    finally:
        if conn:
            conn.close()


@contextmanager
def db_transaction():
    """
    Context manager for database transactions.
    Handles connection opening, committing or rolling back, and closing.
    """
    conn = None
    try:
        conn = get_db_connection()
        yield conn
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Transaction error: {e}")
        raise
    finally:
        if conn:
            conn.close()


def execute_query(query, params=None, fetch=True, many=False):
    """
    Execute a database query and optionally return results.

    Args:
        query (str): SQL query to execute
        params (tuple or dict): Parameters for the query
        fetch (bool): Whether to fetch and return results
        many (bool): If True, execute many statements with executemany

    Returns:
        If fetch is True, returns query results, otherwise returns None
    """
    try:
        with db_connection() as conn:
            with conn.cursor() as cur:
                if many and params:
                    cur.executemany(query, params)
                else:
                    cur.execute(query, params)

                conn.commit()

                if fetch:
                    result = cur.fetchall()
                    # Convert RealDictRow objects to regular dictionaries
                    return [dict(row) for row in result]
                else:
                    return None
    except Exception as e:
        print(f"Database query error: {e}")
        print(f"Query: {query}")
        print(f"Params: {params}")
        raise


def execute_transaction(queries_with_params):
    """
    Execute multiple queries in a single transaction.

    Args:
        queries_with_params: List of (query, params) tuples

    Returns:
        None
    """
    try:
        with db_transaction() as conn:
            with conn.cursor() as cur:
                for query, params in queries_with_params:
                    cur.execute(query, params)
    except Exception as e:
        print(f"Transaction error: {e}")
        raise


def insert_and_return_id(query, params, id_column="id"):
    """
    Insert a record and return its ID.

    Args:
        query (str): SQL insert query with RETURNING clause
        params (tuple or dict): Parameters for the query
        id_column (str): Name of the ID column to return

    Returns:
        The ID of the inserted record
    """
    try:
        with db_connection() as conn:
            with conn.cursor() as cur:
                if "RETURNING" not in query:
                    query += f" RETURNING {id_column}"

                cur.execute(query, params)
                conn.commit()
                result = cur.fetchone()

                if result:
                    return result[id_column]
                return None
    except Exception as e:
        print(f"Insert error: {e}")
        print(f"Query: {query}")
        print(f"Params: {params}")
        raise
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if many and params:
            cursor.executemany(query, params)
        else:
            cursor.execute(query, params)

        if fetch:
            results = cursor.fetchall()
            return results
        else:
            conn.commit()
            if cursor.rowcount >= 0:
                return cursor.rowcount
            return None

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Query execution error: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def execute_transaction(queries):
    """
    Execute multiple queries in a single transaction.

    Args:
        queries (list): List of dictionaries with 'query', 'params', and 'fetch' keys

    Returns:
        List of results from each query that had fetch=True
    """
    conn = None
    cursor = None
    results = []

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        for q in queries:
            query = q["query"]
            params = q.get("params")
            fetch = q.get("fetch", False)

            cursor.execute(query, params)

            if fetch:
                fetch_results = cursor.fetchall()
                results.append(fetch_results)

        conn.commit()
        return results

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Transaction execution error: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
