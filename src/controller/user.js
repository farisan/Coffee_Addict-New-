// Mengkoneksikan file repo users ke controller users
const userRepo = require("../repo/user.js");
const sendResponse = require("../helper/response.js");
const response = require("../helper/response.js");
const { sendMail } = require("../helper/mail");
const { forgotMail } = require("../helper/forgotMail");
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
      const setSendEmail = {
        to: req.body.email,
        subject: "Email Verification !",
        // template: "verificationEmail.html",
        template: "verificationEmail.html",
        buttonUrl: `https://coffeeaddictfe.vercel.app/auth/${response.data.pinactivation}`,
      };
      await sendMail(setSendEmail);
      sendResponse.success(res, 200, {
        msg: "please check your email",
        data: response.data,
      });
    } catch (err) {
      console.log(err);
      sendResponse.error(res, 500, err.message);
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

const updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      await userRepo.updateStatus(id);
      sendResponse.success(res, 200, {
        msg: "success active account",
      });
    } catch (error) {
      console.log(error);
      sendResponse(res, 500, err.message);
    }
  };


  const forgotPassword = async (req, res) => {
    try {
      const response = await userRepo.forgotPassword(req.params.email);
      const setSendEmail = {
        to: req.params.email,
        subject: " Reset Pasword",
        mail:req.params.email,
        template: "forgotEmail.html",
        otp: `${response.data}`,
      };
      await forgotMail(setSendEmail);
      sendResponse.success(res, 200, {
        msg: "please check your email",
      });
    } catch (objErr) {
      console.log(objErr)
      const message = objErr.err.message || "internal server error";
      const statusCode = objErr.statusCode || 500;
      sendResponse.error(res, statusCode, { msg: message });
    }
  };
  
  const forgotChange = async (req, res) => {
    try {
      const { otp, password } = req.body;
      console.log(req.body);
      await userRepo.changeForgot(otp, password);
      sendResponse.success(res, 200, {
        msg: "password was changed",
      });
    } catch (objErr) {
      const statusCode = objErr.statusCode || 500;
      const message = objErr.err.message || "internal server error";
      sendResponse.error(res, statusCode, { msg: message });
    }
  };

// Nama function di atas di bungkus menjadi object
const userController = {
    get,
    getId,
    register,
    editPasswords,
    profile,
    drop,
    updateStatus,
    forgotPassword,
    forgotChange
}

module.exports = userController;