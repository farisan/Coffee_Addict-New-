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
usersRouter.get("/getusers/:id", getId);
usersRouter.post("/", validate.body("email", "passwords", "phone_number"), register);
usersRouter.patch("/profile/:users_id", profile)
usersRouter.patch("/editPasswords", editPasswords)
usersRouter.delete("/:users_id", drop)

// usersRouter.get("/", isLogin(), allowedRole('admin'), get);
// usersRouter.get("/getusers/:id", isLogin(), allowedRole('admin'), getId);
// usersRouter.post("/", validate.body("email", "passwords", "phone_number"), register);
// usersRouter.patch("/profile/:users_id", isLogin(), allowedRole('user'), profile)
// usersRouter.patch("/editPasswords", isLogin(), allowedRole('user'), editPasswords)
// usersRouter.delete("/:users_id", isLogin(), allowedRole('admin'), drop)


module.exports = usersRouter;