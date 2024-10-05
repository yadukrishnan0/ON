const dotenv =require("dotenv");
dotenv.config();
const context = {
  domain: "ONDC:RET12",
  action: "search",
  country: "IND",
  city: "std:080",
  core_version: "1.2.0",
  bap_id: process.env.BAP_ID,
  bap_uri: process.env.BAP_URL,
  transaction_id: "T123",
  message_id: "M133",
  timestamp: "2023-06-03T08:00:00.000Z",
  ttl: "PT30S",
};
module.exports= context;
