const authRepo = require('../repo/auth');
const sendResponse = require("../helper/response")


const login = async (req, res) => {
    try {
        const response = await authRepo.login(req.body)
        sendResponse.success(res, 200, {
            msg: "Login Success",
            data: response,
        })

    } catch (objErr) {
        const statusCode = objErr.statusCode || 500
        sendResponse.error(res, statusCode, { msg: objErr.err.message })
    }
}


const authController = {
    login
}

module.exports = authController;