const express = require("express");
const usersRouter = express.Router();

// Koneksi ke controller user
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")
const uploadimages = require("../middleware/upload.js")

const { get, getId, register, profile, editPasswords } = require("../controller/user.js");


// isLogin() <= middleware, ngunci endpoint harus login

// Routes Tabel Users
usersRouter.get("/", get);                                                              // localhost:6060/coffee/users/             => ()
usersRouter.get("/getusers/:id", getId);                                                // localhost:6060/coffee/users/:id_users    => (params)
usersRouter.post("/", register);                                                        // localhost:6060/coffee/users/             => (params)
usersRouter.patch("/profile/:users_id", profile)
usersRouter.patch("/editPasswords", editPasswords)
// usersRouter.delete("/:id_users", drop)                                               // localhost:6060/coffee/users/:id_users    => (params)



module.exports = usersRouter;