const express = require("express");
const Router = express.Router();

const service = require("../../services/departmentCreation/getDepartmentService");

//get all department
Router.post("/",async (req,res)=>{
    let result;
    const queryType = req.body; 
    // const fklDepartmentId = req.user.user.pklLoginId;
    // //console.log(req.user.user.pklLoginId);
    result = await service.getAllDepartment(queryType);
    //console.log(result);
    
    res.send(result);
});

module.exports = Router;