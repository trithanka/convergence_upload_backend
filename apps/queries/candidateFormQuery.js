const query ={
    // insertCandidate: `INSERT INTO nw_convergence_legacy_dtl (
    //     fklDepartmentId, 
    //     vsCandidateName, 
    //     vsSchemeName, 
    //     vsJobRoleName, 
    //     bIsPlaced, 
    //     bIsCertified, 
    //     fklQualificationId, 
    //     fklGenderID, 
    //     UUID,
    //     fklCasteId, 
    //     dtCreatedAt, 
    //     iUploadMethod, 
    //     vsCandidateKey,
    //     vsDOB) 
    //     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

    insertCandidate: `INSERT INTO nw_convergence_summary_report (
vsSchemeName,
itotalTrainingCandidate,
itotalCertifiedCandidate,
itotalPlacedCandidate,
itotalTarget,
iMaleCount,
iFemaleCount,
iScCount,
iStHCount,
iStPCount,
iObcCount,
iGeneralCount,
iMinorityCount,
iTeaTribeCount,
iPwdCount,
iTotalJobRoleCount,
fklDepartmentId,
dtFinancialYear,
dtCreatedAt,
iOtherCount,
iTotalCandidateCount
) VALUES(?,
?,
?,
?,
?,
?,
?,
?,
?,
?,
?,
?,
?,
?,
?,
?,
?,
?,?,?,?)`,

        checkDuplicateCandidate: `SELECT COUNT(*) as count 
        FROM nw_convergence_legacy_dtl
        WHERE 
        fklDepartmentId = ? 
        and vsSchemeName = ? 
        and vsJobRoleName = ? 
        AND vsCandidateName = ? 
        AND fklGenderID = ? 
        AND fklCasteId = ?
        AND fklQualificationId = ?
        AND vsDOB = ?
        `,
        getCandidateAllDetails: `SELECT * 
        FROM nw_convergence_legacy_dtl 
        WHERE pklLegacyId=?`,

        // Get All Summary Reports 
        getSummaryReportsQ:`SELECT * FROM nw_convergence_summary_report report WHERE report.fklDepartmentId = ? `,
}

module.exports = exports = query
