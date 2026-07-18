# Architecture

# Overview

The AI-Powered Knowledge Base Assistant follows a client-server architecture, separating the frontend, backend, database, and AI service into independent layers. This modular design improves maintainability, scalability, and code organization.

---

# System Architecture

```text
                        +----------------------+
                        |        User          |
                        +----------+-----------+
                                   |
                                   |
                          HTTP / HTTPS Requests
                                   |
                                   ▼
                    +----------------------------+
                    | React Frontend (Vite)      |
                    | - Dashboard                |
                    | - Documents               |
                    | - Chat                    |
                    | - Authentication          |
                    +-------------+-------------+
                                  |
                             Axios REST API
                                  |
                                  ▼
                  +-------------------------------+
                  | Express.js Backend            |
                  |                               |
                  | Authentication (JWT)          |
                  | Document Management           |
                  | Chat Controller              |
                  | Dashboard Controller         |
                  | Text Extraction Service      |
                  | Open Router API Service            |
                  +-------------+----------------+
                                |
              +-----------------+------------------+
              |                                    |
              ▼                                    ▼
      MongoDB Atlas                       Open Router API
      - Users                           - Answer Generation
      - Documents                       - Natural Language
      - Conversations                   - Context-Based Responses
```

---

# Frontend Architecture

The frontend is built using **React (Vite)** and follows a component-based architecture.

```text
src/
│
├── api/
├── components/
├── context/
├── pages/
├── routes/
└── assets/
```

### Responsibilities

* User authentication
* Dashboard
* Document upload
* Document preview
* AI chat interface
* Conversation history
* Responsive user interface

---

# Backend Architecture

The backend follows a layered architecture.

```text
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Models
   │
   ▼
MongoDB
```

### Layers

### Routes

Handle incoming API requests and map them to controllers.

### Controllers

Process requests, validate input, and coordinate business logic.

### Services

Contain reusable business logic such as:

* Text extraction
* AI response generation

### Models

Define MongoDB schemas using Mongoose.

---

# Database Design

## User

Stores user authentication information.

```text
User
├── name
├── email
├── password
└── timestamps
```

---

## Document

Stores uploaded documents and extracted content.

```text
Document
├── owner
├── name
├── filePath
├── fileType
├── extractedText
├── chunks
├── status
└── timestamps
```

---

## Conversation

Stores AI conversations.

```text
Conversation
├── user
├── document
├── question
├── answer
└── timestamps
```

---

# AI Processing Flow

```text
Upload Document
        │
        ▼
Extract Text
        │
        ▼
Split into Chunks
        │
        ▼
Save to MongoDB
        │
        ▼
User Asks Question
        │
        ▼
Retrieve Document Chunks
        │
        ▼
Send Context + Question
        │
        ▼
  Open Router API
        │
        ▼
Generate Answer
        │
        ▼
Store Conversation
        │
        ▼
Return Response
```

---

# Authentication Flow

```text
User Login
      │
      ▼
Validate Credentials
      │
      ▼
Generate JWT
      │
      ▼
Client Stores Token
      │
      ▼
Token Sent with API Requests
      │
      ▼
JWT Middleware
      │
      ▼
Protected API Access
```

---

# Deployment Architecture

```text
                User
                  │
                  ▼
      Frontend (React + Vite)
           Hosted on Vercel
                  │
             REST API (Axios)
                  │
                  ▼
     Backend (Node.js + Express)
          Hosted on Render
                  │
        ┌─────────┴──────────┐
        ▼                    ▼
 MongoDB Atlas         Open Router API
```

---

# Design Principles

* Component-based frontend architecture
* RESTful API design
* Separation of concerns
* Layered backend architecture
* Secure authentication with JWT
* Modular and reusable code
* Scalable folder structure
* Environment-based configuration

---

# Future Enhancements

* Retrieval-Augmented Generation (RAG)
* Vector database integration
* Semantic document search
* OCR support for scanned PDFs
* Role-based access control
* Document sharing
* Pagination and advanced filtering
* Docker containerization
* CI/CD pipeline for automated deployment

---

# Summary

The application is designed using a modular client-server architecture. The React frontend communicates with the Express.js backend through REST APIs. The backend manages authentication, document processing, and AI interactions while MongoDB stores application data. Google Gemini AI generates context-aware answers based on uploaded documents, resulting in a scalable and maintainable full-stack application.
