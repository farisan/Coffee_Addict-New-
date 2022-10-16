const express = require("express");
const productRouter = express.Router();

// Middleware login dan role
const isLogin = require("../middleware/isLogin.js")
const allowedRole = require("../middleware/allowedRole.js")
const uploadimages = require("../middleware/upload.js")


const { filter, create, edit, drop, search } = require("../controller/product.js")


// Routes Tabel Product
productRouter.get("/", filter);
productRouter.get("/search", search);
productRouter.post("/", uploadimages.single('image'), create);
productRouter.patch("/:id", edit);
productRouter.delete("/:id", drop);






module.exports = productRouter;