const mongoose = require("mongoose");
const SelectSchema =  mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required:true
  },
  context: {
    domain: { type: String, required: true },
    city: { type: String, required: true },
    bpp_id: { type: String, required: true },
    bpp_uri: { type: String, required: true },
    transaction_id: { type: String, required: true },
  },
  message: {
    order: {
      provider: {
        id: { type: String },
        locations: [{ items: { id: { type: String } } }],
      },
      items: [
        {
          id: { type: String },
          parent_item_id: { type: String },
          location_id: { type: String },
          fulfillment_id: { type: String },
          quantity: {
            count: { type: Number },
          },
          tags: [
            {
              items: {
                code: { type: String },
                list: [
                  {
                    items: {
                      code: { type: String },
                      value: { type: String },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
      fulfillments: [
        {
          items: {
            end: {
              location: {
                gps: { type: String },
                address: { area_code: { type: String } },
              },
            },
          },
        },
      ],
    },
  },selectdata:{
type: mongoose.Schema.Types.Mixed
  },
  ONDC_SELECT_CALL: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
});
module.exports= mongoose.model("select", SelectSchema);
