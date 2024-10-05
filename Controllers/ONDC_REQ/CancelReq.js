const { messageId } = require("../../config/unique.js");
const CONTEXT = require("../../ONDC_SCHEMA/search/CONTEXT.js");
const Confirm = require("../../Schema/Confirm.js");
const Select = require("../../Schema/Select.js");
const User = require("../../Schema/User.js");
const orderCancelIds = require("../../config/OrderCancelId.js");
const {
  createAuthorizationHeader,
} = require("../../ONDC_Middleware/req/index.js");
const ONDC_DOMAIN = require("../../URl/Domain.js");
const Status = require("../../Schema/Status.js");
const AxiosRequest = require("../../AXIOS/index.js");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CancelReq = async (req, res) => {
  const { transaction_id, user_id, order_id, cancellation_reason_id } =
    req.body;

  // Validate required fields
  if (!transaction_id || !order_id || !cancellation_reason_id || !user_id) {
    return res.status(400).send({
      Nack: {
        message:
          "transaction_id, user_id, order_id, and cancellation_reason_id are required to cancel the order.",
      },
    });
  }

  // Check if user exists
  const userobj = await User.findById(user_id);
  if (!userobj) {
    return res.status(400).send({
      Nack: { message: "Invalid user_id" },
    });
  }

  // Validate cancellation_reason_id
  if (!orderCancelIds.includes(cancellation_reason_id)) {
    return res.status(400).send({
      Nack: { message: "Invalid cancellation_reason_id" },
    });
  }

  // Find the related select object
  const selectobj = await Select.findOne({
    "context.transaction_id": transaction_id,
    user: user_id,
  });

  if (!selectobj) {
    return res.status(400).send({
      Nack: { message: "Select data not found" },
    });
  }

  // Find the confirmation data
  const confirmdata = await Confirm.findOne({
    transaction_id: transaction_id,
  }).lean();
  if (!confirmdata) {
    return res.status(400).send({
      Nack: { message: "Confirmation data not found" },
    });
  }

  // Build the context object
  const isoTimestamp = new Date().toISOString();
  const context = {
    ...CONTEXT,
    message_id: messageId,
    transaction_id: selectobj.context.transaction_id,
    timestamp: isoTimestamp,
    domain: selectobj.context.domain,
    city: selectobj.context.city,
    bpp_id: selectobj.context.bpp_id,
    bpp_uri: selectobj.context.bpp_uri,
  };

  // Build the message for cancellation
  const message = {
    order_id: order_id,
    cancellation_reason_id: cancellation_reason_id,
  };

  const reqSetPayload = { message, context };
  const authorizationHeader = await createAuthorizationHeader(reqSetPayload);

  const response = await AxiosRequest(
    selectobj.context.bpp_uri,
    ONDC_DOMAIN.CANCEL,
    reqSetPayload,
    authorizationHeader
  );

  if (response) {
    await delay(3000);
    const statusdata = await Status.findOne({
      transaction_id: transaction_id,
      confirm: confirmdata._id,
    }).lean();
    if (statusdata) {
      return res.status(200).send({
        Ack: { message: "Order cancelled successfully", statusdata },
      });
    }
  } else {
    return res.status(400).send({
      Nack: { message: "Failed to cancel the order" },
    });
  }
};

module.exports = CancelReq;
