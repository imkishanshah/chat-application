import { Router } from "express";
import { userController } from "../controller/userController";

const usersRoutes = Router();
const users = new userController();

// USER ROUTES  
usersRoutes.get("/", users.getAllUsers);
// usersRoutes.post("/add-user", verifySingleUploadFile, users.CreateUser);


export default usersRoutes;