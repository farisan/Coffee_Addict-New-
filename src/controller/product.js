const productRepo = require("../repo/product.js")
const sendResponse = require("../helper/response")




const search = async (req, res) => {
    try {
        const hostApi = `${req.protocol}://${req.hostname}:6060`;
        const response = await productRepo.search(req.query, hostApi)
        sendResponse.success(res, 200, response)
    } catch (err) {
        sendResponse.error(res, 500, err.message)
    }
}

const create = async (req, res) => {
    try {
        const response = await productRepo.create(req.body, req.file.path)
        response.rows[0].image = `images/${req.file.filename}`
        sendResponse.success(res, 200, {
            msg: "Create Product Success",
            data: response.rows
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const edit = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.path;
        }
        const response = await productRepo.edit(req.body, req.params)
        console.log(response);
        response.rows[0].image = `images/${req.file.filename}`
        sendResponse.success(res, 200, {
            msg: "Edit Data Success",
            data: response.rows
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
    create,
    edit,
    drop,
}

module.exports = productController;