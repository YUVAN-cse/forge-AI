# Authentication

ForgeAI uses JWT-based authentication to securely authenticate users and protect private resources.

The authentication system consists of:

- User registration
- User login
- JWT token generation
- Authentication middleware
- Protected API routes
- Protected frontend routes
- Organization-based authorization

---

## Registration Flow

The registration process allows a new user to create a ForgeAI account.

### Flow

```text
User
  ↓
Registration Form
  ↓
POST /api/auth/register
  ↓
Validate User Input
  ↓
Check Existing User
  ↓
Hash Password
  ↓
Create User
  ↓
Store User in MongoDB
  ↓
Return Success Response