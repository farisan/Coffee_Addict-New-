const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        const suffix = Date.now() + "-" + Math.round(Math.random() * 1e3);
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${suffix}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            return cb(new Error("Format image must png, jpg or jpeg!"));
        }
    },
    limits: { fileSize: 2e6 },
});
module.exports = upload;