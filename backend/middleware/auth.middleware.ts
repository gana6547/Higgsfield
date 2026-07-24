import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import jwt from "jsonwebtoken";


export const auth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction) =>{
        const token=req.cookies.token;
        if(!token){
            return res.status(400).json({message:"token not found"})
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET!) as {userId :string};
        if(!decoded){
            return res.status(404).json({message:"jwt decoding error"})
        }

        req.user={
            userId:decoded.userId
        }
        next();
    }