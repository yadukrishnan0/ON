const mongoose = require("mongoose");


const InitSchema =  mongoose.Schema(
  {
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
    },
    select:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "select",
    },
    ONDC_INIT_CALL: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
      initdata:{
        type: mongoose.Schema.Types.ObjectId,
      },
    
    transaction_id: { type: String, required: true},
  },
  { timestamps: true }
);

// Rename the model to avoid conflict
const Initialization = mongoose.model("initialization", InitSchema);

module.exports = Initialization;
