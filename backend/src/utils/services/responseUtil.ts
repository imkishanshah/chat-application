import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export function successResponse(
    res: Response,
    status: number,
    message: string,
    result?: any,
    pagination?: any,
    token?: string,
) {
    let payloadData: any;

    if (token) {
        payloadData = {
            token: token,
            pager: pagination,
            data: result,
        };
    } else {
        payloadData = {
            pager: pagination,
            data: result,
        };
    }

    const response = {
        status: status,
        message,
        payload: payloadData,
    };

    return res.status(StatusCodes.OK).json(response);
}