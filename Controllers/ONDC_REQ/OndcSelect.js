const { messageId, isoTimestamp } =require( "../../config/unique.js");
const { createAuthorizationHeader } =require( "../../ONDC_Middleware/req/index.js");
const AxiosRequest =require( "../../AXIOS/index.js");
const ONDC_DOMAIN =require( "../../URl/Domain.js");
const Select =require( "../../Schema/Select.js");
const CONTEXT =require( "../../ONDC_SCHEMA/search/CONTEXT.js");
const mongoose =require( "mongoose");
const User =require( "../../Schema/User.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const OndcSelectReq = async (req, res) => {
  const { transaction_id ,user_id} = req.body;
  
// Validate presence of transaction_id and user_id
if (!transaction_id || !user_id) {
  return res.status(400).send({
    Nack: { message: "transaction_id and user_id are required for all ONDC processes" },
  });
}
const userobj =await User.findById(user_id);
  if (!userobj) {
    return res.status(400).send({ message: "Invalid user_id, user not found" });
  }
// Fetch the selected item by user or transaction_id
const selectobj = await Select.findOne({ user: userobj._id,"context.transaction_id":transaction_id});

if (!selectobj) {
  return res.status(400).send({ Nack: { message: "No item selected for the user" } });
}

// Validate transaction_id
if (selectobj.context.transaction_id !== transaction_id) {
  return res.status(400).send({ Nack: { message: "Invalid transaction_id" } });
}
  // Build the context
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

  if (!selectobj.ONDC_SELECT_CALL) {
    context.action = "select";
    const ReqsetPayload = {
      context: context,
      message: selectobj.message,
    };

    try {
      const authorizationHeader = await createAuthorizationHeader(
        ReqsetPayload
      );
      const response = await AxiosRequest(
        selectobj.context.bpp_uri,
        ONDC_DOMAIN.SELECT,
        ReqsetPayload,
        authorizationHeader
      );

      await delay(3000);
      const selectnewData = await Select.findOne({
        "context.transaction_id": transaction_id,
      });
      return res.status(response.status).json(selectnewData);
    } catch (error) {
      return res.status(500).json({
        message: {
          NACK: {
            error: "An error occurred while processing the request.",
            details: error.message,
          },
        },
      });
    }
  } else {
    return res.status(500).json({
      message: {
        NACK: {
          error: "You have already completed this action.",
        },
      },
    });
  }
};

module.exports = OndcSelectReq;
