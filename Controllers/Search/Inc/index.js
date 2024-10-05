const {createAuthorizationHeader}=require("../../../ONDC_Middleware/req/index.js");
const AxiosRequest=require("../../../AXIOS/index.js");
const Search_Transaction_id = require("../../../Unique/Search_Transcation_id.js");
const { v4: uuidv4 } = require("uuid");
const isoTimestamp = require("../../../Unique/Time.js");
const ONDC_DOMAIN=require("../../../Unique/ONDCDOMAIN.js")
const SearchREQ = async (req, res) => {
    const URL="https://preprod.gateway.ondc.org"
    const messageId = uuidv4();
  const {
    city_code,
    start_time,
    end_time
  } = req.body;
  if (!city_code) {
    return res
      .status(400)
      .json({
        message: {
          NACK: { error: "city code is required." },
        },
      });
  }

  const ReqsetPayload={
    "context": {
      "domain": "ONDC:RET11",
      "action": "search",
      "country": "IND",
      "city":city_code,
      "core_version": "1.2.0",
      "bap_id": "ondc.eatiko.com",
      "bap_uri": "https://ondc.eatiko.com/ondc-PREPROD",
      "transaction_id": Search_Transaction_id(city_code,"full"),
      "message_id": messageId,
      "timestamp": isoTimestamp,
      "ttl": "PT30S"
    },
    "message": {
      "intent": {
        "payment": {
          "@ondc/org/buyer_app_finder_fee_type": "percent",
          "@ondc/org/buyer_app_finder_fee_amount": "3"
        },
        "tags":
        [
          {
            "code":"catalog_inc",
            "list":
            [
              {
                "code":"start_time",
                "value":start_time
              },
              {
                "code":"end_time",
                "value":end_time
              }
            ]
          }
        ]
      }
    }
  }


  try {
    const authorizationHeader = await createAuthorizationHeader(ReqsetPayload);
    const response = await AxiosRequest(
      URL,
      ONDC_DOMAIN.SEARCH,
      ReqsetPayload,
      authorizationHeader
    );

    if (response) {
      
      return res.status(200).json({ message: { ACK: response.data } }); 
    } else {
      return res
        .status(500)
        .json({
          message: {
            NACK: {
              error: "No response received from the ONDC search service.",
            },
          },
        });
    }
  } catch (error) {
    console.error("Error in SearchREQ:", error);
    return res
      .status(500)
      .json({
        message: {
          NACK: {
            error: "An error occurred while processing the request.",
            details: error.message,
          },
        },
      });
  }
};

module.exports = SearchREQ;
