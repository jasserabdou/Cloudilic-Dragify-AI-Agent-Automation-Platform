# Cloudilic AI Agent Template

An AI-driven Agent system for lead capture and onboarding, developed as part of an assessment for Cloudilic.

## Project Overview

This project demonstrates an AI Agent that:

- Reacts to webhook trigger events
- Uses LLMs to extract structured data from unstructured messages
- Saves lead data to a mock CRM system with retry logic
- Monitors outcomes through a dynamic dashboard

## Features

- **Webhook Trigger**: Process incoming messages through a FastAPI endpoint
- **AI Processing**: Extract lead information (name, email, company) using LangChain and free HuggingFace models
- **CRM Integration**: Save leads to PostgreSQL with configurable retry logic
- **User Authentication**: Full OAuth2 authentication flow
- **Dashboard**: Real-time monitoring of trigger events, extracted data, and CRM status
- **Multi-tenant**: Support for multiple users with data isolation
- **Dynamic Configuration**: Update business logic settings through the UI
- **Dark Mode UI**: Enhanced readability with a dark color scheme

## Recent Updates

- Dark mode UI for improved readability and reduced eye strain
- Enhanced error handling for database connections
- Auto-creation of database if it doesn't exist
- Improved scripts for database reset and testing
- Better text contrast for improved accessibility

## Tech Stack

- **Backend**: FastAPI (Python)
- **AI Framework**: LangChain
- **Database**: PostgreSQL
- **Frontend**: React with TypeScript and TailwindCSS
- **Authentication**: OAuth2 with JWT
- **Deployment**: Vercel (Frontend), Render (Backend)

## Live Demo

Frontend: [https://cloudilic-agent.vercel.app](https://cloudilic-agent.vercel.app)  
API: [https://cloudilic-agent-api.onrender.com](https://cloudilic-agent-api.onrender.com)

## Local Setup

### Backend

1. Clone the repository
2. Navigate to the backend directory

```bash
cd backend
```

3. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. Install dependencies

```bash
pip install -r requirements.txt
```

5. Create a `.env` file based on `.env.example`
6. Setup PostgreSQL database

```bash
# Create a database named 'cloudilic'
# Update the DATABASE_URL in .env to match your PostgreSQL credentials
```

7. Run the server

```bash
uvicorn main:app --reload
```

### Using Docker Compose (Alternative Setup)

1. Make sure Docker and Docker Compose are installed
2. Run the application stack (includes PostgreSQL database)

```bash
docker-compose up -d
```

This will start:

- PostgreSQL database
- Backend FastAPI server
- Frontend with Nginx

### Common Issues

#### PostgreSQL Authentication Error

If you encounter an error like:

```
FATAL: password authentication failed for user "postgres"
```

You need to:

1. Edit the `.env` file in the backend directory and update the PostgreSQL credentials
2. OR use the Docker Compose setup which comes with a preconfigured PostgreSQL instance
3. OR update the credentials in `app/core/config.py`

#### Database Reset

To reset the database and start fresh:

```bash
cd backend
python reset_database.py
```

This will drop the existing database, recreate it, and set up all the necessary tables.

### Frontend

1. Navigate to the frontend directory

```bash
cd frontend
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/token` - Get access token
- `POST /api/v1/auth/register` - Register new user

### Webhook

- `POST /api/v1/webhook` - Process webhook message

### Leads

- `GET /api/v1/leads` - Get all leads
- `GET /api/v1/leads/{lead_id}` - Get lead details
- `POST /api/v1/leads/{lead_id}/retry-crm` - Retry CRM save

### Events

- `GET /api/v1/events` - Get all events
- `GET /api/v1/events/{event_id}` - Get event details

### Dashboard

- `GET /api/v1/dashboard/stats` - Get dashboard statistics

### Configuration

- `GET /api/v1/config` - Get agent configuration
- `POST /api/v1/config/update` - Update agent configuration

## Agent Logic

1. **Trigger Event**: When a webhook message is received
2. **Logging**: Event is logged in the database
3. **Processing**: LangChain with free HuggingFace model extracts structured lead data
4. **Storage**: Lead is saved to the database
5. **CRM Integration**: Lead is attempted to be saved to the CRM (with retry logic)
6. **Response**: Extracted lead data is returned

## Testing

Run tests using pytest:

```bash
cd backend
pytest
```

## License

This project is for assessment purposes only.

## Author

Created as part of an assessment for Cloudilic.
