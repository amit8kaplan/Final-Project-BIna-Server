import { Request, Response, NextFunction  } from 'express';
import { createClient } from 'redis';
import {findMail, sendMailUtil} from '../common/utils';
import {otptemplateHTML} from "../common/templates";

// Assuming you have Redis initialized
const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function initializeRedisClient() {
    try {
        await redisClient.connect();
        console.log('Redis client connected');
    } catch (err) {
        console.error('Failed to connect to Redis', err);
    }
}

// Call the initialization function
initializeRedisClient();
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
    const emailTo = await findMail(clientId);
    const sessionKey = `session:${clientId}`;

    // Close existing session if any
    try {
        await redisClient.del(sessionKey); // Use await with the del function
    } catch (err) {
        console.error('Failed to close existing session', err);
    }

    // Generate a new OTP
    const otp = generateOTP();
    


    // Save OTP and clientId in Redis (local store) for 10 minutes
    try {
        await redisClient.setEx(sessionKey, 600, JSON.stringify({ otp })); // Use setEx with TTL
        // Here you would send the OTP via email (mocked for now)
        console.log(`Sending OTP ${otp} to email ${emailTo}`);
        console.log(redisClient.get(sessionKey), "redisClient.get(sessionKey)");
        const otptamplate = otptemplateHTML;
        const data = otptamplate.replace('{{OTP_CODE}}', otp);
        const subject = 'OTP Verification to BIna';
        // const objres = await sendMailUtil(emailTo, subject, data);
        res.status(200).json({ message: 'OTP sent via email' });
        // res.status(200).json({ message: 'OTP sent via email', objres: objres });
    } catch (err) {
        res.status(500).json({ message: 'Failed to store OTP in Redis' });
    }
}
// Controller to verify OTP and open a session
export async function verifyFirstTimeOtp(req: Request, res: Response) {
    const { clientId, otpUser } = req.body;

    if (!clientId || !otpUser) {
        return res.status(400).json({ message: 'Client ID and OTP are required' });
    }

    const sessionKey = `session:${clientId}`;

    try {
        const sessionData = await redisClient.get(sessionKey);

        if (!sessionData) {
            return res.status(401).json({ message: 'Session not found or expired' });
        }

        const { otp } = JSON.parse(sessionData);

        if (otp !== otpUser) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        const sessionInfo = {
            storedClientId: clientId,
            storedOtp: otp
        }
        // OTP is correct, open a 10-minute session
        await redisClient.setEx(sessionKey, 600, JSON.stringify({ ...sessionInfo, verified: true }));
        const get = await redisClient.get(sessionKey);
        console.log(get, "get");
        res.status(200).json({ message: 'OTP verified and session opened' });
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).json({ message: 'Server error' });
    }
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

        const { storedClientId, storedOtp, verified } = JSON.parse(sessionData);
        console.log(storedClientId, storedOtp, verified, "storedClientId, storedOtp, verified");
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