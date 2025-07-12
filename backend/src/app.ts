import express from 'express';
import { AppDataSource } from './data-source';
import cors from "cors";
import path from "path";
import { Server } from "socket.io";
import http from 'http';
import mainRoutes from './routes/mainRoutes';

const app = express();
const port = 3001;

// Enable CORS and JSON
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../")));
app.use("", mainRoutes);

// Create HTTP server for socket.io
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

// Listen for socket connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific chat room
    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room: ${roomName}`);
    });

    // Handle sending messages
    socket.on('sendMessage', (data) => {
        io.to(data.room).emit('newMessage', data.message);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Initialize database connection
AppDataSource.initialize()
    .then(() => console.log("Database connected"))
    .catch((error) => console.log("DB Error:", error));

// ✅ Correct way: Listen with the custom server (not app.listen)
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
