const SearchStorage =require( "../../Storage/Search.js");
const SearchData =require( '../../Schema/Search.js');
const SearchRES = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (
      !message ||
      !context ||
      !context.transaction_id ||
      !context.message_id
    ) {
      return res
        .status(400)
        .json({
          error: "Invalid request format. Missing message or context details.",
        });
    }
    const response = {
      message,
      context: {
        transaction_id: context.transaction_id,
        message_id: context.message_id,
        bpp_uri:context.bpp_uri,
        bpp_id:context.bpp_id,
        domain:context.domain,
        city:context.city
      },
    };
    // SearchStorage.push(response);
    try {
      const searchData = new SearchData(response);
      await searchData.save();
    } catch (error) {
      console.error('Error saving data:', error);
    }
    return res.status(200).json({ message: "Ack" });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "An error occurred while processing the request.",
        details: error.message,
      });
  }
};

module.exports = SearchRES;
