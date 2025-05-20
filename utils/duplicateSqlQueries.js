const countDuplicateSchemesQuery = async (criteria) => {
    let groupByClause = criteria.map(col => `scheme.${col}`).join(', ');
    let criteriaSelect = criteria.map(col => `${col}`).join(', ');
    let havingClause = `HAVING COUNT(DISTINCT fklDepartmentId) > 1`;

    // Main query to get the count
    let query = `
        SELECT COUNT(*) AS count FROM (
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
            AND (
                EXISTS (
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
            )
    `;

    // Add the ASDM union part if the criteria match specific conditions
    if ((criteria.includes('vsSchemeName') && criteria.length === 1) ||
        (criteria.length === 2 && criteria.includes('vsSchemeName') && criteria.includes('vsFundName')) ||
        (criteria.includes('vsFundName') && criteria.length === 1)) {
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
        ) AS combined_results;
    `;
    return query;
}

const countDuplicateCandidateQuery = async (criteria) => {
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
    SELECT COUNT(*) AS count FROM (
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
)) AS sub_query
    `;
}
module.exports = {
    countDuplicateSchemesQuery,
    countDuplicateCandidateQuery
}