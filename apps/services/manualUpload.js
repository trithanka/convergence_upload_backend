const co = require("co");
const connection = require("../../JOS/DALMYSQLConnection");
const { propagateError, propagateResponse, } = require("../../utils/responseHandler");
const { StatusCodes } = require("http-status-codes");
const { validateSchemeInput } = require("../validator/manualSchemeValidator");
const { validateCourseInput } = require("../validator/manualCourseValidator");
const { validateTpInput } = require("../validator/manualTpValidator");
const { validateTcInput } = require("../validator/manualTcValidator");
const { validateBatchInput } = require("../validator/batchValidator");
const { validateTargetInput } = require("../validator/targetValidator");
const { validateTrainerInput } = require("../validator/trainerValidator");
const { validateAssesmentInput } = require("../validator/validateAssesment");
const query = require("../queries/manualDataQuery");
const { validatePlacementInput } = require("../validator/validatePlacement");
const { validateAssessorInput } = require("../validator/validateAssessor");
const { validateCandidateInput, validateCandidateAddress } = require("../validator/validateCandidate");
const { validateInvoiceInput } = require("../validator/validateInvoide");

//******************************************************************************************************************** */
//handle scheme
exports.handleScheme = co.wrap(async function (postParam, upload_method) {
    let resultObj = {};
    let queryResultObj = {};
    let mySqlCon = null;

    // Validate the postParam using the separate validation function
    const { error, value } = validateSchemeInput(postParam);

    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-11", `Validation Error: ${error.message}`
        );
    }
    try {
        //get db connection
        mySqlCon = await connection.getDB();
        //check user if exists
        queryResultObj.checkUser = await connection.query(mySqlCon, query.checkUser, [value.fklDepartmentId]);

        if (queryResultObj.checkUser.length == 0) {
            return propagateError(
                StatusCodes.NOT_FOUND, "sLoad-40", "User not Found"
            );
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //check duplicate scheme name and scheme type
        // const isDuplicateSchemeName = await connection.query(mySqlCon, query.checkDuplicateSchemeName, [value.scheme, value.schemeType, value.fklDepartmentId]);
        // if(isDuplicateSchemeName[0].count > 0){
        //    return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `Scheme name ${value.scheme} and scheme type ${value.schemeType} is already exists`);
        // }
        //check duplicate scheme and fund
        const checkDuplicateSchemeNameAndFundName = await connection.query(mySqlCon, query.checkDuplicateSchemeNameAndFundName, [value.scheme, value.schemeCode, value.fklDepartmentId]);
        if (checkDuplicateSchemeNameAndFundName[0].count > 0) {
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `Scheme Name ${value.scheme} and Scheme Code ${value.schemeCode} is already exists`);
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let bDuplicateEntry = 0;
        /** check duplicate scheme */
        const isDuplicate = await connection.query(mySqlCon, query.checkDuplicateScheme, [value.scheme, value.schemeType]);
        if (isDuplicate[0].count > 0) {
            bDuplicateEntry = 1;
        }
        //insert
        try {
            queryResultObj.insertScheme = await connection.query(mySqlCon, query.insertScheme,
                [
                    value.schemeFundingType,
                    value.schemeFundingRatio,
                    value.sanctionOrderNo,
                    value.dateOfSanction,
                    value.schemeType,
                    value.fundName,
                    value.scheme.toUpperCase(),
                    value.schemeCode.toUpperCase(),
                    value.fklDepartmentId,
                    new Date(),
                    upload_method,
                    bDuplicateEntry
                ]
            );
            //retrieve the inserted scheme details

            queryResultObj.getSchemeDetails = await connection.query(mySqlCon, query.getSchemeDetails, [queryResultObj.insertScheme.insertId]);

            return propagateResponse(
                "Scheme Inserted Successfully", queryResultObj.getSchemeDetails[0], "sLoad-200", StatusCodes.OK
            );

        } catch (error) {
            console.error(error);
            return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-10", error.message);
        }
    } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error sLoad-20");
    } finally {
        mySqlCon.release();
    }
});

