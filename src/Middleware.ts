import { NextFunction, Request, Response } from "express"
import { JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const userMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const token = req.headers['authorization'] as string;
    const response = jwt.verify(token, JWT_SECRET);
    if(response){
        req.userId = (response as any).id;
        next();
    }else{
        res.status(4023).json({
            message: "Authorization header missing"
        })
    }
}

export{
    userMiddleware
}