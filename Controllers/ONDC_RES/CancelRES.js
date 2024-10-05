const Confirm = require("../../Schema/Confirm");
const Initialization = require("../../Schema/Initialization");
const Select = require("../../Schema/Select");
const Status = require("../../Schema/Status");
const { isoTimestamp } =require( "../../config/unique.js")

const CancelRES = async (req, res) => {
  const { message, context } = req.body;

  try {
    const selectObj = await Select.findOne({
      "context.transaction_id": context.transaction_id,
    });
    if (!selectObj) {
      return res
        .status(400)
        .send({ Nack: { message: "No item selected for the transaction." } });
    }

    const initObj = await Initialization.findOne({
      select: selectObj._id,
    });

    if (!initObj) {
      return res
        .status(400)
        .send({
          Nack: {
            message: "No initialization object found for the selection.",
          },
        });
    }

    const confirmObj = await Confirm.findOne({ initialization: initObj._id });

    if (!confirmObj) {
      return res
        .status(400)
        .send({
          Nack: {
            message: "No confirmation object found for the initialization.",
          },
        });
    }

    let statusObj = await Status.findOne({ confirm: confirmObj._id });

    if (statusObj) {
      statusObj.state = message.order.state;
      statusObj.stateChanges.set(message.order.state, isoTimestamp);
      await statusObj.save();
    } else {
      const newStatus = new Status({
        order_id: message.order.id,
        confirm: confirmObj._id,
        state: message.order.state,
        stateChanges: new Map([[message.order.state, isoTimestamp]]),
        transaction_id: context.transaction_id,
      });
      await newStatus.save();
    }
    return res.status(200).json({ message: "Ack" });
  } catch (error) {
    console.error("Error in StatusRES:", error);
    return res
      .status(500)
      .send({
        Nack: { message: "Server error occurred", details: error.message },
      });
  }
};
module.exports =CancelRES;