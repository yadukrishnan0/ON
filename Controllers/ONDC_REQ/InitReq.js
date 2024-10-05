const Select =require( "../../Schema/Select.js");
const Initialization =require( "../../Schema/Initialization.js");
const User =require( "../../Schema/User.js");
const Address =require( "../../Schema/Address.js");
const mongoose =require( "mongoose");

const InitReq = async (req, res) => {
  const { transaction_id, user_id, address_id, billing, fulfillments } = req.body;

  // Validate presence of user_id
  if (!user_id) {
    return res.status(400).send({ message: "user_id is required for init process" });
  }

  // const userid=new mongoose.Types.ObjectId(user_id)
  const userobj =await User.findById(user_id);
  if (!userobj) {
    return res.status(400).send({ message: "Invalid user_id, user not found" });
  }
// Validate presence of transaction_id
if (!transaction_id) {
  return res.status(400).send({ message: "transaction_id is required for ONDC process" });
}
  const selectobj = await Select.findOne({ user: user_id,"context.transaction_id":transaction_id });
  if (!selectobj) {
    return res.status(400).send({ message: "Select object not found" });
  }

  // Find address by address_id if provided, or fetch user's default address
  let addressobj = address_id
    ? await Address.findOne({ user: user_id, _id: address_id })
    : await Address.findOne({ user: user_id });

  

  // Validate fulfillments structure if provided
  if (fulfillments) {
    if (!Array.isArray(fulfillments) || fulfillments.length === 0) {
      return res.status(400).send({ message: "Fulfillments must be a non-empty array" });
    }

    for (const fulfillment of fulfillments) {
      const requiredFulfillmentFields = ["id", "type", "end"];
      for (const field of requiredFulfillmentFields) {
        if (!fulfillment[field]) {
          return res.status(400).send({ message: `Fulfillment: ${field} is required` });
        }
      }

      // Validate contact and location details within fulfillment
      const requiredEndFields = ["contact", "location"];
      for (const field of requiredEndFields) {
        if (!fulfillment.end[field]) {
          return res.status(400).send({ message: `Fulfillment end: ${field} is required` });
        }
      }

      if (!fulfillment.end.contact.email || !fulfillment.end.contact.phone) {
        return res.status(400).send({
          message: "Fulfillment end contact: email and phone are required",
        });
      }

      const requiredLocationFields = ["gps", "address"];
      for (const field of requiredLocationFields) {
        if (!fulfillment.end.location[field]) {
          return res.status(400).send({
            message: `Fulfillment end location: ${field} is required`,
          });
        }
      }

      const addressFields = ["building", "city", "state", "country", "area_code", "locality"];
      for (const field of addressFields) {
        if (!fulfillment.end.location.address[field]) {
          return res.status(400).send({
            message: `Fulfillment end location address: ${field} is required`,
          });
        }
      }
    }
  }

  // Validate billing if provided
  if (billing) {
    const requiredBillingFields = ["name", "phone", "email", "address"];
    const billingAddressFields = ["building", "city", "state", "country", "area_code", "locality"];

    for (const field of requiredBillingFields) {
      if (!billing[field]) {
        return res.status(400).send({ message: `Billing: ${field} is required` });
      }
    }

    for (const field of billingAddressFields) {
      if (!billing.address[field]) {
        return res.status(400).send({ message: `Billing address: ${field} is required` });
      }
    }
  }

  // If no new fulfillments and address already exists, reuse the address
  if (!fulfillments && addressobj) {
    try {
      const initObj = new Initialization({
        address: addressobj._id,
        select: selectobj._id,
        transaction_id: transaction_id,
      });

      await initObj.save();

      return res.status(200).json({ message: "Init object created successfully using existing address", initObj });
    } catch (error) {
      console.error("Error creating init object:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // Otherwise, create a new address if fulfillments are provided
  if (fulfillments) {
    const newAddressobj = new Address({
      user: userobj._id,
      billing: {
        address: {
          building: billing.address.building,
          city: billing.address.city,
          state: billing.address.state,
          country: billing.address.country,
          area_code: billing.address.area_code,
          locality: billing.address.locality,
          name: billing.name,
        },
        phone: billing.phone,
        name: billing.name,
        email: billing.email,
        created_at: billing.created_at,
        updated_at: billing.updated_at,
      },
      fulfillments: fulfillments.map((fulfillment) => ({
        id: fulfillment.id,
        type: fulfillment.type,
        end: {
          contact: {
            email: fulfillment.end.contact.email,
            phone: fulfillment.end.contact.phone,
          },
          location: {
            gps: fulfillment.end.location.gps,
            address: {
              building: fulfillment.end.location.address.building,
              city: fulfillment.end.location.address.city,
              state: fulfillment.end.location.address.state,
              country: fulfillment.end.location.address.country,
              area_code: fulfillment.end.location.address.area_code,
              locality: fulfillment.end.location.address.locality,
              name: fulfillment.end.location.address.name,
            },
          },
        },
      })),
    });

    await newAddressobj.save();

    try {
      const initObj = new Initialization({
        address: newAddressobj._id,
        select: selectobj._id,
        transaction_id: transaction_id,
      });

      await initObj.save();

      return res.status(200).json({ message: "Init object created successfully with new address", initObj });
    } catch (error) {
      console.error("Error creating init object:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
};

module.exports = InitReq;
