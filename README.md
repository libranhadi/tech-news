# Hacker News Clone
A full-stack (monorepo) Hacker News clone with a modern frontend built with React and a backend powered by Go as a gateway between Hacker News and Frontend.

# Project Preview
This project is a clone of the popular Hacker News website, featuring:
1. News items listing with different categories (top, new, best, ask, show, jobs)
2. Pagination with "Load More" functionality
3. Detailed view of posts with nested comments

# Tech Stack

# Front End
React 19.1.0
TypeScript
Tailwind CSS

# Backend 
Go
Redis for caching

# Prerequisites
Before you begin, ensure you have the following installed:

Node.js v20.5.0
npm 10.8.3
Go 1.19 or later
Docker (for Redis)

# Setup Instructions
Backend Setup
1. Start Redis using Docker:
```bash
docker run --name redis -p 6379:6379 -d redis
```
2. Navigate to the backend directory:
```bash
cd backend
```
3. Install Go dependencies:
```bash
go mod download
```
4. Start the backend server:

```bash
go  run main.go
```
The backend server will start on http://localhost:8080 by default.


Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies
```bash
npm install
```
3. Start the development server:

```bash
npm run dev
```
The frontend development server will start on http://localhost:5173 by default.

# API Endpoints
The backend provides the following API endpoints:

GET /api/news?type={type}&page={page}&limit={limit} - Get news items by type.
type: newstories, topstories, beststories, askstories, showstories, jobstories
page: Page number (starts at 1)
limit: Number of items per page
    
GET /api/news/{id} - Get a specific news item with comments
