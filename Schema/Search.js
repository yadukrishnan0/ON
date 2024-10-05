const mongoose = require("mongoose");

const ItemSchema =  mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ["Delivery", "Self-Pickup","Delivery and Self-Pickup"], required: true },
});

const DescriptorSchema =  mongoose.Schema({
  name: { type: String },
  symbol: { type: String },
  short_desc: { type: String },
  long_desc: { type: String },
  images: [{ type: String }],
  tags: [
    {
      code: { type: String, enum: ["bpp_terms"] },
      list: [{ type: mongoose.Schema.Types.Mixed }], // Mixed type for flexibility
    },
  ],
});

const ProviderSchema =  mongoose.Schema({
  id: { type: String },
  time: { type: mongoose.Schema.Types.Mixed }, 
  fulfillments: { type: mongoose.Schema.Types.Mixed },
  descriptor: { type: DescriptorSchema }, 
  '@ondc/org/fssai_license_no': { type: String },
  ttl: { type: String }, 
  locations: { type: mongoose.Schema.Types.Mixed },
  categories: { type: mongoose.Schema.Types.Mixed },
  items: { type: mongoose.Schema.Types.Mixed },
  tags: { type: mongoose.Schema.Types.Mixed },
});

const SearchSchema =  mongoose.Schema(
  {
    context: {
      domain: { type: String, required: true },
      city: { type: String, required: true },
      bpp_id: { type: String, required: true },
      bpp_uri: { type: String, required: true },
      transaction_id: { type: String, required: true },
    },
    message: {
      catalog: {
        'bpp/fulfillments': [ItemSchema], 
        'bpp/descriptor': DescriptorSchema, 
        'bpp/providers': [ProviderSchema], 
      },
    },
    expiresAt: { type: Date, default: () => Date.now() + 15 * 60 * 1000 } 
  },
  { timestamps: true }
);
// Add a TTL index for automatic document deletion
SearchSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports= mongoose.model("search", SearchSchema);
