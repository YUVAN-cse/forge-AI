# Engineering Decisions

This document records the major engineering and architectural decisions made during the development of ForgeAI.

The purpose of this document is to explain not only **what** was implemented, but also **why** specific architectural and technical decisions were made.

These decisions are based on the current architecture of ForgeAI and may evolve as the system scales.

---

## 1. Separate Frontend and Backend

### Decision

ForgeAI uses a separate frontend and backend architecture.

The frontend communicates with the backend through REST APIs and real-time communication channels.

```text
Frontend
   │
   ├── REST API
   │
   └── WebSocket
          │
          ▼
       Backend
          │
          ▼
       MongoDB
```

### Reason

**Independent Deployment**

The frontend and backend can be deployed independently.

**Clean Architecture**

The frontend handles:
- UI
- User experience
- Client-side state
- API consumption

The backend handles:
- Business logic
- Authentication
- Authorization
- Database operations
- AI services
- File management
- Real-time communication

**Future Mobile Support**

The backend APIs can later be consumed by mobile applications without rewriting the backend.

**Independent Evolution**

Frontend and backend teams can evolve independently as the project grows.

---

## 2. REST API for Client-Server Communication

### Decision

ForgeAI uses RESTful APIs for communication between the frontend and backend.

### Reason

REST provides a simple and standardized interface between clients and the backend.

It allows the same backend to support:
- Web applications
- Mobile applications
- Future third-party integrations

The API structure is organized around resources such as:
- `/auth`
- `/organizations`
- `/projects`
- `/tasks`
- `/comments`
- `/attachments`
- `/messages`
- `/activities`
- `/ai`

### Benefit

This provides a predictable API structure and makes the backend easier to consume and maintain.

---

## 3. MongoDB as the Primary Database

### Decision

MongoDB is used as the primary database for ForgeAI.

### Reason

ForgeAI contains several entities with flexible and evolving data structures.

Examples include:
- Users
- Organizations
- Projects
- Tasks
- Comments
- Attachments
- Activities
- Messages

MongoDB's document-based model allows these entities to evolve without requiring frequent database schema migrations.

### Why MongoDB Fits ForgeAI

Project and task data can contain optional and evolving fields.

For example:

```text
Task
├── title
├── description
├── status
├── priority
├── assignedTo
├── createdBy
├── project
└── dueDate
```

The schema can evolve as new features are introduced.

---

## 4. Mongoose for Database Modeling

### Decision

Mongoose is used as the MongoDB ODM.

### Reason

Mongoose provides:
- Schema definitions
- Validation
- Model relationships
- Query abstraction
- Middleware support

ForgeAI uses references between entities.

For example:

```text
Organization
     │
     ▼
  Projects
     │
     ▼
   Tasks
     │
     ├── Comments
     │
     └── Attachments
```

Mongoose references allow these relationships to be represented clearly.

---

## 5. Modular Backend Architecture

### Decision

The backend is structured using separate layers.

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MongoDB
```

Additional layers include:
- Middleware
- Utils
- AI Services

### Reason

Separating responsibilities improves maintainability.

- **Routes** — Define API endpoints.
- **Controllers** — Handle HTTP requests and responses.
- **Services** — Contain reusable business logic.
- **Models** — Define database schemas.
- **Middleware** — Handle cross-cutting concerns such as authentication.
- **Utils** — Contain reusable helper functionality.

This structure makes it easier to modify one part of the system without affecting unrelated components.

---

## 6. JWT-Based Authentication

### Decision

ForgeAI uses JWT-based authentication.

### Reason

JWT allows the backend to authenticate requests without maintaining server-side session state.

The basic flow is:

```text
Login
  ↓
Validate Credentials
  ↓
Generate JWT
  ↓
Client Stores Token
  ↓
Client Sends Token
  ↓
Authentication Middleware
  ↓
Verify JWT
  ↓
Identify User
```

### Benefit

JWT authentication provides:
- Stateless authentication
- Easy API protection
- Compatibility with web and mobile clients
- Simple integration with REST APIs

---

## 7. Authentication Middleware

### Decision

Authentication logic is centralized in middleware.

### Reason

Instead of implementing authentication checks separately in every controller, protected routes use authentication middleware.

```text
Request
   ↓
Auth Middleware
   ↓
Verify JWT
   ↓
Attach User
   ↓
Controller
```

### Benefit

This avoids duplicated authentication logic and ensures consistent protection across APIs.

---

## 8. Authorization Based on Organization Membership

### Decision

ForgeAI uses organization-level authorization.

A user must either:
- Own the organization, or
- Be a member of the organization

to access organization-related resources.

### Reason

ForgeAI is designed around collaborative organizations.

The authorization hierarchy is:

```text
User
  ↓
Organization
  ↓
Project
  ↓
Task
  ↓
