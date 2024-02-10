import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthResquest extends Request {
    user?: { _id: string};
}
const  authMiddleware  = (req: AuthResquest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        try{
            console.log("err" +err);
            if (err) return res.sendStatus(401);
            req.user = user as { _id: string};
            // console.log("the auth" + req.user);
            console.log("the auth" + req.user._id);
            next();
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
}

export default authMiddleware;