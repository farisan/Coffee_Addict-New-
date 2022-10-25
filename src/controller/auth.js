const authRepo = require('../repo/auth');
const sendResponse = require("../helper/response")

const client = require("../config/redis");

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

const logout = async (req, res) => {
    try {
        const response = await authRepo.logout(req.userPayload)
        sendResponse.success(res, 200, {
            msg: "Logout Success",
        })

    } catch (err) {
        sendResponse.error(res, 400, err.message)
    }
}

const authController = {
    login,
    logout
}

module.exports = authController;