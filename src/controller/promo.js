const promoRepo = require("../repo/promo");
const sendResponse = require("../helper/response.js");

/* ============================================================== */

// Menampilkan semua values yang ada pada table promo
const get = async (req, res) => {
  try {
    console.log(req.query);
    const response = await promoRepo.get(
      req.query,
    );
    sendResponse.success(res, 200, response.rows);
  } catch (err) {
    sendResponse.error(
      res,
      500,
      "Internal Server Error",
    );
  }
};

const getid = async (req, res) => {
  try {
    const response = await promoRepo.getid(
      req.params,
    );
    // console.log(response);
    sendResponse.success(res, 200, {
      data: response.rows,
    });
  } catch (err) {
    sendResponse.error(
      res,
      500,
      "Internal Server Error",
    );
  }
};

const search = async (req, res) => {
  try {
    console.log(req.query);
    const response = await promoRepo.searchPromo(
      req.query,
    );
    sendResponse.success(res, 200, response.rows);
  } catch (err) {
    sendResponse.error(
      res,
      500,
      "Internal Server Error",
    );
  }
};

const create = async (req, res) => {
  try {
    console.log(req.body);
    await promoRepo.create(
      req.body,
      req.file.secure_url,
    );
    sendResponse.success(res, 200, {
      msg: "Create Promo Success",
    });
  } catch (err) {
    sendResponse.error(
      res,
      500,
      "Internal Server Error",
    );
  }
};

// Edit Promo
const edit = async (req, res) => {
  try {
    if (req.file) {
      var image = `/${req.file.public_id}.${req.file.format}`; //ubah filename
      req.body.image = req.file.secure_url;
    }
    console.log(req.body);
    const result = await promoRepo.edit(
      req.body,
      req.params,
    );
    sendResponse.success(res, 200, {
      msg: "Edit Promo Success",
      data: result.rows,
      filename: image,
    });
  } catch (err) {
    sendResponse.error(
      res,
      500,
      "Internal Server Error",
    );
  }
};

// delete Promo
const drop = async (req, res) => {
  try {
    console.log(req.body);
    await promoRepo.drop(req.params);
    sendResponse.success(res, 200, {
      msg: "Delete Promo Success",
    });
  } catch (err) {
    sendResponse.error(
      res,
      500,
      "Internal Server Error",
    );
  }
};

const promoController = {
  get,
  getid,
  search,
  create,
  edit,
  drop,
};

module.exports = promoController;
