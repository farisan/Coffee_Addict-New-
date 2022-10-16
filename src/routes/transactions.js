const express = require("express");


const transactionsRouter = express.Router();


// Middleware login dan role
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")


const { get, create, edit, drop } = require("../controller/transactions.js")


// Routes Tabel transactions
transactionsRouter.get("/", get);
transactionsRouter.post("/", create);
transactionsRouter.patch("/:id", edit);
transactionsRouter.delete("/:id", drop);



module.exports = transactionsRouter;