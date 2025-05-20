const co = require('co');
const crypto = require('crypto');
const connection = require('../../../JOS/DALMYSQLConnection');
const { propagateError, propagateResponse } = require('../../../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const query = require('../../queries/departmentCreationQuery');
const { validateDepartmentInput } = require('../../validator/createDepartmentValidator');
var request = require('supertest');

//encrypt password
function encrypt(data) {
    const cipher = crypto.createCipher(
      "aes256",
      "3ncryp7i0n"
    );
    let encrypted = cipher.update("" + data, "utf8", "hex") + cipher.final("hex");
    return encrypted;
  };

//create department
exports.createDepartment = co.wrap(async function (postParam, loginId) {
    let mySqlCon = null;
    const { error, value } = validateDepartmentInput(postParam);
    if (error) {
        return propagateError(StatusCodes.BAD_REQUEST, "sLoad-11", `Validation Error: ${error.message}`);
    }
    try {
        mySqlCon = await connection.getDB();
        //check if vsDepartmentName and iphoneNumber already exist
        const checkDepartmentName = await connection.query(mySqlCon, query.checkDepartmentName, [value.departmentName]);
        const checkPhoneNumber = await connection.query(mySqlCon, query.checkPhoneNumber, [value.phoneNumber]);
        if(checkDepartmentName.length > 0 || checkPhoneNumber.length > 0){
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-11", "Department name or phone number already exist");
        }
        //check username already exist
        const checkUsername = await connection.query(mySqlCon, query.checkUsername, [value.loginName]);
        if(checkUsername.length > 0){
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-11", "Username already exist");
        }
        const deptSortName=await connection.query(mySqlCon,query.findDepartmentSortName,[value.departmentName]);
        const insertDepartmentResult = await connection.query(mySqlCon, query.insertDepartment, [value.departmentName, loginId,value.phoneNumber,deptSortName?.[0]?.vsEntityCode ?? 'Other']);
        const departmentId = insertDepartmentResult.insertId;
        let generatedPassword=await generatePassword(6);
        await connection.query(mySqlCon, query.insertLoginDetail, [value.loginName, encrypt(generatedPassword), departmentId, 1,generatedPassword]);

        //** Send SMS to the department */
        let smsObj = await sendSms(value.phoneNumber, value.departmentName, value.loginName, generatedPassword)
     
        // Fetch the newly created department and login details
        const departmentData = await connection.query(mySqlCon, query.getDepartmentById, [departmentId]);

        return propagateResponse("Department created successfully", { department: departmentData[0] , smsObj : smsObj },  "sLoad-200", StatusCodes.OK);
    } catch (error) {
        console.error("Error in createDepartment:", error);
        throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message);
    } finally {
        if (mySqlCon) mySqlCon.release();
    }
});

const generatePassword=async (length=8)=>{
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

//update department status
exports.updateDepartmentStatus = co.wrap(async function (postParam) {
    let mySqlCon = null;
    try {
        mySqlCon = await connection.getDB();
    } catch (error) {
        console.error("Error in updateDepartmentStatus:", error);
        return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message);
    }
    //console.log(postParam);
    
    //check departmentId exist or not and bEnable should be boolean 0 or 1
    if(!postParam.departmentId || (postParam.bEnable !== 0 && postParam.bEnable !== 1)){
        return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Department id and bEnable is required");
    }

    //check department exist or not
    const departmentExist = await connection.query(mySqlCon, query.getDepartmentById, [postParam.departmentId]);
    if(departmentExist.length === 0){
        return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Department not found");
    }
    
    //update department status
    const updateDepartmentStatus = await connection.query(mySqlCon, query.updateDepartmentStatus, [postParam.bEnable, postParam.departmentId]);
    return propagateResponse("Department status updated successfully", updateDepartmentStatus, "sLoad-200", StatusCodes.OK);
});

//*************************************************************************************** */
let sendSms = co.wrap(async function (mobile, departmentName, username, password) {
    let emailSmsObj = {};
    let queryResultObj = {};
       
    let new_name = `Convergence (${departmentName})` 
        try {
          
            emailSmsObj.toMobileNumber = mobile;
           
            emailSmsObj.message = (`Login Details For ${new_name}\n` +
                                   `\nUsername: ${username}` +
                                   `\nPassword: ${password}`);

            emailSmsObj.smsTemplateId = '1407165674914840301';

            await sendSMSFn(emailSmsObj);
            return emailSmsObj.message;
        } catch (error) {
            console.error(error);
            return false;
        }
    
});


//********************************************************************************************* */
let sendSMSFn = async function (smsObject) {
    return new Promise(function (resolve, reject) {
        let mobileNo = smsObject.toMobileNumber;
        request('http://sms.amtronindia.in/form_/send_api_master_get.php?')
            .get("agency=AMTRON&password=skill@123&district=ALL&app_id=ASDM&sender_id=ASDMSM&unicode=false&to=" +
                mobileNo + "&te_id=" + smsObject.smsTemplateId + "&msg=" + encodeURIComponent(smsObject.message))
            .end(function (error, res) {
                if (error) {
                    reject(error);
                }
                resolve(JSON.stringify(res));
            });
    });
};
