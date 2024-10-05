const axios =require("axios");

const vlookup = async (request) => {
  try {
    const response = await axios.post("https://preprod.registry.ondc.org/lookup", request);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0]; 
    } else {
      return response.data; 
    }
  } catch (error) {
    console.error("Error occurred while looking up:", error);
    return null; 
  }
};

module.exports= vlookup;
