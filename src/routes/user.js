const express = require("express");
const usersRouter = express.Router();

// Koneksi ke controller user
const { get, getId, register, editPasswords } = require("../controller/user.js");


// Routes Tabel Users
usersRouter.get("/", get);                  // localhost:6060/coffee/users/             => ()
usersRouter.get("/:id", getId);             // localhost:6060/coffee/users/:id_users    => (params)
usersRouter.post("/", register);            // localhost:6060/coffee/users/             => (params)
usersRouter.patch("/editPasswords", editPasswords)
// usersRouter.patch("/:id_users", edit);   // localhost:6060/coffee/users/:id_users    => (body,params)
// usersRouter.delete("/:id_users", drop)  // localhost:6060/coffee/users/:id_users    => (params)



module.exports = usersRouter;