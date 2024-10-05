const Select =require( "../../Schema/Select.js");
const Search =require( "../../Schema/Search.js");
const CONTEXT =require( "../../ONDC_SCHEMA/search/CONTEXT.js");
const { createAuthorizationHeader } =require( "../../ONDC_Middleware/req/index.js");
const BasicContext =require( "./BasicREQ.js");
const validateRequiredParams =require( "./ValidateRequiedParams.js");
const User =require( "../../Schema/User.js");
const  mongoose =require( "mongoose");
const SelectReq = async (req, res) => {
  try {
    const { context, message, user_id } = req.body;

    // Validate context and message presence
    if (!context || !message) {
      return res.status(400).json({
        NACK: {
          error:
            "Missing required parameters: context and message are required",
        },
      });
    }
    if (!user_id) {
      return res.status(400).json({
        NACK: {
          error: "Missing required parameters: user_id is required",
        },
      });
    }
    const userobj =await User.findById(user_id);
    if (!userobj) {
      return res.status(400).json({
        NACK: {
          error: "invalid user_id ",
        },
      });
    }
    // Validate context parameters
    const contextError = validateRequiredParams(
      context,
      ["bpp_id", "bpp_uri", "requestedDomain"],
      "context"
    );
    if (contextError) {
      return res.status(400).json({ NACK: { error: contextError } });
    }

    // Validate message parameters
    const messageError = validateRequiredParams(
      message,
      ["provider", "items", "fulfillments"],
      "message"
    );
    if (messageError) {
      return res.status(400).json({ NACK: { error: messageError } });
    }

    // Validate provider parameters
    const providerError = validateRequiredParams(
      message.provider,
      ["provider_id", "provider_location_id"],
      "provider"
    );
    if (providerError) {
      return res.status(400).json({ NACK: { error: providerError } });
    }

    // Validate fulfillments parameters
    const fulfillmentsError = validateRequiredParams(
      message.fulfillments,
      ["log_lat", "areacode"],
      "fulfillments"
    );
    if (fulfillmentsError) {
      return res.status(400).json({ NACK: { error: fulfillmentsError } });
    }

    // Validate all items in the items array
    for (let i = 0; i < message.items.length; i++) {
      const { item_id, parent_id, quantity, location_id } = message.items[i];

      const itemsError = validateRequiredParams(
        { item_id, parent_id, quantity, location_id },
        ["item_id", "parent_id", "quantity", "location_id"],
        `items[${i}]`
      );

      if (itemsError) {
        return res.status(400).json({ NACK: { error: itemsError } });
      }
      // Validate nested tags if present
      if (message.items[i].tags) {
        for (let j = 0; j < message.items[i].tags.length; j++) {
          const tagError = validateRequiredParams(
            message.items[i].tags[j].items,
            ["code", "list"],
            `items[${i}].tags[${j}].items`
          );
          if (tagError)
            return res.status(400).json({ NACK: { error: tagError } });
        }
      }
    }
    // Generate context
    let generatedcontext;
    try {
      generatedcontext = await BasicContext(
        CONTEXT,
        context.city,
        context.cityCode,
        context.requestedDomain,
        context.bpp_id,
        context.bpp_uri
      );
    } catch (err) {
      console.error("Error generating context:", err);
      return res.status(500).json({ message: "Failed to generate context" });
    }

    // Create a Select document
    const selectDoc = new Select({
      user: userobj._id,
      context: generatedcontext,
      message: {
        order: {
          provider: {
            id: message.provider.provider_id,
            locations: [
              { items: { id: message.provider.provider_location_id } },
            ],
          },
          items: message.items.map((item) => ({
            id: item.item_id,
            parent_item_id: item.parent_id,
            location_id: item.location_id,
            quantity: { count: item.quantity },
            tags: item.tags || [],
            fulfillments: [
              {
                end: {
                  location: {
                    gps: message.fulfillments.log_lat,
                    address: { area_code: message.fulfillments.areacode },
                  },
                },
              },
            ],
          })),
        },
      },
    });

    await selectDoc.save();

    // // Dummy search logic (replace with actual search logic later)
    // const searchResult = await Search.findOne({
    //   "message.catalog.bpp/providers": {
    //     $elemMatch: { "items.id": item_id },
    //   },
    // });

    // if (!searchResult) {
    //   return res.status(404).json({ message: "Item not found" });
    // }

    // Return success response
    res.status(201).json({ message: "Select document created", selectDoc });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = SelectReq;
