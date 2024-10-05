const mongoose = require("mongoose");

const AddressSchema=mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    billing: {
        address: {
          building: { type: String },
          city: { type: String },
          state: { type: String },
          country: { type: String },
          area_code: { type: String },
          locality: { type: String },
          name: { type: String },
        },
        phone: { type: String },
        name: { type: String },
        email: { type: String },
        created_at: { type: Date },
        updated_at: { type: Date },
      },fulfillments: [
        {
          id: { type: String },
          type: { type: String },
          end: {
            contact: {
              email: { type: String },
              phone: { type: String },
            },
            location: {
              gps: { type: String },
              address: {
                building: { type: String },
                city: { type: String },
                state: { type: String },
                country: { type: String },
                area_code: { type: String },
                locality: { type: String },
                name: { type: String },
              },
            },
          },
        },
      ],
})


const Address= mongoose.model("address", AddressSchema); 
module.exports= Address;
