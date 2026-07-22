import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

export default api;

// Next.js
//    │
//    │ POST /auth/login
//    ▼
// Express
//    │
//    │ Set-Cookie: token
//    ▼
// Browser
//    │
//    │ HTTP-only cookie
//    ▼
// Future API requests
//    │
//    ▼
// Express auth middleware