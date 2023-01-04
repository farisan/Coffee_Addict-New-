const express = require("express");
const productRouter = express.Router();

// Middleware login dan role
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")
const uploadimages = require("../middleware/upload.js")
const sendResponse = require("../helper/response")

const cloudinaryUploader = require("../middleware/cloudinary");
const multer = require("multer");
const { diskUpload, memoryUpload } = require("../middleware/upload");
function uploadFile(req, res, next) {
    memoryUpload.single("image")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(400).json({ msg: err.message });
        } else if (err) {
            return res.json({ msg: err.message });
        }
        next();
    });
}
// function uploadFile(req, res, next) {
//     const upload = uploadimages.single('image');

//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             // Error limit size
//             // return res.json('Size image max 5mb')
//             return sendResponse.error(res, 415, 'Size image max 5mb')
//         } else if (err) {
//             // Error File format
//             // return res.json('Format image must png, jpg or jpeg!')
//             return sendResponse.error(res, 415, 'Format image must png, jpg or jpeg!')
//         }
//         // Everything went fine. 
//         next()
//     })
// }

const { search, getid, create, edit, drop } = require("../controller/product.js")


// Routes Tabel Product


productRouter.get("/", search);
productRouter.get("/:id", getid);
productRouter.post("/", isLogin(), allowedRole('admin'), uploadFile, cloudinaryUploader, create);
productRouter.patch("/:id", isLogin(), allowedRole('admin'), uploadFile, cloudinaryUploader, edit);
productRouter.patch("/delete/:id", isLogin(), allowedRole('admin'), drop);





module.exports = productRouter;