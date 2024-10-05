const SelectData =require( '../../Schema/Select.js')
const SelectRES = async (req, res) => {
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
        .json({
          error: "Invalid request format. Missing message or context details.",
        });
    }
    console.log(message)
    const response = {
      message,
      context: {
        transaction_id: context.transaction_id,
        message_id: context.message_id,
        bpp_uri:context.bpp_uri,
        bpp_id:context.bpp_id,
        domain:context.domain,
        city:context.city
      },
    };
    // SearchStorage.push(response);
    try {
      const selectData =await SelectData.findOne({'context.transaction_id':context.transaction_id});
      
      if (selectData) {
        selectData.message.order.items = selectData.message.order.items.map((itm) => {
          const matchingItem = response.message.order.items.find(itmresp => itm.id === itmresp.id);
          if (matchingItem) {
            itm.fulfillment_id = matchingItem.fulfillment_id;
          }
          return itm;
        });
        selectData.ONDC_SELECT_CALL=true;
        selectData.selectdata=message;
        // Save the updated data
        await selectData.save();
    }
    } catch (error) {
      console.error('Error saving data:', error);
    }
    return res.status(200).json({ message: "Ack" });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "An error occurred while processing the request.",
        details: error.message,
      });
  }
};

module.exports = SelectRES;
