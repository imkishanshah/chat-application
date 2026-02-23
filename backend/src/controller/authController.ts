import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/user.entity";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import * as bcrypt from 'bcryptjs';

export class authController {

    async signup(req: any, res: any) {
        try {
            let userData = req?.body;
            let userExist = await AppDataSource.getRepository(UserEntity).findOne({ where: { email: userData?.email } })
            let token;
            let savedUser;
            if (userExist) {
                return res.status(400).json({ message: "Email already exist!" })
            } else {
                savedUser = await AppDataSource.getRepository(UserEntity).save(userData);
                token = jwt.sign({ id:savedUser?.id, email: userData?.email, }, "k[xjv76-53234/345hkj~nde5769", { expiresIn: "8h" });
            }

            return res.status(200).json({ user: savedUser, token: token, message: "Successfully registered!" })
        } catch (error) {
            console.log(error);

            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async login(req: any, res: any) {
        try {
            const data = req?.body;
            const { password, email } = req?.body;
            let userExist = await AppDataSource.getRepository(UserEntity).findOne({ where: { email: data?.email } })

            // check if user exists
            if (!userExist) {
                return res.status(401).json({ message: "Invalid credentials!" });
            }
            
            // check password
            const isPasswordValid = password == userExist.password
            
            if(!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials!" });
            }            
            //generate JWT token
            const token = jwt.sign({ id: userExist.id, email, }, "k[xjv76-53234/345hkj~nde5769", { expiresIn: "8h" });
            const userData = userExist
            return res.status(200).json({ token: token, user: userData, message: "Login successful!" })
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }

    }

}