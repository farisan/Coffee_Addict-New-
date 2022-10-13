// router utama
const express = require("express");


const userRouter = require("./user.js")                 // menghubungkan router utama ke router user
const authRouter = require("./auth.js")

const mainRouter = express.Router();



const prefix = "/coffee";


// SubRoutes
mainRouter.use(`${prefix}/users`, userRouter);        // localhost:6060/coffee/usersmainRouter.use(`${prefix}/users`, userRouter);
mainRouter.use(`${prefix}/auth`, authRouter);














// cek apakah benar sudah terkoneksi dan jalan (test code)
// http://ocalhost:6060/
mainRouter.get("/", (req, res) => {
    res.json({
        msg: "Berjalan dengan baik",
    })
})


//export
module.exports = mainRouter;