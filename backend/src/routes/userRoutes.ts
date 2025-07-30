import { Router } from "express";
import { userController } from "../controller/userController";

const usersRoutes = Router();
const users = new userController();

// USER ROUTES  
usersRoutes.get("/", users.getAllUsers);
usersRoutes.post("/messages", users.getMessages);

export default usersRoutes;