// src/server.ts
import http from 'http';
import app from './app';
import { AppDataSource } from './data-source';
import { initSocket } from './socket';

const port = 3001;
const server = http.createServer(app);

// Init database
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        initSocket(server); // Initialize Socket.IO
        server.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((error) => console.log('DB Error:', error));
