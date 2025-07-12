# 🤖 Cloudilic Dragify AI Agent Automation Platform

<div align="center">
  
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95+-green.svg)
![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg)

</div>

An intelligent AI-driven Agent system that automates lead capture and onboarding processes, transforming unstructured data into actionable business insights in real-time.

## ✨ Project Overview

Cloudilic Dragify is a cutting-edge AI automation platform that:

- ⚡ **Processes webhook events** in real-time from multiple sources
- 🧠 **Intelligently extracts structured data** from natural language messages using LLMs
- 💾 **Persists lead information** with robust error handling and retry mechanisms
- 📊 **Visualizes performance metrics** through an intuitive, responsive dashboard

## 🚀 Key Features

- **Webhook Trigger System**: Instantly process incoming messages through a robust FastAPI endpoint
- **AI-Powered Data Extraction**: Accurately extract lead information (name, email, company) using LangChain and HuggingFace models
- **Enterprise-Grade CRM Integration**: Save leads to PostgreSQL with configurable retry logic and data validation
- **Secure Authentication**: Complete OAuth2 authentication flow with JWT tokens
- **Real-Time Dashboard**: Monitor trigger events, extraction accuracy, and CRM integration status
- **Multi-Tenant Architecture**: Support for multiple users with comprehensive data isolation
- **Dynamic Configuration**: Adjust business logic and AI parameters through the intuitive UI
- **Modern UI Experience**: Clean, responsive design with dark mode support for enhanced readability

## 🛠️ Tech Stack

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Backend</b></td>
      <td align="center"><b>Frontend</b></td>
      <td align="center"><b>AI & Data</b></td>
      <td align="center"><b>DevOps</b></td>
    </tr>
    <tr>
      <td>
        <ul>
          <li>Python</li>
          <li>FastAPI</li>
          <li>SQLAlchemy</li>
          <li>OAuth2 with JWT</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>React</li>
          <li>TypeScript</li>
          <li>TailwindCSS</li>
          <li>Zustand</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>LangChain</li>
          <li>HuggingFace Models</li>
          <li>PostgreSQL</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Vercel (Frontend)</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

## 🌐 Live Demo

<div align="center">
  
