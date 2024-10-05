const statusModel = require("../../Schema/Status");

const status = async (req, res) => {
  try {
    const { transaction_id, order_id } = req.body;

    if (!transaction_id && !order_id) {
      res.status(500).json({ message: "transaction_id ,order_id required" });
    } else {
      let query = transaction_id
        ? { transaction_id: transaction_id }
        : { order_id: order_id };
      const statusData = await statusModel.findOne(query);
      res.status(200).json({ message: "ok", statusData });
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};
