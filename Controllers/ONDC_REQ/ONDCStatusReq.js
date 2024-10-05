const AxiosRequest = require("../../AXIOS");
const { createAuthorizationHeader } = require("../../ONDC_Middleware/req");
const CONTEXT = require("../../ONDC_SCHEMA/search/CONTEXT");
const Status = require("../../Schema/Status.js");
const Confirm = require("../../Schema/Confirm.js");
const ONDC_DOMAIN = require("../../URl/Domain.js");
const { findObject, delay, isoTimestamp, messageId } = require("../../helpers/utils"); // Assuming these are helper functions

const ONDCStatusReq = async (req, res) => {
  const { transaction_id, order_id, user_id } = req.body;

  if (!transaction_id || !user_id) {
    return res.status(400).send({
      Nack: { message: "transaction_id and user_id are required for all ONDC processes." },
    });
  }

  try {
    // Fetch necessary objects based on transaction_id and user_id
    const { error, selectObj, initDataObj } = await findObject(transaction_id, user_id);

    // Check if Confirm object exists and ONDC_CONFIRM_CALL is true
    const confirmObj = await Confirm.findOne({ initialization: initDataObj._id });
    if (!confirmObj || !confirmObj.ONDC_CONFIRM_CALL) {
      return res.status(409).json({
        message: {
          NACK: {
            error: "Order confirmation not completed. Please confirm your order first.",
          },
        },
      });
    }

    // Create the context for ONDC status request
    const context = {
      ...CONTEXT,
      message_id: messageId,
      transaction_id: selectObj.context.transaction_id,
      timestamp: isoTimestamp,
      domain: selectObj.context.domain,
      city: selectObj.context.city,
      bpp_id: selectObj.context.bpp_id,
      bpp_uri: selectObj.context.bpp_uri,
    };

    // Create the message payload
    const message = {
      order_id: order_id,
    };

    const reqSetPayload = { message, context };

    // Generate the authorization header
    const authorizationHeader = await createAuthorizationHeader(reqSetPayload);

    // Make the ONDC status request
    const response = await AxiosRequest(
      selectObj.context.bpp_uri,
      ONDC_DOMAIN.STATUS,
      reqSetPayload,
      authorizationHeader
    );

    if (response) {
      // Introduce a delay if necessary (e.g., 3 seconds)
      await delay(3000);

      // Fetch and return the current status
      const status = await Status.findOne({ transaction_id }).lean();
      return res.status(200).json({ message: "Status retrieved", status });
    } else {
      return res.status(500).json({ Nack: { message: "ONDC status request failed." } });
    }

  } catch (error) {
    console.error("Error in ONDCStatusReq:", error);
    return res.status(500).send({ Nack: { message: "Server error occurred", details: error.message } });
  }
};

module.exports = ONDCStatusReq;
