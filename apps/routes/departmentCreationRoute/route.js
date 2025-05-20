const express = require("express");
const router = express.Router();
const jwtValidator = require("../../../utils/jwtValidator");
const userAccess = require("../../middleware/userAccess");

//get department route
const getAllDepartment = require("./getAllDepartment");
router.use('/getAllDepartment', jwtValidator, userAccess('admin'), getAllDepartment );

//create department route
const createDepartment = require("./createDepartmentRoute");
router.use('/createDepartment', jwtValidator, userAccess('admin'), createDepartment );

//update department status route
const updateDepartmentStatus = require("./updateDepartmentRoute");
router.use('/updateStatus', jwtValidator, userAccess('admin'), updateDepartmentStatus );

module.exports = router;