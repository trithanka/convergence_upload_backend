const express = require("express");
const router = express.Router();
const jwtValidator = require("../../../utils/jwtValidator");


//get department data route
const getDepartmentRoute = require("./getDepartmentRoute");
router.use('/get-department', jwtValidator, getDepartmentRoute );


//master api
router.use('/master', getDepartmentRoute );


//manual upload route
const manualFileUploadRoute = require("./manualDataRoute");
router.use('/manual-file-upload',manualFileUploadRoute );

//excel upload route
const fileUploadRoute = require("./fileUploadRoute");
router.use('/file-upload' ,fileUploadRoute );

//token validationm
router.post("/validate-token", jwtValidator,(req,res)=>{
    //console.log("token validation route",req.user);
    res.status(200).json({
        success: true,
        message: "Token is valid"
    });
});



module.exports = router;