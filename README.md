# 🚀 ForgeAI
 
> AI-powered collaborative developer workspace for managing projects, tasks, code, documentation, and system architecture — all in one place.
 
ForgeAI is a full-stack developer collaboration platform designed to combine **project management**, **real-time collaboration**, **AI assistance**, **GitHub integration**, **code understanding**, **UML generation**, and **system design** into a single developer-focused workspace.
 
The project is being developed incrementally through multiple versions, with the goal of evolving from a project management platform into a complete **AI-powered developer workspace**.
 
---
 
## 📌 Current Version
 
### ForgeAI v0.2.0 — Core Workspace Complete / Production Polish in Progress
 
**Status:** 🟢 Core features implemented and working end-to-end
 
The v0.2.0 release focuses on connecting the backend foundation with a functional frontend workspace. A substantial end-to-end system is already in place: authentication → organizations → projects → tasks → assignments → comments → attachments → activity → real-time chat → Socket.IO auth → persistence → deletion → dashboard.
 
### Current Architecture
 
```text
Frontend (Next.js)
        │
        ▼
REST APIs ───────────────┐
        │                │
        ▼                ▼
   MongoDB          Socket.IO
        │                │
        ▼                ▼
 Persistent Data    Real-Time Events
        │                │
        └───────┬────────┘
                ▼
         ForgeAI Workspace
```
 
---
 
## ✨ Current Features
 
### 🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Protected backend routes
- Protected frontend routes
- Authentication middleware
- Socket.IO authentication using JWT
- HTTP-only cookie support
- Token-based frontend authentication
- Logged-in users cannot access Login/Register pages
- Unauthenticated users cannot access protected application pages
### 🏢 Organizations
Users can create and manage organizations.
- Create organizations
- View organizations
- View organization details
- Add members using email
- Remove organization members
- View organization members
- Organization ownership
- Organization membership validation
- Organization-based access control
### 📁 Projects
Projects belong to organizations and provide the main workspace for collaboration.
- Create projects
- View projects by organization
- View project details
- Project membership validation
- Project-based task management
- Project activity tracking
- Project real-time chat
### ✅ Tasks
Tasks are the core unit of project management.
- Create tasks
- View tasks by project
- View individual task details
- Update task details
- Update task status
- Update task priority
- Assign tasks to organization members
- Set due dates
- Delete tasks
- Task activity tracking
**Task Workflow**
```text
Project
   │
   ├── Task
   │    ├── Title
   │    ├── Description
   │    ├── Status
   │    ├── Priority
   │    ├── Assigned User
   │    ├── Due Date
   │    ├── Comments
   │    ├── Attachments
   │    └── Activity
   │
   └── Project Activity
```
 
### 💬 Comments
Tasks support collaborative discussions through comments.
- Add comments
- View task comments
- Edit comments
- Delete comments
- User information attached to comments
- Comment activity tracking
### 📎 Attachments
Users can upload files to tasks.
- Upload task attachments
- Store files using Cloudinary
- Store attachment metadata in MongoDB
- View task attachments
- Delete uploaded attachments
- Delete files from Cloudinary
- Attachment activity tracking
- File metadata tracking
**Attachment Data** — each attachment stores:
- File name
- File URL
- File type
- File size
- Cloudinary public ID
- Uploading user
- Associated task
### 📝 Activity Tracking
ForgeAI tracks important actions performed inside projects and tasks.
 
**Supported Activity Types**
```
PROJECT_CREATED, PROJECT_UPDATED, PROJECT_DELETED
TASK_CREATED, TASK_UPDATED, TASK_DELETED, TASK_STATUS_CHANGED
COMMENT_ADDED, COMMENT_UPDATED, COMMENT_DELETED
ATTACHMENT_UPLOADED, ATTACHMENT_DELETED
MEMBER_ADDED, MEMBER_REMOVED
MESSAGE_ADDED, MESSAGE_DELETED
```
 
**Task Activity** is available through:
```
GET /api/tasks/:taskId/activity
```
 
**Project Activity** is available through:
```
GET /api/projects/:projectId/activity
```
 
Activity records include: Organization, Project, Task (optional), User, Action, Metadata (optional), Timestamp.
 
