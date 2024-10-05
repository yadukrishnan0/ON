const mongoose = require("mongoose");


const ConfirmSchema =  mongoose.Schema({
  transaction_id: { type: String, required: true },
  initialization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "initialization", 
  },
  quote: {
    breakup: [
      {
        type: mongoose.Schema.Types.Mixed, 
      },
    ],
    price: {
      currency: { type: String },
      value: { type: Number }, 
    },
    ttl: { type: String },
  },
  payment: {
    method: { type: String },
    status: { type: String }, 
    amount: {
      currency: { type: String },
      value: { type: String }, 
    },
  },
  tags: [
    {
      type: mongoose.Schema.Types.Mixed, 
    },
  ],
  ONDC_CONFIRM_CALL: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
},{ timestamps: true });


const Confirm = mongoose.model("confirm", ConfirmSchema); 
module.exports= Confirm;
