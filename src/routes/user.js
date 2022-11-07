const express = require("express");
const usersRouter = express.Router();

// Koneksi ke controller user
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")
const validate = require("../middleware/validate.js")
const uploadimages = require("../middleware/upload.js")
const sendResponse = require("../helper/response")

const multer = require("multer");
const cloudinaryUploader = require("../middleware/cloudinaryProfile");
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
//             // A Multer error occurred when uploading.
//             // res.json('Size image minimum 5mb')
//             return sendResponse.error(res, 415, 'Size image max 2mb')
//         } else if (err) {
//             // Error File format
//             // res.json('Format image Wrong!')
//             return sendResponse.error(res, 415, err.message)
//         }
//         // Everything went fine. 
//         next()
//     })
// }


const { get, getId, register, profile, editPasswords, drop } = require("../controller/user.js");



// isLogin() <= middleware, ngunci endpoint harus login

// Routes Tabel Users
usersRouter.get("/", isLogin(), allowedRole('admin'), get);
usersRouter.get("/UserID", isLogin(), allowedRole('user', 'admin'), getId);
usersRouter.post("/", validate.body("email", "passwords", "phone_number"), register);
usersRouter.patch("/profile", isLogin(), allowedRole('user'), uploadFile, cloudinaryUploader, validate.body('firstname', 'lastname', 'displayname', 'gender', 'birthday', 'address', 'image'), profile)
usersRouter.patch("/editPasswords", isLogin(), allowedRole('admin', 'user'), validate.body('old_password', 'new_password'), editPasswords)
usersRouter.delete("/", isLogin(), allowedRole('user'), drop)


module.exports = usersRouter;