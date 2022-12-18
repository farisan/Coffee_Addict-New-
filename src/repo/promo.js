const postgreDb = require("../config/postgre")



const get = () => {
    return new Promise((resolve, reject) => {
        const query = "select promo.*, product.name, product.category, product.size, product.price, product.stock from promo inner join product on product.id = promo.product_id";
        postgreDb.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    });
}


const getid = (params) => {
    return new Promise((resolve, reject) => {
        const query = "select product.name, promo.*  from promo inner join product on promo.product_id = product.id where promo.id = $1";
        postgreDb.query(query, [params.id], (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    });
};

const searchPromo = (queryparams) => {
    return new Promise((resolve, reject) => {
      const { code, product_id } = queryparams;
      let query = `select promo.id, promo.product_id, product.name, promo.* from promo inner join product on product.id = promo.product_id where product.id = $1`;
      if (code) {
        query += ` and lower(promo.code) = lower('${code}') `;
      }
      postgreDb.query(query, [product_id], (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  };

  const create = (body,file) => {
    return new Promise((resolve, reject) => {
        const query = "insert into promo ( product_id, code, discount, valid,image,hex_color) values ($1,$2,$3,$4,$5,$6) returning *"
        const { product_id, code, discount, valid , color} = body;
        postgreDb.query(
            query, [product_id, code, discount, valid, file, color], (err, queryResult) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(queryResult);
            })
    })
}


const edit = (body, params) => {
    return new Promise((resolve, reject) => {
        let query = "update promo set "
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
}

const drop = (params) => {
    return new Promise((resolve, reject) => {
        const query = "delete from promo where id = $1";
        postgreDb.query(query, [params.id], (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    });
}


const promoRepo = {
    get,
    getid,
    searchPromo,
    create,
    edit,
    drop
}

module.exports = promoRepo;

