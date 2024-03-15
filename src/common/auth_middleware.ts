import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthResquest extends Request {
    user?: { _id: string};
}
const  authMiddleware  = (req: AuthResquest, res: Response, next: NextFunction) => {
    //console.log("authMiddleware")
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (token == null){ 
        //////console.log("token is null")
        return res.sendStatus(401);
    }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        try{
            //////console.log("err2 " +err);
            if (err) return res.sendStatus(401);
            req.user = user as { _id: string};
            ////////////////console.log("the auth" + req.user);
            //////console.log("the auth" + req.user._id);
            //console.log("authMiddleware next")
            next();
        }
        catch (err) {
            //console.log("authMiddleware error")
            res.status(500).json({ message: err.message });
        }
    });
}

export default authMiddleware;