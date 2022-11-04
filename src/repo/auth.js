const postgreDb = require('../config/postgre.js');
const jwt = require("jsonwebtoken");
const JWTR = require("jwt-redis").default;
const bcrypt = require('bcrypt');
const client = require("../config/redis");


// Login Authentikasi
const login = (body) => {
    return new Promise((resolve, reject) => {
        const { email, passwords } = body;
        const jwtr = new JWTR(client);
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
                // jwt.sign(
                //     payload,
                //     process.env.SECRET_KEY,
                //     {
                //         expiresIn: "1d",
                //         issuer: process.env.ISSUER,
                //     },
                //     (err, token) => {
                //         if (err) {
                //             console.log(err);
                //             return reject({ err });
                //         }
                //         return resolve({ role: payload.role, token })
                //     }
                // )
                jwtr
                    .sign(payload, process.env.SECRET_KEY, {
                        expiresIn: "1d",
                        issuer: process.env.ISSUER,
                    })
                    .then((token) => {
                        // Token verification
                        return resolve({ role: payload.role, token });
                    });
            })
        })

    })
}


const logout = (token) => {
    return new Promise((resolve, reject) => {
        const jwtr = new JWTR(client);
        jwtr.destroy(token.jti).then((res) => {
            if (!res) reject(new Error("Login First"), statusCode);
            return resolve();
        });
    });
};




const authRepo = {
    login,
    logout,
};

module.exports = authRepo;