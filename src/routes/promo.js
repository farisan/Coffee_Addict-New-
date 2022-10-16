const express = require("express");
const promoRouter = express.Router();

// Middleware login dan role
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")


const { get, search, create, edit, drop } = require("../controller/promo.js")


// Routes Tabel Product
promoRouter.get("/GetPromo", get);
promoRouter.get("/", search)
promoRouter.post("/", create);
promoRouter.patch("/:id", edit);
promoRouter.delete("/:id", drop);






module.exports = promoRouter;