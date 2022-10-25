const postgreDb = require("../config/postgre");     //koneksi database
const bcrypt = require("bcrypt");       // koneksi hash password

/* =================================================================================== */

// Get => Menampilkan semua data dalam tabel users
const getUser = () => {
    return new Promise((resolve, reject) => {
        const query = "select users.email,users.passwords ,users.role ,users.phone_number , profile.displayname ,profile.firstname ,profile.lastname ,profile.gender ,profile.birthday ,profile.address ,profile.image, users.create_at ,users.update_at from users inner join profile on profile.users_id = users.id order by id asc";
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
const getUserId = (token) => {
    return new Promise((resolve, reject) => {
        const query = "select users.email,users.passwords ,users.role ,users.phone_number , profile.displayname ,profile.firstname ,profile.lastname ,profile.gender ,profile.birthday ,profile.address ,profile.image, users.create_at ,users.update_at from users inner join profile on profile.users_id = users.id where id = $1";
        postgreDb.query(query, [token], (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    });
};


// Register
const register = (body) => {
    return new Promise((resolve, reject) => {
        let query = `insert into users (email, passwords, phone_number) values ($1, $2, $3) returning id, email`;
        const { email, passwords, phone_number } = body;
        const validasiEmail = `select email from users where email like $1`;
        const validasiPhone = `select phone_number from users where phone_number like $1`;
        postgreDb.query(validasiEmail, [email], (err, resEmail) => {
            if (err) return reject(err);
            if (resEmail.rows.length > 0) {
                return reject(new Error("Email already used"));
            }
            postgreDb.query(validasiPhone, [phone_number], (err, resPhone) => {
                if (err) return reject(err);
                if (resPhone.rows.length > 0) {
                    return reject(new Error("Number already used"));
                }

                // Hash Password
                bcrypt.hash(passwords, 10, (err, hashedPasswords) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    postgreDb.query(
                        query,
                        [email, hashedPasswords, phone_number],
                        (err, response) => {
                            if (err) {
                                console.log(err);
                                return reject(err);
                            }
                            // untuk memasukan id dalam tabel users kedalam table profil
                            let getIDUsers = response.rows[0].id;
                            let load = {
                                email: response.rows[0].email,
                            };
                            let query1 = `insert into profile (users_id) values (${getIDUsers})`;
                            console.log(query1);
                            postgreDb.query(query1, (err, queryResult) => {
                                if (err) {
                                    return reject({ err });
                                }
                                resolve({ data: load.email, queryResult });
                            });
                        }
                    );
                });
            });
        });
    });
};

// Edit Only Password
const editPasswords = (body, token) => {
    return new Promise((resolve, reject) => {
        const { old_password, new_password } = body;
        const getPwdQuery = "select passwords from users where id = $1";
        const getPwdValues = [token];
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
                    const editPwdQuery =
                        "update users set passwords = $1 where id = $2";
                    const editPwdValues = [newHashedPassword, token];
                    postgreDb.query(
                        editPwdQuery,
                        editPwdValues,
                        (err, response) => {
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
    });
};


// edit profil 
const profile = (body, token) => {
    return new Promise((resolve, reject) => {
        let query = "update profile set "
        const values = [];
        Object.keys(body).forEach((key, idx, array) => {
            if (idx === array.length - 1) {
                query += `${key} = $${idx + 1} where users_id = $${idx + 2} returning *`;
                values.push(body[key], token);
                return;
            }
            query += `${key} = $${idx + 1},`;
            values.push(body[key]);
        });
        postgreDb
            .query(query, values)
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}


// delete users
const deleteUser = (token) => {
    return new Promise((resolve, reject) => {
        // let query = `delete from users where id = ($1) returning id, email`
        // delete tabel profil dahulu kemudian delete tabel users nya
        let query = `delete from profile where users_id = $1 returning users_id`
        postgreDb.query(
            query,
            [token],
            (err, response) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                let query1 = `delete from users where id = (${token})`
                console.log(response);
                postgreDb.query(query1, (err, result) => {
                    if (err) {
                        return reject({ err })
                    }
                    resolve(result);
                })
            });
    })
};



// Nama function di atas di bungkus menjadi object
const userRepo = {
    getUser,
    getUserId,
    register,
    editPasswords,
    profile,
    deleteUser

}

module.exports = userRepo;