//****************************************************************************************************************** */
//handle course
exports.handleCourse = co.wrap(async function (postParam, upload_method) {
    let mySqlCon = null;
    let queryResultObj = {};

    // Validate the postParam using the separate validation function
    const { error, value } = validateCourseInput(postParam);
 
    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-12", `Validation Error: ${error.message}`
        );
    }

    try {
        try {
            mySqlCon = await connection.getDB();
        } catch (error) {
            console.error(error);
            return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-40", "DB connection failed");
        }

        //check user if exists
        queryResultObj.checkUser = await connection.query(mySqlCon, query.checkUser, [value.fklDepartmentId]);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //check duplicate QPNOS
        const isDuplicateQPNOS = await connection.query(mySqlCon, query.checkDuplicateQPNOS, [value.vsCourseCode, value.fklDepartmentId]);
        if (isDuplicateQPNOS[0].count > 0) {
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `QPNOS ${value.vsCourseCode} is already exists`);
        }
        let bDuplicateEntry = 0;
        // const isDuplicate = await connection.query(mySqlCon, query.checkDuplicateCourse, [value.vsCourseName, value.vsCourseCode, value.fklDepartmentId]);
        // if(isDuplicate[0].count > 0){
        //     bDuplicateEntry = 1;
        // }
        if (queryResultObj.checkUser.length == 0) {
            return propagateError(
                StatusCodes.NOT_FOUND, "sLoad-40", "User not Found");
        }
        // Insert course data
        queryResultObj.insertCourse = await connection.query(mySqlCon, query.insertCourse,
            [
                value.dtFromDate,
                value.dtToDate,
                value.fklSectorId,
                value.vsCourseCode?.toUpperCase(),
                value.vsCourseName?.toUpperCase(),
                value.iTheoryDurationInHours,
                value.iPracticalDurationInHours,
                new Date(),
                value.fklDepartmentId,
                upload_method,
                value.fklTpId,
                value.fklLoginId,
                bDuplicateEntry,
                value.fklTcId
            ]
        );

        // Fetch and return the inserted course details
        const courseDetails = await connection.query(mySqlCon, query.getCourseDetails, [queryResultObj.insertCourse.insertId]);

        return propagateResponse(
            "Course Inserted Successfully", courseDetails[0], "sLoad-200", StatusCodes.OK
        );

    } catch (error) {
        console.error(error);
        return propagateError(
            StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-10", "Internal Server Error"
        );
    } finally {
        if (mySqlCon) mySqlCon.release();
    }
});

//************************************************************************************************************* */
//handle TP
exports.handleTP = co.wrap(async function (postParam, upload_method) {
    let mySqlCon = null;

    // Validate the postParam using the separate validation function
    const { error, value } = validateTpInput(postParam);
    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-12", `Validation Error: ${error.message}`
        );
    }

    try {
        mySqlCon = await connection.getDB();
        //check dupliacte vsPan
        const isDuplicatePAN = await connection.query(mySqlCon, query.checkDuplicatePAN, [value.vsPAN, value.fklDepartmentId]);
        if (isDuplicatePAN[0].count > 0) {
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `PAN ${value.vsPAN} is already exists`);
        }
        // Insert TP data
        const insertResult = await connection.query(mySqlCon, query.insertTp, [
            value.vsTpName?.toUpperCase(),
            value.vsSpocEmail,
            value.iSpocContactNum,
            value.vsSpocName?.toUpperCase(),
            value.vsTpCode?.toUpperCase(),
            value.vsState,
            value.vsDistrict,
            value.vsBlock,
            value.vsVillage?.toUpperCase(),
            value.vsAddress?.toUpperCase(),
            value.fklDepartmentId,
            new Date(),
            upload_method,
            value.vsSmartId,
            value.fklLoginId,
            value.vsCity?.toUpperCase(),
            value.vsULB,
            value.isVillageCity,
            value.vsPAN
        ]);

        // Fetch and return the inserted TP details using insertId
        const tpDetails = await connection.query(mySqlCon, query.getTpDetailsById, [insertResult.insertId,]);

        return propagateResponse(
            "TP Inserted Successfully", tpDetails[0], "sLoad-200", StatusCodes.OK);
    } catch (error) {
        console.error("Error in handleTP:", error);
        return propagateError(
            StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-10", "Internal Server Error"
        );
    } finally {
        if (mySqlCon) mySqlCon.release();
    }
});

