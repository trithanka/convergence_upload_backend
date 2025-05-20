const co = require('co');
const connection = require('../../../JOS/DALMYSQLConnection');
const { propagateError, propagateResponse } = require('../../../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const query = require('../../queries/departmentCreationQuery');

//get all department
// Get all departments
exports.getAllDepartment = co.wrap(async function (postParam) {
    let mySqlCon = null;
    let query_params = [];

    try {
        mySqlCon = await connection.getDB();
        
        //************************************ */
        let skip = postParam.skip ?? 0;
        let take = postParam.take ?? 25;
        skip = skip * take;

        // Extract filters from postParam
        let Department = postParam.departmentId ?? null;
        let userName = postParam.userName ? `%${postParam.userName}%` : null; // For partial match

        let main_query = query.getAllDepartment;
        let count_query = query.countAllDepartment;

        //fetch all department name list
        const departmentNameList = await connection.query(mySqlCon, query.getDepartmentNameList, []);

        // Prepare query params for filtering
        query_params.push(Department, Department, userName, userName, skip, take);

        // Fetch filtered department data
        const departmentData = await connection.query(mySqlCon, main_query, query_params);

        if (departmentData.length === 0) {
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "No department found");
        }
         const data = {
            departmentNameList,
            departmentData
         }
         
        return propagateResponse("Department fetched successfully", data, "sLoad-200", StatusCodes.OK);
    } catch (error) {
        console.error("Error in getAllDepartment:", error);
        throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message);
    } finally {
        if (mySqlCon) {
            mySqlCon.release();
        }
    }
});
