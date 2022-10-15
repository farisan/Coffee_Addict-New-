module.exports = {
    body: (...allowedKeys) => {
        return (req, res, next) => {
            const { body } = req;
            const sanitizedKey = Object.key(body).filter((key) => {
                allowedKeys.includes(key)
            });

            // Apakah jumlah key di body sesuai dengan jumlah di allowedKeys
            const newBody = {};
            for (let key of sanitizedKey) {
                Object.assign(newBody, { [key]: body[key] });
            }

            // jika newBody kosong, response 400 bad request
            // apakah setiap values sesuai dengan tipe data yang diinginkan
            req.body = newBody;
            next();
        }
    },
}