//************************************************************************************************************* */
//handle TC
exports.handleTC = co.wrap(async function (postParam, upload_method) {
    let mySqlCon = null;

    // Validate the postParam using the separate validation function
    const { error, value } = validateTcInput(postParam);

    if (error) {
        return propagateError(StatusCodes.BAD_REQUEST, "sLoad-12", `Validation Error: ${error.message}`);
    }

    try {
        mySqlCon = await connection.getDB();
        //check duplicate tc name
        const isDuplicateTCName = await connection.query(mySqlCon, query.checkDuplicateTCName, [value.vsTcName, value.fklDepartmentId]);
        if (isDuplicateTCName[0].count > 0) {
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `TC name ${value.vsTcName} is already exists`);
        }
        // Insert TC data
        const insertResult = await connection.query(mySqlCon, query.insertTc, [
            value.fklTpId,
            value.partnerCode?.toUpperCase(),
            value.vsTcName?.toUpperCase(),
            value.vsTcCode?.toUpperCase(),
            value.vsSpocEmail,
            value.vsSpocName?.toUpperCase(),
            value.vsState,
            value.vsDistrict,
            value.vsBlock,
            value.vsVillage?.toUpperCase(),
            value.vsAddress?.toUpperCase(),
            value.iSpocContactNum,
            value.smartId,
            value.fklDepartmentId,
            new Date(),
            upload_method,
            value.fklLoginId,
            value.fklAssemblyConstituencyId,
            value.fklLoksabhaConstituencyId,
            value.vsCity?.toUpperCase(),
            value.vsULB,
            value.isVillageCity,
            value.vsLongitude,
            value.vsLatitude
        ]);

        // Fetch and return the inserted TC details using insertId
        const tcDetails = await connection.query(mySqlCon, query.getTcDetailsById, [insertResult.insertId,]);

        return propagateResponse(
            "TC Inserted Successfully", tcDetails[0], "sLoad-200", StatusCodes.OK
        );

    } catch (error) {
        //console.log("TC Error exe3");
        console.error("Error in handleTC:", error);
        return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-10", "Internal Server Error"
        );
    } finally {
        if (mySqlCon) mySqlCon.release();
    }
});

