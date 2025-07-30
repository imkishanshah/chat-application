// src/socket.ts
import { Server } from 'socket.io';
import { AppDataSource } from './data-source';
import { MessagesEntity } from './entities/messages.entity';

export function initSocket(server: any) {
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


        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
}
