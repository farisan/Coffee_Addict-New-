const postgreDb = require("../config/postgre")


// filter category product
const filter = (queryparams) => {
    return new Promise((resolve, reject) => {
        let query = "select * from product "

        const values = []
        const whereparams = ["category"]
        // const whereparams = Object.key(queryparams).filter((key) =>
        //     ["category_name"].includes(key)
        // );
        if (whereparams.length > 0) query += "where ";
        whereparams.forEach((key) => {
            query += `lower(${key}) like lower('%' || $${values.length + 1} || '%')`;
            values.push(String(queryparams[key]))
        });
        // limit & offset untuk pagination
        const page = Number(queryparams.page);
        const limit = Number(queryparams.limit);
        const offset = (page - 1) * limit;
        query += `limit $${values.length + 1} offset $${values.length + 2}`;
        values.push(limit, offset);
        postgreDb.query(query, values, (err, result) => {
            if (err) {
                console.log(err);
                return reject(err)
            }
            return resolve(result)
        })
    })
}

// belum ditambahkan berdasarkan favorit (qty)
const search = (queryparams) => {
    return new Promise((resolve, reject) => {
        let query = "select * from product ";

        if (queryparams.name_product) {
            query += `where lower(name) like lower('%${queryparams.name_product}%')`
        }

        if (queryparams.sorting == "low price") {
            query += "order by price asc";
        }
        if (queryparams.sorting == "hight price") {
            query += "order by price desc";
        }
        if (queryparams.sorting == "low date") {
            query += "order by create_at asc";
        }
        if (queryparams.sorting == "hight date") {
            query += "order by create_at desc";
        }
        if (queryparams.sorting == "favorite") {
            query = "select product.*, transactions.qty from product inner join transactions on transactions.product_id = product.id order by transactions.qty desc";
        }

        postgreDb.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    })
}

const create = (body, file) => {
    return new Promise((resolve, reject) => {
        const query = "insert into product (name, category, size, price, stock, image, description) values ($1,$2,$3,$4,$5,$6,$7)"
        const { name, category, size, price, stock, description } = body;
        postgreDb.query(
            query, [name, category, size, price, stock, file, description], (err, queryResult) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(queryResult);
            }
        )
    })
}

const edit = (body, params) => {
    return new Promise((resolve, reject) => {
        let query = "update product set "
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

const drop = (params) => {
    return new Promise((resolve, reject) => {
        const query = "delete from product where id = $1";
        postgreDb.query(query, [params.id], (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    });
};



const productRepo = {
    filter,
    search,
    create,
    edit,
    drop,
}

module.exports = productRepo;