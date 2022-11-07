const multer = require("multer");
const path = require("path");

const limits = {
    fileSize: 2e6,
};
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // const allowedExt = ["jpg", "png"];
    const allowedExt = /jpg|png/;
    // re.test : boolean
    if (!allowedExt.test(ext))
        return cb(new Error("Only Use Allowed Extension (JPG, PNG)"), false);
    cb(null, true);
};

const diskStorage = multer.diskStorage({
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

const diskUpload = multer({
    storage: diskStorage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            return cb(new Error("Invalid file type"));
        }
    },
    limits: { fileSize: 3e6 }, //limit file
});

// revisi multer limit dan jenis file ya

const memoryStorage = multer.memoryStorage();

const memoryUpload = multer({
    storage: memoryStorage,
    limits,
    fileFilter,
});

const errorHandler = (err, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(500).json({ status: "Upload Error", msg: err.message });
    }
    if (err) {
        return res
            .status(500)
            .json({ status: "Internal Server Error", msg: err.message });
    }
    console.log("Upload Success");
    next();
};

module.exports = { diskUpload, memoryUpload, errorHandler };

























// const multer = require("multer");
// const path = require("path");
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./public/images");
//     },
//     filename: (req, file, cb) => {
//         const suffix = Date.now() + "-" + Math.round(Math.random() * 1e3);
//         const ext = path.extname(file.originalname);
//         const filename = `${file.fieldname}-${suffix}${ext}`;
//         cb(null, filename);
//     },
// });

// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         if (
//             file.mimetype == "image/png" ||
//             file.mimetype == "image/jpg" ||
//             file.mimetype == "image/jpeg"
//         ) {
//             cb(null, true);
//         } else {
//             return cb(new Error("Format image must png, jpg or jpeg!"));
//         }
//     },
//     limits: { fileSize: 2e6 },
// });
// module.exports = upload;