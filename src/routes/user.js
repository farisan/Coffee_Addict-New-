const express = require("express");
const usersRouter = express.Router();

// Koneksi ke controller user
const isLogin = require("../middleware/isLogin.js")
const { get, getId, register, editPasswords, profil } = require("../controller/user.js");


// isLogin() <= middleware, ngunci endpoint harus login

// Routes Tabel Users
usersRouter.get("/", get);                  // localhost:6060/coffee/users/             => ()
usersRouter.get("/:id", getId);             // localhost:6060/coffee/users/:id_users    => (params)
usersRouter.post("/", register);            // localhost:6060/coffee/users/             => (params)
// usersRouter.post("/profil", profil)
usersRouter.patch("/editPasswords", editPasswords)
// usersRouter.patch("/:id_users", edit);   // localhost:6060/coffee/users/:id_users    => (body,params)
// usersRouter.delete("/:id_users", drop)  // localhost:6060/coffee/users/:id_users    => (params)



module.exports = usersRouter;