const co = require("co");
const connection = require("../../../JOS/DALMYSQLConnection");
const { propagateError, propagateResponse, } = require("../../../utils/responseHandler");
const { StatusCodes } = require("http-status-codes");
const { validateConvergenceInput } = require("../../validator/validateCandidate");
const query = require("../../queries/candidateFormQuery");



exports.handleConvergence = co.wrap(async function (candidateInput, upload_method, logged_dept = null) {
    let mySqlCon = null;
    let insertBasic;
    let candidateDetails;
    let candidateUniqueId;

    const { error, value } = validateConvergenceInput(candidateInput);
    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-401", `Validation Error: ${error.message}`
        );
    }

    try {
        mySqlCon = await connection.getDB();
        await connection.beginTransaction(mySqlCon);

        // // Insert Candidate
        insertBasic = await connection.query(mySqlCon, query.insertCandidate, [

            value.vsSchemeName,
            value.itotalTrainingCandidate,
            value.itotalCertifiedCandidate,
            value.itotalPlacedCandidate,
            value.itotalTarget,
            value.iMaleCount,
            value.iFemaleCount,
            value.iScCount,
            value.iStHCount,
            value.iStPCount,
            value.iObcCount,
            value.iGeneralCount,
            value.iMinorityCount,
            value.iTeaTribeCount,
            value.iPwdCount,
            value.iTotalJobRoleCount,
            //value.fklDepartmentId,
            logged_dept,
            value.dtFinancialYear,
            new Date(),
            value.iOtherCount,
            value.totalCount

            // value.fklDepartmentId,
            // value.vsCandidateName,
            // value.vsSchemeName,
            // value.vsJobRoleName,
            // value.bIsPlaced,
            // value.bIsCertified,
            // value.vsQualificationId,
            // value.fklGenderId,
            // value.UUID,
            // value.fklCasteId,
            // new Date(),
            // upload_method,
            // candidateUniqueId,
            // value.vsDOB
        ]);



        // // Get target details by id
        await connection.commit(mySqlCon);

        if (insertBasic.insertId) {
            candidateDetails = await connection.query(mySqlCon, query.getCandidateAllDetails, [insertBasic.pklReportId]);
        }

        return propagateResponse(
            "Candidate inserted successfully", candidateDetails, "sLoad-200", StatusCodes.OK
        );
    } catch (error) {
        await connection.rollback(mySqlCon);
        console.error("Error in handleCandidate:", error);
        return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message);
    } finally {
        if (mySqlCon) mySqlCon.release();
    }
});



exports.getSummaryReports = async (postParms = null, fklDepartmentId = 0) => {
    let mySqlCon = null;
    let allReports = null;
    let params = [fklDepartmentId];
    let skip = postParms?.skip ?? 0;
    let take = postParms?.take ?? 10;
    let result = {
        pages: 0,
        data: null,
        total: 0,
    };
    try {
        mySqlCon = await connection.getDB();

        // Query Initlize
        let main_query = query.getSummaryReportsQ;

        // Check Any filter Applied
        if (postParms?.search) {
            main_query += ` AND report.vsSchemeName LIKE ? `;
            params.push(`%${postParms?.search}%`);
        }

        // Pagination Applied 
        let skipPage = skip * take;
        main_query += ` LIMIT ${take} OFFSET ${skipPage} `
        main_query = main_query.replace('SELECT *', 'SELECT SQL_CALC_FOUND_ROWS *');
        allReports = await connection.query(mySqlCon, main_query, params);

        // Get Count Only
        let total = await connection.query(mySqlCon, 'SELECT FOUND_ROWS() as total');

        // Arrange Data Set
        result.data = allReports;
        result.total = total?.[0]?.total ?? 0;
        result.pages = Math.ceil(result.total / take);
        return propagateResponse(
            "Report Fetched successfully", result, "sLoad-200", StatusCodes.OK
        );

    } catch (error) {
        console.error("Error in handleCandidate:", error);
        return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message);
    } finally {
        if (mySqlCon) mySqlCon.release();
    }
}