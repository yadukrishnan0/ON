const { isoTimestamp, messageId, transactionId } =require( "../../config/unique.js");
const VALID_DOMAINS =require( "../../config/OndcContextDomain.js");
const VALID_CITY =require( "../../config/ONDCCONTEXTCITY.js")
const DEFAULT_DOMAIN = "ONDC:RET12";
const BasicContext = (CONTEXT, city, cityCode,requestedDomain, bpp_id, bpp_uri) => {
  // Validate city and city code
  const cityObj = cityCode
    ? VALID_CITY.find((ct) => ct.Code === cityCode)
    : VALID_CITY.find((ct) => ct.City === city);
  if (!cityObj) {
    return res.status(400).json({
      message: {
        NACK: { error: "Either valid city or city code is required." },
      },
    });
  }
  const city_code = cityObj.Code;
  // Validate domain
  const domainValue =
    requestedDomain && VALID_DOMAINS[requestedDomain]
      ? VALID_DOMAINS[requestedDomain]
      : DEFAULT_DOMAIN;

  // Build the context
  const context = {
    ...CONTEXT,
    message_id: messageId,
    transaction_id: transactionId,
    action: "search",
    timestamp: isoTimestamp,
    domain: domainValue,
    city: city_code,
    bpp_id,
    bpp_uri,
  };
  return context;
};
module.exports = BasicContext;
