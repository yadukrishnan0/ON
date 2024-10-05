const search = {
  action: "search",
  method: "POST",
  types: {
    FULL_CATALOG: {
      description:
        "Search for the entire catalog without specific filters or criteria.",
      properties: {
        domain: "The domain from which the search is being made (required)",
        city: "The city where the search is being conducted (required)",
        cityCode: "The code of the city (required)",
        lat_long: "Latitude and longitude of the search location (optional)",
        name: "Name of the item or service being searched (optional)",
      },
      additional_fields: false,
      example: {
        domain: "ONDC:RET12",
        cityCode: "BLR",
        searchType:"full"
      },
    },
    INCREMENTAL: {
      description:
        "Search for items or services available within a specific date range.",
      properties: {
        domain: "The domain from which the search is being made (required)",
        city: "The city where the search is being conducted (required)",
        cityCode: "The code of the city (required)",
        start_date: "The start date for filtering results (ISO 8601 format)",
        end_date: "The end date for filtering results (ISO 8601 format)",
        lat_long: "Latitude and longitude of the search location (optional)",
        name: "Name of the item or service being searched (optional)",
      },
      additional_fields: false,
      example: {
        domain: "ONDC:RET12",
        city: "Bangalore",
        cityCode: "BLR",
        start_date: "2023-12-18T15:00:01.112Z",
        end_date: "2023-12-18T16:00:10.112Z",
        lat_long: "12.9715987,77.5945627",
        name: "Groceries",
      },
    },
    LOCATION: {
      description:
        "Search for items or services available at a specific location.",
      properties: {
        domain: "The domain from which the search is being made (required)",
        city: "The city where the search is being conducted (required)",
        cityCode: "The code of the city (required)",
        lat_long: "Latitude and longitude of the search location (required)",
        name: "Name of the item or service being searched (optional)",
      },
      additional_fields: false,
      example: {
        domain: "ONDC:RET12",
        city: "Bangalore",
        cityCode: "BLR",
        lat_long: "12.9715987,77.5945627",
        name: "Groceries",
      },
    },
    CATEGORY: {
      description:
        "Search for items or services filtered by a specific category.",
      properties: {
        domain: "The domain from which the search is being made (required)",
        city: "The city where the search is being conducted (required)",
        cityCode: "The code of the city (required)",
        category_id:
          "The ID of the category to filter the search results (required)",
        lat_long: "Latitude and longitude of the search location (optional)",
        name: "Name of the item or service being searched (optional)",
      },
      additional_fields: false,
      example: {
        domain: "ONDC:RET12",
        city: "Bangalore",
        cityCode: "BLR",
        category_id: "electronics",
      },
    },
  },
};

module.exports = search;
