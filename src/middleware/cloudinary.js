const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const uploader = async (req, res, next) => {
    const { body, file } = req;
    if (!file) return next();

    const parser = new DatauriParser();
    const buffer = file.buffer;
    const ext = path.extname(file.originalname).toString();
    const datauri = parser.format(ext, buffer);
    const fileName = `${body.name}`;
    const cloudinaryOpt = {
        public_id: fileName,
        folder: "coffee_addict",
    };

    try {
        const result = await cloudinary.uploader.upload(
            datauri.content,
            cloudinaryOpt
        );
        req.file = result;
        next();
    } catch (err) {
        console.log(err.message);
        res.status(err).json({ msg: "Internal Server Error" });
    }
};

module.exports = uploader;






















// const DatauriParser = require("datauri/parser");
// const path = require("path");
// // const { resourceLimits } = require("worker_threads");
// const cloudinary = require("../config/cloudinary");

// const uploader = async (req, res, next) => {
//     const { body, file } = req;
//     if (!file) return next()         // apabila file gambar nya tidak ada
//     const parser = new DatauriParser();
//     const buffer = file.buffer;
//     const ext = path.extname(file.originalname).toString();
//     const datauri = parser.format(ext, buffer)
//     const fileName = `${body.prefix}_${body.user_id}`           //user_id ganti token
//     const cloudinaryOpt = {
//         public_id: fileName,
//         folder: "coffee_addict",
//     }
//     try {
//         cloudinary.uploader.upload(datauri.content, cloudinaryOpt);
//         req.file = result;
//         next()

//     } catch (err) {
//         console.log(err.message);
//         res.status(err).json({ msg: "internal server error" })
//     }
// };


// module.exports = uploader;