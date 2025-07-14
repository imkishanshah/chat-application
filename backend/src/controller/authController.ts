import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/user.entity";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


export class authController {

    async signup(req: any, res: any) {
        try {
            let user = req?.body;
            user.role = "user";
            let userExist = await AppDataSource.getRepository(UserEntity).findOne({ where: { email: user?.email } })

            if (userExist) {
                return res.status(400).json({ message: "Email already exist!" })
            } else {
                const saveUser = await AppDataSource.getRepository(UserEntity).save(user);
            }

            return res.status(200).json({ message: "Successfully registered!" })
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async login(req: any, res: any) {
        try {
            const data = req?.body;
            const { id, email } = req?.body;
            let userExist = await AppDataSource.getRepository(UserEntity).findOne({ where: { email: data?.email } })

            if (!userExist) {
                return res.status(401).json({ message: "Invalid credentials!" });
            }

            if (userExist?.is_active == 0) {
                return res.status(401).json({ message: "Wait for admin approval!" });
            }

            const token = jwt.sign({ id: userExist.id, email, }, "k[xjv76-53234/345hkj~nde5769", { expiresIn: "8h" });
            const userData = userExist
            return res.status(200).json({ token: token, user: userData })
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }

    }

}