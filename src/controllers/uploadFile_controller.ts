import { Request, Response, NextFunction } from 'express';
import { upload } from '../common/file_upload'; // Import the upload configuration

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
    upload.single('file')(req, res, function (err) {
        if (err) {
            console.error("uploadFile_controller.ts: uploadFile: Error: ", err);
            return res.status(500).json({ message: err.message });
        }
        console.log("uploadFile_controller.ts: uploadFile: req.file: ", req.file);
        next(); // Proceed to the next middleware/controller
    });
}

 