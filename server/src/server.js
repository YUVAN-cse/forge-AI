import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createServer } from 'http';
import initializeSocket from './socket/socket.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = createServer(app);

const io = initializeSocket(server);

connectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});