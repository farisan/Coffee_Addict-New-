// router utama
const express = require("express");

const mainRouter = express.Router();


// cek apakah benar sudah terkoneksi dan jalan (test code)
// http://ocalhost:6060/
mainRouter.get("/", (req, res) => {
    res.json({
        msg: "Berjalan dengan baik",
    })
})


//export
module.exports = mainRouter;