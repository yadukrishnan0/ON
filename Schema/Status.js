const mongoose = require("mongoose");

const StatusSchema =  mongoose.Schema({
    confirm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "confirm",
    },
    state: {
        type: String, 
        required: true,
    },
    stateChanges: {
        type: Map, 
        of: String, 
        required: true,
    },
    createdAt: {
        type: Date, 
        default: Date.now,
    },order_id: { type: String,required:true },
    transaction_id: { type: String, required: true },
},{ timestamps: true });
module.exports= mongoose.model("status", StatusSchema);
