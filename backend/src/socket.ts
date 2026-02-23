// src/socket.ts
import { Server } from 'socket.io';
import { AppDataSource } from './data-source';
import { MessagesEntity } from './entities/messages.entity';

export function initSocket(server: any) {
    let onlineUsers = new Map();
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinRoom', (roomName) => {
            socket.join(roomName);
            console.log(`User ${socket.id} joined room: ${roomName}`);
        });


        socket.on('sendMessage', async (data) => {
            const { senderId, receiverId, message } = data;

            const saveMessage = new MessagesEntity();
            saveMessage.sender_id = senderId;
            saveMessage.receiver_id = receiverId;
            saveMessage.message = message;
            saveMessage.room_id = `${senderId}_${receiverId}`;
            saveMessage.read = 0;
            saveMessage.message_type = 1;

            const savedMessage = await AppDataSource.getRepository(MessagesEntity).save(saveMessage);

            const messageToSend = {
                id: savedMessage.id,
                sender_id: savedMessage.sender_id,
                receiver_id: savedMessage.receiver_id,
                message: savedMessage.message,
                created_at: savedMessage.created_at
            };

            const room = `${[senderId, receiverId].sort((a, b) => a - b).join('_')}`;
            io.to(room).emit('newMessage', messageToSend);

        });

        socket.on('addUser', (userId) => {
            // Map userId to the specific socket ID
            onlineUsers.set(userId, socket.id);

            console.log(`User ${userId} is online.`);

            // Convert Map keys to an array and send to ALL clients
            const onlineUserIds = Array.from(onlineUsers.keys());
            io.emit('getOnlineUsers', onlineUserIds);
        });

        socket.on('typing', (data) => {
            const { room, user } = data;
            socket.to(room).emit('displayTyping', { user });
        });

        socket.on('stopTyping', (data) => {
            const { room } = data;
            socket.to(room).emit('hideTyping');
        });

        socket.on('disconnect', () => {
            let disconnectedUserId;

            for (let [key, value] of onlineUsers.entries()) {
                if (value === socket.id) {
                    disconnectedUserId = key;
                    break;
                }
            }

            if (disconnectedUserId) {
                onlineUsers.delete(disconnectedUserId);
                console.log(`User ${disconnectedUserId} went offline.`);

                // Send updated list to everyone
                const onlineUserIds = Array.from(onlineUsers.keys());
                io.emit('getOnlineUsers', onlineUserIds);
            }
            console.log(`User disconnected: ${socket.id}`);
        });
    });
}