//******************************************************************************************************************** */
//handle batch
exports.handleBatch = co.wrap(async function (batchInput, upload_method) {
    let mySqlCon = null;
    let result;
    let batchDetails;

    const { error, value } = validateBatchInput(batchInput);
    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST,
            "sLoad-401",
            `Validation Error: ${error.message}`
        );
    }

    try {
        mySqlCon = await connection.getDB();
        await connection.beginTransaction(mySqlCon);

        // check existing batch number and available targets
        const isExists = await connection.query(
            mySqlCon,
            query.checkExistsQuery,
            ["nw_convergence_batch_dtl", "iBatchNumber", value.iBatchNumber]
        );
        const isAvailableTarget = await connection.query(
            mySqlCon,
            query.checkAvailableTarget,
            [value.fklTargetId]
        );

        if (value.iBatchTarget > isAvailableTarget[0].iAvailableTarget) {
            await connection.rollback(mySqlCon);
            const total = isAvailableTarget[0].iTotalTarget;
            const avail = isAvailableTarget[0].iAvailableTarget;
            return propagateError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "sLoad-500-insertBatch",
                `Out of ${total} targets, only ${avail} are available.`
            );
        }

        if (isExists[0]?.count === 1) {
            await connection.rollback(mySqlCon);
            return propagateError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "sLoad-500-insertBatch",
                "Batch number already exists!"
            );
        }
        // //check pan
        // const isDuplicateTrainer = await connection.query(mySqlCon, query.checkDuplicateTrainer, [value.vsPAN, value.fklDepartmentId,value.fklCourseId]);
        // if (isDuplicateTrainer[0].count > 0) {
        //     return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `Trainer PAN is already exists with The selected Course`);
        // }

        //one trainer cannot exist in the same batch duration
        const isTrainerExists = await connection.query(mySqlCon, query.checkDuplicateTrainerByBatchDuration, [value.vsPAN, value.fklDepartmentId]);
        if (isTrainerExists[0].endDate > value.dtStartDate) {
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `Trainer ${value.vsTrainerName} is already exists in the same batch duration`);
        }

        // perform batch insert
        result = await connection.query(mySqlCon, query.insertBatch, [
            value.SDMSid,
            value.dtStartDate,
            value.dtEndDate,
            value.fklCourseId,
            value.fklTcId,
            value.fklTrainerId,
            value.iBatchNumber,
            value.fklDepartmentId,
            new Date(),
            upload_method,
            value.iBatchTarget,
            value.fklTargetId
        ]);

        // update remaining target
        const newTarget = isAvailableTarget[0].iAvailableTarget - value.iBatchTarget;
        await connection.query(mySqlCon, query.updateTarget, [newTarget, value.fklTargetId]);

        // perform trainer insert
        const trainerResult = await connection.query(mySqlCon, query.insertTrainer, [
            value.vsTrainerName,
            value.fklDepartmentId,
            value.vsPAN,
            new Date(),
            upload_method,
            value.fklCourseId,
            value.fklTcId
        ]);

        await connection.commit(mySqlCon);

        // fetch and return batch details
        batchDetails = await connection.query(
            mySqlCon,
            query.getBatchDetailsById,
            [result.insertId]
        );

        return propagateResponse(
            "Batch inserted successfully",
            batchDetails,
            "sLoad-200",
            StatusCodes.OK
        );
    } catch (err) {
        if (mySqlCon) {
            await connection.rollback(mySqlCon);
        }
        console.error("Error in handleBatch:", err);
        return propagateError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "sLoad-500",
            err.message
        );
    } finally {
        if (mySqlCon) mySqlCon.release();
    }
});