Comments / Attachments
```

Access to lower-level resources is validated through their parent relationships.

For example:

```text
User
  ↓
Organization Membership
  ↓
Project Access
  ↓
Task Access
```

### Benefit

This prevents users from accessing projects or tasks belonging to organizations they are not part of.

---

## 9. Project-Centric Architecture

### Decision

Projects are the central unit of collaboration in ForgeAI.

### Reason

Most ForgeAI features are organized around projects.

```text
Organization
      │
      ▼
   Project
      │
 ┌────┼─────┐
 ▼    ▼     ▼
Tasks Chat Activity
 │
 ├── Comments
 │
 └── Attachments
```

This provides a clear context boundary.

The project becomes the primary scope for:
- Tasks
- Communication
- Activity
- AI context
- Future GitHub repositories
- Future codebase analysis

This decision is particularly important for the future AI architecture.

---

## 10. Task-Centric Collaboration

### Decision

Comments and attachments are associated with tasks.

### Reason

Development work is generally represented as tasks.

Instead of having generic comments or files disconnected from work items, ForgeAI associates them with specific tasks.

```text
Project
   │
   ▼
Task
 ├── Comments
 ├── Attachments
 └── Activity
```

### Benefit

This preserves context and makes it easier for the AI system to understand what developers are working on.

---

## 11. Activity Tracking as a Separate Entity

### Decision

ForgeAI stores activity events in a dedicated Activity collection.

### Reason

Instead of embedding activity information directly into projects or tasks, all activity events are stored independently.

Example:

```text
Activity
├── organization
├── project
├── task
├── user
├── action
├── metadata
└── timestamps
```

### Benefit

This allows ForgeAI to create activity timelines without modifying the primary project or task documents.

It also provides a foundation for future:
- Audit logs
- Notifications
- Analytics
- AI project history
- Event-driven architecture

---

## 12. Enum-Based Status and Priority Values

### Decision

Task status and priority use predefined enum values.

**Status**
- `TODO`
- `IN_PROGRESS`
- `DONE`

**Priority**
- `LOW`
- `MEDIUM`
- `HIGH`

### Reason

Using predefined values prevents inconsistent data.

For example, without enums, the following could represent the same state:
- "In Progress"
- "in-progress"
- "IN_PROGRESS"
- "progress"

Enums ensure consistent values across the frontend, backend, database, and AI-generated tasks.

---

## 13. Project Status Management

### Decision

Projects use explicit status values.

- `ACTIVE`
- `ARCHIVED`

### Reason

Projects should not always be permanently deleted when they are no longer active.

Archiving provides a way to preserve project information while removing it from active workflows.

This also provides a foundation for future project lifecycle management.

---

## 14. Real-Time Communication Using Socket.IO

### Decision

ForgeAI uses Socket.IO for real-time project chat.

### Reason

Traditional REST APIs are not ideal for real-time communication.

Project chat requires:

```text
User A
   │
   ▼
Socket Server
   │
   ├── User B
   ├── User C
   └── User D
```

Socket.IO provides real-time bidirectional communication.

### Benefit

Users can receive messages without manually refreshing the page.

---

## 15. Project-Based Chat Instead of User-to-User Chat

### Decision

Messages are associated with projects rather than individual receivers.

The Message model contains:

```text
Message
├── project
├── sender
├── content
└── timestamps
```

There is intentionally no receiver field.

### Reason

ForgeAI's current chat is designed as a project collaboration channel.

All authorized members of a project can participate in the conversation.

```text
Project
   │
   ├── User A
   ├── User B
   ├── User C
   └── User D
```

All members see project messages.

### Benefit

This simplifies the message model and matches the collaboration requirements.

---

## 16. Persisting Chat Messages in MongoDB

### Decision

Real-time messages are also persisted in MongoDB.

### Reason

Socket communication alone would make messages temporary.

Persisting messages provides:
- Chat history
- Message retrieval
- Reliability
- Future search capabilities
- AI context possibilities

The architecture is:

```text
User
  ↓
Socket.IO
  ↓
Backend
  ├── Broadcast Message
  └── Save Message
          ↓
       MongoDB
```

---

## 17. Cloudinary for File Storage

### Decision

Task attachments are stored using Cloudinary.

### Reason

Storing binary files directly inside MongoDB is not ideal for the current architecture.

Cloudinary provides:
- Cloud-based file storage
- Secure URLs
- File management
- Scalable storage

MongoDB stores only metadata:

```text
Attachment
├── fileName
├── fileUrl
├── publicId
├── fileType
├── fileSize
├── task
└── uploadedBy
```

### Benefit

The database remains focused on application data while file storage is handled by a dedicated service.

---

## 18. Store Attachment Metadata in MongoDB

### Decision

ForgeAI stores file metadata in MongoDB while storing the actual file in Cloudinary.

### Reason

The application needs to associate files with:
- Tasks
- Users
- File names
- File types
- File sizes

MongoDB stores this metadata. Cloudinary stores the actual file.

```text
Upload
  │
  ├── File → Cloudinary
  │
  └── Metadata → MongoDB
