const co = require("co");
const connection = require("../../JOS/DALMYSQLConnection");
const { propagateError, propagateResponse, } = require("../../utils/responseHandler");
const { StatusCodes } = require("http-status-codes");
const query = require("../queries/getDataQuery");
const filter_service = require('./FilterService');
const duplicate_sql_queries = require('../../utils/duplicateSqlQueries');
const { Console } = require("winston/lib/winston/transports");

//***************************************************************************************************************** */
//master api
exports.handleMaster = co.wrap(async function (postParam) {
  let mySqlCon = null;
  let result = {};
  let convergenceCount = {};
  try {
    mySqlCon = await connection.getDB();
  } catch (error) {
    console.error(error);
  }
  try {
    const sort_name = await connection.query(mySqlCon, query.getLoggedSortName, [postParam.fklDepartmentId]);
    //convergence count////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (postParam.queryType === "dashboard") {
      let dataType = postParam.dataType ?? 0;
      convergenceCount.schemesCount = await connection.query(mySqlCon, query.getConvergenceCount, [postParam.fklDepartmentId]);
      convergenceCount.coursesCount = await connection.query(mySqlCon, query.getCourseCount, [postParam.fklDepartmentId]);
      convergenceCount.tpCount = await connection.query(mySqlCon, query.getTpCount, [postParam.fklDepartmentId]);
      convergenceCount.tcCount = await connection.query(mySqlCon, query.getTcCount, [postParam.fklDepartmentId]);
      convergenceCount.batchCount = await connection.query(mySqlCon, query.getBatchCount, [postParam.fklDepartmentId]);
      convergenceCount.candidateCount = await connection.query(mySqlCon, query.getCandidateCount, [postParam.fklDepartmentId]);
      convergenceCount.trainerCount = await connection.query(mySqlCon, query.getTrainerCount, [postParam.fklDepartmentId]);
      convergenceCount.assessorCount = await connection.query(mySqlCon, query.getAssessorCount, [postParam.fklDepartmentId]);
      convergenceCount.targetCount = await connection.query(mySqlCon, query.getTargetCount, [postParam.fklDepartmentId]);
      convergenceCount.assessmentCount = await connection.query(mySqlCon, query.getAssessmentCount, [postParam.fklDepartmentId]);
      convergenceCount.invoiceCount = await connection.query(mySqlCon, query.getInvoiceCount, [postParam.fklDepartmentId]);
      convergenceCount.placementCount = await connection.query(mySqlCon, query.getPlacementCount, [postParam.fklDepartmentId]);

      ////////////////////////////new on apr 8//////////////////////////////////////////////////
      convergenceCount.scCount = await connection.query(mySqlCon, query.getSCCOunt, [postParam.fklDepartmentId]);
      convergenceCount.stPCount = await connection.query(mySqlCon, query.getST_P, [postParam.fklDepartmentId]);
      convergenceCount.stHCount = await connection.query(mySqlCon, query.getST_H, [postParam.fklDepartmentId]);
      convergenceCount.obcCount = await connection.query(mySqlCon, query.getOBC, [postParam.fklDepartmentId]);
      convergenceCount.generalCount = await connection.query(mySqlCon, query.getGenralCount, [postParam.fklDepartmentId]);
      convergenceCount.TribeCount = await connection.query(mySqlCon, query.getTeaTribeCOunt, [postParam.fklDepartmentId]);
      convergenceCount.minorityCount = await connection.query(mySqlCon, query.getMinorityCOunt, [postParam.fklDepartmentId]);
      convergenceCount.pwdCount = await connection.query(mySqlCon, query.getPWDCOunt, [postParam.fklDepartmentId]);

      return propagateResponse("Dashboard data fetched successfully", { convergenceCount }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "department") {
      result.department = await connection.query(mySqlCon, query.getAllDepartment, []);
      return propagateResponse("Department data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "sector") {
      // Fetch only sector-related data
      result.sectors = await connection.query(mySqlCon, query.getAllSectors, []);

      return propagateResponse("Sector data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "state") {
      // Fetch only state-related data
      result.states = await connection.query(mySqlCon, query.getAllStates, []);

      return propagateResponse("State data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    } else if (postParam.queryType === "district") {
      if (!postParam.stateId) {

        return propagateError(StatusCodes.BAD_REQUEST, "sLoad-400", "stateId is required for fetching districts");
      }
      // Fetch only district-related data
      result.districts = await connection.query(mySqlCon, query.getAllDistricts, [postParam.stateId]);

      return propagateResponse(
        "District data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    } else if (postParam.queryType === "ulb") {
      result.ulb = await connection.query(mySqlCon, query.ulb, []);

      return propagateResponse(
        "ULB data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    } else if (postParam.queryType === "block") {
      result.block = await connection.query(mySqlCon, query.block, []);

      return propagateResponse(
        "Block data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    } else if (postParam.queryType === "qualification") {
      result.qualification = await connection.query(mySqlCon, query.qualification, []);

      return propagateResponse(
        "Qualification data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    } else if (postParam.qualification === "religion") {
      result.religion = await connection.query(mySqlCon, query.relegion, []);

      return propagateResponse(
        "Religion data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    } else if (postParam.queryType === "ULBblock") {

      if (!postParam.districtId) {
        return propagateError(StatusCodes.BAD_REQUEST, "sLoad-400", "districtId is required for fetching blocks");
      }
      // Fetch blocks by districtId
      result.blocks = await connection.query(mySqlCon, query.getBlocksByDistrictId, [postParam.districtId]);
      result.ulbs = await connection.query(mySqlCon, query.getUlbsByDistrictId, [postParam.districtId]);

      return propagateResponse(
        "Blocks & ULB data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    } else if (postParam.queryType === "constituency") {
      result.loksabhaConstituency = await connection.query(mySqlCon, query.getLoksabhaConstituencyId);
      result.assemblyConstituency = await connection.query(mySqlCon, query.getAssessmblyConstituencu);

      return propagateResponse(
        "Constituency data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    } else if (postParam.queryType === "trainerQualification") {
      result.trainerQualification = await connection.query(mySqlCon, query.trainerQualification, [])

      return propagateResponse(
        "Trainer Qualification data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    }
    else if (postParam.queryType === "tp") {
      if (postParam.fklDepartmentId) {
        result.tp = await connection.query(mySqlCon, query.customMasterQuery, ['pklTpId', 'vsTpName', 'nw_convergence_tp_dtl', postParam.fklDepartmentId]);
      } else {
        result.tp = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    } else if (postParam.queryType === "allCourse") {
      if (postParam.fklDepartmentId) {
        result.allCourse = await connection.query(mySqlCon, query.customMasterQuery, ['pklCourseId', 'vsCourseName', 'nw_convergence_course_dtl', postParam.fklDepartmentId]);
      } else {
        result.tp = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    } else if (postParam.queryType === "courseName") {

      result.courseName = await connection.query(mySqlCon, query.customMasterQuery2, ['pklCourseId', 'vsCourseName', 'nw_coms_course']);

      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);

    }
    else if (postParam.queryType === "tc") {
      let main_query = query.customMasterQuery;
      if (postParam.fklTpId && postParam.fklDepartmentId) {
        main_query += ` AND fklTpId = ?`;
        result.tc = await connection.query(mySqlCon, main_query, ['pklTcId', 'vsTcName', 'nw_convergence_tc_dtl', postParam.fklDepartmentId, postParam.fklTpId]);
      } else {
        result.tc = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "AllDeptTc") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId) {
        result.tc = await connection.query(mySqlCon, main_query, ['pklTcId', 'vsTcName', 'nw_convergence_tc_dtl', postParam.fklDepartmentId]);
      } else {
        result.tc = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "trainner") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId) {
        result.trainner = await connection.query(mySqlCon, main_query, ['pklConvTrainerId', 'vsTrainerName', 'nw_convergence_trainer_dtl', postParam.fklDepartmentId]);
      } else {
        result.trainner = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "TcTrainner") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId && postParam.TcID) {
        // main_query += ` AND fklTcId=?`;
        // result.trainner = await connection.query(mySqlCon, main_query, ['pklConvTrainerId',  'vsTrainerName',  'nw_convergence_trainer_dtl', postParam.fklDepartmentId, postParam.TcID]);
        result.trainner = await connection.query(mySqlCon, query.getTrainerBytc, [postParam.fklDepartmentId, postParam.TcID])
      } else {
        result.trainner = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    }
    else if (postParam.queryType === "course") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId && postParam.fklTpId && postParam.fklSectorId) {
        main_query += ` AND fklTpId = ? AND fklSectorId= ?`;
        result.course = await connection.query(mySqlCon, main_query,
          ['pklCourseId', 'vsCourseName', 'nw_convergence_course_dtl', postParam.fklDepartmentId,
            postParam.fklTpId,
            postParam.fklSectorId
          ]
        );
      } else {
        result.course = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "TcCourse") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId && postParam.fklTcId) {
        main_query += ` AND fklTcId = ?`;
        result.course = await connection.query(mySqlCon, main_query,
          ['pklCourseId', 'vsCourseName', 'nw_convergence_course_dtl', postParam.fklDepartmentId,
            postParam.fklTcId,
          ]
        );
      } else {
        result.course = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "AllCourseData") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId) {
        result.course = await connection.query(mySqlCon, main_query,
          ['pklCourseId', 'vsCourseName', 'nw_convergence_course_dtl', postParam.fklDepartmentId]
        );
      } else {
        result.course = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    }
    else if (postParam.queryType === "batch") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId && postParam.fklTcId && postParam.fklTpId) {
        main_query += ` AND fklTcId = ? AND fklTpId= ?;`;
        result.batch = await connection.query(mySqlCon, main_query,
          ['pklBatchId', 'iBatchNumber', 'nw_convergence_batch_dtl', postParam.fklDepartmentId,
            postParam.fklTcId,
            postParam.fklTpId
            // postParam.fklCourseId,
            // postParam.fklSectorId,
            // postParam.fklTrainerId
          ]
        );
      } else {
        result.batch = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    }
    else if (postParam.queryType === "TcBatch") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId && postParam.fklTcId) {
        main_query += ` AND fklTcId = ?`;
        result.batch = await connection.query(mySqlCon, main_query,
          ['pklBatchId', 'iBatchNumber', 'nw_convergence_batch_dtl', postParam.fklDepartmentId,
            postParam.fklTcId,
          ]
        );
      } else {
        result.batch = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    }
    else if (postParam.queryType === "assesmentBatch") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId && postParam.fklTpId) {
        main_query += ` AND fklTpId= ?;`;
        result.batch = await connection.query(mySqlCon, main_query,
          ['pklBatchId', 'iBatchNumber', 'nw_convergence_batch_dtl', postParam.fklDepartmentId,
            postParam.fklTpId,
          ]
        );
      } else {
        result.batch = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "SDMSBatchid") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId && postParam.pklBatchId) {
        main_query += ` AND pklBatchId= ?;`;
        result.SDMSBatchid = await connection.query(mySqlCon, main_query,
          ['pklBatchId', 'SDMSid', 'nw_convergence_batch_dtl', postParam.fklDepartmentId,
            postParam.pklBatchId,
          ]
        );
      } else {
        result.SDMSBatchid = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "candidateID") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId && postParam.batchId) {
        main_query += ` AND batchId= ?;`;
        result.candidateID = await connection.query(mySqlCon, main_query,
          ['pklCandidateBasicId', 'candidateId', 'nw_convergence_candidate_basic_dtl', postParam.fklDepartmentId,
            postParam.batchId,
          ]
        );
      } else {
        result.candidateID = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "invoiceType") {
      let main_query = query.customMasterQuery2;
      result.invoice_type = await connection.query(mySqlCon, main_query,
        ['pklInvoiceTypeId', 'vsInvoiceType', 'nw_mams_invoice_type']
      );
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "placementType") {
      let main_query = query.customMasterQuery2;
      result.invoice_type = await connection.query(mySqlCon, main_query,
        ['pklPlacementTypeId', 'vsTypeDisplayName', 'nw_mams_placement_tracking_type']
      );
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    }
    else if (postParam.queryType === "id_type") {
      let main_query = query.customMasterQuery2;
      result.idType = await connection.query(mySqlCon, main_query,
        ['pklIdType', 'vsIdTypeDisplayName', 'nw_mams_id_type']
      );
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "religion") {
      let main_query = query.customMasterQuery2;
      result.religion = await connection.query(mySqlCon, main_query,
        ['pklReligionId', 'vsReligionName', 'nw_mams_religion']
      );
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "category") {
      let main_query = query.customMasterQuery2;
      result.category = await connection.query(mySqlCon, main_query,
        ['pklCasteId', 'vsCasteName', 'nw_mams_caste']
      );
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "bank") {
      let main_query = query.customMasterQuery2;
      result.bank = await connection.query(mySqlCon, main_query,
        ['pkBankId', 'vcBankName', 'nw_mams_bank']
      );
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "ifsc_code") {
      let main_query = query.customMasterQuery2;
      if (postParam.pklBranchId) {
        main_query += ` WHERE pklBranchId = ?;`;
        result.ifsc_code = await connection.query(mySqlCon, main_query,
          ['pklBranchId', 'vsIFSCCode', 'nw_mams_bank_branch', postParam.pklBranchId]
        );
      } else {
        result.ifsc_code = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "gender") {
      let main_query = query.customMasterQuery2;
      result.gender = await connection.query(mySqlCon, main_query,
        ['pklGenderId', 'vsGenderName', 'nw_mams_gender']
      );
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "branch") {
      let main_query = query.customMasterQuery2;
      if (postParam.fklBankId) {
        main_query += ` WHERE fklBankId = ?;`;
        result.branch = await connection.query(mySqlCon, main_query,
          ['pklBranchId', 'vsbranchName', 'nw_mams_bank_branch', postParam.fklBankId]
        );
      } else {
        result.branch = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "scheme") {
      result.scheme = await connection.query(mySqlCon, query.getSchemeCode, [postParam.fklDepartmentId]);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "schemeType") {
      result.schemeType = await connection.query(mySqlCon, query.getSchemeType, []);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "targetType") {
      result.targetType = await connection.query(mySqlCon, query.getTargetType, []);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "schemeName") {
      result.schemeName = await connection.query(mySqlCon, query.getSchemeName, []);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "fundingType") {
      result.fundingType = await connection.query(mySqlCon, query.getFundingType, []);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "batchCandidate") {
      result.batchCandidate = await connection.query(mySqlCon, query.getBatchCandidate, [postParam.fklDepartmentId]);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "QPNOS") {
      result.QPNOS = await connection.query(mySqlCon, query.getQPNOS, [postParam.fklDepartmentId]);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "courseCodeNew") {
      result.QPNOS = await connection.query(mySqlCon, query.courseCodeNew, [postParam.fklDepartmentId]);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "BATCH") {
      result.BATCH = await connection.query(mySqlCon, query.getBatch, [postParam.fklDepartmentId]);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "target") {
      result.BATCH = await connection.query(mySqlCon, query.getTarget, [postParam.fklDepartmentId]);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "targetById") {
      result.BATCH = await connection.query(mySqlCon, query.getTargetById, [postParam.fklTargetId]);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    }else if (postParam.queryType === "qpnosAll") {
      result.qpnosAll = await connection.query(mySqlCon, query.getQPNOSAll, []);
      console.log(result.qpnosAll, "----result.qpnosAll");
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    }else if (postParam.queryType === "getByQpnos") {
      result.getByQpnos = await connection.query(mySqlCon, query.getByQpnos, [postParam.qpnos]);
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    }else if (postParam.queryType === "candidateByBatch") {
      result.candidateByBatchId = await connection.query(mySqlCon, query.getCandidateByBatchIdStatus, [postParam.fklDepartmentId, postParam.batchId]);
      //console.log(result.candidateByBatchId, "result.candidateByBatchId");
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "assessorName") {
      // let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId) {
        result.assessor = await connection.query(mySqlCon, query.getAssessorName,
          [postParam.fklDepartmentId]
        );
      } else {
        result.assessor = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    } else if (postParam.queryType === "courseRoleName") {
      let main_query = query.customMasterQuery;
      if (postParam.fklDepartmentId) {
        result.courses = await connection.query(mySqlCon, main_query,
          ['pklCourseId', 'vsCourseName', 'nw_convergence_course_dtl', postParam.fklDepartmentId]
        );
      } else {
        result.courses = [];
      }
      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    }
    else {
      // Fetch all master data
      // result.tp = await connection.query(mySqlCon, query.getTp, [postParam.fklDepartmentId,]);
      // result.tc = await connection.query(mySqlCon, query.getTc, [postParam.fklDepartmentId,]);
      result.schemeCode = await connection.query(mySqlCon, query.getSchemeCode, [postParam.fklDepartmentId]);
      // result.courseQPNOS = await connection.query(mySqlCon, query.courseCode, [postParam.fklDepartmentId,]);
      // result.idType = await connection.query(mySqlCon, query.IDType);

      return propagateResponse(
        "Master data fetched successfully", { result }, "sLoad-200", StatusCodes.OK);
    }
  } catch (error) {
    console.error(error);
    return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//************************************************************************************************************** */
//handle scheme
exports.handleScheme = co.wrap(async function (postParam, fklDepartmentId, schemeId) {
  let mySqlCon = null;
  let query_params = [];

  try {
    let dataType = postParam.dataType;
    mySqlCon = await connection.getDB();

    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    }

    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    let duplicate_skip = postParam.duplicate_skip ?? 0;
    let duplicate_take = postParam.duplicate_take ?? 25;
    skip = skip * take;
    duplicate_skip = duplicate_skip * duplicate_take;
    // Fetch all schemes
    let duplicate_count_query = query.countAllSchemes;
    const dept_sort_name = user?.[0].vsDepartmentSortName;
    let main_query;
    let count_query;

    // Remove ASDM table data 
    // if (dept_sort_name == "ASDM") {
    //   main_query = query.getAllSchemes;
    //   count_query = query.countAllSchemes;
    //   query_params.push(fklDepartmentId);
    // } else {

    // }

    // Only Get Data form Converange table 
    main_query = query.getAllSchemes;
    count_query = query.countAllSchemes;
    query_params.push(fklDepartmentId);
    if (dataType !== "" && dataType !== undefined) {
      main_query += ` AND scheme.bDuplicateEntry = ?`;
      count_query += ` AND scheme.bDuplicateEntry = ?`;
      query_params.push(dataType);
    }

    if (postParam.vsSchemeName) {
      main_query += ` AND scheme.vsSchemeName LIKE ?`;
      count_query += ` AND scheme.vsSchemeName LIKE ?`;
      query_params.push(`%${postParam.vsSchemeName}%`);
    }
    if (postParam.vsSchemeCode) {
      main_query += ` AND scheme.vsSchemeCode LIKE ?`;
      count_query += ` AND scheme.vsSchemeCode LIKE ?`;
      query_params.push(`%${postParam.vsSchemeCode}%`);
    }
    
    if (postParam.vsFundName) {
      main_query += ` AND scheme.vsFundName LIKE ?`;
      count_query += ` AND scheme.vsFundName LIKE ?`;
      query_params.push(`%${postParam.vsFundName}%`);
    }
    if (postParam.dtSanctionDate) {
      main_query += ` AND scheme.dtSanctionDate = ?`;
      count_query += ` AND scheme.dtSanctionDate = ?`;
      query_params.push(`${postParam.dtSanctionDate}`);
    }
    main_query += ` GROUP BY scheme.pklSchemeId ORDER BY scheme.dtCreatedAt DESC`;

    const total_schemes = await connection.query(mySqlCon, count_query, query_params);

    main_query += ` LIMIT ${take} OFFSET ${skip};`;

    const schemes = await connection.query(mySqlCon, main_query, query_params);

    if (schemes.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "No schemes found");
    }

    //************************************************************************************************************************************* */

    //***************************************************************************************************************************** */
    let duplicate_schemes = [];
    let count_duplicate_schemes = [];
    if (postParam.duplicateQuery) {
      const criteria = postParam.duplicateQuery;
      let sqlQuery = getDuplicateSchemesQuery(criteria);
      sqlQuery += ` LIMIT ${duplicate_take} OFFSET ${duplicate_skip};`;
      const countSqlQuery = await duplicate_sql_queries.countDuplicateSchemesQuery(criteria);
      duplicate_schemes = await connection.query(mySqlCon, sqlQuery, [fklDepartmentId]);
      count_duplicate_schemes = await connection.query(mySqlCon, countSqlQuery, [fklDepartmentId]);
    }



    let duplicate_count = duplicate_schemes.length

    let res_data = {
      total_page: Math.ceil((total_schemes[0]?.count ?? 0) / take),
      total_count: total_schemes?.[0]?.count ?? 0,
      data: schemes,
      duplicate_schemes: duplicate_schemes,
      // duplicate_count: duplicate_count,
      duplicate_total_count: count_duplicate_schemes?.[0]?.count ?? 0,
      duplicate_total_page: Math.ceil((count_duplicate_schemes?.[0]?.count ?? 0) / duplicate_take),
    };

    //**get count of target by scheme id *  /
    // const targetCount = await connection.query(mySqlCon, query.getTargetCountBySchemeId, [fklDepartmentId, schemeId]);

    return propagateResponse(
      "Schemes fetched successfully", res_data, "sLoad-200", StatusCodes.OK);
  } catch (error) {
    console.error("Error in handleScheme:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message);

  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});


// function getDuplicateSchemesQuery(criteria) {
//   let groupByClause = criteria.map(col => `scheme.${col}`).join(', ');
//   let criteriaSelect = criteria.map(col => `${col}`).join(', ');
//   let havingClause = `HAVING COUNT(DISTINCT fklDepartmentId) > 1`;

//   return `
//       SELECT 
//           scheme.vsSchemeName, 
//           scheme.vsFundName,
//           scheme.vsSchemeCode,
//           scheme.sanctionOrderNo,
//           scheme_type.vsSchemeType,
//           fund_type.vsFundingType,
//           dept.vsDepartmentName
//       FROM nw_convergence_scheme_dtl scheme
//       JOIN nw_convergence_department_master dept 
//           ON scheme.fklDepartmentId = dept.pklDepartmentID
//       JOIN nw_mams_convergence_scheme_type scheme_type
//           ON scheme.vsSchemeType = scheme_type.pklSchemeTypeId
//       JOIN nw_mams_convergence_funding_type fund_type
//           ON scheme.vsSchemeFundingType = fund_type.pklFundingTypeId
//       WHERE (${groupByClause}) IN (
//           SELECT ${criteriaSelect}
//           FROM nw_convergence_scheme_dtl 
//           GROUP BY ${criteriaSelect}
//           ${havingClause}
//       )
//       AND EXISTS (
//           SELECT 1 FROM nw_convergence_scheme_dtl sub_scheme
//           WHERE sub_scheme.${criteria[0]} = scheme.${criteria[0]}
//           ${criteria.length > 1 ? `AND sub_scheme.${criteria[1]} = scheme.${criteria[1]}` : ""}
//           AND sub_scheme.fklDepartmentId = ?
//       )
//       or EXISTS (
//               SELECT 1 FROM ds.nw_scms_scheme ds_scheme
//               left JOIN ds.nw_scms_scheme_fund fund 
//               ON ds_scheme.vsSchemeShortName = SUBSTRING_INDEX(fund.vsFundName, ' ', 1)
//               WHERE scheme.vsSchemeName = ds_scheme.vsSchemeName
//               ${criteria.length > 1 && criteria.includes('vsFundName') ? `AND scheme.vsFundName = fund.vsFundName` : ""}
//       )

//       UNION ALL
//           SELECT 
//               ds_scheme.vsSchemeName ,
//               fund.vsFundName ,
//               ds_scheme.vsSchemeShortName AS vsSchemeCode,
//               "null" AS sanctionOrderNo,
//               "Not Defined" AS vsSchemeType,
//               "null" AS vsFundingType,
//               'ASDM' AS vsDepartmentName
//           FROM ds.nw_scms_scheme ds_scheme
//           left JOIN ds.nw_scms_scheme_fund fund 
//               ON ds_scheme.vsSchemeShortName = SUBSTRING_INDEX(fund.vsFundName, ' ', 1)
//           WHERE EXISTS (
//               SELECT 1 FROM nw_convergence_scheme_dtl scheme
//               WHERE scheme.vsSchemeName = ds_scheme.vsSchemeName
//               ${criteria.includes('vsFundName') ? `AND scheme.vsFundName = fund.vsFundName` : ""}
//           )


//       ORDER BY vsSchemeName, vsFundName, vsDepartmentName;
//   `;
// }
function getDuplicateSchemesQuery(criteria) {
  // Build dynamic grouping and selection criteria for the main query
  let groupByClause = criteria.map(col => `scheme.${col}`).join(', ');
  let criteriaSelect = criteria.map(col => `${col}`).join(', ');
  let havingClause = `HAVING COUNT(DISTINCT fklDepartmentId) > 1`;

  // Main query: uses the dynamic criteria
  let query = `
      SELECT 
          scheme.vsSchemeName, 
          scheme.vsFundName,
          scheme.vsSchemeCode,
          scheme.sanctionOrderNo,
          dept.vsDepartmentName
      FROM nw_convergence_scheme_dtl scheme
      JOIN nw_convergence_department_master dept 
          ON scheme.fklDepartmentId = dept.pklDepartmentID
      WHERE (${groupByClause}) IN (
          SELECT ${criteriaSelect}
          FROM nw_convergence_scheme_dtl 
          GROUP BY ${criteriaSelect}
          ${havingClause}
      )
      AND EXISTS (
          SELECT 1 
          FROM nw_convergence_scheme_dtl sub_scheme
          WHERE sub_scheme.${criteria[0]} = scheme.${criteria[0]}
          ${criteria.length > 1 ? `AND sub_scheme.${criteria[1]} = scheme.${criteria[1]}` : ""}
          AND sub_scheme.fklDepartmentId = ?
      )
      OR EXISTS (
          SELECT 1 
          FROM ds.nw_scms_scheme ds_scheme
          LEFT JOIN ds.nw_scms_scheme_fund fund 
              ON ds_scheme.vsSchemeShortName = SUBSTRING_INDEX(fund.vsFundName, ' ', 1)
          WHERE scheme.vsSchemeName = ds_scheme.vsSchemeName
          ${criteria.length > 1 && criteria.includes('vsFundName')
      ? `AND scheme.vsFundName = fund.vsFundName`
      : ""}
      )
  `;

  // If the criteria are only for scheme name and fund name, add the ASDM union part.
  if ((criteria.includes('vsSchemeName') && criteria.length === 1) || (criteria.length === 2 && criteria.includes('vsSchemeName') && criteria.includes('vsFundName'))
    || (criteria.includes('vsFundName') && criteria.length === 1)) {
    //console.log("here-------------------")
    query += `
      UNION ALL
      SELECT 
          ds_scheme.vsSchemeName,
          fund.vsFundName,
          ds_scheme.vsSchemeShortName AS vsSchemeCode,
          "null" AS sanctionOrderNo,
          'ASDM' AS vsDepartmentName
      FROM ds.nw_scms_scheme ds_scheme
      LEFT JOIN ds.nw_scms_scheme_fund fund 
          ON ds_scheme.vsSchemeShortName = SUBSTRING_INDEX(fund.vsFundName, ' ', 1)
      WHERE EXISTS (
          SELECT 1 
          FROM nw_convergence_scheme_dtl scheme
          WHERE scheme.vsSchemeName = ds_scheme.vsSchemeName
           ${criteria.includes('vsFundName') ? `AND scheme.vsFundName = fund.vsFundName` : ""}
      )
    `;
  }

  query += `
      ORDER BY vsSchemeName, vsFundName, vsDepartmentName
  `;

  return query;
}



//******************************************************************************************************************** */
//handle course
exports.handleCourse = co.wrap(async function (postParam, fklDepartmentId) {
  let mySqlCon = null;
  let query_params = [];

  try {
    mySqlCon = await connection.getDB();

    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    }

    //*********************************** */
    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    skip = skip * take;
    //********************************** */
    let main_query = query.getAllCourse;
    let count_query = query.countAllCourse;
    query_params.push(fklDepartmentId);
    //********************************* */
    if (postParam.fklSectorId) {
      main_query += ` AND conv.fklSectorId = ?`;
      count_query += ` AND conv.fklSectorId = ?`;
      query_params.push(`${postParam.fklSectorId}`);
    }
    if (postParam.vsCourseCode) {
      main_query += ` AND conv.vsCourseCode LIKE ?`;
      count_query += ` AND conv.vsCourseCode LIKE ?`;
      query_params.push(`%${postParam.vsCourseCode}%`);
    }
    if (postParam.vsCourseName) {
      main_query += ` AND conv.vsCourseName LIKE ?`;
      count_query += ` AND conv.vsCourseName LIKE ?`;
      query_params.push(`%${postParam.vsCourseName}%`);
    }
    // main_query += ` GROUP BY conv.pklCourseId`;
    //*************************************************** */

    const total_course = await connection.query(mySqlCon, count_query, query_params);
    main_query += ` order by conv.dtcreatedAt desc LIMIT ${take} OFFSET ${skip};`;
    // Fetch all schemes
    const course = await connection.query(mySqlCon, main_query, query_params);

    const duplicate_course = await connection.query(mySqlCon, query.getDuplicateCourse, [fklDepartmentId]);


    if (course.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "No course found");
    }

    let res_data = {
      total_page: Math.ceil((total_course[0]?.count ?? 0) / take),
      total_count: total_course[0]?.count ?? 0,
      data: course,
      duplicate_course: duplicate_course
    };

    return propagateResponse(
      "course fetched successfully", res_data, "sLoad-200", StatusCodes.OK
    );

  } catch (error) {
    console.error("Error in handleScheme:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//**************************************************************************************************************** */
//handle TP
exports.handleTP = co.wrap(async function (postParam, fklDepartmentId) {
  let mySqlCon = null;
  let query_params = [];

  try {
    mySqlCon = await connection.getDB();

    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id"
      );
    }

    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    skip = skip * take;

    let main_query = query.getAllTp;
    let count_query = query.countAllTp;
    query_params.push(fklDepartmentId);

    if (postParam.vsTpName) {
      main_query += ` AND tp.vsTpName LIKE ?`;
      count_query += ` AND tp.vsTpName LIKE ?`;
      query_params.push(`%${postParam.vsTpName}%`);
    }
    if (postParam.iSpocContactNum) {
      main_query += ` AND tp.iSpocContactNum LIKE ?`;
      count_query += ` AND tp.iSpocContactNum LIKE ?`;
      query_params.push(`%${postParam.iSpocContactNum}%`);
    }
    if (postParam.vsSmartId) {
      main_query += ` AND tp.vsSmartId = ?`;
      count_query += ` AND tp.vsSmartId = ?`;
      query_params.push(`${postParam.vsSmartId}`);
    }
    if (postParam.vsDistrict) {
      main_query += ` AND tp.vsDistrict = ?`;
      count_query += ` AND tp.vsDistrict = ?`;
      query_params.push(`${postParam.vsDistrict}`);
    }
    if (postParam.vsState) {
      main_query += ` AND tp.vsState = ?`;
      count_query += ` AND tp.vsState = ?`;
      query_params.push(`${postParam.vsState}`);
    }
    // main_query += ` GROUP BY tp.pklTpId`;
    main_query += ` order by tp.dtCreatedAt desc`;
    const total_tp = await connection.query(mySqlCon, count_query, query_params);

    main_query += ` LIMIT ${take} OFFSET ${skip};`;

    // Fetch all schemes
    const tp = await connection.query(mySqlCon, main_query, query_params);
    const duplicate_tp = await connection.query(mySqlCon, query.getDuplicateTp, [fklDepartmentId]);

    if (tp.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "No TP found");
    }

    let res_data = {
      total_page: Math.ceil((total_tp[0]?.count ?? 0) / take),
      total_count: total_tp[0]?.count ?? 0,
      data: tp,
      duplicate_tp: duplicate_tp
    };

    return propagateResponse(
      "TP fetched successfully", res_data, "sLoad-200", StatusCodes.OK
    );
  } catch (error) {
    console.error("Error in handleScheme:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//******************************************************************************************************************* */
//handle TC
exports.handleTC = co.wrap(async function (postParam, fklDepartmentId) {
  let mySqlCon = null;
  let query_params = [];

  try {
    mySqlCon = await connection.getDB();

    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id"
      );
    }

    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    let duplicate_skip = postParam.duplicate_skip ?? 0;
    let duplicate_take = postParam.duplicate_take ?? 25;
    skip = skip * take;
    duplicate_skip = duplicate_skip * duplicate_take;
    // Fetch all schemes
    let main_query = query.getAllTc;
    let count_query = query.countAllTc;
    query_params.push(fklDepartmentId);
    // Fetch all schemes
    let like_params = {
      vsTcName: postParam.vsTcName,
      vsTcCode: postParam.vsTcCode,
      smartId: postParam.smartId,
      vsSpocName: postParam.vsSpocName,
      iSpocContactNum: postParam.iSpocContactNum
    };
    let equal_params = {
      fklTpId: postParam.fklTpId,
      vsDistrict: postParam.vsDistrict,
      vsBlock: postParam.vsBlock,
      vsULB: postParam.vsULB,
      fklAssemblyConstituencyId: postParam.fklAssemblyConstituencyId,
      fklLoksabhaConstituencyId: postParam.fklLoksabhaConstituencyId
    };
    // main_query += ` order by tc.dtCreatedAt desc`;

    // ------------ where with like -----------------
    let [filter_query, filter_params] = await filter_service.addFilterService(main_query, query_params, like_params, equal_params, 'tc');
    let [count_filter_query, count_filter_params] = await filter_service.addFilterService(count_query, query_params, like_params, equal_params, 'tc');
    filter_query += ` order by tc.dtCreatedAt desc`;
    filter_query += ` LIMIT ${take} OFFSET ${skip}`;

    const tc = await connection.query(mySqlCon, filter_query, filter_params);
    const total_count = await connection.query(mySqlCon, count_filter_query, count_filter_params);
    //console.log(count_filter_query);
    let duplicate_query = query.getDuplicateTc;
    duplicate_query += ` LIMIT ${duplicate_take} OFFSET ${duplicate_skip}`;
    const duplicate_tc = await connection.query(mySqlCon, duplicate_query, []);
    const duplicate_count_tc = await connection.query(mySqlCon, query.countDuplicateTc, []);

    if (tc.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "No TC found"
      );
    }
    // let total_tc = tc.length;
    let res_data = {
      total_page: Math.ceil((total_count[0]?.count ?? 0) / take),
      total_count: total_count[0]?.count ?? 0,
      data: tc,
      duplicate_tc: duplicate_tc,
      duplicate_total_count: duplicate_count_tc?.[0]?.count ?? 0,
      duplicate_total_page: Math.ceil((duplicate_count_tc?.[0]?.count ?? 0) / duplicate_take),
    };

    return propagateResponse(
      "TC fetched successfully", res_data, "sLoad-200", StatusCodes.OK
    );

  } catch (error) {
    console.error("Error in handleScheme:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//**************************************************************************************************************** */
//handle batch
exports.handleBatch = co.wrap(async function (postParam, fklDepartmentId) {
  let mySqlCon = null;
  let query_params = [];

  try {
    mySqlCon = await connection.getDB();

    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    };
    //*********************************** */
    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    skip = skip * take;
    //********************************** */
    let main_query = query.getAllBatch;
    let count_query = query.countAllBatch;
    query_params.push(fklDepartmentId);
    let like_params = {
      SDMSid: postParam.SDMSid,
      dtStartDate: postParam.dtStartDate,
      dtEndDate: postParam.dtEndDate,
      iBatchNumber: postParam.iBatchNumber
    };
    let equal_params = {
      fklTcId: postParam.fklTcId,
      fklTrainerId: postParam.fklTrainerId,
      fklCourseId: postParam.fklCourseId
    };
    // Fetch all schemes
    let [filter_query, filter_params] = await filter_service.addFilterService(main_query, query_params, like_params, equal_params, 'batch');
    let [count_filter_query, count_filter_params] = await filter_service.addFilterService(count_query, query_params, like_params, equal_params, 'batch');
    const total_count = await connection.query(mySqlCon, count_filter_query, count_filter_params);
    filter_query += ` order by batch.dtcreatedAt desc`;
    filter_query += ` LIMIT ${take} OFFSET ${skip};`;
    const batch = await connection.query(mySqlCon, filter_query, filter_params);


    //separating bDuplicateEntry by 0 or 1
    // let uniqueBatch = batch.filter(batch => batch.bDuplicateEntry === 0);
    // let duplicateBatch = batch.filter(batch => batch.bDuplicateEntry === 1);

    if (batch.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "No Batch found"
      );
    }
    let total_tc = batch.length;
    let res_data = {
      total_page: Math.ceil((total_count[0]?.count ?? 0) / take),
      total_count: total_count[0]?.count ?? 0,
      data: batch,
      duplicate_Batch: null
    };

    return propagateResponse(
      "Batch fetched successfully", res_data, "sLoad-200", StatusCodes.OK
    );

  } catch (error) {
    console.error("Error in handleScheme:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//****************************************************************************************************************** */
//handle target
exports.handleTarget = co.wrap(async function (postParam, fklDepartmentId) {
  let mySqlCon = null;
  let query_params = [];

  try {
    mySqlCon = await connection.getDB();

    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id"
      );
    }
    // Fetch all schemes
    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    skip = skip * take;
    // Fetch all schemes
    let main_query = query.getAllTarget;
    let count_query = query.countAllTarget;
    query_params.push(fklDepartmentId);
    // Fetch all schemes
    let like_params = {
      vsTargetNo: postParam.vsTargetNo,
      dtTargetDate: postParam.dtTargetDate
    };
    let equal_params = {
      vsSchemeCode: postParam.vsSchemeCode,
    };
    main_query += ` order by dtCreatedAt desc`;
    // ------------ where with like -----------------
    let [filter_query, filter_params] = await filter_service.addFilterService(main_query, query_params, like_params, equal_params, 'target');
    let [count_filter_query, count_filter_params] = await filter_service.addFilterService(count_query, query_params, like_params, equal_params, 'target');
    count_filter_query += ` order by dtCreatedAt desc`;
    const total_count = await connection.query(mySqlCon, count_filter_query, count_filter_params);
    filter_query += ` LIMIT ${take} OFFSET ${skip};`;
    const targets = await connection.query(mySqlCon, filter_query, filter_params);

    //separating bDuplicateEntry by 0 or 1
    // let uniqueTargets = targets.filter(targets => targets.bDuplicateEntry === 0);
    // let duplicateTargets = targets.filter(targets => targets.bDuplicateEntry === 1);

    if (targets.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "No target found"
      );
    }
    // //console.log("here----", uniqueTargets)
    // let total_tc = targets.length;
    let res_data = {
      total_page: Math.ceil((total_count[0]?.count ?? 0) / take),
      total_count: total_count[0]?.count ?? 0,
      data: targets,
      duplicate_Targets: null
    };

    return propagateResponse(
      "Target fetched successfully", res_data, "sLoad-200", StatusCodes.OK
    );

  } catch (error) {
    console.error("Error in handleScheme:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//************************************************************************************************************************ */
//handle trainer
exports.handleTrainer = co.wrap(async function (postParam, fklDepartmentId) {
  let mySqlCon = null;
  let query_params = [];

  try {
    mySqlCon = await connection.getDB();

    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    };
    //*********************************** */
    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    skip = skip * take;
    //********************************** */
    let main_query = query.getAllTrainer;
    let count_query = query.countAllTrainer;
    query_params.push(fklDepartmentId);
    let like_params = {
      vsTrainerName: postParam.vsTrainerName,
      vsMobile: postParam.vsMobile,
      vsEmail: postParam.vsEmail,
      vsPAN: postParam.vsPAN
    };
    let equal_params = {
      fklTcId: postParam.fklTcId,
    };
    // Fetch all schemes
    let [filter_query, filter_params] = await filter_service.addFilterService(main_query, query_params, like_params, equal_params, 'trainner');
    let [count_filter_query, count_filter_params] = await filter_service.addFilterService(count_query, query_params, like_params, equal_params, 'trainner');
    const total_count = await connection.query(mySqlCon, count_filter_query, count_filter_params);
    filter_query += ` order by trainner.pklConvTrainerId desc `;
    filter_query += ` LIMIT ${take} OFFSET ${skip};`;
    const trainners = await connection.query(mySqlCon, filter_query, filter_params);
    const duplicate_trainer = await connection.query(mySqlCon, query.getDuplicateTrainer, [fklDepartmentId]);

    if (trainners.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "No Trainer found"
      );
    }
    // let total_trainner = trainners.length;
    let res_data = {
      total_page: Math.ceil((total_count[0]?.count ?? 0) / take),
      total_count: total_count[0]?.count ?? 0,
      data: trainners,
      duplicate_Trainers: duplicate_trainer
    };

    return propagateResponse(
      "trainer fetched successfully", res_data, "sLoad-200", StatusCodes.OK);

  } catch (error) {
    console.error("Error in handleScheme:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message);
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//****************************************************************************************************************** */
// ------------- get assesment details ------------------
exports.handleAssesment = co.wrap(async function (postParam, fklDepartmentId) {
  let mySqlCon = null;
  let query_params = [];

  try {
    mySqlCon = await connection.getDB();

    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    }

    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    skip = skip * take;
    // Fetch all schemes
    let main_query = query.getAllAssesments;
    let count_query = query.countAllAssessments;
    query_params.push(fklDepartmentId);
    // Fetch all schemes
    let like_params = {
      SDMSBatchId: postParam.SDMSBatchId,
    };
    let equal_params = {
      batchId: postParam.batchId,
      accessorId: postParam.accessorId,
      dtAssessmentDate: postParam.dtAssessmentDate,
      vsResult: postParam.vsResult,
      dtResultDate: postParam.dtResultDate
    };
    // ------------ where with like -----------------
    let [filter_query, filter_params] = await filter_service.addFilterService(main_query, query_params, like_params, equal_params, 'assesment');
    let [count_filter_query, count_filter_params] = await filter_service.addFilterService(count_query, query_params, like_params, equal_params, 'assesment');
    const total_count = await connection.query(mySqlCon, count_filter_query, count_filter_params);
    filter_query += ` order by assesment.pklConvAssessmentId desc`;
    filter_query += ` LIMIT ${take} OFFSET ${skip};`;
    const allAssesment = await connection.query(mySqlCon, filter_query, filter_params);

    //separating bDuplicateEntry by 0 or 1
    // let uniqueAssesments = allAssesment.filter(allAssesment => allAssesment.bDuplicateEntry === 0);
    // let duplicateAssesments = allAssesment.filter(allAssesment => allAssesment.bDuplicateEntry === 1);

    if (allAssesment.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "No Assesment found");
    }
    // let total_tc = allAssesment.length;
    let res_data = {
      total_page: Math.ceil((total_count[0]?.count ?? 0) / take),
      total_count: total_count[0]?.count ?? 0,
      data: allAssesment,
      duplicate_Assesments: null
    };

    return propagateResponse(
      "assesments fetched successfully", res_data, "sLoad-200", StatusCodes.OK
    );

  } catch (error) {
    console.error("Error in handleAssesment:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//********************************************************************************************************************* */
// ------------- get placement details ------------------
exports.handlePlacement = co.wrap(async function (postParam, fklDepartmentId) {
  let mySqlCon = null;
  let query_params = [];
  try {
    mySqlCon = await connection.getDB();

    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    }
    //*********************************** */
    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    skip = skip * take;
    //********************************** */ 
    let main_query = query.getAllPlacements;
    let count_query = query.countAllPlacements;
    query_params.push(fklDepartmentId);
    if (postParam.batchId) {
      main_query += ` AND placement.batchId = ?`;
      count_query += ` AND placement.batchId = ?`;
      query_params.push(postParam.batchId);
    }
    if (postParam.candidateId) {
      main_query += ` AND placement.candidateId = ?`;
      count_query += ` AND placement.candidateId = ?`;
      query_params.push(postParam.candidateId);
    }
    if (postParam.vsPlacementType) {
      main_query += ` AND placement.vsPlacementType = ?`;
      count_query += ` AND placement.vsPlacementType = ?`;
      query_params.push(postParam.vsPlacementType);
    }
    if (postParam.bIsCandidatePlaced) {
      main_query += ` AND placement.bIsCandidatePlaced = ?`;
      count_query += ` AND placement.bIsCandidatePlaced = ?`;
      query_params.push(postParam.bIsCandidatePlaced);
    }
    if (postParam.vsEmployeerName) {
      main_query += ` AND placement.vsEmployeerName LIKE ?`;
      count_query += ` AND placement.vsEmployeerName LIKE ?`;
      query_params.push(`%${postParam.vsEmployeerName}%`);
    }
    if (postParam.vsEmployeerContactNumber) {
      main_query += ` AND placement.vsEmployeerContactNumber LIKE ?`;
      count_query += ` AND placement.vsEmployeerContactNumber LIKE ?`;
      query_params.push(`%${postParam.vsEmployeerContactNumber}%`);
    }
    if (postParam.vsPlacementState) {
      main_query += ` AND placement.vsPlacementState = ?`;
      count_query += ` AND placement.vsPlacementState = ?`;
      query_params.push(postParam.vsPlacementState);
    }
    if (postParam.vsPlacementDistrict) {
      main_query += ` AND placement.vsPlacementDistrict = ?`;
      count_query += ` AND placement.vsPlacementDistrict = ?`;
      query_params.push(postParam.vsPlacementDistrict);
    }
    if (postParam.vsMonthlySalary) {
      main_query += ` AND placement.vsMonthlySalary = ?`;
      count_query += ` AND placement.vsMonthlySalary = ?`;
      query_params.push(postParam.vsMonthlySalary);
    }
    main_query += ` GROUP BY placement.pklConvPlacementId`;

    const total_placements = await connection.query(mySqlCon, count_query, query_params);
    main_query += ` order by placement.pklConvPlacementId desc`;
    main_query += ` LIMIT ${take} OFFSET ${skip};`


    const allPlacements = await connection.query(mySqlCon, main_query, query_params);
    const duplicate_placements = await connection.query(mySqlCon, query.getDuplicatePlacement, [fklDepartmentId]);

    if (allPlacements.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "No placemnets found");
    }

    let res_data = {
      total_page: Math.ceil((total_placements[0]?.count ?? 0) / take),
      total_count: total_placements[0]?.count ?? 0,
      data: allPlacements,
      duplicate_placements: duplicate_placements

    }

    return propagateResponse(
      "placements fetched successfully", res_data, "sLoad-200", StatusCodes.OK
    );

  } catch (error) {
    console.error("Error in handlePLacement:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message);
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//************************************************************************************************************* */
// ------------- get Assesor details ------------------
exports.handleAssessor = co.wrap(async function (postParam, fklDepartmentId) {
  let mySqlCon = null;
  let query_params = [];

  try {
    mySqlCon = await connection.getDB();

    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    };
    //*********************************** */
    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    skip = skip * take;
    //********************************** */
    let main_query = query.getAllAssesor;
    let count_query = query.countAllAssesor;
    query_params.push(fklDepartmentId);
    let like_params = {
      vsAssosserName: postParam.vsAssosserName,
      vsEmail: postParam.vsEmail,
      vsMobile: postParam.vsMobile,
      vsPan: postParam.vsPan,
      vsAssesmentAgency: postParam.vsAssesmentAgency
    };
    let equal_params = {
      QPNOS: postParam.QPNOS,
      dtValidUpTo: postParam.dtValidUpTo
    };
    // Fetch all schemes
    let [filter_query, filter_params] = await filter_service.addFilterService(main_query, query_params, like_params, equal_params, 'assessor');
    let [count_filter_query, count_filter_params] = await filter_service.addFilterService(count_query, query_params, like_params, equal_params, 'assessor');
    filter_query += ` order by assessor.pklConvAssessorId desc`;
    filter_query += ` LIMIT ${take} OFFSET ${skip};`;
    const assessor = await connection.query(mySqlCon, filter_query, filter_params);
    const total_count = await connection.query(mySqlCon, count_filter_query, count_filter_params);
    const duplicate_assessor = await connection.query(mySqlCon, query.getDuplicateAssessor, [fklDepartmentId]);

    if (assessor.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "No assesor found");
    }
    // let total_assessor = assessor.length;
    let res_data = {
      total_page: Math.ceil((total_count[0]?.count ?? 0) / take),
      total_count: total_count[0]?.count ?? 0,
      data: assessor,
      duplicate_Assessors: duplicate_assessor
    };

    return propagateResponse(
      "assesor fetched successfully", res_data, "sLoad-200", StatusCodes.OK
    );
  } catch (error) {
    console.error("Error in handleAssesor:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});
//********************************************************************************************** */
exports.handleInvoice = co.wrap(async function (postParam, fklDepartmentId) {
  let mySqlCon = null;
  let query_params = [];

  try {
    mySqlCon = await connection.getDB();

    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id"
      );
    }

    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    skip = skip * take;
    // Fetch all schemes
    let main_query = query.getAllInvoices;
    let count_query = query.countAllInvoices;
    query_params.push(fklDepartmentId);
    // Fetch all schemes
    let like_params = {
      vsInvoiceTranche: postParam.vsInvoiceTranche,
      vsInvoiceNo: postParam.vsInvoiceNo,
    };
    let equal_params = {
      fklTcId: postParam.fklTcId,
      fklBatchId: postParam.fklBatchId,
      fklInvoiceType: postParam.fklInvoiceType,
      vsInvoiceDate: postParam.vsInvoiceDate,
    };
    // ------------ where with like -----------------
    let [filter_query, filter_params] = await filter_service.addFilterService(main_query, query_params, like_params, equal_params, 'invoice');
    let [count_filter_query, count_filter_params] = await filter_service.addFilterService(count_query, query_params, like_params, equal_params, 'invoice');
    filter_query += ` order by invoice.pklConvInvoiceId desc`;
    filter_query += ` LIMIT ${take} OFFSET ${skip};`;
    const invoices = await connection.query(mySqlCon, filter_query, filter_params);
    const total_count = await connection.query(mySqlCon, count_filter_query, count_filter_params);

    //separating bDuplicateEntry by 0 or 1
    // let uniqueInvoices = invoices.filter(invoices => invoices.bDuplicateEntry === 0);
    // let duplicateInvoices = invoices.filter(invoices => invoices.bDuplicateEntry === 1);

    if (invoices.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "No Invoice found"
      );
    }
    // let total_tc = invoices.length;
    let res_data = {
      total_page: Math.ceil((total_count[0]?.count ?? 0) / take),
      total_count: total_count[0]?.count ?? 0,
      data: invoices,
      duplicate_Invoices: null
    };

    return propagateResponse(
      "Invoice fetched successfully", res_data, "sLoad-200", StatusCodes.OK
    );

  } catch (error) {
    console.error("Error in handleInvoice:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//******************************************************************************************************************** */
// ------------- get scheme by scheme id ------------------
exports.getSchemeById = co.wrap(async function (postParam, fklDepartmentId, schemeId) {
  let mySqlCon = null;

  try {
    mySqlCon = await connection.getDB();
    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    }
    // Fetch all schemes
    const scheme = await connection.query(mySqlCon, query.getSchemeById, [fklDepartmentId, schemeId,]);

    if (scheme.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "No scheme found");
    }

    return propagateResponse(
      "scheme fetched successfully", scheme, "sLoad-200", StatusCodes.OK
    );
  } catch (error) {
    console.error("Error in getSchemeById:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//****************************************************************************************************************** */
//* view target by scheme id */
exports.viewTargetBySchemeId = co.wrap(async function (postParam, fklDepartmentId, schemeId) {
  let mySqlCon = null;

  try {
    mySqlCon = await connection.getDB();
    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    }
    // Fetch all schemes
    const target = await connection.query(mySqlCon, query.getTargetBySchemeId, [fklDepartmentId, schemeId,]);

    if (target.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "No target found");
    }

    return propagateResponse("Target fetched successfully", target, "sLoad-200", StatusCodes.OK);

  } catch (error) {
    console.error("Error in viewTargetBySchemeId:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//********************************************************************************************************************* */
//***** get tp by id ************* */
exports.getTpById = co.wrap(async function (postParam, fklDepartmentId, tpId) {
  let mySqlCon = null;

  try {
    mySqlCon = await connection.getDB();
    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    }

    // Fetch tp
    const tp = await connection.query(mySqlCon, query.getTpById, [fklDepartmentId, tpId,]);

    if (tp.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "No TP found");
    }

    return propagateResponse("TP fetched successfully", tp, "sLoad-200", StatusCodes.OK);

  } catch (error) {
    console.error("Error in getTPbyId:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message);

  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//******************************************************************************************************************************** */
//* view TC by TP id */
exports.viewTCbyTP = co.wrap(async function (postParam, fklDepartmentId, tpId) {
  let mySqlCon = null;

  try {
    mySqlCon = await connection.getDB();
    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId,]);

    if (user.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    }
    // Fetch all schemes
    const tc = await connection.query(mySqlCon, query.getTCbyTPid, [fklDepartmentId, tpId,]);

    if (tc.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "No TC found");
    }

    return propagateResponse("TC fetched successfully", tc, "sLoad-200", StatusCodes.OK);

  } catch (error) {
    console.error("Error in viewTCbyTP:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message
    );
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});

//******************************************************************************************************************************** */
//** handle Candidate */
exports.handleCandidate = co.wrap(async function (postParam, fklDepartmentId) {
  let mySqlCon = null;
  let query_params = [];

  try {
    mySqlCon = await connection.getDB();


    //check user
    const user = await connection.query(mySqlCon, query.checkUser, [fklDepartmentId]);

    if (user.length === 0) {
      return propagateError(
        StatusCodes.BAD_REQUEST, "sLoad-401", "Invalid department id");
    };
    //*********************************** */
    let skip = postParam.skip ?? 0;
    let take = postParam.take ?? 25;
    let duplicate_skip = postParam.duplicate_skip ?? 0;
    let duplicate_take = postParam.duplicate_take ?? 25;
    skip = skip * take;
    duplicate_skip = duplicate_skip * duplicate_take;
    let main_query;
    let count_query;
    let column_name = `cand.vsCandidateName`;
    let batch_column = 'cand.vsBatchID';
    let candidate_id_column = 'cand.vsCandidateID';
    let gender_column = 'cand.vsGender';
    let mobile_column = 'cand.vsMobileNo';
    let qualification_column = 'cand.vsEducationAttained';
    const dept_sort_name = user?.[0].vsDepartmentSortName;
    //********************************** */
    if (fklDepartmentId == 1016) {
      main_query = query.getAllHTSHCandidate;
      count_query = query.getAllHTSHCandidateCount;
    } else if (fklDepartmentId == 1017) {
      main_query = query.getAllNulmCandidate;
      count_query = query.getAllNulmCandidateCount;
    } else if (fklDepartmentId == 1012) {
      main_query = query.getAllJJMCandidate;
      count_query = query.getAllJJMCandidateCount;
    } else {
      // main_query = query.getAllCandidate;
      main_query = query.completeAllCandidateDetailsQ;
      count_query = query.countAllCandidate;
      query_params.push(fklDepartmentId);
      column_name = 'cand.vsCandidateName';
      batch_column = 'cand.batchId'
      candidate_id_column = 'cand.candidateId';
      gender_column = 'cand.vsGender';
      mobile_column = 'cand.vsMobile';
      qualification_column = 'cand.vsEducationAttained';
    }
    if (postParam.vsCandidateName) {
      main_query += ` AND ${column_name} LIKE ?`;
      count_query += ` AND ${column_name} LIKE ?`;
      query_params.push(`%${postParam.vsCandidateName}%`)
    }
    // if (postParam.batchId) {
    //   main_query += ` AND ${batch_column} = ?`;
    //   count_query += ` AND ${batch_column} = ?`;
    //   query_params.push(`${postParam.batchId}`)
    // }
    if (postParam.candidateId && dept_sort_name != "ASDM") {
      main_query += ` AND ${candidate_id_column} = ?`;
      count_query += ` AND ${candidate_id_column} = ?`;
      query_params.push(`${postParam.candidateId}`)
    }
    // if (postParam.gender) {
    //   main_query += ` AND ${gender_column} = ?`;
    //   count_query += ` AND ${gender_column} = ?`;
    //   query_params.push(`${postParam.gender}`)
    // }
    if (postParam.mobile) {
      main_query += ` AND ${mobile_column} LIKE ?`;
      count_query += ` AND ${mobile_column} LIKE ?`;
      query_params.push(`%${postParam.mobile}%`)
    }
    // if (postParam.qualification) {
    //   main_query += ` AND ${qualification_column} = ?`;
    //   count_query += ` AND ${qualification_column} = ?`;
    //   query_params.push(`${postParam.qualification}`)
    // }
    // main_query += ` GROUP BY cand.pklCandidateBasicId`;

    main_query += ` ORDER BY id DESC`;

    const total_candidate = await connection.query(mySqlCon, count_query, query_params);
//console.log("Main Query ",main_query);
    main_query += ` LIMIT ${take} OFFSET ${skip};`;

    const candidate = await connection.query(mySqlCon, main_query, query_params);


    if (candidate.length === 0) {
      return propagateError(StatusCodes.BAD_REQUEST, "sLoad-401", "No candidate found");
    }


    // let duplicate_candidate = [];
    // let count_duplicate_candidate = [];
    // if (postParam.duplicateQuery) {
    //   const criteria = postParam.duplicateQuery;
    //   let sqlQuery = getDuplicateCandidateQuery(criteria);
    //   sqlQuery += ` LIMIT ${duplicate_take} OFFSET ${duplicate_skip};`;
    //   let countSqlQuery = await duplicate_sql_queries.countDuplicateCandidateQuery(criteria);
    //   duplicate_candidate = await connection.query(mySqlCon, sqlQuery, [fklDepartmentId]);
    //   count_duplicate_candidate = await connection.query(mySqlCon, countSqlQuery, [fklDepartmentId]);
    // }

    let duplicate_candidate = [];
    let count_duplicate_candidate = [];


    if (postParam.duplicateType == "ownDept") {
      let mainQ = query.dupCand;
      let count_query = query.countDupCand;
      count_duplicate_candidate = await connection.query(mySqlCon, count_query, [fklDepartmentId]);


      mainQ += ` LIMIT ${duplicate_take} OFFSET ${duplicate_skip};`;
      duplicate_candidate = await connection.query(mySqlCon, mainQ, [fklDepartmentId]);
    } else if (postParam.duplicateType == "crossDept") {
      let dupMain = query.dupCandCross
      let count_query = query.countDupCandCross;
      count_duplicate_candidate = await connection.query(mySqlCon, count_query, [fklDepartmentId]);
      dupMain += ` LIMIT ${duplicate_take} OFFSET ${duplicate_skip};`;
      duplicate_candidate = await connection.query(mySqlCon, dupMain, [fklDepartmentId]);
    }

    function getDuplicateCandidateQuery(criteria) {
      let groupByClause = criteria.map(col => `candidate.${col}`).join(', ');
      // let groupByClause = criteria.map(col => {
      //   if (col === "vsCandidateName") {
      //     return "SUBSTRING_INDEX(candidate.vsCandidateName, ' ', 1)";
      //   } else {
      //     return `candidate.${col}`
      //   }
      // }).join(', ');
      let criteriaSelect = criteria.map(col => `${col}`).join(', ');
      let havingClause = `HAVING COUNT(DISTINCT fklDepartmentId) > 1`;

      // Dynamic condition mapping between the two tables
      let mappedConditions = criteria.map(col => {
        if (col === "vsCandidateName") return "candidate.vsCandidateName = ds_candidate.vsCertName";
        if (col === "vsDOB") return "candidate.vsDOB = ds_candidate.dtDOB";
        if (col === "vsMobile") return "candidate.vsMobile = contact.vsPrimaryMobileNo";
        if (col === "vsUUID") return "candidate.vsUUID = ds_candidate.UUID";
        if (col === "vsGender") return "candidate.vsGender = ds_candidate.vsGender";
        // if (col === "vsCandidateName") return "SUBSTRING_INDEX(candidate.vsCandidateName, ' ', 1)  = SUBSTRING_INDEX(ds_candidate.vsCertName, ' ', 1)";
        return `candidate.${col} = ds_candidate.${col}`; // Default fallback
      }).join(" AND ");

      return `
          SELECT 
              candidate.vsCandidateName, 
              DATE_FORMAT(candidate.vsDOB, '%d-%m-%Y') AS vsDOB,
              candidate.vsUUID,
              candidate.vsMobile,
              gender.vsGenderName,
              dept.vsDepartmentName
          FROM nw_convergence_candidate_basic_dtl candidate
          JOIN nw_convergence_department_master dept 
              ON candidate.fklDepartmentId = dept.pklDepartmentID
          JOIN nw_mams_gender gender
              ON candidate.vsGender = gender.pklGenderId
          WHERE (${groupByClause}) IN (
              SELECT ${criteriaSelect}
              FROM nw_convergence_candidate_basic_dtl 
              GROUP BY ${criteriaSelect}
              ${havingClause}
          )
          AND EXISTS (
              SELECT 1 FROM nw_convergence_candidate_basic_dtl sub_candidate
              WHERE sub_candidate.${criteria[0]} = candidate.${criteria[0]}
              ${criteria.length > 1 ? `AND sub_candidate.${criteria[1]} = candidate.${criteria[1]}` : ""}
              AND sub_candidate.fklDepartmentId = ?
          )
          or EXISTS (
              SELECT 1 FROM ds.nw_candidate_basic_dtl ds_candidate
              LEFT JOIN ds.nw_candidate_contact_dtl contact 
                  ON ds_candidate.pklCandidateId = contact.fklCandidateId
              WHERE ${mappedConditions}
          )
                
          UNION ALL

          SELECT 
              ds_candidate.vsCertName AS vsCandidateName,
              DATE_FORMAT(ds_candidate.dtDOB, '%d-%m-%Y') AS vsDOB,
              ds_candidate.UUID AS vsUUID,
              contact.vsPrimaryMobileNo AS vsMobile,
              ds_candidate.vsGender AS vsGenderName,  
              'ASDM' AS vsDepartmentName
          FROM ds.nw_candidate_basic_dtl ds_candidate
          LEFT JOIN ds.nw_candidate_contact_dtl contact 
              ON ds_candidate.pklCandidateId = contact.fklCandidateId
          WHERE EXISTS (
              SELECT 1 FROM nw_convergence_candidate_basic_dtl candidate
              WHERE ${mappedConditions}
          )

          ORDER BY vsCandidateName, vsDepartmentName
      `;
    }



    let res_data = {
      total_page: Math.ceil((total_candidate[0]?.count ?? 0) / take),
      total_count: total_candidate[0]?.count ?? 0,
      data: candidate,
      duplicate_candidate: duplicate_candidate,
      duplicate_total_count: count_duplicate_candidate?.[0]?.count ?? 0,
      duplicate_total_page: Math.ceil((count_duplicate_candidate?.[0]?.count ?? 0) / duplicate_take),

    };

    return propagateResponse(
      "Schemes fetched successfully", res_data, "sLoad-200", StatusCodes.OK);
  } catch (error) {
    console.error("Error in handleScheme:", error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-500", error.message);

  } finally {
    if (mySqlCon) mySqlCon.release();
  }

})