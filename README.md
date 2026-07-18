# 📚 AI-Powered Knowledge Base Assistant

An AI-powered Knowledge Base Assistant that enables users to upload documents, ask natural language questions, and receive AI-generated answers based solely on the uploaded content. The application provides secure authentication, document management, conversation history, and an interactive dashboard.

---

## 🌐 Live Demo

* Frontend (Vercel): https://ai-powered-knowledge-base-assistant-umber.vercel.app/
* Backend API (Render):https://ai-powered-knowledge-base-assistant-5ktv.onrender.com

---

## 🚀 Features

### 🔐 Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### 📄 Document Management

* Upload PDF, TXT, and Markdown files
* View uploaded documents
* Preview document content
* Delete documents
* Search and filter documents

### 🤖 AI Chat

* Ask questions about uploaded documents
* AI-generated answers using Gemini AI
* Context-aware responses
* Conversation history per document

### 📊 Dashboard

* Total uploaded documents
* Total questions asked
* Recent uploads
* Recent conversations
* Document type statistics

### 📝 History

* View previous conversations
* Search conversation history
* Organized by document

---

# 🛠️ Tech Stack

## Frontend

* React.js (Vite)
* React Router DOM
* Axios
* Tailwind CSS
* React Context API

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* PDF-Parse
* Open Router API

---

# ☁️ Deployment

The application is deployed using:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas
* **AI Service:**Open Router API

---

# ⚙️ Production Environment

### Backend Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend Environment Variables

```env
VITE_API_URL=https://your-project.onrender.com/api
```

---

# 🏗️ Deployment Architecture

```text
User
   │
   ▼
Frontend (React + Vite)
Hosted on Vercel
   │
   ▼
Backend (Node.js + Express)
Hosted on Render
   │
   ├── MongoDB Atlas
   └──  Open Router API
```

---

# 📁 Project Structure

```text
knowledge-base-assistant/
│
├── backend/
│
│   ├── config/
│   │   ├── db.js
│   │   ├── api.js
│   │   └── jwt.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── documentController.js
│   │   ├── chatController.js
│   │   └── dashboardController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   ├── validateMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Document.js
│   │   └── Conversation.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── chatRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   └── textExtraction.js
│   │
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│
│   ├── public/
│   ├── src/
│   │
│   ├── api/
│   │   ├── axios.jsx
│   │   ├── authApi.jsx
│   │   ├── documents.jsx
│   │   └── chat.jsx
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   └── layout/
│   │       ├── Layout.jsx
│   │       ├── Navbar.jsx
│   │       └── Sidebar.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Documents.jsx
│   │   ├── Upload.jsx
│   │   ├── Chat.jsx
│   │   ├── History.jsx
│   │   └── NotFound.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
└── README.md
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/yourusername/knowledge-base-assistant.git

cd knowledge-base-assistant
```

---

# Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

OPENROUTER_API_KEY=your_open_router_api_key
```

Run the backend:

```bash
npm run dev
```

Server:

```
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

Run:

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register User    |
| POST   | `/api/auth/login`    | Login User       |
| GET    | `/api/auth/profile`  | Get User Profile |

---

## Documents

| Method | Endpoint                     | Description      |
| ------ | ---------------------------- | ---------------- |
| GET    | `/api/documents`             | Get Documents    |
| POST   | `/api/documents`             | Upload Document  |
| GET    | `/api/documents/:id`         | Get Document     |
| GET    | `/api/documents/:id/preview` | Preview Document |
| DELETE | `/api/documents/:id`         | Delete Document  |

---

## Chat

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| POST   | `/api/chat/ask`                 | Ask AI                |
| GET    | `/api/chat/history`             | Chat History          |
| GET    | `/api/chat/history/:documentId` | Document Chat History |

---

## Dashboard

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/api/dashboard` | Dashboard Statistics |

---

# AI Workflow

1. User uploads a document.
2. Backend extracts text from the document.
3. Text is divided into chunks.
4. User asks a question.
5. Relevant document content is sent to Gemini AI.
6. AI generates an answer based on the uploaded document.
7. The conversation is saved to MongoDB.
8. Users can revisit previous conversations anytime.

---

# Security

* JWT Authentication
* Protected API Routes
* File Type Validation
* Request Validation
* Centralized Error Handling
* Secure Environment Variables

---

# Future Improvements

* Pagination
* Drag & Drop Upload
* Dark Mode
* OCR Support
* Semantic Search
* Vector Database Integration
* RAG (Retrieval-Augmented Generation)
* Admin Dashboard
* Document Sharing

---

# Learning Outcomes

This project demonstrates practical experience with:

* Full-Stack Web Development
* React & Vite
* Node.js & Express
* MongoDB & Mongoose
* RESTful API Development
* JWT Authentication
* File Upload & Processing
* Open Router AI Integration
* Context-Based Question Answering
* Responsive UI Design
* State Management with React Context