### 💬 Real-Time Project Chat
ForgeAI includes real-time project communication using Socket.IO.
- JWT-authenticated Socket.IO connections
- Project room-based communication
- Join project rooms
- Send real-time messages
- Persist messages in MongoDB
- Receive messages instantly
- Delete messages
- Broadcast deleted messages to project members
- Sender-based message deletion authorization
- Real-time message activity tracking
**Real-Time Flow**
```text
User A
   │
   │ send_message
   ▼
Socket.IO Server
   │
   ├── Validate JWT
   ├── Verify Project Membership
   ├── Save Message to MongoDB
   └── Broadcast to Project Room
            │
            ├───────────────┐
            ▼               ▼
         User A           User B
       receive_message   receive_message
```
 
**Message Deletion Flow**
```text
User
  │
  │ delete_message
  ▼
Socket.IO Server
  │
  ├── Validate Message
  ├── Verify Sender
  ├── Delete Message
  └── Broadcast message_deleted
           │
           ├───────────────┐
           ▼               ▼
        User A           User B
      UI Updates        UI Updates
```
 
### 📊 Dashboard
The dashboard provides an overview of the user's ForgeAI workspace, dynamically retrieving data from backend APIs.
 
Current dashboard metrics:
- Organizations
- Projects
- Tasks
### 🛡️ Security
Current security mechanisms include:
- JWT authentication
- Password hashing with bcrypt
- Protected REST API routes
- Protected frontend routes
- Socket.IO authentication middleware
- Organization membership validation
- Project membership validation
- Sender authorization for message deletion
- Attachment ownership validation
- Environment variable configuration
- CORS configuration
---
 
## 🏗️ Backend Architecture
 
ForgeAI follows a modular backend architecture.
 
```text
server/
│
├── controllers/
├── models/
├── routes/
├── services/
├── middleware/
├── socket/
├── utils/
└── server.js
```
 
**Backend Layers**
```text
Request
   │
   ▼
Route
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
MongoDB
```
 
**Real-time features use:**
```text
Client
   │
   ▼
Socket.IO
   │
   ▼
Socket Authentication
   │
   ▼
Socket Event
   │
   ▼
Service Layer
   │
   ▼
MongoDB
   │
   ▼
Socket.IO Broadcast
```
 
## 🎨 Frontend Architecture
 
The frontend is built using Next.js and provides the main user workspace.
 
```text
client/
│
├── app/
├── components/
├── services/
├── lib/
└── ...
```
 
Frontend communicates with the backend through:
- REST APIs
- Axios
- Socket.IO
---
 
## 🧰 Technology Stack
 
**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Socket.IO Client
**Backend**
- Node.js
- Express.js
- JavaScript
- Socket.IO
- JWT
- bcrypt
**Database**
- MongoDB
- Mongoose
- MongoDB Atlas / Local MongoDB
**Storage**
- Cloudinary
**Development Tools**
- Git
- GitHub
- Postman
- VS Code
---
 
## 📦 Project Structure
 
```text
ForgeAI
│
├── client/
│   ├── app/
│   ├── components/
│   ├── services/
│   └── lib/
│
├── server/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── middleware/
│       ├── socket/
│       └── utils/
│
└── README.md
```
 
---
 
## 🗺️ Development Roadmap
 
ForgeAI is being developed through multiple versions.
 
### ✅ ForgeAI v0.1.0 — Core Backend / MVP
**Status:** ✅ Completed
 
- Authentication (JWT)
- Organizations & organization membership
- Projects
- Tasks & task assignment
- Database models, controllers, services, routes, middleware
- Access control
### 🚧 ForgeAI v0.2.0 — Frontend Workspace
**Status:** ✅ Completed
 
**Completed**
- Frontend authentication & protected routes
- Organization workspace & management
- Project management & project details
- Task management, assignment, and details
- Comments (add, edit, delete)
- Attachments with Cloudinary storage & deletion
- Task & project activity tracking
- Real-time project chat (Socket.IO auth, rooms, persistence, deletion, live updates)
- Dynamic dashboard
- Homepage project section
**Remaining / Polish**
- UI/UX refinement
- Responsive design improvements
- Better loading states
- Better error states
- Empty states
- Final security audit
- Production environment configuration
- Deployment
### 🤖 ForgeAI v0.3.0 — AI Workspace
**Status:** ✅ Completed
 
Planned features:
- AI Project Assistant
- AI Project Context Engine
- Project Q&A
- Documentation Q&A
- AI Task Help
- AI Code Explanation
- AI Task Generation
**Core Architecture**
```text
Project
   │
   ├── Tasks
   ├── Comments
   ├── Files
   ├── Documentation
   └── Activity
          │
          ▼
   Project Context Engine
          │
          ▼
      AI Engine
          │
          ▼
    AI Project Assistant
```
 
The Project Context Engine will be the foundation of the AI features.
 
