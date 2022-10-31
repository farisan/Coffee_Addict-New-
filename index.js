require("dotenv").config();
require("./src/config/redis");
const express = require("express");
const morgan = require('morgan');



// Cors => menerima inputan dari luar port
const cors = require('cors');
// const corsOPSTIONS = {
//     origin: "http://localhost:3000",
//     credentials: true,
//     optionsSuccessStatus: 200,
// }


const server = express();
const PORT = 6060;


const postgreDb = require("./src/config/postgre.js"); // import database yang ada di dalam file src/config
const mainRouter = require("./src/routes/main.js") // untuk mengubungkan/memanggil file main js yang ada di routes

postgreDb
    .connect()  // promise
    // untuk menangkap success
    .then(() => {
        console.log("Database Connected");

        // untuk dapat digunakan isi data nya di json atau urlencode
        server.use(express.json());
        server.use(express.urlencoded({ extended: false }));
        server.use(cors());
        server.use(express.static("./public/images"))

        server.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
        server.use(mainRouter);


        // untuk mengetahui bahwa server sudah terkoneksi
        server.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        });

    })

    //menangkap apabila yang dijalankan error
    .catch((err) => {
        console.log(err);
    });