//*************************************************************************************************************** */
//Candidate insert
exports.handleCandidate = co.wrap(async function (candidateInput, upload_method) {
    let mySqlCon = null;
    let insertBasic;
    let insertPersoanl;
    let candidateDetails;
    let candidateUniqueId;

    const { error, value } = validateCandidateInput(candidateInput);
    if (candidateInput.iSameAddress === 0) {
        const pAddress = {
            vsPAddress: candidateInput.vsPAddress,
            vsPState: candidateInput.vsPState,
            vsPDistrict: candidateInput.vsPDistrict,
            vsPBlock: candidateInput.vsPBlock,
            vsPUlb: candidateInput.vsPUlb,
            isPCityVillage: candidateInput.isPCityVillage,
            vsPVillageCity: candidateInput.vsPVillageCity,
            vsPPostOffice: candidateInput.vsPPostOffice,
            vsPPolice: candidateInput.vsPPolice,
            vsPPIN: candidateInput.vsPPIN,
            vsPCouncilContituency: candidateInput.vsPCouncilContituency,
            vsPAssemblyContituency: candidateInput.vsPAssemblyContituency,
        };
        const { error: address_error = null, value: address_value = null } = validateCandidateAddress(pAddress) || {};

        if (address_error) {
            return propagateError(
                StatusCodes.BAD_REQUEST, "sLoad-401", `Validation Error 1: ${address_error}`
            );
        }
    }
    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-401", `Validation Error: ${error.message}`
        );
    }

    try {
        mySqlCon = await connection.getDB();
        await connection.beginTransaction(mySqlCon);
        //check duplicate candidate bduplicateEntry
        let bDuplicateEntry = 0;
        let queryN= query.checkDuplicateCandidate;
        let params = [value.fklDepartmentId, value.vsDOB, value.vsCandidateName, value.vsGender,value.fklReligionId,value.fklCategoryId,value.vsEducationAttained];
        
        if (value.batchId){
            queryN += `AND batchId = ?`;
            params.push(value.batchId);
        }
        let isDuplicate = await connection.query(mySqlCon, queryN, params);
        //console.log(isDuplicate);
        if (isDuplicate[0].count > 0) {
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `Candidate ${value.vsCandidateName}  already exists with Candidate DOB: ${candidateInput.vsDOB}`);
        }
        let idType;
        if (value.vsUUID !== undefined) {
            idType = 3;
        }
        
        //if adhare is exist then create the id
        if (value.vsUUID !== undefined) {
            const date = new Date(value.vsDOB);
            // yyyyddmm format
            const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
            //candidate first 4 character capitalize + uuid + DOB(YYYYMMDD) + GENDER(M/F) if1 then M then 2 F 3 for T and 4 for A
            candidateUniqueId = value.vsCandidateName.substring(0, 4).toUpperCase() + (value.vsUUID ? value.vsUUID : "") + formattedDate + (value.vsGender == 1 ? 'M' : (value.vsGender == 2 ? 'F' : (value.vsGender == 3 ? 'T' : 'A')));
        }

        // // Insert Candidate
        insertBasic = await connection.query(mySqlCon, query.insertCandidateBasic, [
            value.fklDepartmentId,
            value.candidateId,
            value.batchId,
            value.vsCandidateName,
            value.vsDOB,
            value.iAge,
            value.vsFatherName,
            value.vsGender,
            idType,
            value.vsUUID,
            value.fklReligionId,
            value.fklCategoryId,
            value.vsMobile,
            value.vsEmail,
            value.vsEducationAttained,
            value.bDisability,
            value.bTeaTribe,
            value.bBPLcardHolder,
            value.bMinority,
            new Date(),
            upload_method,
            bDuplicateEntry,
            candidateUniqueId,
            value.bDropout
        ]);

        // Insert assessment data if available
        if (value.bAssessed == 1) {
            const assessmentInput = {
                fklDepartmentId: value.fklDepartmentId,
                batchId: value.batchId,
                candidateId: insertBasic.insertId,
                bAssessed: value.bAssessed,
                vsResult: value.vsResult,
                dtCreatedAt: new Date(),
                upload_method: upload_method
            };
            //insert assessment
            await connection.query(mySqlCon, query.insertAssesment, [
                assessmentInput.fklDepartmentId,
                assessmentInput.batchId,
                assessmentInput.candidateId,
                assessmentInput.bAssessed,
                assessmentInput.vsResult,
                assessmentInput.dtCreatedAt,
                assessmentInput.upload_method
            ]);
        }

        // Insert placement data if available
        if (value.placed == 1) {
            const placementInput = {
                fklDepartmentId: value.fklDepartmentId,
                batchId: value.batchId,
                candidateId: insertBasic.insertId,
                placed: value.placed,
                vsPlacementType: value.vsPlacementType,
                dtCreatedAt: new Date(),
                upload_method: upload_method
            };
            await connection.query(mySqlCon, query.insertPlacement, [
                placementInput.fklDepartmentId,
                placementInput.batchId,
                placementInput.candidateId,
                placementInput.placed,
                placementInput.vsPlacementType,
                placementInput.dtCreatedAt,
                placementInput.upload_method
            ]);
        }

        // // Get target details by id
        await connection.commit(mySqlCon);

        if (insertBasic.insertId) {
            candidateDetails = await connection.query(mySqlCon, query.getCandidateAllDetails, [insertBasic.insertId]);
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

//********************************************************************************************************************* */
//handle target
exports.handleTarget = co.wrap(async function (targetInput, upload_method) {

    let mySqlCon = null;
    let insertResult;
    let targetDetails;

    const { error, value } = validateTargetInput(targetInput);

    if (error) {
        //console.log("error", error);
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-401", `Validation Error: ${error.message}`
        );
    }
    // handle financial year input like 'YYYY-YYYY'
    
    //if object then change it to string
    if (typeof targetInput.dtTargetDate === 'object' || typeof targetInput.dtTargetDate === 'number') {
        targetInput.dtTargetDate = targetInput.dtTargetDate.toString();
    }
   
    if (typeof targetInput.dtTargetDate === 'string' && /^\d{4}-\d{4}$/.test(targetInput.dtTargetDate.trim())) {
        const [startYear, endYear] = targetInput.dtTargetDate.trim().split('-').map(Number);
        // set to financial year start and end
        value.dtTargetDate = new Date(startYear, 3, 1);   // 1 April
        value.dtTargetEndDate = new Date(endYear,   2, 31);  // 31 March
    } else {
        // parse regular date inputs
        value.dtTargetDate = new Date(value.dtTargetDate);
        if (value.dtTargetEndDate) {
            value.dtTargetEndDate = new Date(value.dtTargetEndDate);
        }
    }
    console.log("value.dtTargetDate----------------", value.dtTargetDate);
    try {
        mySqlCon = await connection.getDB();
        // let bDuplicateEntry = 0;
        /** check duplicate sanction number */

        // const isDuplicate = await connection.query(mySqlCon, query.checkDuplicateTarget, [value.vsSanctionNo, value.fklDepartmentId]);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //check vsTargetNo
        const isDuplicateTargetNo = await connection.query(mySqlCon, query.checkDuplicateTargetNo, [value.vsTargetNo, value.fklDepartmentId]);
        if (isDuplicateTargetNo[0].count > 0) {
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `Target number ${value.vsTargetNo} is already exists`);
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // if(isDuplicate[0].count > 0){
        //     bDuplicateEntry = 1;
        // }
        // Insert target
        const schemeCode = await connection.query(mySqlCon, query.getSchemeCode, [value.vsSchemeCode]);

        insertResult = await connection.query(mySqlCon, query.insertTarget, [
            value.vsTargetNo.toUpperCase(),
            value.dtTargetDate,
            schemeCode?.[0]?.vsSchemeCode,
            value.iTotalTarget,
            value.fklDepartmentId,
            new Date(),
            upload_method,
            value.targetType,
            // value.fklSchemeId,
            value.vsSchemeCode,
            value.iTotalTarget,
            value.dtTargetEndDate
        ]);
        // Get target details by id
        targetDetails = await connection.query(mySqlCon, query.getTargetDetailsById, [insertResult.insertId]);

        return propagateResponse(
            "Target inserted successfully", targetDetails, "sLoad-200", StatusCodes.OK
        );
    } catch (error) {
        console.error("Error in handleTarget:", error);
        return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message);
    } finally {
        if (mySqlCon) mySqlCon.release();
    }
});

