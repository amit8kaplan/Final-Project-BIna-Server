import { Request, Response, NextFunction  } from 'express';
import { createClient } from 'redis';
import {findMail, sendMailUtil} from '../common/utils';
import {otptemplateHTML} from "../common/templates";
import {redisClient} from '../app'; // Import the redisClient from app.ts
import Instractor_model from '../models/Instractor_model';
import {IInstractor} from '../models/Instractor_model';

export interface IredisSessionData {
    storedClientId: string;
    storedOtp: string;
    permissions: string;
    verified: boolean;
}
// Generate OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Controller to send OTP via email and store clientId/OTP
export async function sentOtpUsingMail(req: Request, res: Response) {
    const { clientId } = req.body;
    if (!clientId) {
        return res.status(400).json({ message: 'Client ID and email are required' });
    }
    try{
        const emailTo = await findMail(clientId);
        const sessionKey = `sessionTemp:${clientId}`;
        // Close existing session if any
        try {await redisClient.del(sessionKey); // Use await with the del function
            }
         catch (err) {console.error('Failed to close existing session', err);}
        // Generate a new OTP
        const otp = generateOTP();
        // Save OTP and clientId in Redis (local store) for 10 minutes
        try {
            await redisClient.setEx(sessionKey, 120, JSON.stringify({ otp })); // Use setEx with TTL
            // Here you would send the OTP via email (mocked for now)
            console.log(`Sending OTP ${otp} to email ${emailTo}`);
            console.log(redisClient.get(sessionKey), "redisClient.get(sessionKey)");
            const otptamplate = otptemplateHTML;
            const data = otptamplate.replace('{{OTP_CODE}}', otp);
            const subject = 'OTP Verification to BIna';
            const objres = await sendMailUtil(emailTo, subject, data);
            const [localPart, domain] = emailTo.split('@');
            const ttl = await redisClient.ttl(sessionKey);
            if (localPart.length <= 4) { 
                res.status(200).json({ message: 'OTP sent via email', email: emailTo, ttl: ttl });
            }
            else{
                const maskedLocalPart = `${localPart.slice(0, 2)}${'*'.repeat(localPart.length - 4)}${localPart.slice(-2)}`;
                const maskedEmail = `${maskedLocalPart}@${domain}`;
                res.status(200).json({ message: 'OTP sent via email', email: maskedEmail,ttl: ttl });
            }
        } catch (err) {
            res.status(500).json({ message: 'Failed to store OTP in Redis' });
        }
    }catch(err){
        console.error('Failed to find client ID:', err);
        res.status(500).json({ message: err.message });

    }
}
export async function verifyFirstTimeOtpUsingCookies(req: Request, res: Response) {
    console.log("verifyFirstTimeOtpUsingCookies");
    const { clientId, otpUser, seconds, permissionFromreq } = req.body;
    console.log(clientId, otpUser, seconds, "clientId, otpUser, seconds");
    const prevClientId = req.headers['path'] as string;
    const prevOtp = req.headers['value'] as string;
    if (!clientId || !otpUser) {
        console.log("Client ID and OTP are required");
        return res.status(400).json({ message: 'Client ID and OTP are required' });
    }

    // Delete the previous session if it exists
    try {
        if (prevClientId && prevOtp) {
            const OldsessionKey = `session:${prevClientId}`;
            const exist =  await redisClient.exists(OldsessionKey)
            if (exist) {
                console.log(`Deleted old session: ${OldsessionKey}`);
                await redisClient.del(OldsessionKey); // Delete old session
            }
        }
    } catch (err) {
        console.error('Failed to close existing session:', err);
        return res.status(500).json({ message: 'Failed to close existing session' });
    }
    const sessionTempKey = `sessionTemp:${clientId}`;
    const sessionKey = `session:${clientId}`;
    // Ensure client exists in the database
    let permission: string;
    try {
        const instractor: IInstractor = await Instractor_model.findOne({ _id: clientId });
        if (!instractor) {
            console.log("Client ID is not found 2");
            return res.status(400).json({ message: 'Client ID is not found' });
        }
        permission = instractor.permissions || 'regular';
        if (permission === "regular" && permissionFromreq !== permission ) {
            console.log("Permission is not valid", permission, permissionFromreq);
            return res.status(400).json({ message: 'Permission is not valid' });
        }
    } catch (err) {
        console.error('Failed to find client ID:', err);
        return res.status(400).json({ message: 'Client ID is not found' });
    }

    // Verify OTP and open new session
    try {
        const sessionData = await redisClient.get(sessionTempKey);

        if (!sessionData) {
            return res.status(401).json({ message: 'Session not found or expired' });
        }

        const { otp } = JSON.parse(sessionData);

        if (otp !== otpUser) {
            console.log("Invalid OTP");
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP is valid, create a new session and store it
        const sessionInfo = {
            storedClientId: clientId,
            storedOtp: otp,
            permissions: permission,
        };

        // Set new session with 10-minute expiry
        await redisClient.setEx(sessionKey, seconds, JSON.stringify({ ...sessionInfo, verified: true }));
        console.log('New session opened:', sessionKey);
        // const ttl = await redisClient.ttl(sessionKey);
        // console.log('Session TTL:', ttl);
        //delete the temp session
        await redisClient.del(sessionTempKey);

        //open cookie
        const value = `${clientId}_${otpUser}_${permission}`;

        
        res.status(200).json({ message: 'OTP verified and session opened', permissions: permission ,ttl: await redisClient.ttl(sessionKey) });
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function verifyOtpAgain(req: Request, res: Response) {
    const { clientId, otpUser } = req.body;
    console.log("verify-otp-again");
    console.log(clientId, otpUser, "clientId, otpUser");
    if (!clientId || !otpUser) {
        console.log("Client ID and OTP are required");
        return res.status(400).json({ message: 'Client ID and OTP are required' });
    }
    const sessionKey = `session:${clientId}`;
    try{
        const sessionData = await redisClient.get(sessionKey);
        const ttl = await redisClient.ttl(sessionKey);
        if (!sessionData) {
            console.log("Unauthorized: Session not found or expired");
            return res.status(401).json({ message: 'Unauthorized: Session not found or expired' });
        }
        else if (sessionData) {
            const { storedClientId, storedOtp, verified, permissions } = JSON.parse(sessionData);
            if (storedClientId !== clientId || storedOtp !== otpUser) {
                console.log("Unauthorized: clientID and otp not good");
                return res.status(401).json({ message: 'Unauthorized: clientID and otp not good' });
            }
            else {
                console.log("OTP verified");
                return res.status(200).json({ message: 'OTP verified', permissions: permissions , ttl: ttl});
            }
        }
    }catch(err){
        console.error('Failed to find client ID:', err);
        return res.status(500).json({ message: err.message });
    }

}

export async function newTtlSession(req: Request, res: Response) {
    const clientId = req.headers['client-id'] as string;
    const otpUser = req.headers['otp'] as string;
    const {  seconds } = req.body;
    if (!clientId || !otpUser || !seconds) {
        return res.status(400).json({ message: 'Client ID is required' });
    }
    const sessionKey = `session:${clientId}`;
     
    try {
        const sessionData = await redisClient.get(sessionKey);
        console.log(sessionData, "sessionData");
        if (!sessionData) {
            return res.status(401).json({ message: 'Unauthorized: Session not found or expired' });
        }
        else if (sessionData) {
            const { storedClientId, storedOtp, verified, permissions } = JSON.parse(sessionData);
            if (storedClientId !== clientId || storedOtp !== otpUser) {
                return res.status(401).json({ message: 'Unauthorized: clientID and otp not good' });
            }
            else {
                const ans = await redisClient.expire(sessionKey, seconds);
                if (ans)
                    res.status(200).json({ message: 'Session TTL updated successfully' });
                else
                    res.status(500).json({ message: 'Failed to update TTL', permissions: permissions});
            }
        }
    } catch (err) {
        console.error('Failed to update TTL:', err);
        res.status(500).json({ message: 'Failed to update TTL' });
    }
}

export async function verifyOtp(req: Request, res: Response){
    const { clientId, otpUser } = req.body;
    console.log(clientId, otpUser, "clientId, otpUser");
    const sessionKey = `session:${clientId}`;
    const sessionData = await redisClient.get(sessionKey);
    if (!sessionData) {
        return res.status(401).json({ message: 'Unauthorized: Session not found or expired' });
    }
    else if (sessionData) {
        const { storedClientId, storedOtp, verified, permissions } = JSON.parse(sessionData);
        if (storedClientId !== clientId || storedOtp !== otpUser) {
            const deleted = await redisClient.del(sessionKey);
            return res.status(401).json({ message: 'Unauthorized: the session deleted', deleted: deleted });
        }
        else{
            return res.status(200).json({ message: 'OTP verified', permissions: permissions });
        }
       
    }
}

// Controller to verify OTP and open a session
export async function verifyFirstTimeOtp(req: Request, res: Response) {
    console.log("verifyFirstTimeOtp verify-otp");
    const { clientId, otpUser } = req.body;
    const hours = req.body.hours || 1;
    console.log(clientId, otpUser, "clientId, otpUser");
    // const prevClientId = req.headers['client-id'] as string;
    // const prevOtp = req.headers['otp'] as string;
    // console.log(prevClientId, prevOtp, "prevClientId, prevOtp");

    if (!clientId || !otpUser) {
        return res.status(400).json({ message: 'Client ID and OTP are required' });
    }

    // Delete the previous session if it exists
    try {
        if (clientId) {
            const OldsessionKey = `session:${clientId}`;
            const oldSessionExists = await redisClient.exists(OldsessionKey);

            if (oldSessionExists) {
                await redisClient.del(OldsessionKey); // Delete old session
                console.log(`Deleted old session: ${OldsessionKey}`);
            }
        }
    } catch (err) {
        console.error('Failed to close existing session:', err);
        return res.status(500).json({ message: 'Failed to close existing session' });
    }

    const sessionTempKey = `sessionTemp:${clientId}`;
    const sessionKey = `session:${clientId}`;
    // Ensure client exists in the database
    let permission: string;
    try {
        const instractor: IInstractor = await Instractor_model.findOne({ _id: clientId });
        if (!instractor) {
            return res.status(400).json({ message: 'Client ID is not found' });
        }
        permission = instractor.permissions || 'regular';
    } catch (err) {
        console.error('Failed to find client ID:', err);
        return res.status(400).json({ message: 'Client ID is not found' });
    }

    // Verify OTP and open new session
    try {
        const sessionData = await redisClient.get(sessionTempKey);

        if (!sessionData) {
            return res.status(401).json({ message: 'Session not found or expired' });
        }

        const { otp } = JSON.parse(sessionData);

        if (otp !== otpUser) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP is valid, create a new session and store it
        const sessionInfo = {
            storedClientId: clientId,
            storedOtp: otp,
            permissions: permission,
        };

        // Set new session with 10-minute expiry
        await redisClient.setEx(sessionKey, hours*60*60, JSON.stringify({ ...sessionInfo, verified: true }));
        console.log('New session opened:', sessionKey);
        // const ttl = await redisClient.ttl(sessionKey);
        // console.log('Session TTL:', ttl);
        //delete the temp session
        await redisClient.del(sessionTempKey);

        res.status(200).json({ message: 'OTP verified and session opened', permissions: permission ,ttl: await redisClient.ttl(sessionKey) });
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function getMyTtlSession(req: Request, res: Response) {
    const clientId = req.headers['client-id'] as string;
    const otp = req.headers['otp'] as string;
    if (!clientId || !otp) {
        return res.status(400).json({ message: 'Client ID and OTP are required' });
    }
    const sessionKey = `session:${clientId}`;
    try {
        const ttl = await redisClient.ttl(sessionKey);
        res.status(200).json({ ttl });
    } catch (err) {
        console.error('Failed to retrieve TTL:', err);
        res.status(500).json({ message: 'Failed to retrieve TTL' });
    }
}
// Controller to delete a session
export async function deleteSession(req: Request, res: Response): Promise<void> {
    console.log("RegularDeleteSession deleteSession");
    const ClientId = req.headers['client-id'] as string;
    const Otp = req.headers['otp'] as string;

    const sessionKey = `session:${ClientId}`;

    try {
        await redisClient.del(sessionKey);
        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (err) {
        console.error('Failed to delete session:', err);
        res.status(500).json({ message: 'Failed to delete session' });
    }
}

// controller to delete all sessions except the current one
export async function deleteAllSessionExecptHimSelf(req: Request, res: Response): Promise<void> {
    const ClientId = req.headers['client-id'] as string;
    const Otp = req.headers['otp'] as string;

    const sessionKey = `session:${ClientId}`;

    try {
        const keys = await redisClient.keys('session:*');
        for (const key of keys) {
            if(key !== sessionKey){
                await redisClient.del(key);
            }
        }
        res.status(200).json({ message: 'All Sessions deleted successfully' });
    } catch (err) {
        console.error('Failed to delete session:', err);
        res.status(500).json({ message: 'Failed to delete session' });
    }
}

export async function getAllSessions(req: Request, res: Response): Promise<void> {
    try {
        
        const keys = await redisClient.keys('session:*');
        const sessions = [];

        for (const key of keys) {
            const sessionData = await redisClient.get(key);
            const ttl = await redisClient.ttl(key); // Get the remaining TTL for the session
            if (sessionData) {
                const parsedData = JSON.parse(sessionData);
                delete parsedData.storedOtp; // Remove the otp field
                sessions.push({ key, storedClientId: parsedData.storedClientId, ttl });
            }
        }

        res.status(200).json(sessions);
    } catch (err) {
        console.error('Failed to retrieve sessions:', err);
        res.status(500).json({ message: 'Failed to retrieve sessions' });
    }
}

const permissionHierarchy = {
    admin: ['admin', 'group', 'regular'],
    group: ['group', 'regular'],
    regular: ['regular']
};

async function checkClientSessionAndPermmisionUsingCookies(req: Request, res: Response, next: NextFunction, requiredPermission: string) {
    const clientId = req.headers['path'] as string;
    const otp = req.headers['value'] as string; 
    if (!clientId || !otp) {
        return res.status(400).json({ message: 'Client ID and OTP are required' });
    }
    const sessionKey = `session:${clientId}`;
    try {
        const sessionData = await redisClient.get(sessionKey);
        if (!sessionData) {
            return res.status(401).json({ message: 'Unauthorized: Session not found or expired' });
        }
        else{
            const { storedClientId, storedOtp, verified, permissions } = JSON.parse(sessionData);
            if (storedClientId !== clientId || storedOtp !== otp) {
                return res.status(401).json({ message: 'Unauthorized: Invalid client ID or OTP' });
            }
            else if (!verified) {
                return res.status(401).json({ message: 'Unauthorized: OTP not verified' });
            }
            else if (permissionHierarchy[permissions].includes(requiredPermission)) {
                return next(); // Session and OTP are valid, proceed to the route
            } else {
                return res.status(403).json({ message: 'Unauthorized: Permission denied' });
            }
        }
    } catch (err) {
        console.error('Redis error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}


async function checkClientSessionAndPermission(req: Request, res: Response, next: NextFunction, requiredPermission: string) {
    const clientId = req.headers['client-id'] as string;
    const otp = req.headers['otp'] as string;
    // const permissions = req.headers['permissions'] as string;
    if (!clientId || !otp) {
        return res.status(400).json({ message: 'Client ID and OTP are required' });
    }
    const sessionKey = `session:${clientId}`;
    try {
        const sessionData = await redisClient.get(sessionKey);
        if (!sessionData) {
            return res.status(401).json({ message: 'Unauthorized: Session not found or expired' });
        }
        else{
            const { storedClientId, storedOtp, verified, permissions } = JSON.parse(sessionData);
            if (storedClientId !== clientId || storedOtp !== otp) {
                return res.status(401).json({ message: 'Unauthorized: Invalid client ID or OTP' });
            }
            else if (!verified) {
                return res.status(401).json({ message: 'Unauthorized: OTP not verified' });
            }
            else if (permissionHierarchy[permissions].includes(requiredPermission)) {
                return next(); // Session and OTP are valid, proceed to the route
            } else {
                return res.status(403).json({ message: 'Unauthorized: Permission denied' });
            }
        }
    } catch (err) {
        console.error('Redis error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export async function checkClientSessionAndPermissionToAdminUsingCookies(req: Request, res: Response, next: NextFunction) {
    return checkClientSessionAndPermmisionUsingCookies(req, res, next, 'admin');
}
export async function checkClientSessionAndPermissionToRegularUsingCookies(req: Request, res: Response, next: NextFunction) {
    return checkClientSessionAndPermmisionUsingCookies(req, res, next, 'regular');
}
export async function checkClientSessionAndPermissionToGroupUsingCookies(req: Request, res: Response, next: NextFunction) {
    return checkClientSessionAndPermmisionUsingCookies(req, res, next, 'group');
}

export async function checkClientSessionAndPermissionToAdmin(req: Request, res: Response, next: NextFunction) {
    return checkClientSessionAndPermission(req, res, next, 'admin');
}

export async function checkClientSessionAndPermissionToRegular(req: Request, res: Response, next: NextFunction) {
    return checkClientSessionAndPermission(req, res, next, 'regular');
}

export async function checkClientSessionAndPermissionToGroup(req: Request, res: Response, next: NextFunction) {
    return checkClientSessionAndPermission(req, res, next, 'group');
}

export async function checkClientSession(req: Request, res: Response, next: NextFunction) {
    const clientId = req.headers['client-id'] as string;
    const otp = req.headers['otp'] as string;

    if (!clientId || !otp) {
        return res.status(400).json({ message: 'Client ID and OTP are required' });
    }

    const sessionKey = `session:${clientId}`;

    try {
        const sessionData = await redisClient.get(sessionKey);
        console.log(sessionData, "sessionData");
        if (!sessionData) {
            return res.status(401).json({ message: 'Unauthorized: Session not found or expired' });
        }


        const { storedClientId, storedOtp, verified, permission } = JSON.parse(sessionData);
        console.log(storedClientId, storedOtp, verified,permission, "storedClientId, storedOtp, verified, permission");
        if (storedClientId !== clientId || storedOtp !== otp) {
            return res.status(401).json({ message: 'Unauthorized: Invalid client ID or OTP' });
        }

        if (!verified) {
            return res.status(401).json({ message: 'Unauthorized: OTP not verified' });
        }

        next(); // Session and OTP are valid, proceed to the route
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}