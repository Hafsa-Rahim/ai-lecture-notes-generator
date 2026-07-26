# AI Lecture Notes Generator

An AI-powered web application that helps students generate structured, academic lecture notes based on a subject, lecture topic, academic level, preferred language, and notes format.

The application combines a modern React/TypeScript frontend with a Node.js backend, Gemini AI for intelligent note generation, and Airtable for persistent data storage.

---

## Overview

AI Lecture Notes Generator is designed to simplify the process of preparing academic notes.

Instead of manually searching and organizing study material, a user can provide basic lecture information and request AI-generated notes. The generated content is displayed inside the application and stored in the database so the user can access it later through **My Notes**.

The project demonstrates a complete AI-enabled web application workflow:

**User → Frontend → Backend API → Gemini AI → Airtable → User Dashboard**

---

## Key Features

### User Authentication
- User Sign Up
- User Sign In
- User information stored for application use
- User-specific data handling
- Browser-based session persistence using local storage

### AI Lecture Notes Generator

Users can generate notes by providing:

- Subject
- Lecture Topic
- Academic Level
- Language
- Notes Type

Supported note formats currently include:

- Detailed Notes
- Exam Notes
- Quick Revision
- Bullet Points

The application sends the request securely through the backend, generates academic content using Gemini AI, and returns the generated notes to the dashboard.

### Flexible Academic Level

Academic Level is entered as text rather than being restricted to a fixed list.

Examples:

- BS Computer Science
- BS Software Engineering
- MS Computer Science
- MPhil
- PhD

This makes the system suitable for students from different academic programs.

### My Notes

Generated notes are stored in Airtable and can later be retrieved for the authenticated user.

The **My Notes** page displays information such as:

- Lecture Topic
- Subject
- Academic Level
- Notes Type
- Language
- AI-generated content

Markdown rendering is used to provide cleaner formatting for generated academic notes.

### Dashboard

The application provides a student dashboard containing:

- User information
- Notes Generated section
- Favorites section
- AI Requests section
- AI Lecture Notes Generator
- Sidebar navigation

Navigation includes:

- Dashboard
- AI Assistant
- My Notes
- Favorites
- History
- Profile

Some modules represent the planned expansion of the application and may not yet be fully implemented.

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- React Markdown

### Backend

- Node.js
- TypeScript
- Express-style API architecture

### Artificial Intelligence

- Google Gemini AI

Gemini is used to generate structured academic lecture notes according to the user's selected parameters.

### Database

- Airtable

Airtable is currently used as the application's cloud database for user information, generated notes, AI history, and related application data.

### Development & Version Control

- Visual Studio Code
- Git
- GitHub
- npm

---

## Project Architecture

```text
AI Lecture Notes Generator
│
├── Frontend
│   ├── Landing Page
│   ├── Sign In
│   ├── Sign Up
│   ├── Dashboard
│   └── My Notes
│
├── Backend
│   ├── Authentication APIs
│   ├── Notes Generation API
│   └── Notes Retrieval API
│
├── AI Layer
│   └── Gemini AI
│
└── Database
    └── Airtable
```

---

## Application Workflow

### 1. Authentication

The user creates an account or signs into the application.

After successful authentication, required user information is stored in the browser session/local storage for application use.

### 2. Notes Generation

The user enters:

```text
Subject
Lecture Topic
Academic Level
Language
Notes Type
```

The frontend sends the information to the backend API.

### 3. AI Processing

The backend constructs an academic prompt and sends the request to Gemini AI.

Gemini generates structured lecture notes according to the supplied parameters.

### 4. Database Storage

The generated result and related metadata are stored in Airtable.

### 5. Notes Retrieval

The **My Notes** page requests notes belonging to the current user and displays them in a readable format.

---