//************************************************************************************************************** */
//handle trainer
exports.handleTrainer = co.wrap(async function (trainerInput, upload_method) {
    let mySqlCon = null;
    let insertResult;
    let trainerDetails;

    const { error, value } = validateTrainerInput(trainerInput);

    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-401", `Validation Error: ${error.message}`
        );
    }

    try {
        mySqlCon = await connection.getDB();
        //check pan
        const isDuplicateTrainer = await connection.query(mySqlCon, query.checkDuplicateTrainer, [value.vsPAN, value.fklDepartmentId,value.fklCourseId]);
        if (isDuplicateTrainer[0].count > 0) {
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `Trainer PAN is already exists with The selected Course`);
        }
        // Insert trainer
        insertResult = await connection.query(mySqlCon, query.insertTrainer, [
            value.trainerId,
            value.vsTrainerName.toUpperCase(),
            value.vsEmail,
            value.vsMobile,
            value.vsPAN,
            value.fklDepartmentId,
            new Date(),
            upload_method,
            value.fklCourseId,
            value.fklTcId
        ]);

        // Get trainer details by id
        trainerDetails = await connection.query(mySqlCon, query.getTrainerDetailsById, [insertResult.insertId]);

        return propagateResponse(
            "Trainer inserted successfully", trainerDetails, "sLoad-200", StatusCodes.OK
        );
    } catch (error) {
        console.error("Error in handleTrainer:", error);
        return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
        );
    } finally {
        if (mySqlCon) mySqlCon.release();
    }
});

