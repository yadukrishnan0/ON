const  { messageId, isoTimestamp } =require("../../config/unique.js");
const  { createAuthorizationHeader } =require( "../../ONDC_Middleware/req/index.js");
const  AxiosRequest = require("../../AXIOS/index.js");
const  ONDC_DOMAIN = require("../../URl/Domain.js");
const  Select = require("../../Schema/Select.js");
const  Initialization = require("../../Schema/Initialization.js");
const  Confirm = require("../../Schema/Confirm.js");
const  mongoose =require( "mongoose");
const  CONTEXT =require("../../ONDC_SCHEMA/search/CONTEXT.js");
const  User = require("../../Schema/User.js");
const  Address = require("../../Schema/Address.js");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fetchSelectAndInit = async (transaction_id, user_id) => {
  
  const userobj =await User.findById(user_id);
  const selectobj = await Select.findOne({ user: user_id });

  if (!selectobj) {
    throw new Error("No item selected for the user.");
  }

  if (selectobj.context.transaction_id !== transaction_id) {
    throw new Error("Invalid transaction_id.");
  }

  if (!selectobj.ONDC_SELECT_CALL) {
    throw new Error("ONDC_SELECT_CALL must be completed first.");
  }

  const initobj = await Initialization.findOne({ select: selectobj._id });
  
  if (!initobj) {
    throw new Error("No init object found.");
  }

  if (initobj.transaction_id !== transaction_id) {
    throw new Error("Invalid transaction_id in init object.");
  }

  const initData = await Initialization.findById(initobj._id).lean();
const address=await Address.findById(initData.address)
initData.address=address;
  return { selectobj, initData  };
};

const OndcInitReq = async (req, res) => {
  const { transaction_id, user_id } = req.body;

  if (!transaction_id || !user_id) {
    return res.status(400).send({
      Nack: { message: "transaction_id and user_id are required for all ONDC processes." },
    });
  }

  try {
    // Fetch the selected and initialization objects
    const { selectobj, initData } = await fetchSelectAndInit(transaction_id, user_id);

    // Check if ONDC_INIT_CALL has already been made
    if (initData.ONDC_INIT_CALL) {
      return res.status(409).json({
        message: {
          NACK: {
            error: "The init action has already been completed.",
          },
        },
      });
    }

    // Prepare the context
    const context = {
      ...CONTEXT,
      message_id: messageId,
      transaction_id: selectobj.context.transaction_id,
      timestamp: isoTimestamp,
      domain: selectobj.context.domain,
      city: selectobj.context.city,
      bpp_id: selectobj.context.bpp_id,
      bpp_uri: selectobj.context.bpp_uri,
      action: "init",
    };

    // Prepare request payload
    const ReqsetPayload = {
      context,
      message: {
        order: {
          provider: selectobj.message.order.provider,
          items: selectobj.message.order.items,
          billing: initData.address.billing,
          fulfillments: initData.address.fulfillments,
        },
      },
    };

    // Create authorization header
    const authorizationHeader = await createAuthorizationHeader(ReqsetPayload);

    console.log("Request Payload:", ReqsetPayload);
    console.log("Authorization Header:", authorizationHeader);

    // Make the Axios request to the BPP
    const response = await AxiosRequest(
      selectobj.context.bpp_uri,
      ONDC_DOMAIN.INIT,
      ReqsetPayload,
      authorizationHeader
    );

    // Introduce a delay to wait for the response to process
    await delay(3000);

    try {
      // Fetch the confirmation data associated with the transaction
      const initnewData = await Confirm.findOne({ transaction_id: transaction_id }).lean()
      const init=await Initialization.findById(initnewData.initialization);
      initnewData.initialization=init;

      if (!initnewData) {
        return res.status(404).json({
          message: {
            NACK: {
              error: "No confirm data found for the provided transaction_id.",
            },
          },
        });
      }

      console.log("Fetched initnewData:", initnewData);
      return res.status(200).json(initnewData);
    } catch (error) {
      console.error("Error fetching Confirm data:", error);
      return res.status(500).json({
        message: {
          NACK: {
            error: "An error occurred while fetching confirm data.",
            details: error.message,
          },
        },
      });
    }

  } catch (error) {
    console.error("Error during ONDC Init Request:", error);
    return res.status(500).json({
      message: {
        NACK: {
          error: "An error occurred while processing the request.",
          details: error.message,
        },
      },
    });
  }
};

module.exports = OndcInitReq;