### 🧑‍💻 ForgeAI v0.4.0 — Developer Tools
**Status:** 🔵 Planned
 
This phase transforms ForgeAI from a project management application into an AI-powered developer platform.
 
Planned features:
- GitHub Integration
- Repository Connection
- Repository Analysis
- Codebase Understanding
- AI Code Review
- Architecture Generator
- UML Generator
- System Design Generator
**Planned Developer Workflow**
```text
GitHub Repository
       │
       ▼
Repository Analyzer
       │
       ▼
Codebase Understanding
       │
       ├───────────────┐
       ▼               ▼
Architecture        AI Code Review
       │
       ├───────────────┐
       ▼               ▼
UML Generator     System Design
```
 
### 🤝 ForgeAI v0.5.0 — Advanced Collaboration
**Status:** 🔵 Planned
 
- User presence
- Online/offline status
- Real-time notifications
- Live collaboration
- Collaborative whiteboard
- Advanced collaboration tools
### 🚀 ForgeAI v1.0.0 — Production ForgeAI
**Status:** 🔵 Future Goal
 
The final vision is to combine project management, collaboration, AI, code intelligence, and system design into one developer workspace.
 
```text
                         FORGEAI
                            │
             ┌──────────────┴──────────────┐
             │                             │
      Project Management              AI Engine
             │                             │
      ┌──────┼──────┐              ┌───────┼───────┐
      │      │      │              │       │       │
    Tasks   Chat   Files           AI     UML   System
      │      │      │              │      Gen    Design
      └──────┼──────┘              │
             │                     │
         Activity            Project Context
             │                     │
             └──────────┬──────────┘
                        │
                        ▼
              Developer Workspace
```
 
### ⚙️ Post-v1.0 — Production Engineering
After the core product is complete, ForgeAI will evolve toward production-scale engineering.
 
Planned infrastructure:
- Docker
- CI/CD
- AWS
- Redis
- Caching
- Message Queues
- Background Workers
- Monitoring
- Logging
- Rate Limiting
- Horizontal Scaling
**Target Architecture**
```text
                         Users
                           │
                           ▼
                    Load Balancer
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
          API Server    API Server    API Server
              │            │            │
              └────────────┼────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       Redis          Message Queue      MongoDB
          │                │
          │                ▼
          │          Worker Services
          │
          ▼
        Cache
```
 
This stage will demonstrate real-world system design concepts including: horizontal scaling, load balancing, caching, asynchronous processing, background jobs, WebSockets, database scaling, rate limiting, fault tolerance, and observability/monitoring.
 
---
 
## 📈 Version Progress
 
| Version | Focus | Status |
|---|---|---|
| v0.1.0 | Core Backend / MVP | ✅ Completed |
| v0.2.0 | Frontend Workspace | ✅ Completed |
| v0.3.0 | AI Workspace | ✅ Completed |
| v0.4.0 | Developer Tools | 🔵 Planned |
| v0.5.0 | Advanced Collaboration | 🔵 Planned |
| v1.0.0 | Production ForgeAI | 🔵 Future |
| Post-v1.0 | Production Engineering | 🔵 Future |
 
---
 
## 🎯 Long-Term Vision
 
ForgeAI aims to become an AI-powered developer workspace where developers can:
- Create organizations and projects
- Manage tasks and deadlines
- Collaborate with team members
- Communicate in real time
- Share files and documentation
- Track project activity
- Connect GitHub repositories
- Understand entire codebases using AI
- Generate UML diagrams automatically
- Generate system architecture and system designs
- Get AI-powered coding assistance
- Review code using AI
- Scale the platform using production-grade distributed systems
The ultimate goal is to bring the complete software development lifecycle into a single intelligent workspace.
 
---
 
## 👨‍💻 Developer
 
Built as a long-term full-stack engineering project focused on:
- Full-stack development
- Backend architecture
- Real-time systems
- AI integration
- System design
- Scalable infrastructure
- Developer tooling
---
 
## 📌 Development Philosophy
 
ForgeAI is being built incrementally. Each version introduces a new layer:
 
```text
v0.1.0
Backend Foundation
       ↓
v0.2.0
Frontend + Workspace
       ↓
v0.3.0
AI Intelligence
       ↓
v0.4.0
Developer Tools
       ↓
v0.5.0
Advanced Collaboration
       ↓
v1.0.0
Production Platform
       ↓
Post-v1.0
Scalable Distributed System
```
 
ForgeAI is not just a project management application. It is being built as an evolving AI-powered developer operating workspace.