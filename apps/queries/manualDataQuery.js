const query = {
  //check duplicate trainer by batch duration
  checkDuplicateTrainerByBatchDuration: `SELECT DATE(MAX(dtEndDate)) as endDate FROM nw_convergence_batch_dtl batch
left join nw_convergence_tc_dtl tc on batch.fklTcId = tc.pklTcId
left join nw_convergence_trainer_dtl trainer on tc.pklTcId = trainer.fkltcId
WHERE trainer.vsPan=? AND batch.fklDepartmentId=?;`,
  //check duplicate tc name
  checkDuplicateTCName: `SELECT COUNT(*) as count FROM nw_convergence_tc_dtl WHERE vsTcName=? AND fklDepartmentId=?;`,
  // check dept
  checkUser: `SELECT * FROM nw_convergence_department_master WHERE pklDepartmentId=?`,

  // check duplicate scheme
  checkDuplicateScheme: `SELECT COUNT(*) as count FROM nw_convergence_scheme_dtl 
                         WHERE vsSchemeName=? OR vsSchemeType=? ;`,
//update target no
updateTarget:`Update nw_convergence_target_dtl set iAvailableTarget =? where pklTargetId =?`,
  // insert scheme details
  insertScheme: `INSERT INTO nw_convergence_scheme_dtl (
                 vsSchemeFundingType, 
                 vsSchemeFundingRatio, 
                 sanctionOrderNo, 
                 dtSanctionDate, 
                 vsSchemeType, 
                 vsFundName, 
                 vsSchemeName, 
                 vsSchemeCode,
                 fklDepartmentId, 
                 dtcreatedAt,
                 iUploadMethod,
                 bDuplicateEntry  ) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

  // get scheme by id
  getSchemeDetails: `SELECT * FROM nw_convergence_scheme_dtl WHERE pklSchemeId=?`,

  //insert course details
  insertCourse: `INSERT INTO nw_convergence_course_dtl (
                 dtFromDate,
                 dtToDate,
                 fklSectorId,
                 vsCourseCode,
                 vsCourseName,
                 iTheoryDurationInHours,
                 iPracticalDurationInHours,
                 dtcreatedAt,
                 fklDepartmentId,
                 iUploadMethod,
                 fklTpId,
                 fklLoginId,
                 bDuplicateEntry,
                 fklTcId
                 ) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,

  // get course by id
  getCourseDetails: `SELECT * FROM nw_convergence_course_dtl WHERE pklCourseId=?`,

  //insert TP details
  insertTp: `INSERT INTO nw_convergence_tp_dtl (
             vsTpName,
             vsSpocEmail,
             iSpocContactNum,
             vsSpocName,
             vsTpCode,
             vsState,
             vsDistrict,
             vsBlock,
             vsVillage,
             vsAddress,
             fklDepartmentId,
             dtcreatedAt,
             iUploadMethod,
             vsSmartId,
             fklLoginId,
             vsCity,
             vsULB,
             isCityVillage,
             vsPan
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)`,

  // get tp by id
  getTpDetailsById: `SELECT * FROM nw_convergence_tp_dtl WHERE pklTpId=?`,

  //insert TC details
  insertTc: `INSERT INTO nw_convergence_tc_dtl (
             fklTpId,
             iPartnerCode,
             vsTcName,
             vsTcCode,
             vsSpocEmail,
             vsSpocName,
             vsState,
             vsDistrict,
             vsBlock,
             vsVillage,
             vsAddress,
             iSpocContactNum,
             smartId,
             fklDepartmentId,
             dtcreatedAt,
             iUploadMethod,
             fklLoginId,
             fklAssemblyConstituencyId,
             fklLoksabhaConstituencyId,
             vsCity,
             vsULB,
             isCityVillage,
             vsLongitude,
             vsLatitude
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)`,

  // get tc by id
  getTcDetailsById: `SELECT * FROM nw_convergence_tc_dtl WHERE pklTcId=?`,

  //insert batch details
  insertBatch: `INSERT INTO nw_convergence_batch_dtl (
                SDMSid,
                dtStartDate, 
                dtEndDate,  
                fklCourseId, 
                fklTcId, 
                fklTrainerId, 
                iBatchNumber,
                fklDepartmentId, 
                dtcreatedAt, 
                iUploadMethod,
                iBatchTarget,
                fklTargetId) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`,

  //get batch details by id
  getBatchDetailsById: `SELECT * FROM nw_convergence_batch_dtl WHERE pklBatchId=?`,

  // Insert target details
  insertTarget: `INSERT INTO nw_convergence_target_dtl (
                 vsTargetNo, 
                 dtTargetDate, 
                 vsSchemeCode, 
                 iTotalTarget, 
                 fklDepartmentId, 
                 dtCreatedAt, 
                 iUploadMethod, 
                 vsTargetType,
                 fklSchemeId,
                 iAvailableTarget,
                 dtTargetEndDate) 
                  VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?)`,

  // get target by id
  getTargetDetailsById: `SELECT * FROM nw_convergence_target_dtl WHERE pklTargetId=?`,

  // //insert trainer details
  // insertTrainer: `INSERT INTO nw_convergence_trainer_dtl (
  //                 trainerId, 
  //                 vsTrainerName, 
  //                 vsEmail, 
  //                 vsMobile, 
  //                 vsPAN, 
  //                 fklDepartmentId, 
  //                 dtCreatedAt,
  //                 iUploadMethod,
  //                 fklCourseId,
  //                 fklTcId) 
  //                 VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)`,


   //insert trainer details
   insertTrainer: `INSERT INTO nw_convergence_trainer_dtl (
    vsTrainerName, 
    fklDepartmentId,
    vsPAN, 
    dtCreatedAt,
    iUploadMethod,
    fklCourseId,
    fklTcId) 
    VALUES (?, ?, ?, ?, ? , ?, ?)`,
  //get trainer by id
  getTrainerDetailsById: `SELECT * FROM nw_convergence_trainer_dtl WHERE pklConvTrainerId=?`,

  //insert assesment details
  // insertAssesment: `INSERT INTO nw_convergence_assessement_dtl (
  //                   fklDepartmentId,
  //                   batchId,
  //                   SDMSBatchId,
  //                   candidateId,
  //                   bAssessed,
  //                   dtAssessmentDate,
  //                   vsAgency,
  //                   vsAgencyMobile,
  //                   vsAgencyEmail,
  //                   accessorId,
  //                   vsAccessorName,
  //                   vsResult,
  //                   dtResultDate,
  //                   vsCertificationStatus,
  //                   vsTotalMarks,
  //                   vsObtainedMarks,
  //                   vsMarksheetUrl,
  //                   vsCertificateUrl,
  //                   dtCreatedAt, 
  //                   iUploadMethod) 
  //                   VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

  insertAssesment: `INSERT INTO nw_convergence_assessement_dtl (
    fklDepartmentId,
    batchId,
    candidateId,
    bAssessed,
    vsResult,
    dtCreatedAt, 
    iUploadMethod) 
    VALUES(?,?,?,?,?,?,?)`,
  //get assessment by id
  getAssesmentDetails: `SELECT * FROM nw_convergence_assessement_dtl WHERE pklConvAssessmentId=?`,

  //insert placement data
  // insertPlacement: `INSERT INTO nw_convergence_placement_dtl (
  //                   fklDepartmentId,
  //                   batchId,
  //                   candidateId,
  //                   bIsCandidatePlaced,
  //                   vsEmployeerName,
  //                   vsPlacementType,
  //                   vsEmployeerContactNumber,
  //                   vsPlacementDistrict,
  //                   vsPlacementState,
  //                   vsMonthlySalary,
  //                   dtCreatedAt, 
  //                   iUploadMethod,
  //                   dtAppointmentDate) 
  //                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  insertPlacement: `INSERT INTO nw_convergence_placement_dtl (
    fklDepartmentId,
    batchId,
    candidateId,
    bIsCandidatePlaced,
    vsPlacementType,
    dtCreatedAt,
    iUploadMethod) 
    VALUES (?,?,?,?,?,?,?)`,

  // get placement by id
  getPlacementDetails: `SELECT * FROM nw_convergence_placement_dtl WHERE pklConvPlacementId=?`,

  //insert assessor data
  insertAssesor: `INSERT INTO nw_convergence_assessor_dtl (
                  fklDepartmentId,
                  assosserId,
                  vsAssosserName,
                  vsEmail,
                  vsMobile,
                  vsAssesmentAgency,
                  dtValidUpTo,
                  dtCreatedAt, 
                  iUploadMethod,
                  vsPan,
                  QPNOS,fklBatchId,fklCourseId) 
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,

  // get assessor by id
  getAssesorDetails: `SELECT * FROM nw_convergence_assessor_dtl WHERE pklConvAssessorId=?`,

  //insert invoide data
  insertInvoice: `INSERT INTO nw_convergence_invoice_dtl (
                  fklDepartmentId,
                  fklInvoiceType,
                  vsInvoiceTranche,
                  vsInvoiceDate,
                  vsInvoiceNo,
                  fAmount,
                  fRate,
                  iTotalCandidate,
                  fklBatchId,
                  dtCreatedAt, 
                  iUploadMethod,
                  fklTcId) 
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,

  // get invoice by id                
  getInvoiceDetails: `SELECT * FROM nw_convergence_invoice_dtl WHERE pklConvInvoiceId=?`,

  //insert candidate besic data
  //idType is not included
  insertCandidateBasic: `INSERT INTO nw_convergence_candidate_basic_dtl (
                         fklDepartmentId,
                         candidateId,
                         batchId,
                         vsCandidateName,
                         vsDOB,
                         iAge,
                         vsFatherName,
                         vsGender,
                         idType,
                         vsUUID,
                         fklReligionId,
                         fklCategoryId,
                         vsMobile,
                         vsEmail,
                         vsEducationAttained,
                         bDisability,
                         bTeaTribe,
                         bBPLcardHolder,
                         bMinority,
                         dtCreatedAt, 
                         iUploadMethod,
                         bDuplicateEntry ,
                         vsCandidateKey,
                         bDropout
                         ) 
                         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

  //get candidate basic by id
  getCandidateDetailsBasic: `SELECT * FROM nw_convergence_candidate_basic_dtl WHERE pklCandidateBasicId=?`,

  // insert candidate personal data
  insertCandidatePersonal: `INSERT INTO nw_convergence_candidate_personal_dtl (
                            fklCandidateBasicId,
                            fklDepartmentId,
                            iSameAddress,
                            vsRAddress,
                            iRState,
                            vsRDistrict,
                            vsRBlock,
                            vsRUlb,
                            isRCityVillage,
                            vsRVillageCity,
                            vsRPostOffice,
                            vsRPolice,
                            vsRPIN,
                            vsRCouncilContituency,
                            vsRAssemblyContituency,
                            vsPAddress,
                            iPState,
                            vsPDistrict,
                            vsPBlock,
                            vsPUlb,
                            isPCityVillage,
                            vsPVillageCity,
                            vsPPostOffice,
                            vsPPolice,
                            vsPPIN,
                            vsPCouncilContituency,
                            vsPAssemblyContituency,
                            vsBankHolderName,
                            vsAccountNumber,
                            vsBankName,
                            vsBankIFSC,
                            vsBranchName,
                            dtCreatedAt, 
                            iUploadMethod) 
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

  // get candidate personal by id
  getCandidateDetailsPersoanl: `SELECT * FROM nw_convergence_candidate_personal_dtl WHERE fklCandidateBasicId=?`,

  // get candidate by id
  // getCandidateAllDetails: `SELECT * 
  //                          FROM nw_convergence_candidate_basic_dtl 
  //                          INNER JOIN nw_convergence_candidate_personal_dtl ON nw_convergence_candidate_basic_dtl.pklCandidateBasicId=nw_convergence_candidate_personal_dtl.fklCandidateBasicId 
  //                          WHERE pklCandidateBasicId=?`,
          getCandidateAllDetails: `SELECT * 
    FROM nw_convergence_candidate_basic_dtl 
    WHERE pklCandidateBasicId=?`,

  checkExistsQuery: `SELECT COUNT(*) as count FROM ??  WHERE ?? = ?;`,

  checkAvailableTarget: `Select iAvailableTarget,iTotalTarget from nw_convergence_target_dtl where pklTargetId =?`,

  //insert sector data
  insertSector: `INSERT INTO nw_convergence_sector_master_dtl (
                  fklDepartmentId,
                  vsSectorName,
                  dtCreatedAt, 
                  iUploadMethod) 
                  VALUES (?,?,?,?)`,

  //get sector by id
  getSectorDetails: `SELECT * FROM nw_convergence_sector_master_dtl WHERE pklSectorId=?`,

  //check duplicate target
  checkDuplicateTarget: `SELECT COUNT(*) as count FROM nw_convergence_target_dtl WHERE vsSanctionNo=? AND fklDepartmentId=?;`,

  //check duplicate course
  checkDuplicateCourse: `SELECT COUNT(*) as count FROM nw_convergence_course_dtl WHERE vsCourseName=? OR vsCourseCode=? AND fklDepartmentId=?;`,

  //check duplicate candidate
  // checkDuplicateCandidate: `SELECT COUNT(*) as count 
  //                           FROM nw_convergence_candidate_basic_dtl
  //                           WHERE candidateId = ? AND fklDepartmentId = ? 
  //                           OR (DATE(vsDOB) = ? AND SUBSTRING_INDEX(vsCandidateName, ' ', 1) = SUBSTRING_INDEX(?, ' ', 1) AND vsGender = ? AND vsUUID = ?);`,

  checkDuplicateCandidate: `SELECT COUNT(*) as count 
                            FROM nw_convergence_candidate_basic_dtl
                            WHERE 
                            fklDepartmentId = ? 
                            and vsDOB = ? 
                            AND vsCandidateName = ? 
                            AND vsGender = ? 
                            AND fklReligionId = ?
                            AND fklCategoryId = ?
                            AND vsEducationAttained = ?
                            `,
  //check duplicate scheme name
  checkDuplicateSchemeName: `SELECT COUNT(*) as count FROM nw_convergence_scheme_dtl WHERE vsSchemeName=? AND vsSchemeType=? AND fklDepartmentId=? ;`,

  //check duplicate scheme code
  checkDuplicateSchemeNameAndFundName: `SELECT COUNT(*) as count FROM nw_convergence_scheme_dtl WHERE vsSchemeName=? AND vsSchemeCode=? AND  fklDepartmentId=?;`,

  //check duplicate target no
  checkDuplicateTargetNo: `SELECT COUNT(*) as count FROM nw_convergence_target_dtl WHERE vsTargetNo=? AND fklDepartmentId=?;`,

  //check duplicate QPNOS
  checkDuplicateQPNOS: `SELECT COUNT(*) as count FROM nw_convergence_course_dtl WHERE vsCourseCode=? AND fklDepartmentId=?;`,

  //check duplicate PAN
  checkDuplicatePAN: `SELECT COUNT(*) as count FROM nw_convergence_tp_dtl WHERE vsPan=? AND fklDepartmentId=?;`,

  //check duplicate assessor
  checkDuplicateAssessor: `SELECT COUNT(*) as count FROM nw_convergence_assessor_dtl WHERE vsPan=? AND fklDepartmentId=?;`,
  //check assessor nae with qpnos code 
  checkDuplicateAssessorName: `SELECT COUNT(*) as count FROM nw_convergence_assessor_dtl WHERE vsAssosserName=? AND fklCourseId=? AND fklDepartmentId=?;`,


  //check duplicate trainer
  checkDuplicateTrainer: `SELECT COUNT(*) as count FROM nw_convergence_trainer_dtl WHERE vsPan=? AND fklDepartmentId=? AND fklCourseId=?;`,
  checkDuplicateAssessment: `SELECT COUNT(*) as count FROM nw_convergence_assessement_dtl WHERE candidateId=? AND batchId=? AND fklDepartmentId=?;`,
  getSchemeCode:`SELECT vsSchemeCode FROM nw_convergence_scheme_dtl WHERE pklSchemeId = ?`,
  // --------- check batch and candidate pkl id duplicate ---------------
  checkBatchCandPklDup:`SELECT COUNT(pklConvPlacementId) AS count FROM nw_convergence_placement_dtl WHERE candidateId = ? `,
  getCandIDbyPKL:`SELECT candidateId FROM nw_convergence_candidate_basic_dtl WHERE pklCandidateBasicId= ? AND fklDepartmentId = ?`,
  getBatchIDbyPKL:`SELECT iBatchNumber FROM nw_convergence_batch_dtl WHERE pklBatchId= ? AND fklDepartmentId = ?`,

};


module.exports = query;
