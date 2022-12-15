const express = require("express");


const transactionsRouter = express.Router();


// Middleware login dan role
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")


const { get, history, create, edit, drop, getStatus, patchStatus } = require("../controller/transactions.js")


// Routes Tabel transactions

transactionsRouter.get("/", isLogin(), allowedRole('admin'), get);
transactionsRouter.get("/history", isLogin(), allowedRole('user'), history)
transactionsRouter.post("/", isLogin(), allowedRole('user'), create);
transactionsRouter.patch("/:id", isLogin(), allowedRole('admin'), edit);
transactionsRouter.delete("/:id", isLogin(), allowedRole('user'), drop);
transactionsRouter.get('/status',isLogin(),allowedRole('admin') , getStatus);
transactionsRouter.patch('/users/:status/:id',isLogin(),allowedRole('admin'), patchStatus);


module.exports = transactionsRouter;