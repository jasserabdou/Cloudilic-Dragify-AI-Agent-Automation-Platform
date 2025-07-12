# 🤖 Cloudilic Dragify AI Agent Automation Platform

<div align="center">
  
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
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
          <li>Render (Backend)</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

## 🌐 Live Demo

<div align="center">
  
[<img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />](https://cloudilic-agent.vercel.app)
[<img src="https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />](https://cloudilic-agent-api.onrender.com)
[<img src="https://img.shields.io/badge/API_Docs-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />](https://cloudilic-agent-api.onrender.com/docs)

</div>

## 📋 Local Setup

### Prerequisites

- Python 3.11 
- Node.js 22.1 
- PostgreSQL 17.5 

### Backend Setup

<details>
<summary>🔍 Click to expand backend setup instructions</summary>

1. **Navigate to the backend directory**

```bash
cd backend
```

2. **Create and activate a virtual environment**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

```bash
# Create a .env file based on the provided .env.example
cp .env.example .env
# Edit the .env file with your database credentials and other settings
```

5. **Set up PostgreSQL database**

```bash
# Create a database named 'cloudilic'
# Update the DATABASE_URL in .env with your credentials
```

6. **Initialize the database**

```bash
python create_database.py
```

7. **Start the backend server**

```bash
uvicorn main:app --reload
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

3. **Start the development server**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

</details>

### Quick Start (Windows)

Simply run the included start script:

```bash
start_app.bat
```

This will launch both the backend and frontend in separate terminal windows.

## 💻 API Reference

The platform provides a comprehensive set of RESTful APIs:

### Authentication Endpoints

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| `POST` | `/api/v1/auth/token`    | Generate JWT access token    |
| `POST` | `/api/v1/auth/register` | Create new user account      |
| `GET`  | `/api/v1/auth/me`       | Get current user information |

### Webhook Endpoints

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| `POST` | `/api/v1/webhook`        | Process webhook messages  |
| `GET`  | `/api/v1/webhook/config` | Get webhook configuration |

### Lead Management

| Method   | Endpoint                            | Description               |
| -------- | ----------------------------------- | ------------------------- |
| `GET`    | `/api/v1/leads`                     | List all captured leads   |
| `GET`    | `/api/v1/leads/{lead_id}`           | Get specific lead details |
| `POST`   | `/api/v1/leads/{lead_id}/retry-crm` | Retry CRM integration     |
| `DELETE` | `/api/v1/leads/{lead_id}`           | Delete lead data          |

### Event Tracking

| Method | Endpoint                    | Description                |
| ------ | --------------------------- | -------------------------- |
| `GET`  | `/api/v1/events`            | List all webhook events    |
| `GET`  | `/api/v1/events/{event_id}` | Get specific event details |
| `GET`  | `/api/v1/events/stats`      | Get event statistics       |

### Dashboard & Analytics

| Method | Endpoint                            | Description                      |
| ------ | ----------------------------------- | -------------------------------- |
| `GET`  | `/api/v1/dashboard/stats`           | Get dashboard summary statistics |
| `GET`  | `/api/v1/dashboard/leads-over-time` | Get lead acquisition timeline    |

### Agent Configuration

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| `GET`  | `/api/v1/config`        | Get agent configuration |
| `POST` | `/api/v1/config/update` | Update agent settings   |

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
