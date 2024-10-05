const Search = require("../Schema/Search.js");

const SearchInLocal = async (
  searchType,
  cityCode,
  domain,
  category,
  area_code
) => {
  let results;
  let query = {};

  if (cityCode) {
    query["context.city"] = cityCode;
  }
  if (domain) {
    query["context.domain"] = domain;
  }

  try {
    switch (searchType) {
      case "full":
        
        results = await Search.find(query);
        break;

      case "category":
        if (category) {
          query["message.catalog.bpp.providers"] = {
            $elemMatch: {
              locations: {
                $elemMatch: {
                  descriptor: {
                    name: {
                      $regex: category,
                      $options: "i", 
                    },
                  },
                },
              },
            },
          };
        }
        results = await Search.find(query);
        break;

      case "location":
        if (area_code) {
          query["message.catalog.bpp.providers"] = {
            $elemMatch: {
              locations: {
                $elemMatch: {
                  address: {
                    area_code: {
                      $regex: area_code,
                      $options: "i", 
                    },
                  },
                },
              },
            },
          };
        }
        results = await Search.find(query);
        break;

      default:
        throw new Error(`Invalid search type: ${searchType}`);
    }

    if (!results || results.length === 0) {
      return []; 
    }

    return results;

  } catch (error) {
    console.error(`Error during search: ${error.message}`);
    throw error; 
  }
};
module.exports= SearchInLocal;
