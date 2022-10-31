const transactionsRepo = require("../repo/transactions");
const sendResponse = require("../helper/response.js")


/* =================================================================== */


const get = async (req, res) => {
    try {
        const response = await transactionsRepo.getALL()
        sendResponse.success(res, 200, response.rows)
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const history = async (req, res) => {
    try {
        const response = await transactionsRepo.historyTransactions(req.query, req.userPayload.user_id)
        // console.log(response);
        sendResponse.success(res, 200, response)
    } catch (err) {
        console.log(err);
        sendResponse.error(res, 500, err.message)
    }
}

const create = async (req, res) => {
    try {
        await transactionsRepo.createTransactions(req.body, req.userPayload.user_id)
        sendResponse.success(res, 200, {
            data: "Create data success"
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}


const edit = async (req, res) => {
    try {
        await transactionsRepo.editTransactions(req.body, req.params)
        sendResponse.success(res, 200, {
            data: "Update data success"
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}


const drop = async (req, res) => {
    try {
        await transactionsRepo.dropTransactions(req.params)
        sendResponse.success(res, 200, {
            data: "Delete data success"
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}



const transactionsController = {
    get,
    history,
    create,
    edit,
    drop
}

module.exports = transactionsController;