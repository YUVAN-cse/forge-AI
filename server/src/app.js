import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.route.js';
import organizationRoutes from './routes/organization.route.js';
import projectRoutes from './routes/project.route.js';
import taskRoutes from './routes/task.route.js';
import commentRoutes from './routes/comment.route.js';
import attachmentRoutes from './routes/attachment.route.js';
import messageRoutes from './routes/message.route.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Forge API');
});

export default app;