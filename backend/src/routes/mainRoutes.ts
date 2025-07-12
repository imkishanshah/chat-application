import { Router } from "express";
import usersRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const mainRoutes = Router();

mainRoutes.use("/auth", authRoutes);
mainRoutes.use("/user", usersRoutes);

export default mainRoutes;