const  axios=require("axios");
const dotenv =require( "dotenv");

dotenv.config();

const AxiosRequest = async (ONDC_SEARCH_URL,ONDC_SEARCH_DOMAINS,requestPayload,authorizationHeader) => {
  try {
    const response = await axios.post(`${ONDC_SEARCH_URL}${ONDC_SEARCH_DOMAINS}`, requestPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorizationHeader,
        "X-Gateway-Authorization": authorizationHeader,
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  }
};
module.exports = AxiosRequest;