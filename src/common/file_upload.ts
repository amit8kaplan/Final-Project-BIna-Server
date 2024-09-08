import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure the upload directory exists
const ensureUploadDirectory = (dir) => {
    console.log("file_upload.ts: ensureUploadDirectory: dir: ", dir);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../../upload"); // Adjusted path
        console.log("file_upload.ts: storage: destination: uploadPath: ", uploadPath);
        ensureUploadDirectory(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        console.log("file_upload.ts: storage: filename: file: ", file);
        const ext = path.extname(file.originalname);
        console.log("file_upload.ts: storage: filename: ext: ", ext);
        cb(null, `${Date.now()}${ext}`);
    }
});

export const upload = multer({ storage });