//************************************************************************************************************************* */
// -----------handle assisment data manually ----------------------
exports.handleAssesment = co.wrap(async function (assesmentInput, upload_method) {
    let mySqlCon = null;
    let insertResult;
    let assesmentDetails;

    const { error, value } = validateAssesmentInput(assesmentInput);

    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-401", `Validation Errorc: ${error.message}`
        );
    }
    try {
        mySqlCon = await connection.getDB();

        //check by id
        const isDuplicateAssessment = await connection.query(mySqlCon, query.checkDuplicateAssessment, [value.candidateId, value.batchId, value.fklDepartmentId]);
        if (isDuplicateAssessment[0].count > 0) {
            let candID = await connection.query(mySqlCon, query.getCandIDbyPKL, [value.candidateId, value.fklDepartmentId]);
            let batchID = await connection.query(mySqlCon, query.getBatchIDbyPKL, [value.batchId, value.fklDepartmentId]);
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `Candidate ID ${candID?.[0]?.candidateId || ''} already exists under Batch ID ${batchID?.[0]?.iBatchNumber}`);
        }

        // -------------- insert assesment data ---------------
        insertResult = await connection.query(mySqlCon, query.insertAssesment, [
            value.fklDepartmentId,
            value.batchId,
            value.SDMSBatchId,
            value.candidateId,
            value.bAssessed,
            value.dtAssessmentDate,
            value.vsAgency,
            value.vsAgencyMobile,
            value.vsAgencyEmail,
            value.accessorId,
            value.vsAccessorName,
            value.vsResult,
            value.dtResultDate,
            value.vsCertificationStatus,
            value.vsTotalMarks,
            value.vsObtainedMarks,
            value.vsMarksheetUrl,
            value.vsCertificateUrl,
            new Date(),
            upload_method
        ]);

        assesmentDetails = await connection.query(mySqlCon, query.getAssesmentDetails, [insertResult.insertId]);

        return propagateResponse(
            "Assessment inserted successfully", assesmentDetails, "sLoad-200", StatusCodes.OK
        );
    } catch (error) {
        console.error("Error in handleTrainer:", error);
        return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
        );
    } finally {
        if (mySqlCon) {
            mySqlCon.release();
        }
    }
});

//************************************************************************************************************* */
// ------------- add placement data ----------------
exports.handlePlacement = co.wrap(async function (placementInput, upload_method) {
    let mySqlCon = null;
    let insertResult;
    let placementDetails;

    const { error, value } = validatePlacementInput(placementInput);

    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-401", `Validation Errorc: ${error.message}`
        );
    }
    try {
        mySqlCon = await connection.getDB();

        let checkBatchCandPkl = await connection.query(mySqlCon, query.checkBatchCandPklDup, [value.candidateId]);
        //console.log("checkBatchCandPkl", checkBatchCandPkl);
        if (checkBatchCandPkl?.[0]?.count != 0) {
            return propagateError(
                StatusCodes.BAD_REQUEST, "sLoad-402", `Candidate Id already exists `
            );
        }
        insertResult = await connection.query(mySqlCon, query.insertPlacement, [
            value.fklDepartmentId,
            value.batchId,
            value.candidateId,
            value.bIsCandidatePlaced,
            value.vsEmployeerName,
            value.vsPlacementType,
            value.vsEmployeerContactNumber,
            value.vsPlacementDistrict,
            value.vsPlacementState,
            value.vsMonthlySalary,
            new Date(),
            upload_method,
            value.dtAppointmentDate
        ]);

        placementDetails = await connection.query(mySqlCon, query.getPlacementDetails, [insertResult.insertId]);

        return propagateResponse(
            "Placement inserted successfully", placementDetails, "sLoad-200", StatusCodes.OK
        );
    } catch (error) {
        console.log(error);
        return propagateError(
            StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
        );
    } finally {
        if (mySqlCon) {
            mySqlCon.release();
        }
    }
});

