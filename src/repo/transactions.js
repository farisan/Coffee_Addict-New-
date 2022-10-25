const postgreDb = require("../config/postgre.js")


const getALL = () => {
    return new Promise((resolve, reject) => {
        const query = "select users.email, product.name, promo.code, delivery.method, transactions.qty, transactions.tax, transactions.total, transactions.status from transactions inner join users on transactions.user_id = users.id inner join product on transactions.product_id = product.id full join promo on promo.id = transactions.promo_id inner join delivery on delivery.id = transactions.delivery_id where transactions.user_id = users.id order by transactions.id asc";
        postgreDb.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    });
}

// const historyTransactions = (token) => {
//     return new Promise((resolve, reject) => {
//         let query = "select users.email, product.name, transactions.total, transactions.status from transactions inner join users on users.id = transactions.user_id inner join product on product.id = transactions.product_id where users.id = $1";


//         postgreDb.query(query, [token], (err, result) => {
//             if (err) {
//                 console.log(err);
//                 return reject(err);
//             }
//             return resolve(result);
//         });

//     })
// }

const historyTransactions = (queryparams, token) => {
    return new Promise((resolve, reject) => {


        let query = "select users.email, product.name, transactions.total, transactions.status from transactions inner join users on users.id = transactions.user_id inner join product on product.id = transactions.product_id where users.id = $1";

        let queryLimit = "";
        let link = `http://localhost:6060/coffee/transactions/?`


        let values = [token];
        if (queryparams.page && queryparams.limit) {
            let page = parseInt(queryparams.page);
            let limit = parseInt(queryparams.limit);
            let offset = (page - 1) * limit;
            queryLimit = query + ` limit $2 offset $3`;
            values.push(limit, offset);
        } else {
            queryLimit = query;
        }


        console.log(queryLimit);
        postgreDb.query(query, [token], (err, result) => {
            postgreDb.query(queryLimit, values, (err, queryresult) => {
                console.log(queryresult);
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                console.log(queryresult);
                console.log(queryLimit);
                if (queryresult.rows.length == 0) return reject(new Error("History Not Found"))
                let resNext = null;
                let resPrev = null;
                if (queryparams.page && queryparams.limit) {
                    let page = parseInt(queryparams.page);
                    let limit = parseInt(queryparams.limit);
                    let start = (page - 1) * limit;
                    let end = page * limit;
                    let next = "";
                    let prev = "";
                    const dataNext = Math.ceil(result.rowCount / limit);
                    if (start <= result.rowCount) {
                        next = page + 1;
                    }
                    if (end > 0) {
                        prev = page - 1;
                    }
                    if (parseInt(next) <= parseInt(dataNext)) {
                        resNext = `${link}page=${next}&limit=${limit}`;
                    }
                    if (parseInt(prev) !== 0) {
                        resPrev = `${link}page=${prev}&limit=${limit}`;
                    }
                    let sendResponse = {
                        dataCount: result.rowCount,
                        next: resNext,
                        prev: resPrev,
                        totalPage: Math.ceil(result.rowCount / limit),
                        data: result.rows,
                    };
                    return resolve(sendResponse)
                }
                let sendResponse = {
                    dataCount: result.rowCount,
                    next: resNext,
                    prev: resPrev,
                    totalPage: null,
                    data: result.rows,
                }
                return resolve(sendResponse)
            })
        });
    })
}

const createTransactions = (body) => {
    return new Promise((resolve, reject) => {
        const query = "insert into transactions (user_id, product_id, promo_id, delivery_id, method_payment, qty, tax, total, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)"
        const { user_id, product_id, promo_id, delivery_id, method_payment, qty, tax, total, status } = body;
        postgreDb.query(
            query, [user_id, product_id, promo_id, delivery_id, method_payment, qty, tax, total, status], (err, queryResult) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(queryResult);
            }
        )
    })
}

const editTransactions = (body, params) => {
    return new Promise((resolve, reject) => {
        let query = "update transactions set "
        const values = [];
        // menggunakan perulangan untuk dapat melakukan pengubahan semua data pada table product
        Object.keys(body).forEach((key, idx, array) => {
            if (idx === array.length - 1) {
                query += `${key} = $${idx + 1} where id = $${idx + 2}`;
                values.push(body[key], params.id);
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
};

const dropTransactions = (params) => {
    return new Promise((resolve, reject) => {
        const query = "delete from transactions where id = $1";
        postgreDb.query(query, [params.id], (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    });
};

const transactionsRepo = {
    getALL,
    historyTransactions,
    createTransactions,
    editTransactions,
    dropTransactions
}

module.exports = transactionsRepo;