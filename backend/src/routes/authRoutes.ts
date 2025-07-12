import { Router } from "express";
import { authController } from "../controller/authController";

const authRoutes = Router();
const users = new authController();

// USER ROUTES  
authRoutes.post("/signup", users.signup);
authRoutes.post("/login", users.login);


export default authRoutes;