const query = {
    getCandidateById: `SELECT cand.pklCandidateBasicId AS id,
                    CASE WHEN cand.bDropout = 1 THEN 'YES'
                    WHEN cand.bDropout = 0 THEN 'NO'
                    ELSE ''
                    END AS dropout,
                    cand.vsCandidateKey, cand.fklDepartmentId AS departmentId, cand.candidateId AS candidateId, 
                    cand.vsCandidateName AS vsCandidateName, cand.vsDOB AS vsDOB, cand.vsFatherName,cand.vsGender, gender.vsGenderName,cand.vsEducationAttained, 
                    cand.vsUUID AS UUID, religion.vsReligionName AS religion, 
                    caste.vsCasteName AS caste,  qual.vsQualification,
                                                CASE WHEN cand.bDisability = 1 THEN 'YES' 
                                                WHEN cand.bDisability = 0 THEN 'NO'
                                                ELSE ''
                                                END AS disability,
                                                CASE WHEN cand.bTeaTribe = 1 THEN 'YES' 
                                                WHEN cand.bTeaTribe = 0 THEN 'NO'
                                                ELSE ''
                                                END AS teaTribe,
                                                CASE WHEN cand.bBPLcardHolder = 1 THEN 'YES' 
                                                WHEN cand.bBPLcardHolder = 0 THEN 'NO'
                                                ELSE ''
                                                END AS BPLcardHolder,
                                                CASE WHEN cand.bMinority = 1 THEN 'YES' 
                                                WHEN cand.bMinority = 0 THEN 'NO'
                                                ELSE ''
                                                END AS Minority,
                                                batch.iBatchNumber AS batchNo, batch.dtStartDate AS startDate, batch.dtEndDate AS endDate,
                                                course.vsCourseName AS courseName,
                                               tc.vsTcName AS TC, tc.vsAddress AS tcAddress,
                                               dept.vsDepartmentName ,
                                               tp.vsTpName AS TP,
                                               tp.vsAddress AS tpAddress,
                                               sector.vsSectorName AS sector,
                                               CASE WHEN place.bIsCandidatePlaced = 1 THEN 'YES'
                                                   WHEN place.bIsCandidatePlaced = 0 THEN 'NO'
                                                   ELSE 'N/A' END AS candidatePlaced,
                                                   place.vsPlacementType AS placementType,
                                                   assesment.vsResult,
                                                   assesment.bAssessed as assessmentComplete
                               
                FROM nw_convergence_candidate_basic_dtl cand
                LEFT JOIN nw_mams_gender gender on gender.pklGenderId = cand.vsGender
                LEFT JOIN nw_mams_religion religion on religion.pklReligionId = cand.fklReligionId
                LEFT JOIN nw_mams_caste caste ON caste.pklCasteId = cand.fklCategoryId
                LEFT JOIN nw_mams_qualification qual ON qual.pklQualificationId = cand.vsEducationAttained
                LEFT JOIN nw_convergence_batch_dtl batch ON batch.pklBatchId = cand.batchId
                LEFT JOIN nw_convergence_course_dtl course ON course.pklCourseId = batch.fklCourseId
                LEFT JOIN nw_convergence_tc_dtl tc ON tc.pklTcId = batch.fklTcId
                LEFT JOIN nw_convergence_tp_dtl tp ON tp.pklTpId = tc.fklTpId
                LEFT JOIN nw_convergence_sector_master_dtl sector ON sector.pklSectorId = batch.fklSectorId
                LEFT JOIN nw_convergence_placement_dtl place ON place.candidateId = cand.pklCandidateBasicId
                LEFT JOIN nw_convergence_assessement_dtl AS assesment ON  assesment.batchId= batch.pklBatchId
                LEFT JOIN nw_convergence_department_master dept ON dept.pklDepartmentId = cand.fklDepartmentId
                WHERE cand.fklDepartmentId = ? AND cand.pklCandidateBasicId = ?;`,
    
  getByQpnos: `select course.vsCourseName , sector.vsSectorName ,sector.pklSectorId,date_format(config.dtFromDate, '%y-%m-%d') as dtFromDate , date_format(config.dtToDate, '%y-%m-%d') as dtToDate
            from nw_coms_course course 
            left join nw_coms_course_config config on course.pklCourseId = config.fklCourseId
            left join nw_coms_sector sector on sector.pklSectorId = course.fklSectorId
            where course.vsCourseCode= ?;`,
  getAssessorName: `select pklConvAssessorId,concat(vsAssosserName, " (", vsPan, ")") as vsAssosserName from nw_convergence_assessor_dtl where fklDepartmentId=?`,
  courseCodeNew: `select vsCourseCode as QPNOS ,pklCourseId as ID from nw_convergence_course_dtl where fklDepartmentId=?`,
  //get logged user details
  getLoggedSortName: `SELECT dept.vsDepartmentSortName as sortName FROM nw_convergence_department_master AS dept WHERE pklDepartmentId=?`,
  //get QPNOS
  getQPNOS: `SELECT QPNOS,pklBatchId as ID FROM nw_convergence_batch_dtl WHERE fklDepartmentId=?`,
  //get QPNOS
  getQPNOSAll: `select vsCourseCode from nw_coms_course where bEnabled =1 group by vsCourseCode asc;`,
  //get batch candidate
  getBatchCandidate: `SELECT  pklBatchId AS id, iBatchNumber FROM nw_convergence_batch_dtl WHERE fklDepartmentId=?`,
  //scheme name master
  getSchemeName: `SELECT pklSchemeId,vsSchemeName FROM nw_scms_scheme
            UNION
                SELECT distinct pklSchemeId,vsSchemeName FROM nw_convergence_scheme_dtl
            UNION
                SELECT "other" AS pklSchemeId, "Add New Scheme" AS vsSchemeName;`,
  //scheme type master
//   getSchemeType: `SELECT pklSchemeTypeId , vsSchemeType FROM nw_mams_convergence_scheme_type`,
  //funding type master
//   getFundingType: `SELECT pklFundingTypeId , vsFundingType FROM nw_mams_convergence_funding_type`,
  //target type master
  getTargetType: `SELECT pklTargetTypeId , vsTargetType FROM nw_mams_convergence_target_type`,
  //department master
  getAllDepartment: `SELECT pklEntityId as value, vsEntityName  as label, vsEntityCode 
                       FROM nw_enms_entity 
                       where fklRoleId = 1
                       ORDER BY label ASC;`,
  // validate dept
  checkUser: `SELECT * FROM nw_convergence_department_master WHERE pklDepartmentId=?`,

  //get schemes by dept
  getAllSchemes: `SELECT scheme.*,scheme.vsSchemeFundingType,COUNT(target.pklTargetId) AS count,dept.vsDepartmentName as vsDepartmentName
                  FROM nw_convergence_scheme_dtl scheme
                  LEFT JOIN nw_convergence_target_dtl target ON target.fklSchemeId = scheme.pklSchemeId

          
            LEFT JOIN nw_convergence_department_master as dept 
            ON scheme.fklDepartmentId = dept.pklDepartmentId
                  WHERE scheme.fklDepartmentId = ? `,

  // scheme count by dept
  countAllSchemes: `SELECT COUNT(pklSchemeId) as count
                    FROM nw_convergence_scheme_dtl scheme
                    WHERE scheme.fklDepartmentId = ?`,

  //get count of target by scheme id
  getTargetCountBySchemeId: `SELECT COUNT(*) AS count FROM nw_convergence_target_dtl WHERE fklDepartmentId=? AND fklSchemeId=?`,

  // get all course by dept
  getAllCourse: `SELECT conv.pklCourseId, conv.fklDepartmentId, conv.vsCourseName, conv.vsCourseCode, 
                 conv.dtFromDate, conv.dtToDate, conv.iTheoryDurationInHours, conv.iPracticalDurationInHours,
                 sector.vsSectorName, conv.bDuplicateEntry,tc.vsTcName  
                 FROM nw_convergence_course_dtl conv
                 LEFT JOIN nw_coms_sector sector on sector.pklSectorId = conv.fklSectorId
                 LEFT JOIN nw_convergence_tc_dtl tc on tc.pklTcId = conv.fklTcId
                 WHERE conv.fklDepartmentId=?`,

  //course count by dept
  countAllCourse: `SELECT COUNT(conv.pklCourseId) as count
                   FROM nw_convergence_course_dtl as conv WHERE conv.fklDepartmentId = ? `,

  //get all TP by dept
  getAllTp: `SELECT tp.pklTpId, tp.fklDepartmentId, tp.vsTpName,CONCAT(REPEAT('*', LENGTH(tp.vsPan) - 4), RIGHT(tp.vsPan, 4)) AS vsPan, tp.vsAddress,dpt.vsDepartmentName
-- tp.vsSpocEmail, tp.iSpocContactNum, state.vsStateName AS vsState,dist.vsDistrictName AS vsDistrict, block.vsTalukaName, tp.vsVillage, tp.vsAddress, tp.vsSpocName, tp.vsSmartId, tp.vsCity,ulb.vsUlbName, tp.isCityVillage, tp.bDuplicateEntry,tp.vsPan
             FROM nw_convergence_tp_dtl tp
             -- LEFT JOIN nw_convergence_tc_dtl tc ON tc.fklTpId = tp.pklTpId
             -- LEFT JOIN nw_mams_state state ON state.pklStateId = tp.vsState
             -- LEFT JOIN nw_mams_district dist ON dist.pklDistrictId = tp.vsDistrict
             -- LEFT JOIN nw_mams_taluka block ON block.pklTalukaId = tp.vsBlock
             -- LEFT JOIN nw_mams_ulb ulb ON ulb.pklUlbId = tp.vsULB
             LEFT JOIN nw_convergence_department_master dpt ON dpt.pklDepartmentId = tp.fklDepartmentId
             WHERE dpt.pklDepartmentId = ?`,

  //count TP by dept
  countAllTp: `SELECT COUNT(pklTpId) as count
               FROM nw_convergence_tp_dtl as tp WHERE fklDepartmentId = ?`,

  //get all TC by dept
  getAllTc: `SELECT tc.vsTcName,tc.vsAddress,tc.vsLatitude,tc.vsLongitude,
    tp.vsTpName,tp.vsAddress as vsTpAddress,
    state.vsStateName as vsState,
    dist.vsDistrictName AS vsDistrict,
    dept.vsDepartmentName 
    FROM nw_convergence_tc_dtl as tc
    LEFT JOIN nw_convergence_department_master dept ON dept.pklDepartmentId = tc.fklDepartmentId 
    LEFT JOIN nw_convergence_tp_dtl as tp ON tp.pklTpId = tc.fklTpId
    LEFT JOIN nw_mams_state state ON state.pklStateId = tc.vsState
    LEFT JOIN nw_mams_district dist ON dist.pklDistrictId = tc.vsDistrict
    WHERE tc.fklDepartmentId = ?`,

  countAllTc: `SELECT COUNT(pklTcId) AS count FROM nw_convergence_tc_dtl as tc WHERE fklDepartmentId = ?`,
  //get all batch by dept
  getAllBatch: `SELECT DISTINCT batch.pklBatchId,
batch.iBatchNumber, 
batch.iBatchTarget,
batch.dtStartDate,
batch.dtEndDate,
batch.dtcreatedAt,
tc.vsTcName AS tcName,
tc.vsAddress AS tcAddress,
course.vsCourseName,
target.vsTargetNo,
count(cand.batchId) as totalCandidate
FROM nw_convergence_batch_dtl AS batch
LEFT JOIN nw_convergence_tc_dtl tc ON tc.pklTcId = batch.fklTcId
left join nw_convergence_candidate_basic_dtl cand on cand.batchId = batch.pklBatchId 
LEFT JOIN nw_convergence_course_dtl AS course ON course.pklCourseId = batch.fklCourseId
LEFT JOIN nw_convergence_target_dtl AS target ON target.pklTargetId = batch.fklTargetId
WHERE batch.fklDepartmentId= ? `,
  countAllBatch: `SELECT COUNT(pklBatchId) AS count FROM nw_convergence_batch_dtl as batch WHERE fklDepartmentId = ?`,

  //get all target by dept
  getAllTarget: `SELECT target.pklTargetId, target.pklTargetId, target.vsTargetNo, target.vsSchemeCode as vsSchemeCode, target.iTotalTarget,DATE_FORMAT(target.dtTargetDate, '%d-%m-%Y') as dtTargetDate, target.dtCreatedAt,
tt.vsTargetType,target.bDuplicateEntry,dept.vsDepartmentName 
FROM nw_convergence_target_dtl as target
LEFT JOIN nw_mams_convergence_target_type tt ON tt.pklTargetTypeId = target.vsTargetType
LEFT JOIN nw_convergence_department_master dept ON dept.pklDepartmentId = target.fklDepartmentId
WHERE target.fklDepartmentId = ?`,
  countAllTarget: `SELECT COUNT(pklTargetId) AS count FROM nw_convergence_target_dtl as target WHERE fklDepartmentId = ?`,

  // get all candidate
  getAllCandidate: `SELECT cand.pklCandidateBasicId, cand.fklDepartmentId, cand.candidateId, batch.iBatchNumber,
                    cand.vsCandidateName, cand.vsDOB, cand.iAge, gen.vsGenderName as pklGenderId, cand.vsMobile, qual.vsQualification as pklQualificationId, cand.bDuplicateEntry
                    FROM nw_convergence_candidate_basic_dtl cand
                    LEFT JOIN nw_convergence_batch_dtl batch ON batch.pklBatchId = cand.batchId
                    LEFT JOIN nw_mams_gender gen ON gen.pklGenderId = cand.vsGender
                    LEFT JOIN nw_mams_qualification qual ON qual.pklQualificationId = cand.vsEducationAttained
                    WHERE cand.fklDepartmentId = ? `,

  completeAllCandidateDetailsQ: `
                    SELECT cand.pklCandidateBasicId AS id,
                    CASE WHEN cand.bDropout = 1 THEN 'YES'
                    WHEN cand.bDropout = 0 THEN 'NO'
                    ELSE ''
                    END AS dropout,
                    cand.vsCandidateKey,cand.vsCandidateKey, cand.fklDepartmentId AS departmentId, cand.candidateId AS candidateId, 
                    cand.vsCandidateName AS vsCandidateName, cand.vsDOB AS vsDOB, cand.vsFatherName,cand.vsGender, gender.vsGenderName,cand.vsEducationAttained, 
                    cand.vsUUID AS UUID, religion.vsReligionName AS religion, 
                    caste.vsCasteName AS caste,  qual.vsQualification,
                                                CASE WHEN cand.bDisability = 1 THEN 'YES' 
                                                WHEN cand.bDisability = 0 THEN 'NO'
                                                ELSE ''
                                                END AS disability,
                                                CASE WHEN cand.bTeaTribe = 1 THEN 'YES' 
                                                WHEN cand.bTeaTribe = 0 THEN 'NO'
                                                ELSE ''
                                                END AS teaTribe,
                                                CASE WHEN cand.bBPLcardHolder = 1 THEN 'YES' 
                                                WHEN cand.bBPLcardHolder = 0 THEN 'NO'
                                                ELSE ''
                                                END AS BPLcardHolder,
                                                CASE WHEN cand.bMinority = 1 THEN 'YES' 
                                                WHEN cand.bMinority = 0 THEN 'NO'
                                                ELSE ''
                                                END AS Minority,
                                                batch.iBatchNumber AS batchNo, batch.dtStartDate AS startDate, batch.dtEndDate AS endDate,
                                                course.vsCourseName AS courseName,
                                               tc.vsTcName AS TC, tc.vsAddress AS tcAddress,
                                               dept.vsDepartmentName ,
                                               tp.vsTpName AS TP,
                                               tp.vsAddress AS tpAddress,
                                               sector.vsSectorName AS sector,
                                               CASE WHEN place.bIsCandidatePlaced = 1 THEN 'YES'
                                                   WHEN place.bIsCandidatePlaced = 0 THEN 'NO'
                                                   ELSE 'N/A' END AS candidatePlaced,
                                                   place.vsPlacementType AS placementType,
                                                   assesment.vsResult
                               
                FROM nw_convergence_candidate_basic_dtl cand
                LEFT JOIN nw_mams_gender gender on gender.pklGenderId = cand.vsGender
                LEFT JOIN nw_mams_religion religion on religion.pklReligionId = cand.fklReligionId
                LEFT JOIN nw_mams_caste caste ON caste.pklCasteId = cand.fklCategoryId
                LEFT JOIN nw_mams_qualification qual ON qual.pklQualificationId = cand.vsEducationAttained
                LEFT JOIN nw_convergence_batch_dtl batch ON batch.pklBatchId = cand.batchId
                LEFT JOIN nw_convergence_course_dtl course ON course.pklCourseId = batch.fklCourseId
                LEFT JOIN nw_convergence_tc_dtl tc ON tc.pklTcId = batch.fklTcId
                LEFT JOIN nw_convergence_tp_dtl tp ON tp.pklTpId = tc.fklTpId
                LEFT JOIN nw_convergence_sector_master_dtl sector ON sector.pklSectorId = batch.fklSectorId
                LEFT JOIN nw_convergence_placement_dtl place ON place.candidateId = cand.pklCandidateBasicId
                LEFT JOIN nw_convergence_assessement_dtl AS assesment ON  assesment.batchId= batch.pklBatchId
                LEFT JOIN nw_convergence_department_master dept ON dept.pklDepartmentId = cand.fklDepartmentId
                WHERE cand.fklDepartmentId = ? `,

  // --- START OLD CODE 30-04-2025 -------

  //     completeAllCandidateDetailsQ: `
  //     SELECT cand.pklCandidateBasicId AS id,cand.vsCandidateKey,cand.vsCandidateKey, cand.fklDepartmentId AS departmentId, cand.candidateId AS candidateId,
  //     cand.vsCandidateName AS vsCandidateName, cand.vsDOB AS vsDOB, cand.vsFatherName,cand.vsGender, gender.vsGenderName,cand.vsEducationAttained,
  //     cand.vsUUID AS UUID, religion.vsReligionName AS religion,
  //     caste.vsCasteName AS caste, cand.vsMobile AS vsMobile, qual.vsQualification,
  //                                 CASE WHEN cand.bDisability = 1 THEN 'YES'
  //                                 WHEN cand.bDisability = 0 THEN 'NO'
  //                                 ELSE 'N/A'
  //                                 END AS disability,
  //                                 CASE WHEN cand.bTeaTribe = 1 THEN 'YES'
  //                                 WHEN cand.bTeaTribe = 0 THEN 'NO'
  //                                 ELSE 'N/A'
  //                                 END AS teaTribe,
  //                                 CASE WHEN cand.bBPLcardHolder = 1 THEN 'YES'
  //                                 WHEN cand.bBPLcardHolder = 0 THEN 'NO'
  //                                 ELSE 'N/A'
  //                                 END AS BPLcardHolder,
  //                                 CASE WHEN cand.bMinority = 1 THEN 'YES'
  //                                 WHEN cand.bMinority = 0 THEN 'NO'
  //                                 ELSE 'N/A'
  //                                 END AS Minority,
  //                                 batch.iBatchNumber AS batchNo, batch.SDMSid AS SDMSBatchId, batch.dtStartDate AS startDate, batch.dtEndDate AS endDate,
  //                                 course.vsCourseName AS courseName, course.vsCourseCode AS courseCode,
  //                                tc.vsTcName AS TC, tc.iPartnerCode AS tcPartnerCode, tc.vsSpocName AS tcSpocName, tc.iSpocContactNum AS tcSpocContactNo, tc.vsAddress AS tcAddress,
  // tc.vsSpocEmail AS tcSpocEmail, tc.vsVillage AS tcVillage, tc.vsCity AS tcCity, tcstate.vsStateName AS tcState, tcdist.vsDistrictName AS tcDistrict,
  // tcblock.vsTalukaName AS tcBlock, tculb.vsUlbName AS tcUlb, tc.smartId AS smartId, tc.vsLongitude AS tcLongitude, tc.vsLatitude AS tcLatitude,
  // tcassembly.vsConstituencyName AS tcAssembly, tcloksabha.vsConstituencyName AS tcLoksabha,
  // dept.vsDepartmentName ,
  // tp.vsTpName AS TP, tp.vsTpCode AS tpCode, tp.vsSpocName AS tpSpocName, tp.iSpocContactNum AS tpSpocContactNo, tp.vsSpocEmail AS tpSpocEmail, tpstate.vsStateName AS state,
  // tpdist.vsDistrictName AS district, tp.vsAddress AS tpAddress, tp.vsVillage AS tpVillage, tp.vsCity AS tpCity, tpblock.vsTalukaName AS tpBlock,
  // tpulb.vsUlbName AS tpULB, tp.vsSmartId AS tpSmartId,
  // sector.vsSectorName AS sector,CASE WHEN place.bIsCandidatePlaced = 1 THEN 'YES'
  //                                    WHEN place.bIsCandidatePlaced = 0 THEN 'NO'
  //                                    ELSE 'N/A' END AS candidatePlaced,
  // place.vsEmployeerName AS employeerName,place.vsEmployeerContactNumber AS EmployeerContactNumber, place.vsPlacementType AS placementType,
  // pstate.vsStateName AS placementState, pdist.vsDistrictName AS placementDistrict, place.vsMonthlySalary AS salary

  // FROM nw_convergence_candidate_basic_dtl cand
  // LEFT JOIN nw_mams_gender gender on gender.pklGenderId = cand.vsGender
  // LEFT JOIN nw_mams_religion religion on religion.pklReligionId = cand.fklReligionId
  // LEFT JOIN nw_mams_caste caste ON caste.pklCasteId = cand.fklCategoryId
  // LEFT JOIN nw_mams_qualification qual ON qual.pklQualificationId = cand.vsEducationAttained
  // LEFT JOIN nw_convergence_batch_dtl batch ON batch.pklBatchId = cand.batchId
  // LEFT JOIN nw_convergence_course_dtl course ON course.pklCourseId = batch.fklCourseId
  // LEFT JOIN nw_convergence_tc_dtl tc ON tc.pklTcId = course.fklTcId
  // LEFT JOIN nw_mams_state tcstate ON tcstate.pklStateId = tc.vsState
  // LEFT JOIN nw_mams_district tcdist ON tcdist.pklDistrictId = tc.vsDistrict
  // LEFT JOIN nw_mams_taluka tcblock ON tcblock.pklTalukaId = tc.vsBlock
  // LEFT JOIN nw_mams_ulb tculb ON tculb.pklUlbId = tc.vsULB
  // LEFT JOIN nw_mams_constituency_assembly tcassembly ON tcassembly.pklAssemblyConstituencyId = tc.fklAssemblyConstituencyId
  // LEFT JOIN nw_mams_constituency_loksabha tcloksabha ON tcloksabha.pklLoksabhaConstituencyId = tc.fklLoksabhaConstituencyId
  // LEFT JOIN nw_convergence_tp_dtl tp ON tp.pklTpId = tc.fklTpId
  // LEFT JOIN nw_mams_state tpstate ON tpstate.pklStateId = tp.vsState
  // LEFT JOIN nw_mams_district tpdist ON tpdist.pklDistrictId = tp.vsDistrict
  // LEFT JOIN nw_mams_taluka tpblock ON tpblock.pklTalukaId = tp.vsBlock
  // LEFT JOIN nw_mams_ulb tpulb ON tpulb.pklUlbId = tp.vsULB
  // LEFT JOIN nw_convergence_sector_master_dtl sector ON sector.pklSectorId = batch.fklSectorId
  // LEFT JOIN nw_convergence_placement_dtl place ON place.candidateId = cand.pklCandidateBasicId
  // LEFT JOIN nw_mams_state pstate ON pstate.pklStateId = place.vsPlacementState
  // LEFT JOIN nw_mams_district pdist ON pdist.pklDistrictId = place.vsPlacementDistrict
  // LEFT JOIN nw_convergence_department_master dept ON dept.pklDepartmentId = cand.fklDepartmentId
  // WHERE cand.fklDepartmentId = ? `,

  // ---- END OLD CODE 30-04-2025 --------

  //candidate count
  countAllCandidate: ` SELECT COUNT(*) as count
FROM nw_convergence_candidate_basic_dtl cand
LEFT JOIN nw_mams_gender gender on gender.pklGenderId = cand.vsGender
LEFT JOIN nw_mams_religion religion on religion.pklReligionId = cand.fklReligionId
LEFT JOIN nw_mams_caste caste ON caste.pklCasteId = cand.fklCategoryId
LEFT JOIN nw_mams_qualification qual ON qual.pklQualificationId = cand.vsEducationAttained
LEFT JOIN nw_convergence_batch_dtl batch ON batch.pklBatchId = cand.batchId
LEFT JOIN nw_convergence_course_dtl course ON course.pklCourseId = batch.fklCourseId
LEFT JOIN nw_convergence_tc_dtl tc ON tc.pklTcId = batch.fklTcId
LEFT JOIN nw_convergence_tp_dtl tp ON tp.pklTpId = tc.fklTpId
LEFT JOIN nw_convergence_sector_master_dtl sector ON sector.pklSectorId = batch.fklSectorId
LEFT JOIN nw_convergence_placement_dtl place ON place.candidateId = cand.pklCandidateBasicId
LEFT JOIN nw_convergence_assessement_dtl AS assesment ON  assesment.batchId= batch.pklBatchId
LEFT JOIN nw_convergence_department_master dept ON dept.pklDepartmentId = cand.fklDepartmentId
WHERE cand.fklDepartmentId = ? `,
  getAllHTSHCandidate: `SELECT htss.pklLegacyDataId as pklCandidateBasicId,htss.vsCandidateID as candidateId,htss.vsAge as iAge,htss.vsGender as pklGenderId,htss.vsCandidateName,htss.vsMobileNo as vsMobile,htss.vsEducationAttained as pklQualificationId ,htss.candidateDOB as vsDOB FROM nw_legacy_dtl_handloom_textile_sericulture_sericulture as htss`,
  getAllHTSHCandidateCount: `SELECT COUNT(*) as count FROM nw_legacy_dtl_handloom_textile_sericulture_sericulture`,
  getAllNulmCandidate: `SELECT nulm.pklLegacyDataId as pklCandidateBasicId,nulm.vsCandidateID as candidateId,nulm.vsAge as iAge,nulm.vsGender as pklGenderId,nulm.vsCandidateName,nulm.vsMobileNo as vsMobile,nulm.vsEducationAttained as pklQualificationId,nulm.candidateDOB as vsDOB FROM nw_legacy_dtl_nulm as nulm`,
  getAllJJMCandidate: `SELECT jjm.pklLegacyDataId as pklCandidateBasicId,jjm.vsCandidateID as candidateId,jjm.vsAge as iAge,jjm.vsGender as pklGenderId,jjm.vsCandidateName,jjm.vsMobileNo as vsMobile,jjm.vsEducationAttained as pklQualificationId,jjm.candidateDOB as vsDOB FROM nw_legacy_dtl_public_health_engineering_department as jjm WHERE 1=1 `,
  getAllNulmCandidateCount: `SELECT COUNT(*) as count FROM nw_legacy_dtl_nulm`,
  getAllJJMCandidateCount: `SELECT COUNT(*) as count FROM nw_legacy_dtl_public_health_engineering_department WHERE 1=1 `,

  //get all trainer by dept
  getAllTrainer: `SELECT *,tc.vsTcName FROM nw_convergence_trainer_dtl as trainner 
    LEFT JOIN nw_convergence_tc_dtl as tc ON trainner.fklTcId = tc.pklTcId
    WHERE trainner.fklDepartmentId=?`,
  countAllTrainer: `SELECT COUNT(pklConvTrainerId) AS count FROM nw_convergence_trainer_dtl as trainner WHERE fklDepartmentId = ?`,
  //get all assesments by dept
  getAllAssesments: `SELECT *,batch.iBatchNumber as batchId FROM nw_convergence_assessement_dtl as assesment 
    LEFT JOIN nw_convergence_batch_dtl as batch ON batch.pklBatchId = assesment.batchId
     WHERE assesment.fklDepartmentId=?`,
  countAllAssessments: `SELECT COUNT(pklConvAssessmentId) AS count FROM nw_convergence_assessement_dtl as assesment WHERE fklDepartmentId=?`,

  getAllInvoices: `SELECT * FROM nw_convergence_invoice_dtl as invoice WHERE fklDepartmentId=?`,
  countAllInvoices: `SELECT COUNT(pklConvInvoiceId) AS count FROM nw_convergence_invoice_dtl as invoice WHERE fklDepartmentId=?`,

  //get all placements by dept
  getAllPlacements: `SELECT 
    placement.pklConvPlacementId, 
    placement.fklDepartmentId, 
    batch.iBatchNumber as batchId,
     MAX(candidate.candidateId) AS candidateId,
    MAX(candidate.vsCandidateName) AS vsCandidateName,
    CASE 
        WHEN MAX(placement.bIsCandidatePlaced) = 1 THEN 'Yes' 
        WHEN MAX(placement.bIsCandidatePlaced) = 0 THEN 'No' 
        ELSE 'Unknown' 
    END AS status,
    MAX(placement.vsEmployeerName) AS vsEmployeerName, 
    MAX(placement.vsPlacementType) AS vsPlacementType,
    MAX(placement.vsEmployeerContactNumber) AS vsEmployeerContactNumber, 
    MAX(dist.vsDistrictName) AS vsDistrictName,
    MAX(state.vsStateName) AS vsStateName, 
    MAX(placement.vsMonthlySalary) AS vsMonthlySalary, 
    MAX(placement.dtCreatedAt) AS dtCreatedAt,
      MAX(placement.bDuplicateEntry) AS bDuplicateEntry
FROM nw_convergence_placement_dtl placement
LEFT JOIN nw_convergence_candidate_basic_dtl candidate 
    ON candidate.pklCandidateBasicId = placement.candidateId
LEFT JOIN nw_mams_district dist 
    ON dist.pklDistrictId = placement.vsPlacementDistrict
LEFT JOIN nw_mams_state state 
    ON state.pklStateId = placement.vsPlacementState
    LEFT JOIN nw_convergence_batch_dtl batch 
    ON batch.pklBatchId = placement.batchId
WHERE placement.fklDepartmentId = ?`,

  // placement count
  countAllPlacements: `SELECT COUNT(pklConvPlacementId) AS count 
                        FROM nw_convergence_placement_dtl as placement
                        WHERE fklDepartmentId = ?`,

  //get all assesor by dept
  getAllAssesor: `SELECT * FROM nw_convergence_assessor_dtl as assessor WHERE fklDepartmentId=?`,
  countAllAssesor: `SELECT COUNT(pklConvAssessorId) as count FROM nw_convergence_assessor_dtl as assessor WHERE fklDepartmentId=?`,

  //convergence count
  getConvergenceCount: `SELECT COUNT(*) AS count FROM nw_convergence_scheme_dtl WHERE fklDepartmentId=?`,
  getCourseCount: `SELECT COUNT(*) AS count FROM nw_convergence_course_dtl WHERE fklDepartmentId=?`,
  getTpCount: `SELECT COUNT(*) AS count FROM nw_convergence_tp_dtl WHERE fklDepartmentId=?`,
  getTcCount: `SELECT COUNT(*) AS count FROM nw_convergence_tc_dtl WHERE fklDepartmentId=?`,
  getBatchCount: `SELECT COUNT(*) AS count FROM nw_convergence_batch_dtl WHERE fklDepartmentId=?`,
  getCandidateCount: `SELECT COUNT(*) AS count FROM nw_convergence_candidate_basic_dtl WHERE fklDepartmentId=?`,
  getTrainerCount: `SELECT COUNT(*) AS count FROM nw_convergence_trainer_dtl WHERE fklDepartmentId=?`,
  getAssessorCount: `SELECT COUNT(*) AS count FROM nw_convergence_assessor_dtl WHERE fklDepartmentId=?`,
  getTargetCount: `SELECT COUNT(*) AS count FROM nw_convergence_target_dtl WHERE fklDepartmentId=?`,
  getAssessmentCount: `SELECT COUNT(*) AS count FROM nw_convergence_assessement_dtl WHERE fklDepartmentId=?`,
  getInvoiceCount: `SELECT COUNT(*) AS count FROM nw_convergence_invoice_dtl WHERE fklDepartmentId=?`,
  getPlacementCount: `SELECT COUNT(*) AS count FROM nw_convergence_placement_dtl WHERE fklDepartmentId=?`,

  // Last Update ON 8 Apr
  getSCCOunt:
    "select count(*) from nw_convergence_candidate_basic_dtl where fklCategoryId = 1", //-- sc
  getGenralCount:
    "select count(*) from nw_convergence_candidate_basic_dtl where fklCategoryId = 5", //-- general
  getOBC:
    "select count(*) from nw_convergence_candidate_basic_dtl where fklCategoryId = 9", //-- obc
  getST_H:
    "select count(*) from nw_convergence_candidate_basic_dtl where fklCategoryId = 4", //-- ST (H)
  getST_P:
    "select count(*) from nw_convergence_candidate_basic_dtl where fklCategoryId = 8", //-- ST (H)
  getPWDCOunt:
    "select count(*) from nw_convergence_candidate_basic_dtl where bDisability = 1", //-- Disabled (PWD)
  getTeaTribeCOunt:
    "select count(*) from nw_convergence_candidate_basic_dtl where bTeaTribe = 1", //-- (PWD)
  getMinorityCOunt:
    "select count(*) from nw_convergence_candidate_basic_dtl where bMinority = 1", //-- (PWD)

  // get loksabha master
  getLoksabhaConstituencyId: `SELECT pklLoksabhaConstituencyId AS LoksabhaConstituencyId,vsConstituencyName AS ConstituencyName 
                              FROM ds.nw_mams_constituency_loksabha WHERE fklJvId = 14 AND fklStateId = 4
                              ORDER BY vsConstituencyName ASC;`,

  // get assessmbly master
  getAssessmblyConstituencu: `SELECT pklAssemblyConstituencyId AS AssemblyConstituencyId,vsConstituencyName AS ConstituencyName  
                              FROM ds.nw_mams_constituency_assembly WHERE fklJvId = 14  
                              ORDER BY vsConstituencyName ASC;`,

  // get trainer qualification master
  trainerQualification: `SELECT * FROM nw_mams_trainer_qualification ORDER BY vsMinQualification ASC;`,

  //get state master
  getAllStates: `SELECT pklStateId AS stateID, vsStateName AS stateName FROM nw_mams_state`,

  //get district master by state
  getAllDistricts: `SELECT dist.pklDistrictId AS districtID, dist.vsDistrictName AS districtName
                    FROM nw_mams_district dist 
                    LEFT JOIN nw_mams_state state ON state.pklStateId = dist.fklStateId
                    WHERE state.pklStateId = ? ORDER BY dist.vsDistrictName ASC;`,

  // get sector master
  getAllSectors: `SELECT pklSectorId AS sectorID, vsSectorName AS sectorName FROM nw_convergence_sector_master_dtl where bEnabled= 1`,

  //convergence master data
  getTp: `SELECT tpId AS tpId, vsTpName AS tpName FROM nw_convergence_tp_dtl WHERE fklDepartmentId=?`,
  getTc: `SELECT pklTcId AS tcId, vsTcName AS tcName, fklTpId AS tpId FROM nw_convergence_tc_dtl WHERE fklDepartmentId=?`,
  getBatch: `SELECT * FROM nw_convergence_batch_dtl WHERE fklDepartmentId=? AND dtEndDate <= NOW()`,
  getTarget: `SELECT 
    pklTargetId AS id, 
    CONCAT(vsTargetNo, '(', vsSchemeCode, ')') AS name
        from nw_convergence_target_dtl where fklDepartmentId=?`,
  getTargetById: `SELECT 
    pklTargetId AS id, 
    iAvailableTarget as availableTarget,
    iTotalTarget as totalTarget
        from nw_convergence_target_dtl where pklTargetId =?`,
  // get id type master
  IDType: `SELECT pklIdType AS IdType, vsIdTypeCode AS typeCode, vsIdTypeDisplayName AS typeName
           FROM nw_mams_id_type`,

  // get qualification master
  qualification: `SELECT pklQualificationId AS value, vsQualification AS label
                  FROM nw_mams_qualification
                  ORDER BY iHierarchy ASC`,

  // get relegion master
  relegion: `SELECt pklReligionId AS religionId, vsReligionName AS religionName 
             FROM nw_mams_religion
             ORDER BY nDisplayOrder ASC;`,

  // get block master by dist
  getBlocksByDistrictId: `SELECT pklTalukaId AS blockId, vsTalukaName AS blockName
                          FROM nw_mams_taluka WHERE fklDistrictId = ?`,

  // get ulb master by dist
  getUlbsByDistrictId: `SELECT pklUlbId AS ulbId, vsUlbName AS ulbName
                        FROM nw_mams_ulb WHERE fklDistrictId = ?`,

  // get block master
  block: `SELECT fklDistrictId,pklTalukaId,vsTalukaName FROM ds.nw_mams_taluka;`,

  // get ulb master
  ulb: `SELECT fklDistrictId,pklUlbId,vsUlbName FROM ds.nw_mams_ulb;`,

  //* get scheme by scheme id
  getSchemeById: `SELECT * FROM nw_convergence_scheme_dtl WHERE fklDepartmentId=? AND pklSchemeId=?`,

  //* view target by scheme id
  getTargetBySchemeId: `SELECT * FROM nw_convergence_target_dtl WHERE fklDepartmentId=? AND fklSchemeId=?`,

  //** get tp by id */
  getTpById: `SELECT * FROM nw_convergence_tp_dtl WHERE fklDepartmentId = ? AND pklTpId = ?`,

  //**get tc by tp id */
  getTCbyTPid: `SELECT * FROM nw_convergence_tc_dtl WHERE fklDepartmentId=? AND fklTpId = ?;`,

  //
  getSchemeCode: `SELECT pklSchemeId,vsSchemeName,vsSchemeCode,dtSanctionDate FROM nw_convergence_scheme_dtl WHERE fklDepartmentId=?`,

  //
  courseCode: `SELECT vsCourseCode FROM nw_convergence_course_dtl WHERE fklDepartmentId=?`,

  //master query
  customMasterQuery: `SELECT ??, ?? FROM ?? WHERE fklDepartmentId=?`,
  customMasterQuery2: `SELECT ??, ?? FROM ??`,
  //check exists or not
  checkDuplicateCandidateGlobal: `SELECT 
                basic.vsDOB, 
                basic.vsCandidateName, 
                basic.vsMobile, 
                COUNT(*) as duplicate_count, 
                GROUP_CONCAT(master.vsDepartmentName) as department_names
            FROM 
                nw_convergence_candidate_basic_dtl basic
            LEFT JOIN 
                nw_convergence_department_master master 
                ON basic.fklDepartmentId = master.pklDepartmentID
            GROUP BY 
                basic.vsDOB, basic.vsCandidateName, basic.vsMobile
            HAVING 
                COUNT(*) > 1;`,
  //   getDuplicateSchemes: `SELECT
  //     scheme.vsSchemeName,
  //     scheme.vsFundName,
  //     scheme.vsSchemeCode,
  //     scheme.sanctionOrderNo,
  //     scheme_type.vsSchemeType,
  //     fund_type.vsFundingType,
  //     dept.vsDepartmentName
  // FROM nw_convergence_scheme_dtl scheme
  // JOIN nw_convergence_department_master dept
  //     ON scheme.fklDepartmentId = dept.pklDepartmentID
  // JOIN nw_mams_convergence_scheme_type scheme_type
  //     ON scheme.vsSchemeType = scheme_type.pklSchemeTypeId
  // JOIN nw_mams_convergence_funding_type fund_type
  //     ON scheme.vsSchemeFundingType = fund_type.pklFundingTypeId
  // WHERE (scheme.vsSchemeName, scheme.vsFundName) IN (
  //     SELECT vsSchemeName, vsFundName
  //     FROM nw_convergence_scheme_dtl
  //     GROUP BY vsSchemeName, vsFundName
  //     HAVING COUNT(DISTINCT fklDepartmentId) > 1
  // )
  // AND EXISTS (
  //     SELECT 1 FROM nw_convergence_scheme_dtl sub_scheme
  //     WHERE sub_scheme.vsSchemeName = scheme.vsSchemeName
  //     AND sub_scheme.vsFundName = scheme.vsFundName
  //     AND sub_scheme.fklDepartmentId = ?
  // )
  //     ORDER BY scheme.vsSchemeName, scheme.vsFundName, dept.vsDepartmentName;`,
  getDuplicateSchemes: `SELECT 
    scheme.vsSchemeName, 
    scheme.vsFundName,
    scheme.vsSchemeCode,
    scheme.sanctionOrderNo,
    dept.vsDepartmentName
FROM nw_convergence_scheme_dtl scheme
JOIN nw_convergence_department_master dept 
    ON scheme.fklDepartmentId = dept.pklDepartmentID

`,
  duplicateBySchemefundName: `WHERE (scheme.vsSchemeName, scheme.vsFundName) IN (
                    SELECT vsSchemeName, vsFundName 
                    FROM nw_convergence_scheme_dtl 
                    GROUP BY vsSchemeName, vsFundName
                    HAVING COUNT(DISTINCT fklDepartmentId) > 1
                )
                AND EXISTS (
                    SELECT 1 FROM nw_convergence_scheme_dtl sub_scheme
                    WHERE sub_scheme.vsSchemeName = scheme.vsSchemeName
                    AND sub_scheme.vsFundName = scheme.vsFundName
                    AND sub_scheme.fklDepartmentId = ?
                )
                    ORDER BY scheme.vsSchemeName, scheme.vsFundName, dept.vsDepartmentName;`,

  getDuplicateCourse: `SELECT 
                course.vsCourseName, 
                course.vsCourseCode, 
                GROUP_CONCAT(DISTINCT dept.vsDepartmentName) AS departmentNames
            FROM nw_convergence_course_dtl course
            JOIN nw_convergence_department_master dept 
                ON course.fklDepartmentId = dept.pklDepartmentID
            GROUP BY course.vsCourseName, course.vsCourseCode
            HAVING COUNT(DISTINCT course.fklDepartmentId) > 1
            AND EXISTS (
                SELECT 1 FROM nw_convergence_course_dtl sub_course
                WHERE sub_course.vsCourseName = course.vsCourseName
                AND sub_course.vsCourseCode = course.vsCourseCode
                AND sub_course.fklDepartmentId = ?
            );`,
  getDuplicateTp: `SELECT 
    tp.vsTpName, 
    tp.vsPan, 
    dept.vsDepartmentName as departmentNames
FROM nw_convergence_tp_dtl tp
JOIN nw_convergence_department_master dept 
    ON tp.fklDepartmentId = dept.pklDepartmentID
WHERE tp.vsTpName IN (
    SELECT vsTpName 
    FROM nw_convergence_tp_dtl 
    GROUP BY vsTpName, vsPan
    HAVING COUNT(DISTINCT fklDepartmentId) > 1
)
AND tp.vsPan IN (
    SELECT vsPan 
    FROM nw_convergence_tp_dtl 
    GROUP BY vsTpName, vsPan
    HAVING COUNT(DISTINCT fklDepartmentId) > 1
)
AND EXISTS (
    SELECT 1 FROM nw_convergence_tp_dtl sub_tp
    WHERE sub_tp.vsTpName = tp.vsTpName
    AND sub_tp.vsPan = tp.vsPan
    AND sub_tp.fklDepartmentId = ?
)`,
  getDuplicateCandidate: `SELECT 
                                candidate.vsCandidateName,
                                candidate.vsDOB,
                                candidate.vsUUID,
                                GROUP_CONCAT(candidate.candidateId) AS candidateId,
                                GROUP_CONCAT(DISTINCT dept.vsDepartmentName) AS departmentNames
                            FROM
                                nw_convergence_candidate_basic_dtl candidate
                                    JOIN
                                nw_convergence_department_master dept ON candidate.fklDepartmentId = dept.pklDepartmentID
                            GROUP BY candidate.vsCandidateName , candidate.vsDOB , candidate.vsUUID
                            HAVING COUNT(DISTINCT candidate.fklDepartmentId) > 1
                                AND EXISTS( SELECT 
                                    1
                                FROM
                                    nw_convergence_candidate_basic_dtl sub_can
                                WHERE
                                    sub_can.vsCandidateName = candidate.vsCandidateName
                                        AND sub_can.vsDOB = candidate.vsDOB
                                        AND sub_can.vsUUID = candidate.vsUUID
                                        AND sub_can.fklDepartmentId = ?);`,
  getDuplicateTrainer: `
            SELECT 
    trainer.vsTrainerName AS TrainerName,
    trainer.vsPAN,
    dept.vsDepartmentName AS departmentNames
FROM nw_convergence_trainer_dtl trainer
JOIN nw_convergence_department_master dept 
    ON trainer.fklDepartmentId = dept.pklDepartmentID
WHERE trainer.vsPAN IN (
    SELECT vsPAN
    FROM nw_convergence_trainer_dtl
    GROUP BY vsPAN
    HAVING COUNT(DISTINCT fklDepartmentId) > 1
)
AND EXISTS (
    SELECT 1
    FROM nw_convergence_trainer_dtl sub_trainer
    WHERE sub_trainer.vsPAN = trainer.vsPAN
    AND sub_trainer.fklDepartmentId = ?
)`,
  getDuplicateAssessor: `SELECT 
    asse.vsAssosserName AS AssessorName,
    asse.vsPAN,
    dept.vsDepartmentName AS departmentNames
FROM
    nw_convergence_assessor_dtl asse
JOIN
    nw_convergence_department_master dept 
    ON asse.fklDepartmentId = dept.pklDepartmentID
WHERE
    EXISTS ( 
        SELECT 1
        FROM nw_convergence_assessor_dtl sub_asse
        WHERE sub_asse.vsPAN = asse.vsPAN
          AND sub_asse.fklDepartmentId = ?
    )
AND asse.vsPAN IN (
    SELECT vsPAN
    FROM nw_convergence_assessor_dtl
    GROUP BY vsPAN
    HAVING COUNT(DISTINCT fklDepartmentId) > 1
);`,

  // get candidate by batch id name(id) format
  getCandidateByBatchId: `SELECT pklCandidateBasicId as id, CONCAT(vsCandidateName, '(', candidateId, ')') AS name  FROM nw_convergence_candidate_basic_dtl WHERE fklDepartmentId=? AND batchId=?`,
  getTrainerBytc: `SELECT pklConvTrainerId , CONCAT(vsTrainerName, '(', vsPAN, ')') AS vsTrainerName  FROM nw_convergence_trainer_dtl WHERE fklDepartmentId=? AND fklTcId=?`,
  getCandidateByBatchIdStatus: `SELECT 
    cand.pklCandidateBasicId AS id, 
    CONCAT(cand.vsCandidateName, '(', cand.candidateId, ')') AS name,
    CASE 
        WHEN place.candidateId IS NOT NULL THEN 1 
        ELSE 0
    END AS status
FROM nw_convergence_candidate_basic_dtl cand
LEFT JOIN nw_convergence_placement_dtl place 
    ON cand.pklCandidateBasicId = place.candidateId
WHERE cand.fklDepartmentId = ? AND cand.batchId = ?;`,

  // get duplicate placement
  getDuplicatePlacement: `SELECT 
    candidate.vsCandidateName,
  DATE_FORMAT(candidate.vsDOB, '%d-%m-%Y') AS vsDOB,
    candidate.vsUUID,
    GROUP_CONCAT(candidate.candidateId) AS candidateId,
    GROUP_CONCAT(DISTINCT dept.vsDepartmentName) AS departmentNames
FROM
    nw_convergence_candidate_basic_dtl candidate
        JOIN
    nw_convergence_department_master dept ON candidate.fklDepartmentId = dept.pklDepartmentID
         inner JOIN
nw_convergence_placement_dtl placement ON candidate.pklCandidateBasicId = placement.candidateId
GROUP BY candidate.vsCandidateName , candidate.vsDOB , candidate.vsUUID
HAVING COUNT(DISTINCT placement.fklDepartmentId) > 1
    AND EXISTS( SELECT 
        1
    FROM
        nw_convergence_candidate_basic_dtl sub_can
    WHERE
        sub_can.vsCandidateName = candidate.vsCandidateName
            AND sub_can.vsDOB = candidate.vsDOB
            AND sub_can.vsUUID = candidate.vsUUID
            AND sub_can.fklDepartmentId =? );`,
  getDuplicateTc: `SELECT
    t1.pklTcId,
    t1.vsTcName,
    tp.vsTpName,
    t1.vsLatitude,
    t1.vsLongitude,
    t1.vsTcCode,
    dept.vsDepartmentName,
    district.vsDistrictName,
    COUNT(t2.pklTcId) AS nearby_count
FROM nw_convergence_tc_dtl t1
JOIN nw_convergence_tc_dtl t2 
    ON t1.pklTcId <> t2.pklTcId
    AND t1.fklTpId = t2.fklTpId
    AND (6371000 * ACOS(
        COS(RADIANS(t1.vsLatitude)) * COS(RADIANS(t2.vsLatitude)) * 
        COS(RADIANS(t2.vsLongitude) - RADIANS(t1.vsLongitude)) + 
        SIN(RADIANS(t1.vsLatitude)) * SIN(RADIANS(t2.vsLatitude))
    )) <= 100 
LEFT JOIN nw_mams_district district 
    ON t1.vsDistrict = district.pklDistrictId
LEFT JOIN nw_convergence_tp_dtl tp 
    ON t1.fklTpId = tp.pklTpId
JOIN nw_convergence_department_master dept 
    ON t1.fklDepartmentId = dept.pklDepartmentID
GROUP BY
    t1.pklTcId,
    t1.vsTcName,
    t1.vsLatitude,
    t1.vsLongitude,
    t1.vsTcCode,
    tp.vsTpName,
    dept.vsDepartmentName,
    district.vsDistrictName
HAVING nearby_count > 0

UNION ALL

SELECT 
    ds_tc.pklEntityId AS pklTcId,
    ds_tc.vsEntityName AS vsTcName,
    ds_tp.vsEntityName AS vsTpName,
    address.vsLatitude,
    address.vsLongitude,
    ds_tc.vsPartnerCode AS vsTcCode,
    'ASDM' AS vsDepartmentName,
    district.vsDistrictName,
    NULL AS nearby_count
FROM ds.nw_enms_entity ds_tc
LEFT JOIN ds.nw_enms_entity_address address 
    ON address.fklEntityId = ds_tc.pklEntityId
LEFT JOIN ds.nw_enms_entity ds_tp 
    ON ds_tp.pklEntityId = ds_tc.fklParentEntityLevel1Id
LEFT JOIN nw_mams_district district 
    ON address.fklDistrictId = district.pklDistrictId
WHERE ds_tc.fklRoleId = 4
AND address.vsLatitude IS NOT NULL 
AND address.vsLatitude <> ''
AND address.vsLongitude IS NOT NULL 
AND address.vsLongitude <> ''
AND EXISTS (
    SELECT 1
    FROM nw_convergence_tc_dtl t2
    JOIN nw_convergence_tp_dtl tp ON t2.fklTpId = tp.pklTpId
    JOIN nw_convergence_department_master dept2 
        ON t2.fklDepartmentId = dept2.pklDepartmentID
    WHERE 
    (tp.vsPan = ds_tp.vsPan OR tp.vsTpName = ds_tp.vsEntityName)
    AND
    (6371000 * ACOS(
        COS(RADIANS(address.vsLatitude)) * COS(RADIANS(t2.vsLatitude)) * 
        COS(RADIANS(t2.vsLongitude) - RADIANS(address.vsLongitude)) + 
        SIN(RADIANS(address.vsLatitude)) * SIN(RADIANS(t2.vsLatitude))
    )) <= 100
)
ORDER BY 
    vsDepartmentName DESC,  
    vsDistrictName, 
    vsTcName `,
  countDuplicateTc: `SELECT COUNT(*) AS count
FROM (
    SELECT
        t1.pklTcId,
        t1.vsTcName,
        tp.vsTpName,
        t1.vsLatitude,
        t1.vsLongitude,
        t1.iPartnerCode,
        dept.vsDepartmentName,
        district.vsDistrictName,
        COUNT(t2.pklTcId) AS nearby_count
    FROM nw_convergence_tc_dtl t1
    JOIN nw_convergence_tc_dtl t2 
        ON t1.pklTcId <> t2.pklTcId
        AND t1.fklTpId = t2.fklTpId
        AND (6371000 * ACOS(
            COS(RADIANS(t1.vsLatitude)) * COS(RADIANS(t2.vsLatitude)) * 
            COS(RADIANS(t2.vsLongitude) - RADIANS(t1.vsLongitude)) + 
            SIN(RADIANS(t1.vsLatitude)) * SIN(RADIANS(t2.vsLatitude))
        )) <= 100
    LEFT JOIN nw_mams_district district 
        ON t1.vsDistrict = district.pklDistrictId
    LEFT JOIN nw_convergence_tp_dtl tp 
        ON t1.fklTpId = tp.pklTpId
    JOIN nw_convergence_department_master dept 
        ON t1.fklDepartmentId = dept.pklDepartmentID
    GROUP BY
        t1.pklTcId,
        t1.vsTcName,
        t1.vsLatitude,
        t1.vsLongitude,
        t1.iPartnerCode,
        tp.vsTpName,
        dept.vsDepartmentName,
        district.vsDistrictName
    HAVING COUNT(t2.pklTcId) > 0

    UNION ALL

    SELECT 
        ds_tc.pklEntityId AS pklTcId,
        ds_tc.vsEntityName AS vsTcName,
        ds_tp.vsEntityName AS vsTpName,
        address.vsLatitude,
        address.vsLongitude,
        ds_tc.vsPartnerCode AS iPartnerCode,
        'ASDM' AS vsDepartmentName,
        district.vsDistrictName,
        NULL AS nearby_count
    FROM ds.nw_enms_entity ds_tc
    LEFT JOIN ds.nw_enms_entity_address address 
        ON address.fklEntityId = ds_tc.pklEntityId
    LEFT JOIN ds.nw_enms_entity ds_tp 
        ON ds_tp.pklEntityId = ds_tc.fklParentEntityLevel1Id
    LEFT JOIN nw_mams_district district 
        ON address.fklDistrictId = district.pklDistrictId
    WHERE ds_tc.fklRoleId = 4
        AND address.vsLatitude IS NOT NULL 
        AND address.vsLatitude <> ''
        AND address.vsLongitude IS NOT NULL 
        AND address.vsLongitude <> ''
        AND EXISTS (
            SELECT 1
            FROM nw_convergence_tc_dtl t2
            JOIN nw_convergence_tp_dtl tp ON t2.fklTpId = tp.pklTpId
            JOIN nw_convergence_department_master dept2 
                ON t2.fklDepartmentId = dept2.pklDepartmentID
            WHERE 
                (tp.vsPan = ds_tp.vsPan OR tp.vsTpName = ds_tp.vsEntityName)
                AND (6371000 * ACOS(
                    COS(RADIANS(address.vsLatitude)) * COS(RADIANS(t2.vsLatitude)) * 
                    COS(RADIANS(t2.vsLongitude) - RADIANS(address.vsLongitude)) + 
                    SIN(RADIANS(address.vsLatitude)) * SIN(RADIANS(t2.vsLatitude))
                )) <= 100
        )
) AS combined_results `,

  countASDMCandidate: `SELECT COUNT(*) AS count FROM nw_candidate_basic_dtl as cand WHERE 1 = 1`,
  getASDMCandidate: `SELECT *,cand.pklCandidateId as id FROM nw_candidate_basic_dtl AS cand WHERE 1= 1 `,
  dupCand: `SELECT 
            basic.vsCandidateName,
           DATE_FORMAT(basic.vsDOB, '%d-%m-%Y') AS vsDOB,
            basic.vsUUID,
            gender.vsGenderName,
            department.vsDepartmentName
        FROM nw_convergence_candidate_basic_dtl basic
        INNER JOIN nw_mams_gender gender ON basic.vsGender = gender.pklGenderId
        INNER JOIN nw_convergence_department_master department ON basic.fklDepartmentId = department.pklDepartmentID
        WHERE basic.vsCandidateKey IN (
            SELECT vsCandidateKey
            FROM nw_convergence_candidate_basic_dtl
            where  fklDepartmentId =?
            GROUP BY vsCandidateKey
            HAVING COUNT(*) > 1
        )
            ORDER BY 
    basic.vsCandidateName, vsDOB
         `,
  countDupCand: `SELECT COUNT(*) AS count FROM (SELECT 
            basic.vsCandidateName,
             DATE_FORMAT(basic.vsDOB, '%d-%m-%Y') AS vsDOB,
            basic.vsUUID,
            gender.vsGenderName,
            department.vsDepartmentName
        FROM nw_convergence_candidate_basic_dtl basic
        INNER JOIN nw_mams_gender gender ON basic.vsGender = gender.pklGenderId
        INNER JOIN nw_convergence_department_master department ON basic.fklDepartmentId = department.pklDepartmentID
        WHERE basic.vsCandidateKey IN (
            SELECT vsCandidateKey
            FROM nw_convergence_candidate_basic_dtl
            where  fklDepartmentId =?
            GROUP BY vsCandidateKey
            HAVING COUNT(*) > 1
)) AS sub_query
         `,
  dupCandCross: `SELECT 
    basic.vsCandidateName,
    basic.vsDOB,
    basic.vsUUID,
    gender.vsGenderName,
    department.vsDepartmentName
FROM nw_convergence_candidate_basic_dtl basic
INNER JOIN nw_mams_gender gender ON basic.vsGender = gender.pklGenderId
INNER JOIN nw_convergence_department_master department ON basic.fklDepartmentId = department.pklDepartmentID
WHERE basic.vsCandidateKey IN (
    SELECT vsCandidateKey
    FROM nw_convergence_candidate_basic_dtl
    GROUP BY vsCandidateKey
    HAVING COUNT(*) > 1
)
 and (basic.vsCandidateKey) IN (
         SELECT vsCandidateKey
        FROM nw_convergence_candidate_basic_dtl 
        GROUP BY vsCandidateKey
        HAVING COUNT(DISTINCT fklDepartmentId) > 1
)
AND EXISTS (
    SELECT 1 
    FROM nw_convergence_candidate_basic_dtl sub_cand
    WHERE sub_cand.vsCandidateKey = basic.vsCandidateKey
    AND sub_cand.fklDepartmentId = ?
)
ORDER BY basic.vsCandidateKey, basic.vsCandidateName`,

  // countDupCandCross:`SELECT
  //     basic.vsCandidateName,
  //     basic.vsDOB,
  //     basic.vsUUID,
  //     gender.vsGenderName,
  //     department.vsDepartmentName
  // FROM nw_convergence_candidate_basic_dtl basic
  // INNER JOIN nw_mams_gender gender ON basic.vsGender = gender.pklGenderId
  // INNER JOIN nw_convergence_department_master department ON basic.fklDepartmentId = department.pklDepartmentID
  // WHERE basic.vsCandidateKey IN (
  //     SELECT vsCandidateKey
  //     FROM nw_convergence_candidate_basic_dtl
  //     GROUP BY vsCandidateKey
  //     HAVING COUNT(*) > 1
  // )
  //  and (basic.vsCandidateKey) IN (
  //          SELECT vsCandidateKey
  //         FROM nw_convergence_candidate_basic_dtl
  //         GROUP BY vsCandidateKey
  //         HAVING COUNT(DISTINCT fklDepartmentId) > 1
  // )
  // AND EXISTS (
  //     SELECT 1
  //     FROM nw_convergence_candidate_basic_dtl sub_cand
  //     WHERE sub_cand.vsCandidateKey = basic.vsCandidateKey
  //     AND sub_cand.fklDepartmentId = ?
  // )`
  countDupCandCross: `SELECT 
    basic.vsCandidateName,
    basic.vsDOB,
    basic.vsUUID,
    gender.vsGenderName AS vsGender,
    caste.vsCasteName AS caste,
    basic.vsMobile,
    department.vsDepartmentName AS departmentName
FROM nw_convergence_candidate_basic_dtl basic
INNER JOIN nw_mams_gender gender ON basic.vsGender = gender.pklGenderId
INNER JOIN nw_convergence_department_master department ON basic.fklDepartmentId = department.pklDepartmentID
INNER JOIN nw_mams_caste caste ON basic.fklCategoryId = caste.pklCasteId
WHERE basic.vsCandidateKey IN (
    SELECT vsCandidateKey
    FROM nw_convergence_candidate_basic_dtl
    GROUP BY vsCandidateKey
    HAVING COUNT(*) > 1
)
AND basic.vsCandidateKey IN (
    SELECT vsCandidateKey
    FROM nw_convergence_candidate_basic_dtl 
    GROUP BY vsCandidateKey
    HAVING COUNT(DISTINCT fklDepartmentId) > 1
)
AND EXISTS (
    SELECT 1 
    FROM nw_convergence_candidate_basic_dtl sub_cand
    WHERE sub_cand.vsCandidateKey = basic.vsCandidateKey
    AND sub_cand.fklDepartmentId =?
)

UNION ALL

SELECT 
    ds_candidate.vsCertName AS vsCandidateName,
    DATE_FORMAT(ds_candidate.dtDOB, '%d-%m-%Y') AS vsDOB,
    ds_candidate.UUID AS vsUUID,
    ds_candidate.vsGender AS vsGender,
    caste.vsCasteName AS caste,  -- ASDM table might not have caste info
    contact.vsPrimaryMobileNo AS vsMobile,
    'Assam Skill Development Mission' AS departmentName
FROM ds.nw_candidate_basic_dtl ds_candidate
LEFT JOIN ds.nw_candidate_contact_dtl contact 
    ON ds_candidate.pklCandidateId = contact.fklCandidateId
LEFT JOIN nw_mams_gender gender 
	ON ds_candidate.vsGender = gender.vsGenderName
LEFT JOIN nw_candidate_caste_dtl ds_caste
	ON ds_caste.fklCandidateId = ds_candidate.pklCandidateId
LEFT JOIN nw_mams_caste caste
	ON ds_caste.fklCasteCategoryId = caste.pklCasteId
WHERE EXISTS (
    SELECT 1 FROM nw_convergence_candidate_basic_dtl candidate
    WHERE candidate.vsCandidateName = ds_candidate.vsCertName
      AND candidate.vsDOB = ds_candidate.dtDOB
      AND candidate.vsUUID = RIGHT(ds_candidate.UUID, 4)
      AND candidate.vsGender = gender.pklGenderId
)
ORDER BY vsCandidateName, departmentName
`,
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getScCount: `SELECT COUNT(*) AS count FROM nw_convergence_placement_dtl WHERE fklDepartmentId=?`,
};

module.exports = query;
