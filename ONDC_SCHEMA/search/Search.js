const createSearchMessage = (body) => {
    const { 
        lat_long, 
        name, 
        start_date, 
        end_date, 
        category_id, 
        area_code, 
        finder_fee_type = 'percent', 
        finder_fee_amount = '3.00', 
        searchType 
    } = body;

    const message = {
        intent: {
            payment: {
                '@ondc/org/buyer_app_finder_fee_type': finder_fee_type, 
                '@ondc/org/buyer_app_finder_fee_amount': finder_fee_amount,
            },
            fulfillment: {
                type: 'Delivery',
            },
        },
    };

    switch (searchType) {
        case "full":
            break;

        case 'category':
            if (!category_id) {
                throw new Error("category_id is required for category search.");
            }
            message.intent.category = { id: category_id };
            break;

        case 'location':
            if (!lat_long) {
                throw new Error("lat_long is required for location search.");
            }
            if (!area_code) {
                throw new Error("area_code is required for location search.");
            }
            message.intent.fulfillment.end = {
                location: {
                    gps: lat_long,
                    address: { area_code }, // area_code is now required
                },
            };
            break;

        case 'incremental':
            if (!lat_long || !name || !start_date || !end_date) {
                throw new Error("lat_long, name, start_date, and end_date are required for incremental search.");
            }
            message.intent.item = { descriptor: { name } };
            if (category_id) {
                message.intent.category = { id: category_id };
            }
            message.intent.tags = [{
                code: 'catalog_inc',
                list: [
                    { code: 'start_time', value: start_date },
                    { code: 'end_time', value: end_date },
                ],
            }];
            break;

        default:
            throw new Error("Invalid search parameters. Allowed types: full, category, location, incremental.");
    }

    return message;
};

module.exports =createSearchMessage;
