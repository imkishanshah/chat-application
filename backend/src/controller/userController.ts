import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/user.entity";
import { successResponse } from "../utils/services/responseUtil";
import { MessagesEntity } from "../entities/messages.entity";

export class userController {

    async getAllUsers(req: any, res: any) {
        try {
            const page = parseInt(req.query.pageNumber as string, 10) || 1;
            const pageSize = parseInt(req.query.recordsPerPage as string, 10) || 10;
            const sortField = req.query.sortBy || 'id' as string | undefined;
            const sortOrder = req?.query?.sortOrder?.toUpperCase() || 'DESC' as | "ASC" | "DESC" | undefined;

            const usersRepository = AppDataSource.getRepository(UserEntity);

            // INITIALIZE REPOSITORY
            let query = usersRepository.createQueryBuilder("user");

            // APPLY SORTING
            if (sortField && sortOrder) {
                query = query.orderBy(`user.${sortField}`, sortOrder);
            }

            // APPLY PAGINATION
            if (req?.query?.records !== "all") {
                query = query.skip((page - 1) * pageSize).take(pageSize);
            }

            // EXECUTE THE QUERY
            const userList = await query.getMany();


            // EXECUTE THE QUERY
            const totalRecords = await query.getCount();

            const pager = {
                sortBy: sortField || "id",
                sortOrder: sortOrder || "ASC",
                pageNumber: page,
                recordsPerPage: pageSize,
                totalRecords: totalRecords,
                filteredRecords: userList?.length,
            };

            const users = await AppDataSource.getRepository(UserEntity).find();
            return res.status(200).json({ message: "Users found successfully", data: users, pager: pager });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async createUser(req: any, res: any) {
        try {
            const userData = req?.body;
            const saveUserData = await AppDataSource.getRepository(UserEntity).save(userData);
            return successResponse(res, StatusCodes.OK, "User created succesfully", saveUserData);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" })
        }
    }


    async updateUser(req: any, res: any) {
        try {
            const id = req?.params?.id;
            const userData = req?.body;
            let userExist = await AppDataSource.getRepository(UserEntity).findOne({ where: { email: userData?.email } });

            if (!userExist) {
                return res.status(404).json({ message: "User does not exist!" })
            }


        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async getMessages(req: any, res: any) {
        try {
            const { user1Id, user2Id } = req.body;

            const messages = await AppDataSource.getRepository(MessagesEntity).find({
                where: [
                    { sender_id: user1Id, receiver_id: user2Id },
                    { sender_id: user2Id, receiver_id: user1Id }
                ],
                order: { created_at: 'ASC' }
            });

            return successResponse(res, StatusCodes.OK, "Messages found successfully", messages);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}