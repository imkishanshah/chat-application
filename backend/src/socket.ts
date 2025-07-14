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
            console.log(senderId, receiverId, message, "messagemessagemessagemessagemessagemessage");

            const saveMessage = new MessagesEntity();
            saveMessage.sender_id = senderId;
            saveMessage.receiver_id = receiverId;
            saveMessage.message = message;
            console.log(saveMessage);

            await AppDataSource.getRepository(MessagesEntity).save(saveMessage);

            const room1 = `${senderId}_${receiverId}`;
            const room2 = `${receiverId}_${senderId}`;
            io.to(room1).to(room2).emit('newMessage', message);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
}
