# Debug Notes

## Overview

This document summarizes the key technical issues encountered during the development of the AI-Powered Knowledge Base Assistant and the solutions implemented to resolve them.

---

# Backend Issues

## 1. MongoDB Connection

### Issue

The backend failed to connect to the MongoDB database due to an incorrect connection string or missing environment variables.

### Resolution

* Verified the `MONGO_URI` in the `.env` file.
* Confirmed that the MongoDB Atlas cluster allowed network access.
* Restarted the server after updating environment variables.

---

## 2. JWT Authentication

### Issue

Protected API requests returned **401 Unauthorized**.

### Resolution

* Ensured the JWT token was generated during login.
* Added the `Authorization: Bearer <token>` header to all protected requests.
* Verified the authentication middleware correctly decoded the token.

---

## 3. File Upload Errors

### Issue

Document uploads failed because of unsupported file types or missing multipart form data.

### Resolution

* Configured Multer for file uploads.
* Restricted uploads to PDF, TXT, and Markdown files.
* Validated uploaded files before processing.

---

## 4. Text Extraction

### Issue

Uploaded documents were stored successfully, but extracted text was empty.

### Resolution

* Verified the uploaded file path.
* Confirmed `pdf-parse` processed PDF files correctly.
* Added handling for TXT and Markdown files using the file system module.
* Logged extraction results during development for verification.

---

## 5. AI Response Generation

### Issue

The AI service occasionally returned empty or incomplete responses.

### Resolution

* Verified the OpenRouter API key.
* Improved prompt formatting by providing document context and user questions clearly.
* Added error handling for API failures and invalid responses.

---

# Frontend Issues

## 1. Authentication State

### Issue

Users were redirected to the login page after refreshing the browser.

### Resolution

* Stored the JWT token in local storage.
* Restored the authenticated user using `AuthContext`.
* Protected routes using a dedicated `ProtectedRoute` component.

---

## 2. API Communication

### Issue

Frontend requests failed because of incorrect API URLs.

### Resolution

* Created a centralized Axios instance.
* Configured the backend base URL using environment variables.
* Automatically attached the JWT token using Axios interceptors.

---

## 3. Routing

### Issue

Refreshing protected pages resulted in routing errors.

### Resolution

* Configured React Router correctly.
* Wrapped protected pages with `ProtectedRoute`.
* Added a custom `NotFound` page for undefined routes.

---

## 4. State Management

### Issue

Document and chat data were not refreshed after creating or deleting records.

### Resolution

* Reloaded data after successful API operations.
* Managed application state using React hooks and Context API.

---

# Deployment Issues

## Render Backend

### Issue

Environment variables were not available after deployment.

### Resolution

* Added all required variables in the Render dashboard.
* Redeployed the application after updating configuration.

---

## Vercel Frontend

### Issue

Frontend requests failed after deployment because they still referenced the local backend.

### Resolution

* Updated `VITE_API_URL` to the deployed backend URL.
* Rebuilt and redeployed the frontend.

---

# General Debugging Practices

During development, the following practices were used to identify and resolve issues:

* Used browser Developer Tools to inspect network requests.
* Checked backend console logs for runtime errors.
* Verified API responses using Postman.
* Reviewed request and response payloads.
* Tested endpoints individually before frontend integration.
* Validated environment variables before deployment.

---

# Lessons Learned

* Validate environment variables before running the application.
* Test backend APIs independently before integrating the frontend.
* Keep API configuration centralized to simplify deployment.
* Add proper error handling and logging to speed up debugging.
* Use modular project structure for easier maintenance and troubleshooting.

---

# Summary

Throughout development, common issues related to authentication, API communication, file uploads, AI integration, routing, and deployment were identified and resolved using systematic debugging techniques. These experiences improved the stability, maintainability, and overall quality of the application.
