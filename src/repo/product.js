const postgreDb = require("../config/postgre")


// Get all
const search = (queryparams) => {
    return new Promise((resolve, reject) => {
        let query = "select product.*, promo.code, promo.discount from product full join promo on promo.product_id = product.id ";

        // Search name product
        if (queryparams.name_product) {
            query += `where lower(name) like lower('%${queryparams.name_product}%')`
        }

        // Filter category
        if (queryparams.category) {
            if (queryparams.name_product) {
                query += `and lower(category) like lower('${queryparams.category}')`;
            } else {
                query += `where lower(category) like lower('${queryparams.category}')`;
            }
        }

        if (queryparams.sorting == "cheapest") {
            query += "order by price asc";
        }
        if (queryparams.sorting == "expensive") {
            query += "order by price desc";
        }
        if (queryparams.sorting == "newest") {
            query += "order by create_at asc";
        }
        if (queryparams.sorting == "lates") {
            query += "order by create_at desc";
        }
        if (queryparams.sorting == "favorite") {
            query = "select product.*, transactions.qty from product inner join transactions on transactions.product_id = product.id order by transactions.qty desc";
        }


        const page = Number(queryparams.page);
        const limit = Number(queryparams.limit);
        const offset = (page - 1) * limit;
        query += ` limit ${limit} offset ${offset}`;

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
    search,
    create,
    edit,
    drop,
}

module.exports = productRepo;