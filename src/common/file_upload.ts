import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        ////console.log("in storage")
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        ////console.log("in filename")
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.')
        cb(null, Date.now() + "." + ext)
    }
})

// const upload = multer({ storage: storage });
const upload_img = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit, adjust as needed
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']; // Allowed image MIME types
        ////console.log(file)
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed (JPEG, PNG, GIF)'));
        }
    }
});


const upload_vid = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: function (req, file, cb) {
        //console.log("file", file)
        const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']; 
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed'));
        }
    }
});


export { upload_img, upload_vid };