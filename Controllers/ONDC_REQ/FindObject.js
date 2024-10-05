const mongoose =require( "mongoose");
const Initialization =require( "../../Schema/Initialization.js");
const Select =require( "../../Schema/Select.js");
const User =require( "../../Schema/User.js");
const Address =require( "../../Schema/Address.js");

const findObject = async (transaction_id, user_id) => {
  
  const userobj =await User.findById(user_id);
    const selectObj = await Select.findOne({ user: userobj._id,"context.transaction_id":transaction_id }).lean();
  
    // Validate selectObj
    if (!selectObj) {
      return {
        error: true,
        message: "transaction_id and user_id are required for all ONDC processes.",
        status: 400,
      };
    }
  
    // Validate transaction_id in selectObj
    if (selectObj.context.transaction_id !== transaction_id) {
      return {
        error: true,
        message: "Invalid transaction_id.",
        status: 400,
      };
    }
  
    // Check ONDC_SELECT_CALL
    if (!selectObj.ONDC_SELECT_CALL) {
      return {
        error: true,
        message: "ONDC_SELECT_CALL must be completed first.",
        status: 400,
      };
    }
  
    const initObj = await Initialization.findOne({ select: selectObj._id }).lean();
  const address=await Address.findById(initObj.address);
  initObj.address=address;
    // Validate initObj
    if (!initObj) {
      return {
        error: true,
        message: "No init object found.",
        status: 400,
      };
    }
  
    // Validate transaction_id in initObj
    if (initObj.transaction_id !== transaction_id) {
      return {
        error: true,
        message: "Invalid transaction_id in init object.",
        status: 400,
      };
    }
  
    // Check ONDC_INIT_CALL
    if (!initObj.ONDC_INIT_CALL) {
      return {
        error: true,
        message: "ONDC_INIT_CALL must be completed first.",
        status: 400,
      };
    }
  
    // Return the select and init objects if everything is valid
    return {
      error: false,
      selectObj,
      initDataObj:initObj,
    };
  };
module.exports = findObject