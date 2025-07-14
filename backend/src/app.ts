// src/app.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import mainRoutes from './routes/mainRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));
app.use('', mainRoutes);

export default app;