[<img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />](https://cloudilic-dragify-ai-agent-automati.vercel.app/)
[<img src="https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />](https://cloudilic-agent-api.onrender.com)
[<img src="https://img.shields.io/badge/API_Docs-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />](https://cloudilic-agent-api.onrender.com/docs)

</div>

## 🧠 Agent Logic Overview

The Cloudilic Dragify AI Agent operates through a multi-step intelligent process:

1. **Webhook Event Reception**: 
   - The system receives webhook events from external sources via the `/api/v1/webhook` endpoint
   - Each event is immediately logged with a unique identifier for tracking

2. **Message Analysis & Validation**:
   - Incoming messages are validated for required fields and format
   - The system determines if the message contains potential lead information

3. **AI-Powered Information Extraction**:
   - LangChain orchestrates the extraction pipeline
   - HuggingFace models process natural language to identify:
     - Contact names
     - Email addresses
     - Company information
     - Product interests
     - Communication preferences

4. **Confidence Scoring**:
   - Each extracted field receives a confidence score (0-100%)
   - Fields below threshold are flagged for manual review
   - High-confidence data proceeds automatically

5. **CRM Integration**:
   - Structured data is formatted according to CRM requirements
   - A multi-attempt integration process handles potential connection issues
   - Success/failure status is recorded for each integration attempt

6. **Feedback Loop**:
   - Results feed back into the AI model to improve future extractions
   - System learns from manual corrections to continuously enhance accuracy

7. **Real-Time Monitoring**:
   - All processes are monitored and visualized on the dashboard
   - Alerts trigger for critical failures or unusual patterns

## 📋 Detailed Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 22.1+
- PostgreSQL 17.5+
- Git

### Backend Setup

<details>
<summary>🔍 Click to expand backend setup instructions</summary>

1. **Clone the repository**

```bash
git clone https://github.com/jasserabdou/Cloudilic-Dragify-AI-Agent-Automation-Platform.git
cd Cloudilic-Dragify-AI-Agent-Automation-Platform
```

2. **Navigate to the backend directory**

```bash
cd backend
```

3. **Create and activate a virtual environment**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

4. **Install dependencies**

```bash
pip install -r requirements.txt
```

5. **Configure environment variables**

```bash
# Create a .env file based on the provided example
copy .env.example .env
# Edit the .env file with your settings
```

Required environment variables:
```
DATABASE_URL=postgresql://username:password@localhost/cloudilic
SECRET_KEY=your_jwt_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
MODEL_NAME=google/flan-t5-base
```

6. **Set up PostgreSQL database**

```bash
# Create a database named 'cloudilic'
psql -U postgres -c "CREATE DATABASE cloudilic;"
# Update the DATABASE_URL in .env with your credentials
```

7. **Initialize the database**

```bash
python create_database.py
```

8. **Start the backend server**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`

</details>

### Frontend Setup

<details>
<summary>🔍 Click to expand frontend setup instructions</summary>

1. **Navigate to the frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure API endpoint**

Edit `src/api/index.ts` to point to your backend server:

```typescript
// For local development
const API_URL = 'http://localhost:8000/api/v1';

// For production
// const API_URL = 'https://your-backend-url.com/api/v1';
```

4. **Start the development server**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

5. **Build for production**

```bash
npm run build
```

This will create optimized production files in the `dist` directory.

</details>

### Quick Start (Windows)

For Windows users, a convenience script is included:

```bash
start_app.bat
```

This script will:
1. Activate the Python virtual environment
2. Start the backend server
3. Start the frontend development server

## 💻 API Endpoints Reference

The platform provides a comprehensive set of RESTful APIs:

### Authentication Endpoints

| Method | Endpoint                | Description                  | Request Body | Response |
| ------ | ----------------------- | ---------------------------- | ------------ | -------- |
| `POST` | `/api/v1/auth/token`    | Generate JWT access token    | `{"username": "string", "password": "string"}` | `{"access_token": "string", "token_type": "bearer"}` |
| `POST` | `/api/v1/auth/register` | Create new user account      | `{"email": "string", "username": "string", "password": "string"}` | `{"id": "uuid", "email": "string", "username": "string"}` |
| `GET`  | `/api/v1/auth/me`       | Get current user information | _Bearer token in header_ | `{"id": "uuid", "email": "string", "username": "string"}` |

### Webhook Endpoints

| Method | Endpoint                 | Description               | Request Body | Response |
| ------ | ------------------------ | ------------------------- | ------------ | -------- |
| `POST` | `/api/v1/webhook`        | Process webhook messages  | `{"source": "string", "message": "string", "metadata": {}}` | `{"event_id": "uuid", "status": "string", "lead_id": "uuid?"}` |
| `GET`  | `/api/v1/webhook/config` | Get webhook configuration | _Bearer token in header_ | `{"webhook_url": "string", "secret_key": "string", "allowed_sources": ["string"]}` |

### Lead Management

| Method   | Endpoint                            | Description               | Request/Parameters | Response |
| -------- | ----------------------------------- | ------------------------- | ------------------ | -------- |
| `GET`    | `/api/v1/leads`                     | List all captured leads   | _Query params: page, limit_ | `{"items": [Lead], "total": int, "page": int, "limit": int}` |
| `GET`    | `/api/v1/leads/{lead_id}`           | Get specific lead details | _Path param: lead_id_ | `{"id": "uuid", "name": "string", "email": "string", "company": "string", ...}` |
| `POST`   | `/api/v1/leads/{lead_id}/retry-crm` | Retry CRM integration     | _Path param: lead_id_ | `{"success": boolean, "message": "string"}` |
| `DELETE` | `/api/v1/leads/{lead_id}`           | Delete lead data          | _Path param: lead_id_ | `{"success": boolean}` |

### Event Tracking

| Method | Endpoint                    | Description                | Request/Parameters | Response |
| ------ | --------------------------- | -------------------------- | ------------------ | -------- |
| `GET`  | `/api/v1/events`            | List all webhook events    | _Query params: page, limit, status_ | `{"items": [Event], "total": int, "page": int, "limit": int}` |
| `GET`  | `/api/v1/events/{event_id}` | Get specific event details | _Path param: event_id_ | `{"id": "uuid", "source": "string", "message": "string", "status": "string", ...}` |
| `GET`  | `/api/v1/events/stats`      | Get event statistics       | _Query param: timeframe_ | `{"total": int, "success": int, "failed": int, "by_source": {}}` |

### Dashboard & Analytics

| Method | Endpoint                            | Description                      | Request/Parameters | Response |
| ------ | ----------------------------------- | -------------------------------- | ------------------ | -------- |
| `GET`  | `/api/v1/dashboard/stats`           | Get dashboard summary statistics | _Query param: timeframe_ | `{"leads_count": int, "events_count": int, "success_rate": float, ...}` |
| `GET`  | `/api/v1/dashboard/leads-over-time` | Get lead acquisition timeline    | _Query params: start_date, end_date_ | `{"dates": ["string"], "counts": [int]}` |

### Agent Configuration

| Method | Endpoint                | Description             | Request Body | Response |
| ------ | ----------------------- | ----------------------- | ------------ | -------- |
| `GET`  | `/api/v1/config`        | Get agent configuration | _Bearer token in header_ | `{"model": "string", "threshold": float, "retry_count": int, ...}` |
| `POST` | `/api/v1/config/update` | Update agent settings   | `{"model": "string?", "threshold": float?, "retry_count": int?, ...}` | `{"success": boolean, "config": {}}` |

### Health Check

| Method | Endpoint         | Description        | Response |
| ------ | ---------------- | ------------------ | -------- |
| `GET`  | `/api/v1/health` | API health status  | `{"status": "string", "version": "string", "db_connected": boolean}` |

## 🔄 How It Works

1. **Event Ingestion**: External systems send webhook events to the platform API
2. **Event Processing**: Incoming messages are logged and validated
3. **AI Analysis**: LangChain with HuggingFace models extracts structured lead data
4. **Data Storage**: Extracted information is persisted to the database
5. **CRM Integration**: Data is securely transferred to CRM with retry capability
6. **Monitoring**: Real-time dashboard updates with latest metrics

## 🧪 Testing

Comprehensive test coverage is available through pytest:

<details>
<summary>🔍 Click to expand testing details</summary>

### Running Tests

```bash
cd backend
pytest
```

### Running Tests with Coverage

```bash
cd backend
pytest --cov=app
```

### Specific Test Categories

```bash
# Run just the webhook tests
pytest tests/test_webhook.py
```

</details>

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/) for the high-performance API framework
- [React](https://reactjs.org/) for the frontend UI library
- [LangChain](https://langchain.com/) for the AI orchestration framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [HuggingFace](https://huggingface.co/) for the open-source AI models

---

<div align="center">
  
Developed by [Jasser Abdou](https://github.com/jasserabdou) for Cloudilic

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/jasser-abdelfattah-67a420276)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/jasserabdou)

</div>
