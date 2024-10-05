const Confirm =require( "../../Schema/Confirm.js");
const SelectData =require( "../../Schema/Select.js");
const Initialization =require( "../../Schema/Initialization.js");

const InitRES = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (
      !message ||
      !context ||
      !context.transaction_id ||
      !context.message_id
    ) {
      return res
        .status(400)
        .json({ error: "Invalid request format. Missing message or context details." });
    }
    const response = {
      message,
      context: {
        transaction_id: context.transaction_id,
        message_id: context.message_id,
        bpp_uri: context.bpp_uri,
        bpp_id: context.bpp_id,
        domain: context.domain,
        city: context.city,
      },
    };

    const selectData = await SelectData.findOne({
      'context.transaction_id': context.transaction_id,
    });

    if (selectData) {
      const initData = await Initialization.findOne({ select: selectData._id });

      if (initData) {
        try {
          const responseOrder = response.message.order;

          const onInitData = new Confirm({
            initialization: initData._id,
            quote: responseOrder.quote,
            payment: responseOrder.payment,
            tags: responseOrder.tags,
            transaction_id:context.transaction_id,
            initdata:message
          });

          await onInitData.save();

          initData.ONDC_INIT_CALL = true;
          await initData.save(); 

          await selectData.save();

          return res.status(200).json({ message: "Ack" });
        } catch (error) {
          console.error("Error saving OnInit data:", error);
          return res.status(500).json({
            error: "An error occurred while saving OnInit data.",
            details: error.message,
          });
        }
      } else {
        return res.status(404).json({
          error: "Init data not found for the given select data.",
        });
      }
    } else {
      return res.status(404).json({
        error: "Select data not found for the given transaction ID.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while processing the request.",
      details: error.message,
    });
  }
};

module.exports = InitRES;
