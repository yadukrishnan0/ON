const context = require("../../ONDC_SCHEMA/search/CONTEXT");
const Search = require("../../Schema/Search");
const CITY_CODES = require("../../Unique/ONDCCONTEXTCITY");

const Inside_searchReq = async (req, res) => {
    try {
        const { bpp_id, city_code, city,category } = req.body;

        if (!bpp_id && !city_code && !city) {
            return res.status(400).send({ message: "Please provide bpp_id, city_code, or city." });
        }

        let final_city_code = city_code;
        if (!city_code && city) {
            const cityData = CITY_CODES.find(c => c.City === city);
            if (cityData) {
                final_city_code = cityData.Code;
            } else {
                return res.status(400).send({ message: "Invalid city provided." });
            }
        }

        let query = {};
        if (bpp_id) {
            query = { "context.bpp_id": bpp_id };
        } else if (final_city_code) {
            query = { "context.city_code": final_city_code };
        }
        query={"message.catalog.bpp/providers[0]categories.descriptor.name":{$regex:category}}

        const result = await Search.find(query);

        if (result.length === 0) {
            return res.status(404).send({ message: "No results found." });
        }

        return res.status(200).send(result);
    } catch (error) {
        console.error("Error occurred during search request:", error);
        return res.status(500).send({ message: "An internal server error occurred." });
    }
};
module.exports=Inside_searchReq
