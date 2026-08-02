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
import cookieParser from 'cookie-parser';
import aiRoutes from "./routes/ai.routes.js";
import githubRoutes from "./routes/github.routes.js";
import repositoryRoutes from "./routes/repository.routes.js";
import repositoryAnalysisRoutes from "./routes/repositoryAnalysis.routes.js";


const app = express();


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api", repositoryAnalysisRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Forge API');
});

export default app;