```

This separation makes file management easier.

---

## 19. Attachment Deletion from Both Systems

### Decision

When an attachment is deleted, ForgeAI removes:
1. The file from Cloudinary.
2. The metadata from MongoDB.

### Reason

Deleting only the MongoDB record would leave orphaned files in Cloudinary.

Deleting only the Cloudinary file would leave invalid metadata.

The intended flow is:

```text
Delete Attachment
      │
      ├── Delete Cloudinary File
      │
      └── Delete MongoDB Metadata
```

---

## 20. AI as a Separate Service Layer

### Decision

AI logic is separated from controllers.

### Reason

Controllers should handle HTTP concerns rather than directly managing AI model calls.

The architecture is:

```text
Controller
    ↓
AI Service
    ↓
Gemini API
```

### Benefit

This allows the AI provider to be changed later without rewriting the entire API layer.

It also makes AI functionality easier to test and extend.

---

## 21. Project Context Engine

### Decision

ForgeAI uses a dedicated Project Context Engine for AI features.

### Reason

The AI should not receive random project data.

Instead, project information is collected and transformed into structured context.

```text
Project
 ├── Description
 ├── Tasks
 ├── Comments
 ├── Activities
 └── Other Context
          │
          ▼
   Project Context Engine
          │
          ▼
    Relevant Context
          │
          ▼
        AI Model
```

This provides a foundation for context-aware AI.

---

## 22. Context Selection Before AI Generation

### Decision

ForgeAI selects relevant project context before sending information to the AI model.

### Reason

Sending the entire project database to the AI for every question would:
- Increase token usage
- Increase latency
- Increase cost
- Add irrelevant information

The current architecture follows:

```text
User Question
      ↓
Project Context
      ↓
Context Selection
      ↓
Relevant Context
      ↓
AI Model
      ↓
Answer
```

This is an early foundation for a future Retrieval-Augmented Generation (RAG) architecture.

---

## 23. Project-Scoped AI

### Decision

AI requests are scoped to individual projects.

### Reason

ForgeAI is designed around project context.

An AI assistant should understand the project the user is currently working on rather than operating as a generic chatbot.

This enables future capabilities such as:
- Project Q&A
- Task assistance
- Documentation Q&A
- Codebase Q&A
- Architecture analysis
- System design generation

---

## 24. AI-Generated Tasks Require User Confirmation

### Decision

AI-generated tasks are not immediately inserted into the database.

Users must review and select generated tasks before creation.

### Reason

AI output may not always be accurate or relevant.

The workflow is:

```text
User Requirement
      ↓
AI Task Generation
      ↓
Generated Tasks
      ↓
User Review
      ↓
User Selection
      ↓
Create Tasks
```

### Benefit

This introduces a human-in-the-loop workflow and prevents accidental creation of incorrect tasks.

---

## 25. AI Output Uses Structured Task Data

### Decision

AI-generated tasks follow a structured format.

Example:

```text
Task
├── title
├── description
└── priority
```

### Reason

Structured output makes AI-generated tasks compatible with the existing task creation API.

This allows:

```text
AI Output
    ↓
Frontend Review
    ↓
Existing Task API
    ↓
MongoDB
```

The AI does not directly manipulate the database.

---

## 26. AI Uses Existing Business APIs for Task Creation

### Decision

AI-generated tasks are created through the existing task creation workflow.

### Reason

The AI layer should not bypass normal business logic.

Instead:

```text
AI
 ↓
Generate Task Data
 ↓
Frontend Review
 ↓
Task Creation API
 ↓
Authorization
 ↓
Validation
 ↓
MongoDB
```

This ensures AI-generated tasks follow the same rules as manually created tasks.

---

## 27. AI Features Require Project Authorization

### Decision

AI features verify that the authenticated user belongs to the project's organization.

### Reason

Project context may contain private or sensitive information.

Therefore, AI access must follow the same authorization model as normal project access.

```text
AI Request
   ↓
Authenticate User
   ↓
Find Project
   ↓
Find Organization
   ↓
Check Owner / Member
   ↓
Allow AI Context Access
```

---

## 28. Versioned Incremental Development

### Decision

ForgeAI is developed through incremental version milestones.

```text
v0.1.0
Core Backend
      ↓
v0.2.0
Frontend Workspace
      ↓
v0.3.0
AI Workspace
      ↓
v0.4.0
Developer Intelligence
      ↓
v0.5.0
Advanced Collaboration
      ↓
