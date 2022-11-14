const express = require("express");
const promoRouter = express.Router();

// Middleware login dan role
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")


const { get, getid, search, create, edit, drop } = require("../controller/promo.js")


// Routes Tabel Product

promoRouter.get("/GetPromo", get);
promoRouter.get("/promo/:id", getid);
promoRouter.get("/", search)
promoRouter.post("/", isLogin(), allowedRole('admin'), create);
promoRouter.patch("/:id", isLogin(), allowedRole('admin'), edit);
promoRouter.delete("/:id", isLogin(), allowedRole('admin'), drop);





module.exports = promoRouter;