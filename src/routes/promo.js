const express = require("express");
const promoRouter = express.Router();

// Middleware login dan role
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")


const cloudinaryUploader = require("../middleware/cloudinaryPromo");
const multer = require("multer");
const { diskUpload, memoryUpload } = require("../middleware/upload");
function uploadFile(req, res, next) {
    memoryUpload.single("image")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(400).json({ msg: "Size to large" });
        } else if (err) {
            return res.json({ msg: "Format Wrong" });
        }
        next();
    });
}


const { get, getid, search, create, edit, drop } = require("../controller/promo.js")


// Routes Tabel Product

promoRouter.get("/GetPromo", get);
promoRouter.get("/promo/:id", getid);
promoRouter.get("/", search)
promoRouter.post("/", isLogin(), allowedRole('admin'),uploadFile,cloudinaryUploader, create);
promoRouter.patch("/:id", isLogin(), allowedRole('admin'), uploadFile, cloudinaryUploader, edit);
promoRouter.patch("/delete/:id", isLogin(), allowedRole('admin'), drop);





module.exports = promoRouter;