## Current Pages

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/signin` | User sign-in |
| `/signup` | User registration |
| `/dashboard` | Main student dashboard |
| `/my-notes` | Previously generated lecture notes |

---

## Backend API

The application currently uses backend routes for operations such as AI generation and retrieving stored notes.

Example:

```http
POST /api/generate-notes
```

Used to generate AI lecture notes.

Example request:

```json
{
  "userId": "USER_ID",
  "subject": "Computer Science",
  "topic": "Database Management Systems",
  "level": "BS Computer Science",
  "language": "English",
  "notesType": "Bullet Points"
}
```

Notes retrieval follows a user-specific API pattern such as:

```http
GET /api/notes/:userId
```

This retrieves stored notes associated with the requested user.

---

## Airtable Database

The project currently uses Airtable tables including:

### Users

Stores application user information.

### Notes

Stores generated lecture notes and associated metadata.

Important fields include:

```text
Note_ID
User_ID
Lecture_Topic
Subject
Academic_Level
Notes_Type
Language
AI_Prompt
AI_Response
Favorite
```

### AI_History

Designed for AI interaction/history records.

### ContactUs

Designed for contact requests.

### Feedback

Designed for user feedback.

The database structure may continue to evolve as additional modules are implemented.

---

## Environment Variables

The application requires environment variables for services such as Gemini AI and Airtable.

Create a local environment file:

```text
.env
```

or use the appropriate environment file required by the deployment environment.

Example structure:

```env
GEMINI_API_KEY=your_gemini_api_key

AIRTABLE_TOKEN=your_airtable_token
AIRTABLE_BASE_ID=your_airtable_base_id
```

Additional variables may be required depending on the current backend configuration.

Refer to:

```text
.env.example
```

for the project's expected environment-variable names.

> Never place real API keys, access tokens, passwords, or other secrets inside README files or commit them to GitHub.

---

## Security

Sensitive credentials are intentionally excluded from version control.

The `.gitignore` configuration excludes environment files:

```gitignore
.env*
!.env.example
```

Therefore:

- `.env` is ignored
- `.env.local` is ignored
- environment-specific secret files are ignored
- `.env.example` can safely be committed when it contains placeholders only

API keys should remain on the server side and should never be exposed directly in frontend source code.

---

## Run the Project Locally

### Prerequisites

Install:

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

Enter the project directory:

```bash
cd ai-lecture-notes-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create the required local environment file and add your own credentials.

Do not use production secrets from another developer.

### 4. Start the application

```bash
npm run dev
```

The development server will start locally.

For the current project configuration, the application may be available at:

```text
http://localhost:3001
```

---

## Current Development Status

The project currently has the following major functionality working:

- React/TypeScript application setup
- Landing page
- User Sign Up
- User Sign In
- Student dashboard
- User information display
- Gemini AI integration
- AI lecture-note generation
- Airtable integration
- Generated-note database storage
- User-specific notes retrieval
- My Notes page
- Markdown rendering for AI-generated notes
- Git version control
- GitHub repository integration
- Environment-file protection

---

## Planned Improvements

Future development can include:

- Fully functional Favorites
- Notes History
- User Profile management
- Dedicated AI Assistant
- Search and filtering
- Edit/Delete notes
- Export notes to PDF
- Download/print functionality
- Improved authentication and authorization
- Server-side session management
- Usage analytics
- AI request tracking
- Responsive mobile improvements
- Production deployment
- Improved error handling
- Automated testing

---

## Security Roadmap

Before using the application in a production environment, additional security improvements should be considered, including:

- Strong server-side authentication
- Password hashing
- Authorization checks on protected APIs
- Secure session/token management
- Input validation
- API rate limiting
- Environment-variable protection
- Restricted Airtable permissions
- Protection against unauthorized access to another user's notes
- Production logging and monitoring

---

## Repository Structure

```text
ai-lecture-notes-generator/
│
├── src/
│   ├── lib/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── LandingPage.tsx
│   │   ├── MyNotes.tsx
│   │   ├── SignIn.tsx
│   │   └── SignUp.tsx
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── server.ts
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── .gitignore
└── README.md
```

---

## Development Stage

This project is currently under active development.

The current version represents a functional AI lecture-notes application prototype with frontend, backend, AI integration, database persistence, authentication flow, and user-specific note retrieval.

Further work will focus on production deployment, stronger security, additional dashboard modules, testing, and overall user experience.

---

## Author

**Hafsa Rahim**

AI Lecture Notes Generator

---

## Disclaimer

AI-generated academic content should be reviewed before being used for examinations, assignments, research, or other academic purposes.

AI can produce inaccurate or incomplete information, so generated notes should be treated as learning assistance rather than an authoritative academic source.