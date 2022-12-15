const productRepo = require("../repo/product.js")
const sendResponse = require("../helper/response")




const search = async (req, res) => {
    try {
        const hostApi = `${req.protocol}://${req.hostname}`;
        const response = await productRepo.search(req.query, hostApi)
        sendResponse.success(res, 200, response)
    } catch (err) {
        sendResponse.error(res, 500, err.message)
    }
}

const getid = async (req, res) => {
    try {
        const response = await productRepo.getid(req.params)
        console.log(response);
        sendResponse.success(res, 200, {
            data: response.rows
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const create = async (req, res) => {
    try {
        // if (req.file) {
        //     // req.file.filename = `/images/${req.file.filename}`; //ubah filename
        //     var image = `/${req.file.public_id}.${req.file.format}`; //ubah filename
        // }
        const response = await productRepo.create(req.body, req.file.secure_url)
        // const response = await productRepo.create(req.body, req.file.filename)
        sendResponse.success(res, 200, {
            msg: "Create Product Success",
            data: response.rows,
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const edit = async (req, res) => {
    try {
        // if (req.file) {
        //     req.body.image = `${req.file.filename}`;
        // }
        if (req.file) {
            var image = `/${req.file.public_id}.${req.file.format}`; //ubah filename
            req.body.image = req.file.secure_url
        }
        const response = await productRepo.edit(req.body, req.params)
        sendResponse.success(res, 200, {
            msg: "Edit Data Success",
            data: response.rows,
            filename: image,
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const drop = async (req, res) => {
    try {
        const response = await productRepo.drop(req.params)
        sendResponse.success(res, 200, {
            msg: "Delete Data Success",
            data: response.rows
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const productController = {
    search,
    getid,
    create,
    edit,
    drop,
}

module.exports = productController;