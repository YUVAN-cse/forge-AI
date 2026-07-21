import { Server } from 'socket.io';
import socketAuth from '../middleware/socketAuth.middleware.js';
import Project from '../models/project.model.js';
import { createMessageService  , deleteMessageService} from '../services/message.service.js';

const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.use(socketAuth);

    io.on('connection', (socket) => {

        console.log('User connected:', socket.id);

        console.log('Authenticated user:', socket.user.name);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });


        socket.on('join_project', async (projectId) => {
            try {
                const project = await Project.findById(projectId);

                if (!project) {
                    return socket.emit('join_project_error', {
                        message: 'Project not found'
                    });
                }

                const isMember = project.members.some(
                    member => member.toString() === socket.user._id.toString()
                );

                if (!isMember) {
                    return socket.emit('join_project_error', {
                        message: 'You are not a member of this project'
                    });
                }

                const room = `project:${projectId}`;

                socket.join(room);

                socket.emit('joined_project', {
                    projectId,
                    message: 'Joined project successfully'
                });

                console.log(
                    `${socket.user.name} joined ${room}`
                );

                } catch (error) {
                    socket.emit('join_project_error', {
                        message: 'Failed to join project'
                    });
                }

        });
        //our key goal is first save the message to the database and then broadcast it to all members of the project. This way, we ensure that the message is persisted before notifying other users.
        socket.on('send_message', async ({ projectId, content }) => {
            try {
                if (!projectId || !content) {
                    return socket.emit('send_message_error', {
                        message: 'Project ID and content are required'
                    });
                }

                const message = await createMessageService({
                    projectId,
                    userId: socket.user._id,
                    content
                });

                const room = `project:${projectId}`;

                io.to(room).emit('receive_message', message);

            } catch (error) {
                socket.emit('send_message_error', {
                    message: error.message
                });
            }
        });

        socket.on('delete_message', async ({ messageId }) => {
            try {
                if (!messageId) {
                    return socket.emit('delete_message_error', {
                        message: 'Message ID is required'
                    });
                }

                const result = await deleteMessageService({
                    messageId,
                    userId: socket.user._id
                });

                const room = `project:${result.projectId}`;

                io.to(room).emit('message_deleted', {
                    messageId: result.messageId
                });

            } catch (error) {
                socket.emit('delete_message_error', {
                    message: error.message
                });
            }
        });

    });

    return io;
};

export default initializeSocket;