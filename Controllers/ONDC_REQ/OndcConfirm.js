const Initialization = require( "../../Schema/Initialization.js");
const Select = require( "../../Schema/Select.js");
const CONTEXT = require( "../../ONDC_SCHEMA/search/CONTEXT.js");
const generateID = require( "../../config/generateID.js");
const { messageId, isoTimestamp } =require( "../../config/unique.js");
const { createAuthorizationHeader } =require( "../../ONDC_Middleware/req/index.js");
const AxiosRequest =require( "../../AXIOS/index.js");
const ONDC_DOMAIN =require( "../../URl/Domain.js");
const Status = require( "../../Schema/Status.js");
const findObject = require( "./FindObject.js");
const Confirm = require("../../Schema/Confirm.js");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const OndcConfirmReq = async (req, res) => {
  const { transaction_id, user_id } = req.body;

  if (!transaction_id || !user_id) {
    return res.status(400).send({
      Nack: { message: "transaction_id and user_id are required for all ONDC processes." },
    });
  }

  try {
    const {error, selectObj, initDataObj } = await findObject(transaction_id, user_id);
    const confirmobj=await Confirm.findOne({initialization:initDataObj._id})
     // Check if ONDC_CONFIRM_CALL has already been made
     if (confirmobj&& confirmobj.ONDC_CONFIRM_CALL) {
      return res.status(409).json({
        message: {
          NACK: {
            error: "Action has already been completed.",
          },
        },
      });
      
    }
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

    const message = {
      order: {
        id: generateID(selectObj._id),
        state: "Created",
        billing: initDataObj.address.billing,
        items: selectObj.message.order.items,
        provider: selectObj.message.order.provider,
        fulfillments: initDataObj.address.fulfillments,
        payment: confirmobj.payment,
        quote: confirmobj.quote,
        created_at: isoTimestamp,
        updated_at: isoTimestamp,
      },
    };
console.log(message)
    const reqSetPayload = { message, context };
    const authorizationHeader = await createAuthorizationHeader(reqSetPayload);

    const response = await AxiosRequest(
      selectObj.context.bpp_uri,
      ONDC_DOMAIN.CONFIRM,
      reqSetPayload,
      authorizationHeader
    );

    if (response) {
      await delay(3000);  

      const status = await Status.findOne({ transaction_id }).lean();
      const confirmeddata=await Confirm.findById(status.confirm);
      status.Confirmdetails=confirmeddata;

      if (status) {
        return res.status(200).json({ status });
      } else {
        return res.status(404).send({ Nack: { message: "Status not found." } });
      }
    }
  } catch (error) {
    return res.status(500).send({ Nack: { message: "Internal server error", details: error.message } });
  }
};

module.exports = OndcConfirmReq;
