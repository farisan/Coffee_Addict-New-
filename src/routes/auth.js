const authRouter = require('express').Router();
const isLogin = require("../middleware/isLogin.js")


const { login, logout } = require("../controller/auth.js")


// Login
authRouter.post("/", login);
// Logout
authRouter.delete("/", isLogin(), logout);


module.exports = authRouter;