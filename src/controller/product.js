const productRepo = require("../repo/product.js")
const sendResponse = require("../helper/response")

const filter = async (req, res) => {
    try {
        // console.log(req.query);
        const response = await productRepo.filter(req.query)
        sendResponse.success(res, 200, response.rows)
    } catch (err) {
        sendResponse.error(res, 500, "internal server error")
    }
}

const search = async (req, res) => {
    try {
        const response = await productRepo.search(req.query)
        sendResponse.success(res, 200, response.rows)
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const create = async (req, res) => {
    try {
        const response = await productRepo.create(req.body)
        sendResponse.success(res, 200, {
            msg: "Create Product Success",
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const edit = async (req, res) => {
    try {
        await productRepo.edit(req.body, req.params)
        sendResponse.success(res, 200, {
            msg: "Edit Data Success",
            data: req.body
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const drop = async (req, res) => {
    try {
        await productRepo.drop(req.params)
        sendResponse.success(res, 200, {
            msg: "Delete Data Success",
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const productController = {
    filter,
    search,
    create,
    edit,
    drop,
}

module.exports = productController;