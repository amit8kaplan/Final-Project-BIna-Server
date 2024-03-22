import { Request, Response } from 'express';
import User, { IUser } from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { Document } from 'mongoose';
import env from "dotenv";

const client = new OAuth2Client();
const googleSignin = async (req: Request, res: Response) => {
    ////////////////console.log(req.body);
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email;
        if (email != null) {
            let user = await User.findOne({ 'email': email });
            if (user == null) {
                user = await User.create(
                    {
                        'email': email,
                        'password': '0',
                        'imgUrl': payload?.picture,
                        'user_name': payload?.given_name + " " + payload?.family_name
                    });
            }
            const tokens = await generateTokens(user)
            res.status(200).send(
                {
                    email: user.email,
                    _id: user._id,
                    imgUrl: user.imgUrl,
                    user_name: user.user_name,
                    ...tokens
                })
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }

}

const register = async (req: Request, res: Response) => {
    ////console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const imgUrl = req.body.imgUrl;
    const user_name = req.body.user_name;
    if (!email || !password) {
        ////console.log("missing email or password");
        return res.status(400).send("missing email or password");
    }
    try {
        const rs = await User.findOne({ 'email': email });
        if (rs != null) {
            return res.status(406).send("email already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        const rs2 = await User.create(
            {
                'email': email,
                'password': encryptedPassword,
                'imgUrl': imgUrl,
                'user_name': user_name
            });
        const tokens = await generateTokens(rs2)
        res.status(201).send(
            {
                email: rs2.email,
                _id: rs2._id,
                imgUrl: rs2.imgUrl,
                user_name: rs2.user_name,
                ...tokens
            })
    } catch (err) {
        return res.status(400).send("error missing email or password");
    }
}

const generateTokens = async (user: Document & IUser) => {
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
    if (user.refreshTokens == null) {
        user.refreshTokens = [refreshToken];
    } else {
        user.refreshTokens.push(refreshToken);
    }
    await user.save();
    return {
        'accessToken': accessToken,
        'refreshToken': refreshToken
    };
}

const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = await User.findOne({ 'email': email });
        if (user == null) {
            return res.status(401).send("email  incorrect");
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send(" password incorrect");
        }

        const tokens = await generateTokens(user)
        return res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
             email: user.email,
              _id: user._id,
             imgUrl: user.imgUrl,
             user_name: user.user_name
            });
    } catch (err) {
        return res.status(400).send("error missing email or password");
    }
}

const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    ////////console.log(refreshToken);
    // if (refreshToken === null){
    //     ////////console.log("refreshToken == null");
    //     return res.sendStatus(401);
    
    //     }
    ////////console.log("refreshToken != null");
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user: { '_id': string }) => {
        //////console.log("err1 " +err);
        if (err) return res.status(400).send("problem with jwt" +err);
        try {
            const userDb = await User.findOne({ '_id': user._id });
            //////console.log("userDb:" + JSON.stringify(userDb, null, 2));
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                //////console.log("inside the if")
                //////console.log("userDb.refreshTokens:" + !userDb.refreshTokens);
                //////console.log("userDb.refreshTokens.includes(refreshToken:" + !userDb.refreshTokens.includes(refreshToken));
                userDb.refreshTokens = [];
                await userDb.save();
                return res.status(401).send("refresh token not found");
            } else {
                //////console.log("inside the else")
                userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
                await userDb.save();
                return res.sendStatus(200);
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    });
}

const refresh = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user: { '_id': string }) => {
        if (err) {
            ////////////////console.log(err);
            return res.sendStatus(401);
        }
        try {
            const userDb = await User.findOne({ '_id': user._id });
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                ////////console.log("inside the if refresh");
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            }
            const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            //////console.log("before Filter:"+ JSON.stringify(userDb, null, 2));
            userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
            //////console.log("after Filter:"+ JSON.stringify(userDb, null, 2))
            ////////console.log("newRefreshToken in auth_controller:" + newRefreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            await userDb.save();
            ////////console.log("ater refresh this meed to be with the new refresh token")
            ////////console.log(JSON.stringify(userDb, null, 2));
            return res.status(200).send({
                'accessToken': accessToken,
                'refreshToken': newRefreshToken,
                'userdb': userDb
            });
        } catch (err) {
            res.sendStatus(401).send(err.message);
        }
    });
}
import Unsplash from 'unsplash-js';

const randomPhoto = async (req: Request, res: Response) => {
    //////console.log("inside randomPhoto")
    const unsplash =   Unsplash.createApi({
        accessKey: process.env.UNSPLASH_ACCESS_KEY,
        fetch: fetch
    });
    const response = await unsplash.photos.getRandom({ query: 'people,man,woman,portrait' });
    //////console.log(JSON.stringify(response, null, 2));
    // const randomPhoto = await User.aggregate([{ $sample: { size: 1 } }]);
    res.status(200).send({response});
}


  
export default {
    googleSignin,
    register,
    login,
    logout,
    refresh,
    randomPhoto
}