const postgreDb = require("../config/postgre");     //koneksi database
const bcrypt = require("bcrypt");       // koneksi hash password

/* =================================================================================== */

// Get => Menampilkan semua data dalam tabel users
const getUser = () => {
    return new Promise((resolve, reject) => {
        const query = "select * from users order by id asc";
        postgreDb.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    });
};


// GetId => Menampilkan data berdasarkan id users yang dicari
const getUserId = (params) => {
    return new Promise((resolve, reject) => {
        const query = "select * from users where id = $1";
        postgreDb.query(query, [params.id], (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    });
};


// Create => Input data dalam body kedalam database
const register = (body) => {
    return new Promise((resolve, reject) => {
        const query = "insert into users (email, passwords, phone_number) values ($1,$2,$3) returning id, email";
        const { email, passwords, phone_number } = body;
        // Hash Password 
        bcrypt.hash(passwords, 10, (err, hashedPasswords) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            postgreDb.query(
                query,
                [email, hashedPasswords, phone_number],
                (err, queryResult) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    resolve(queryResult);
                });
        })
    });
};


// Edit Only Password
const editPasswords = (body) => {
    return new Promise((resolve, reject) => {
        const { old_password, new_password, user_id, phone_number } = body;

        const getPwdQuery = "select passwords from users where id = $1";
        const getPwdValues = [user_id];
        postgreDb.query(getPwdQuery, getPwdValues, (err, response) => {
            if (err) {
                console.log(err);
                return reject({ err });
            }
            const hashedPassword = response.rows[0].passwords;
            bcrypt.compare(old_password, hashedPassword, (err, isSame) => {
                if (err) {
                    console.log(err);
                    return reject({ err });
                }
                if (!isSame)
                    return reject({
                        err: new Error("Old Password is Wrong!"),
                        statusCode: 403,
                    });
                bcrypt.hash(new_password, 10, (err, newHashedPassword) => {
                    if (err) {
                        console.log(err);
                        return reject({ err });
                    }
                    const editPwdQuery = "update users set passwords = $1 where id = $2";
                    const editPwdValues = [newHashedPassword, user_id];
                    postgreDb.query(editPwdQuery, editPwdValues, (err, response) => {
                        if (err) {
                            console.log(err);
                            return reject({ err });
                        }
                        return resolve(response);
                    }
                    );
                });
            });
        });

        // const update_phone = `update users set phone_number = $1 where id = $2`
        // const editPhone = [phone_number, user_id];
        // postgreDb.query(update_phone, editPhone, (err, response) => {
        //     if (err) {
        //         console.log(err);
        //         return reject({ err });
        //     }
        //     if (phone_number == null) {
        //         return resolve(response);
        //     }
        // })

    });
};


// Nama function di atas di bungkus menjadi object
const userRepo = {
    getUser,
    getUserId,
    register,
    editPasswords,
    // editUser,
    // deleteUser

}

module.exports = userRepo;