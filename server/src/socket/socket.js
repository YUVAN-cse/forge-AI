import { Server } from 'socket.io';
import socketAuth from '../middleware/socketAuth.middleware.js';
import Project from '../models/project.model.js';
import Organization from '../models/organization.model.js';

import {
    createMessageService,
    deleteMessageService
} from '../services/message.service.js';

const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.use(socketAuth);

    io.on('connection', (socket) => {

        console.log(
            'User connected:',
            socket.id
        );

        console.log(
            'Authenticated user:',
            socket.user.name
        );

        socket.on('disconnect', () => {
            console.log(
                'User disconnected:',
                socket.id
            );
        });


        // JOIN PROJECT CHAT
        socket.on(
            'join_project',
            async (projectId) => {

                try {

                    if (!projectId) {
                        return socket.emit(
                            'join_project_error',
                            {
                                message:
                                    'Project ID is required'
                            }
                        );
                    }

                    // Find project
                    const project =
                        await Project.findById(
                            projectId
                        );

                    if (!project) {
                        return socket.emit(
                            'join_project_error',
                            {
                                message:
                                    'Project not found'
                            }
                        );
                    }

                    // Find organization
                    const organization =
                        await Organization.findById(
                            project.organization
                        );

                    if (!organization) {
                        return socket.emit(
                            'join_project_error',
                            {
                                message:
                                    'Organization not found'
                            }
                        );
                    }

                    // Check organization membership
                    const isMember =
                        organization.members.some(
                            (member) =>
                                member.toString() ===
                                socket.user._id.toString()
                        );

                    if (!isMember) {
                        return socket.emit(
                            'join_project_error',
                            {
                                message:
                                    'You are not a member of this organization'
                            }
                        );
                    }

                    // Create project chat room
                    const room =
                        `project:${projectId}`;

                    socket.join(room);

                    socket.emit(
                        'joined_project',
                        {
                            projectId,
                            message:
                                'Joined project successfully'
                        }
                    );

                    console.log(
                        `${socket.user.name} joined ${room}`
                    );

                } catch (error) {

                    console.error(
                        'Join project error:',
                        error
                    );

                    socket.emit(
                        'join_project_error',
                        {
                            message:
                                error.message ||
                                'Failed to join project'
                        }
                    );
                }
            }
        );


        // SEND MESSAGE
        socket.on(
    'send_message',
    async ({ projectId, content }) => {

        try {
            console.log(
                'SEND MESSAGE EVENT:',
                {
                    projectId,
                    content,
                    userId: socket.user._id
                }
            );

            if (
                !projectId ||
                !content?.trim()
            ) {
                return socket.emit(
                    'send_message_error',
                    {
                        message:
                            'Project ID and content are required'
                    }
                );
            }

            const message =
                await createMessageService({
                    projectId,
                    userId: socket.user._id,
                    content: content.trim()
                });

            console.log(
                'MESSAGE CREATED:',
                message
            );

            const room =
                `project:${projectId}`;

            console.log(
                'BROADCASTING TO ROOM:',
                room
            );

            io.to(room).emit(
                'receive_message',
                message
            );

        } catch (error) {

            console.error(
                'SEND MESSAGE ERROR:',
                error
            );

            socket.emit(
                'send_message_error',
                {
                    message:
                        error.message
                }
            );
        }
    }
);


        // DELETE MESSAGE
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