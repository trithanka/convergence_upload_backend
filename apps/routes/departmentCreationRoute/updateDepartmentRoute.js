const express = require("express");
const Router = express.Router();
const service = require("../../services/departmentCreation/createDepartmentService");

//update department status
Router.post("/status",async (req,res)=>{
    let result;
    //console.log("update department status route");
    const queryType = req.body;
    result = await service.updateDepartmentStatus(queryType);
    res.send(result);
});

module.exports = Router;