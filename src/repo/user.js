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
      let query = `insert into users (email, passwords, phone_number, pinactivation, status) values ($1, $2, $3, $4, $5) returning id, email, pinactivation `;
      const { email, passwords, phone_number } = body;
      const validasiEmail = `select email from users where email like $1`;
      const validasiPhone = `select phone_number from users where phone_number like $1`;
      const status = "pending";
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}"); //harus ada @ dan .
      if (regex.test(body.email) === false) {
        return reject(new Error("format email was wrong"));
      }
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
            const pinActivation = Math.floor(Math.random() * 1000000);
            postgreDb.query(
              query,
              [email, hashedPasswords, phone_number, pinActivation, status],
              (err, response) => {
                if (err) {
                  console.log(err);
                  return reject(err);
                }
                // untuk memasukan id dalam tabel users kedalam table profil
                let getIDUsers = response.rows[0].id;
                let data = response.rows[0];
                let query1 = `insert into profile (users_id) values (${getIDUsers})`;
                console.log(query1);
                postgreDb.query(query1, (err, queryResult) => {
                  if (err) {
                    return reject({ err });
                  }
                  resolve({ data: data, queryResult });
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


const updateStatus = (pin) => {
    return new Promise((resolve, reject) => {
      const query =
        "update users set status = 'active' , pinactivation = null where pinactivation = $1";
      postgreDb.query(query, [pin], (err, response) => {
        if (err) {
          console.log(err);
          return reject({ err });
        }
        resolve({response})
      });
    });
};


const forgotPassword = (email) => {
    return new Promise((resolve, reject) => {
      const pinActivation = Math.floor(Math.random() * 1000000);
      const query = "select email from users where email = $1";
      postgreDb.query(query, [email], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ err });
        }
        if (result.rows.length === 0) {
          return reject({ err: new Error("email wrong"), statusCode: 404 });
        }
  
        const queryInsert =
          "update users set pinforgot = $1 where email = $2 returning pinforgot";
        postgreDb.query(queryInsert, [pinActivation, email], (err, response) => {
          if (err) {
            console.log(err);
            return reject({err});
          }
          return resolve({data:response.rows[0].pinforgot});
        });
      });
    });
  };
  
  const changeForgot = (otp, newPassword) => {
    return new Promise((resolve, reject) => {
      const query = "select pinforgot from users where pinforgot = $1";
      postgreDb.query(query, [otp], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ error });
        }
        if (result.rows.length === 0) {
          return reject({ err: new Error("otp was wrong"), statusCode: 404 });
        }
        bcrypt.hash(newPassword, 10, (error, hashedPassword) => {
          if (error) {
            console.log(error);
            return reject({ error });
          }
          const insetQuery =
            "update users set pinforgot = null,passwords = $1 where pinforgot = $2";
          postgreDb.query(insetQuery, [hashedPassword, otp], (error, result) => {
            if (error) {
              console.log(error);
              return reject(error);
            }
            return resolve(result);
          });
        });
      });
    });
  };



// Nama function di atas di bungkus menjadi object
const userRepo = {
    getUser,
    getUserId,
    register,
    editPasswords,
    profile,
    deleteUser,
    updateStatus,
    forgotPassword,
    changeForgot
}

module.exports = userRepo;