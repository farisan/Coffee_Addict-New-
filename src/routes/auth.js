const authRouter = require('express').Router();


const { login } = require("../controller/auth.js")


// Login
authRouter.post("/", login);
// Logout
// authRouter.delete("/", (req, res) => { });


module.exports = authRouter;