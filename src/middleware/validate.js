const sendResponse = require("../helper/response.js")

module.exports = {
    body: (...allowedKeys) => {
        return (req, res, next) => {
            const { body } = req;
            const sanitizedKey = Object.keys(body).filter((key) =>
                allowedKeys.includes(key)
            );
            const newBody = {};
            for (let key of sanitizedKey) {
                Object.assign(newBody, { [key]: body[key] });
            }
            console.log(body);
            // Pengecekan key body tidak boleh kosong
            // if (Object.keys(newBody).length === 0) return sendResponse.error(res, 400, { msg: "Input Key" })
            // Pengecekan key body harus sama dengan yang diisi di routes validate
            // if (Object.keys(newBody).length !== allowedKeys.length) return sendResponse.error(res, 400, { msg: "Input body not same" })
            // if (Object.keys(newBody).length >= allowedKeys.length) 
            // return sendResponse.error(res, 400, { msg: "Input body over" })
            // if (!req.file) {
            //     if (Object.keys(newBody).length === 0) return sendResponse.error(res, 400, { msg: "Input Key" })
            // }
            req.body = newBody;
            next();
        };
    },

    params: (...allowedKeys) => {
        return (req, res, next) => {
            const { params } = req;
            const sanitizedKey = Object.keys(params).filter((key) =>
                allowedKeys.includes(key)
            );
            const newParams = {};
            for (let key of sanitizedKey) {
                Object.assign(newParams, { [key]: params[key] });
            }
            req.params = newParams;
            next();
        };
    },
};