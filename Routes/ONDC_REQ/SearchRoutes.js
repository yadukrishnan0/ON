const express= require("express");
const Fullsearch=require("../../Controllers/Search/Full/index");
const Incsearch=require("../../Controllers/Search/Inc/index")
const SearchRoutes=express.Router();
SearchRoutes.post('/full',Fullsearch);
SearchRoutes.post("/inc",Incsearch);
module.exports=SearchRoutes;