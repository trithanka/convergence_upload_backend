const express = require("express");
const Router = express.Router();
const service = require("../../services/departmentCreation/createDepartmentService");

//create department
Router.post("/",async (req,res)=>{
    let result;
    const queryType = req.body; 
    const loginId = req.user.user.pklLoginId;
    result = await service.createDepartment(queryType,loginId);
    res.send(result);
});



module.exports = Router;