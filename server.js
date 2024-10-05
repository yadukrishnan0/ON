const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ONDCREQROUTES = require("./Routes/ONDC_REQ/index.js")
const ONDCRESROUTES = require("./Routes/ONDC_RES/index.js")
const verifyRes = require("./ONDC_Middleware/res/verifyRes.js");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConfig.js");
const SearchRoutes = require("./Routes/ONDC_REQ/SearchRoutes.js");
dotenv.config()
const app=express();
connectDB()
const port=process.env.PORT;
app.use(express.json({ limit: '7mb' })); 
app.use("/self",SearchRoutes)
app.use("/api",ONDCREQROUTES);
app.use("/ondc-PREPROD" ,verifyRes,ONDCRESROUTES);
app.listen(port,() => console.log(`Server is running on port ${port}`))