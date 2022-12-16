const postgreDb = require("../config/postgre")


// Get all
const search = (queryparams, hostAPI) => {
    return new Promise((resolve, reject) => {


        let query = "select * from product ";

        let queryLimit = "";
        let link = `${hostAPI}/coffee/product?`


        // Search name product
        if (queryparams.name_product) {
            query += `where lower(name) like lower('%${queryparams.name_product}%')`
            link += `name_product=${queryparams.name_product}&`
        }

        // Filter category
        if (queryparams.category) {
            if (queryparams.name_product) {
                query += `and lower(category) like lower('${queryparams.category}')`;
                link += `category=${queryparams.category}&`
            } else {
                query += `where lower(category) like lower('${queryparams.category}')`;
                link += `category=${queryparams.category}&`
            }
        }

        if (queryparams.sorting == "cheapest") {
            query += "order by price asc";
            link += `sorting=${queryparams.sorting}&`
        }
        if (queryparams.sorting == "expensive") {
            query += "order by price desc";
            link += `sorting=${queryparams.sorting}&`
        }
        if (queryparams.sorting == "newest") {
            query += "order by create_at asc";
            link += `sorting=${queryparams.sorting}&`
        }
        if (queryparams.sorting == "lates") {
            query += "order by create_at desc";
            link += `sorting=${queryparams.sorting}&`
        }
        if (queryparams.sorting == "favorite") {
            query = "select pr.*, COALESCE(sum(tr.qty),0) as sold from product pr left join transactions tr on pr.id = tr.product_id GROUP BY pr.id ORDER by sold desc";
            link += `sorting=${queryparams.sorting}&`
        }


        // const page = Number(queryparams.page);
        // const limit = Number(queryparams.limit);
        // const offset = (page - 1) * limit;
        // query += ` limit ${limit} offset ${offset}`;

        let values = [];
        if (queryparams.page && queryparams.limit) {
            let page = parseInt(queryparams.page);
            let limit = parseInt(queryparams.limit);
            let offset = (page - 1) * limit;
            queryLimit = query + ` limit $1 offset $2`;
            values.push(limit, offset);
        } else {
            queryLimit = query;
        }



        postgreDb.query(query, (err, result) => {
            postgreDb.query(queryLimit, values, (err, queryresult) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                if (queryresult.rows.length == 0) return reject(new Error("Product Not Found"))
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
                    console.log(queryresult);
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
                        data: queryresult.rows,
                    };
                    return resolve(sendResponse)
                }
                let sendResponse = {
                    dataCount: result.rowCount,
                    next: resNext,
                    prev: resPrev,
                    totalPage: null,
                    data: queryresult.rows,
                }
                return resolve(sendResponse)
            })
        });
    })
}

const getid = (params) => {
    return new Promise((resolve, reject) => {
        const query = "select * from product where id = $1";
        postgreDb.query(query, [params.id], (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    });
};

const create = (body, file) => {
    return new Promise((resolve, reject) => {
        const query = "insert into product (name, category, size, price, stock, image, description) values ($1,$2,$3,$4,$5,$6,$7) returning *"
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
                query += `${key} = $${idx + 1} where id = $${idx + 2} returning *`;
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
        const query = "delete from product where id = $1 returning *";
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
    getid,
    create,
    edit,
    drop,
}

module.exports = productRepo;