v1.0.0
Production ForgeAI
```

### Reason

Each version introduces a logically independent capability layer.

This approach allows:
- Easier testing
- Smaller development milestones
- Clear progress tracking
- Easier debugging
- Incremental deployment

---

## 29. GitHub and Code Intelligence as a Separate Layer

### Decision

GitHub integration and codebase intelligence are planned as a separate developer intelligence layer.

### Reason

The current project management system should remain stable while developer-specific capabilities are built on top of it.

The future architecture is expected to evolve toward:

```text
ForgeAI
    │
    ├── Project Management
    │
    ├── Collaboration
    │
    ├── AI Project Intelligence
    │
    └── Developer Intelligence
            │
            ├── GitHub
            ├── Repository Analysis
            ├── Codebase Understanding
            ├── AI Code Review
            ├── UML
            └── System Design
```

This keeps the core project management domain independent from code intelligence.

---

## 30. Planned Scalability Architecture

### Decision

ForgeAI will eventually evolve toward a distributed architecture as the system grows.

The planned architecture is:

```text
Client
   ↓
Load Balancer
   ↓
Node.js API Servers
   │
   ├── Redis
   │
   ├── Message Queue
   │
   ├── Worker Services
   │
   └── MongoDB
```

### Reason

Some operations will eventually become too expensive or time-consuming to execute synchronously.

Examples include:
- Repository analysis
- Codebase indexing
- AI processing
- Large file processing
- UML generation
- System design generation

These operations can be moved to background workers.

---

## 31. Future Asynchronous Processing

### Decision

Long-running operations are planned to use asynchronous background processing.

**Planned Flow**

```text
User Request
      ↓
API Server
      ↓
Message Queue
      ↓
Background Worker
      ↓
AI / Repository Processing
      ↓
Result Storage
      ↓
Notification
```

### Reason

Long-running operations should not block API requests.

This will improve:
- API responsiveness
- Reliability
- Scalability
- User experience

---

## 32. Future Redis Usage

### Decision

Redis is planned for future performance and distributed system requirements.

Potential use cases include:
- Caching
- Session-related data
- Rate limiting
- Real-time presence
- Temporary AI context
- Job coordination

Redis will be introduced when the application reaches a scale where in-memory application-level solutions are insufficient.

---

## 33. Future Horizontal Scaling

### Decision

ForgeAI is designed with a future path toward horizontal scaling.

Instead of relying on a single backend instance:

```text
                 Load Balancer
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Server 1    Server 2    Server 3
          │           │           │
          └───────────┼───────────┘
                      ▼
                   MongoDB
```

### Reason

Stateless API architecture allows multiple backend instances to serve requests.

Future distributed state such as:
- WebSocket presence
- Caching
- Background jobs

can be managed using dedicated infrastructure such as Redis and message queues.

---

## 34. Engineering Philosophy

ForgeAI follows several core engineering principles:

**Separation of Concerns**
Each component should have a clear responsibility.

**Reusability**
Business logic should be reusable across multiple clients.

**Security by Default**
Authentication and authorization should be enforced before accessing protected resources.

**Human-in-the-Loop AI**
AI should assist users rather than blindly modifying project data.

**Context-Aware AI**
AI responses should be grounded in actual project information.

**Incremental Architecture**
The system should evolve gradually without prematurely introducing unnecessary complexity.

**Scalability by Design**
Current decisions should allow the system to evolve toward distributed architecture when required.

---

## Decision Status

| Decision | Status |
|---|---|
| Separate Frontend and Backend | Accepted |
| REST API Architecture | Accepted |
| MongoDB | Accepted |
| Mongoose | Accepted |
| Modular Backend Architecture | Accepted |
| JWT Authentication | Accepted |
| Authentication Middleware | Accepted |
| Organization-Based Authorization | Accepted |
| Project-Centric Architecture | Accepted |
| Task-Centric Collaboration | Accepted |
| Activity as Separate Entity | Accepted |
| Enum-Based Task Status/Priority | Accepted |
| Project Status Management | Accepted |
| Socket.IO Real-Time Chat | Accepted |
| Project-Based Chat | Accepted |
| Persistent Messages | Accepted |
| Cloudinary File Storage | Accepted |
| Attachment Metadata in MongoDB | Accepted |
| Separate AI Service Layer | Accepted |
| Project Context Engine | Accepted |
| Context Selection | Accepted |
| Project-Scoped AI | Accepted |
| Human-in-the-Loop AI Tasks | Accepted |
| Structured AI Task Output | Accepted |
| AI Uses Existing Task APIs | Accepted |
| AI Authorization | Accepted |
| Incremental Versioning | Accepted |
| GitHub Developer Intelligence Layer | Planned |
| Message Queues | Planned |
| Background Workers | Planned |
| Redis | Planned |
| Horizontal Scaling | Planned |