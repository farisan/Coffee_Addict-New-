const express = require("express");
const productRouter = express.Router();

// Middleware login dan role
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")
const uploadimages = require("../middleware/upload.js")
const multer = require("multer");
function uploadFile(req, res, next) {
    const upload = uploadimages.single('image');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.json('Size image minimum 5mb')
        } else if (err) {
            // Error File format
            res.json('Format image Wrong!')
        }
        // Everything went fine. 
        next()
    })
}

const { search, create, edit, drop } = require("../controller/product.js")


// Routes Tabel Product


productRouter.get("/", search);
productRouter.post("/", isLogin(), allowedRole('admin'), uploadFile, create);
productRouter.patch("/:id", isLogin(), allowedRole('admin'), uploadFile, edit);
productRouter.delete("/:id", isLogin(), allowedRole('admin'), drop);





module.exports = productRouter;