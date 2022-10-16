// Mengkoneksikan file repo users ke controller users
const userRepo = require("../repo/user.js");
const sendResponse = require("../helper/response.js")
/* ============================================================== */

// Menampilkan semua values yang ada pada table users
const get = async (req, res) => {
    try {
        console.log(req.query);
        const response = await userRepo.getUser(req.query);
        sendResponse.success(res, 200, response.rows)

    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
};


// menampilkan semua values berdasarkan ID yang dipilih pada params
const getId = async (req, res) => {
    try {
        // console.log(req.query);
        const response = await userRepo.getUserId(req.params);
        sendResponse.success(res, 200, response.rows)

    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
};


// register users
const register = async (req, res) => {
    try {
        console.log(req.body);
        const response = await userRepo.register(req.body);
        sendResponse.success(res, 200, {
            msg: "Register Success",
            data: response.data
        })

    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
};


// edit password
const editPasswords = async (req, res) => {
    try {
        // console.log(req.query);
        const response = await userRepo.editPasswords(req.body);
        // console.log(response);
        sendResponse.success(res, 200, {
            msg: response.text = "Password has been changed",
            data: null
        })

    } catch (objErr) {
        const statusCode = objErr.statusCode || 500
        sendResponse.error(res, statusCode, { msg: objErr.err.message })
    }
};


// profil
const profile = async (req, res) => {
    try {
        await userRepo.profile(req.body, req.params);
        sendResponse.success(res, 200, {
            msg: "Edit Profile Success"
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}



// Nama function di atas di bungkus menjadi object
const userController = {
    get,
    getId,
    register,
    editPasswords,
    profile,
    // drop
}

module.exports = userController;