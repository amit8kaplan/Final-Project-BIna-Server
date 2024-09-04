import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { promisify } from 'util';

// Set up Redis client
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});

// Promisify Redis methods
const setexAsync = promisify(redisClient.setEx).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Generate OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in Redis with a 10-minute expiration
async function storeOTPInSession(clientId: string, otp: string): Promise<void> {
    try {
        await setexAsync(clientId, 600, otp); // 600 seconds = 10 minutes
    } catch (err) {
        throw new Error(`Failed to store OTP: ${err.message}`);
    }
}

// Validate OTP from Redis
async function validateOTP(clientId: string, otp: string): Promise<boolean> {
    try {
        const storedOTP = await getAsync(clientId);
        if (storedOTP === otp) {
            await delAsync(clientId); // Invalidate OTP after successful validation
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw new Error(`Failed to validate OTP: ${err.message}`);
    }
}

// Middleware to check OTP session
export async function checkOTPSession(req: Request, res: Response, next: NextFunction) {
    const clientId = req.headers['client-id'] as string;
    const otp = req.headers['otp'] as string;

    if (!clientId || !otp) {
        return res.status(400).json({ message: 'Client ID and OTP are required' });
    }

    try {
        const isValid = await validateOTP(clientId, otp);
        if (isValid) {
            next(); // OTP is valid, allow access
        } else {
            res.status(401).json({ message: 'Unauthorized access' });
        }
    } catch (err) {
        console.error('Error validating OTP: ', err);
        res.status(500).json({ message: 'Server error' });
    }
}

// Export the OTP request handler as well
export async function handleOTPRequest(req: Request, res: Response) {
    const clientId = req.body.clientId;
    if (!clientId) {
        return res.status(400).json({ message: 'Client ID is required' });
    }

    const otp = generateOTP();
    try {
        await storeOTPInSession(clientId, otp);
        // Here you would send the OTP to the client (e.g., via SMS, email)
        res.json({ message: 'OTP sent successfully', otp }); // Sending OTP in response for demonstration
    } catch (err) {
        console.error('Error storing OTP: ', err);
        res.status(500).json({ message: 'Failed to store OTP' });
    }
}