//********************************************************************************************************************** */
// ------------- add assessor data ----------------
exports.handleAssessor = co.wrap(async function (assessorInput, upload_method) {
    let mySqlCon = null;
    let insertResult;
    let assessorDetails;

    const { error, value } = validateAssessorInput(assessorInput);

    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-401", `Validation Errorc: ${error.message}`
        );
    }

    try {
        mySqlCon = await connection.getDB();
        //check duplicate assessor
        const isDuplicateAssessorPan = await connection.query(mySqlCon, query.checkDuplicateAssessor, [value.vsPAN, value.fklDepartmentId]);
        if(isDuplicateAssessorPan[0].count > 0){
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `Assessor ${value.vsAssessorName} is already exists with PAN no. ${value.vsPAN}`);
        }
        // check assessor name with qpnos code 
        const isDuplicateAssessor = await connection.query(mySqlCon, query.checkDuplicateAssessorName, [value.vsAssessorName, value.fklcourse, value.fklDepartmentId]);
        //console.log("asessor duplicate ", isDuplicateAssessor);
        if (isDuplicateAssessor[0].count > 0) {
            return propagateError(StatusCodes.BAD_REQUEST, "sLoad-40", `Assessor ${value.vsAssessorName} is already exists with ${value.QPNOS}`);
        }
      
        insertResult = await connection.query(mySqlCon, query.insertAssesor, [
            value.fklDepartmentId,
            value.assosserId,
            value.vsAssessorName.toUpperCase(),
            value.vsEmail,
            value.vsMobile,
            value.vsAssessmentAgency.toUpperCase(),
            value.dtValidUpTo,
            new Date(),
            upload_method,
            value.vsPAN,
            value.QPNOS,
            value.fklBatchId,
            value.fklCourseId
        ]);

        assessorDetails = await connection.query(mySqlCon, query.getAssesorDetails, [insertResult.insertId]);

        return propagateResponse(
            "Assesor inserted successfully", assessorDetails, "sLoad-200", StatusCodes.OK
        );
    } catch (error) {
        return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
        );
    } finally {
        if (mySqlCon) {
            mySqlCon.release();
        }
    }
});

//****************************************************************************************************************** */
//handle invoice
exports.handleInvoice = co.wrap(async function (placementInput, upload_method) {
    let mySqlCon = null;
    let insertResult;
    let invoiceDetails;

    const { error, value } = validateInvoiceInput(placementInput);

    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-401", `Validation Errorc: ${error.message}`
        );
    }

    try {
        mySqlCon = await connection.getDB();

        insertResult = await connection.query(mySqlCon, query.insertInvoice, [
            value.fklDepartmentId,
            value.fklInvoiceType,
            value.vsInvoiceTranche,
            value.vsInvoiceDate,
            value.vsInvoiceNo?.toUpperCase(),
            value.fAmount,
            value.fRate,
            value.iTotalCandidate,
            value.fklBatchId,
            new Date(),
            upload_method,
            value.fklTcId
        ]);
        invoiceDetails = await connection.query(mySqlCon, query.getInvoiceDetails, [insertResult.insertId,]);

        return propagateResponse(
            "Invoice inserted successfully", invoiceDetails, "sLoad-200", StatusCodes.OK
        );
    } catch (error) {
        console.log(error);
        return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
        );
    } finally {
        if (mySqlCon) {
            mySqlCon.release();
        }
    }
});

//********************************************************************************************************************************* */
exports.handleSector = co.wrap(async function (sectorInput, upload_method) {
    let mySqlCon = null;
    let insertResult;
    let sectorDetails;
    const { error, value } = validateSectorInput(sectorInput);

    if (error) {
        return propagateError(
            StatusCodes.BAD_REQUEST, "sLoad-401", `Validation Errorc: ${error.message}`
        );
    }

    try {
        mySqlCon = await connection.getDB();
        //check if name already exists
        let isExists = await connection.query(mySqlCon, query.checkExistsQuery, ['nw_convergence_sector_master_dtl', 'vsSectorName', value.vsSectorName]);
        if (isExists[0]?.count > 0) {
            return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", "Sector name already exists");
        }
        insertResult = await connection.query(mySqlCon, query.insertSector, [
            value.fklDepartmentId,
            value.vsSectorName,
            new Date(),
            upload_method
        ]);
        sectorDetails = await connection.query(mySqlCon, query.getSectorDetails, [insertResult.insertId,]);

        return propagateResponse(
            "Sector inserted successfully", sectorDetails, "sLoad-200", StatusCodes.OK
        );
    } catch (error) {
        console.log(error);
        return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
        );
    } finally {
        if (mySqlCon) {
            mySqlCon.release();
        }
    }
});