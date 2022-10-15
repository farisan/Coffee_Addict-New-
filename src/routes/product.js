const express = require("express");
const usersRouter = express.Router();

// Middleware login dan role
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")


const { filter, create, edit, drop, search } = require("../controller/product.js")


// Routes Tabel Product
usersRouter.get("/", filter);
usersRouter.get("/search", search);
usersRouter.post("/", create);
usersRouter.patch("/:id", edit);
usersRouter.delete("/:id", drop);






module.exports = usersRouter;