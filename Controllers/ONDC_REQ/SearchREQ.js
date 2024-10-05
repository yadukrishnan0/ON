const CONTEXT =require( "../../ONDC_SCHEMA/search/CONTEXT.js");
const { createAuthorizationHeader } =require( "../../ONDC_Middleware/req/index.js");
const AxiosRequest =require( "../../AXIOS/index.js");
const URL =require( "../../URl/PreprodOndc.js");
const ONDC_DOMAIN =require( "../../URl/Domain.js");
const { isoTimestamp, messageId, transactionId } =require( "../../config/unique.js");
// const GetSearch =require( "../../Storage/StorageGet.js";
const GetSearchDB =require( "../../Storage/SearchGetDb.js");
const createSearchMessage =require( "../../ONDC_SCHEMA/search/Search.js");
const VALID_DOMAINS =require( "../../config/OndcContextDomain.js");
const VALID_CITY =require( "../../config/ONDCCONTEXTCITY.js");
const SearchInLocal =require( "../../Storage/SearchInLocal.js");
const DEFAULT_DOMAIN = "ONDC:RET12";

const SearchREQ = async (req, res) => {
  const {
    lat_long,
    name,
    start_date,
    end_date,
    category_id,
    area_code,
    searchType,
    domain: requestedDomain,
    city,
    cityCode,
  } = req.body;
  // Validate city and city code
  const cityObj = city
    ? VALID_CITY.find((ct) => ct.City === city)
    : VALID_CITY.find((ct) => ct.Code === cityCode);
  if (!cityObj) {
    return res
      .status(400)
      .json({
        message: {
          NACK: { error: "Either valid city or city code is required." },
        },
      });
  }

  const city_code = cityObj.Code;
  // Attempt local search first
  try {
    let localresult = await SearchInLocal(
      searchType,
      city_code,
      requestedDomain,
      category_id,
      area_code
    );
    if (localresult && localresult.length > 0) {
      return res
        .status(200)
        .json({ message: { ACK: localresult, LocalResult: true } });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        message: {
          NACK: { error: "Local search failed.", details: error.message },
        },
      });
  }

  // Validate domain
  const domainValue =
    requestedDomain && VALID_DOMAINS[requestedDomain]
      ? VALID_DOMAINS[requestedDomain]
      : DEFAULT_DOMAIN;

  // Create search message
  let message;
  try {
    message = createSearchMessage({
      lat_long,
      name,
      start_date,
      end_date,
      category_id,
      area_code,
      searchType,
    });
  } catch (error) {
    return res
      .status(400)
      .json({
        message: {
          NACK: {
            error: "Failed to create search message.",
            details: error.message,
          },
        },
      });
  }

  // Build the context
  const context = {
    ...CONTEXT,
    message_id: messageId,
    transaction_id: transactionId,
    action: "search",
    timestamp: isoTimestamp,
    domain: domainValue,
    city: city_code,
  };

  const ReqsetPayload = { context, message };

  try {
    const authorizationHeader = await createAuthorizationHeader(ReqsetPayload);
    const response = await AxiosRequest(
      URL,
      ONDC_DOMAIN.SEARCH,
      ReqsetPayload,
      authorizationHeader
    );

    if (response) {
      const result = await GetSearchDB(context.transaction_id);
      return res.status(200).json({ message: { ACK: result } }); 
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
