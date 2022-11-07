// Mengkoneksikan file repo users ke controller users
const userRepo = require("../repo/user.js");
const sendResponse = require("../helper/response.js");
const response = require("../helper/response.js");
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
        // console.log(req.userPayload.user_id);
        const response = await userRepo.getUserId(req.userPayload.user_id);
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
        console.log(err);
        sendResponse.error(res, 500, err.message)
    }
};


// edit password
const editPasswords = async (req, res) => {
    try {
        // console.log(req.query);
        const response = await userRepo.editPasswords(req.body, req.userPayload.user_id);
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
        // push all body lalu if disini mengubah body.image menjadi file.patch
        // if (req.file) {
        //     req.body.image = `${req.file.filename}`;
        // }
        if (req.file) {
            var image = `/${req.file.public_id}.${req.file.format}`; //ubah filename
            req.body.image = req.file.secure_url
        }

        const response = await userRepo.profile(req.body, req.userPayload.user_id);
        sendResponse.success(res, 200, {
            msg: "Edit Profile Success",
            data: response.rows,
            filename: image,

        })
    } catch (err) {
        console.log(err);
        sendResponse.error(res, 500, "internal server error")
    }
}

// drop users data
const drop = async (req, res) => {
    try {
        await userRepo.deleteUser(req.userPayload.user_id);
        sendResponse.success(res, 200, {
            msg: "Delete Profile Success",
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
    drop
}

module.exports = userController;