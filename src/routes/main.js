// router utama
const express = require("express");


const authRouter = require("./auth.js")
const userRouter = require("./user.js")                 // menghubungkan router utama ke router user
const productRouter = require("./product.js")
const promoRouter = require("./promo.js")
const transactionsRouter = require("./transactions.js")

const mainRouter = express.Router();



const prefix = "/coffee";


// SubRoutes
mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/users`, userRouter);          // localhost:6060/coffee/users
mainRouter.use(`${prefix}/product`, productRouter)      // localhost:6060/coffee/product
mainRouter.use(`${prefix}/promo`, promoRouter)      // localhost:6060/coffee/promo
mainRouter.use(`${prefix}/transactions`, transactionsRouter)      // localhost:6060/coffee/delivery














// cek apakah benar sudah terkoneksi dan jalan (test code)
// http://ocalhost:6060/
mainRouter.get("/", (req, res) => {
    res.json({
        msg: "Berjalan dengan Lancar",
    })
})


//export
module.exports = mainRouter;