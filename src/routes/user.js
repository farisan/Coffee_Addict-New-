const express = require("express");
const usersRouter = express.Router();

// Koneksi ke controller user
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")
const validate = require("../middleware/validate.js")
const uploadimages = require("../middleware/upload.js")

const { get, getId, register, profile, editPasswords, drop } = require("../controller/user.js");


// isLogin() <= middleware, ngunci endpoint harus login

// Routes Tabel Users
usersRouter.get("/", isLogin(), allowedRole('admin'), get);
usersRouter.get("/UserID", isLogin(), allowedRole('user'), getId);
usersRouter.post("/", validate.body("email", "passwords", "phone_number"), register);
usersRouter.patch("/profile", isLogin(), allowedRole('user'), uploadimages.single('image'), profile)
usersRouter.patch("/editPasswords", isLogin(), allowedRole('admin', 'user'), editPasswords)
usersRouter.delete("/", isLogin(), allowedRole('user'), drop)


module.exports = usersRouter;