const transactionsRepo = require("../repo/transactions");
const sendResponse = require("../helper/response.js")


/* =================================================================== */


const get = async (req, res) => {
    try {
        const response = await transactionsRepo.getALL()
        sendResponse.success(res, 200, response.rows)
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const history = async (req, res) => {
    try {
        const response = await transactionsRepo.historyTransactions(req.query, req.userPayload.user_id)
        // console.log(response);
        sendResponse.success(res, 200, response)
    } catch (err) {
        console.log(err);
        sendResponse.error(res, 500, err.message)
    }
}

const create = async (req, res) => {
    try {
      const result = await transactionsRepo.createTransactions(
        req.body,
        req.userPayload.user_id
      );
      sendResponse.success(res, 200, {
        msg: "Create data success",
        data: result
      });
    } catch (err) {
      sendResponse.error(res, 500, "Internal Server Error");
    }
  };


const edit = async (req, res) => {
    try {
        await transactionsRepo.editTransactions(req.body, req.params)
        sendResponse.success(res, 200, {
            data: "Update data success"
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}


const drop = async (req, res) => {
    try {
        await transactionsRepo.dropTransactions(req.params)
        sendResponse.success(res, 200, {
            data: "Delete data success"
        })
    } catch (err) {
        sendResponse.error(res, 500, "Internal Server Error")
    }
}

const getStatus = async (req, res) => {
    try {
      const response = await transactionsRepo.getByStatus();
      sendResponse.success(res, 200, response.rows);
    } catch (err) {
      sendResponse.error(res, 500, "internal server error");
    }
  };
  
  const patchStatus = async (req, res) => {
    try {
      const { status, id } = req.params;
      const response = await transactionsRepo.statusApprove(status, id);
      sendResponse.success(res, 200, `your transactions ${status}`);
    } catch (err) {
      sendResponse.error(res, 500, "internal server error");
    }
  };



const transactionsController = {
    get,
    history,
    create,
    edit,
    drop,
    getStatus,
    patchStatus
}

module.exports = transactionsController;