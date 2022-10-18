const postgreDb = require('../config/postgre.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Login Authentikasi
const login = (body) => {
    return new Promise((resolve, reject) => {
        const { email, passwords } = body;
        // 1. Cek apakah ada email yang sama di database ?
        const getPasswordsByEmailValues = "select id, email, passwords, role from users where email = $1"
        const getPasswordsEmailValues = [email];
        postgreDb.query(getPasswordsByEmailValues, getPasswordsEmailValues, (err, response) => {
            if (err) {
                console.log(err);
                return reject({ err });
            }
            if (response.rows.length === 0) return reject({ err: new Error("Email or Passwords is WRONG!"), statusCode: 401 })
            // 2. Cek apakah password yang di input sama dengan di database ?
            const hashedPasswords = response.rows[0].passwords       // <= Get passwords from database
            bcrypt.compare(passwords, hashedPasswords, (err, isSame) => {
                if (err) {
                    console.log(err);
                    return reject({ err });
                }
                if (!isSame) return reject({ err: new Error("Email or Passwords is WRONG!"), statusCode: 401 })

                // 3. Process Login => create jwt => return jwt to users
                const payload = {
                    user_id: response.rows[0].id,
                    email: response.rows[0].email,
                    role: response.rows[0].role
                }
                jwt.sign(
                    payload,
                    process.env.SECRET_KEY,
                    {
                        expiresIn: "5m",
                        issuer: process.env.ISSUER,
                    },
                    (err, token) => {
                        if (err) {
                            console.log(err);
                            return reject({ err });
                        }
                        return resolve({ role: payload.role, token })
                    }
                )
            })
        })

    })
}




const authRepo = {
    login,
};

module.exports = authRepo;