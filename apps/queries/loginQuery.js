const query = {
    getDept:`SELECT pklDepartmentId as fklDepartmentId ,vsDepartmentName from nw_convergence_department_master where fklLoginId = ?`,
    // check login
    // checkUser: `SELECT * FROM nw_convergence_login_dtl WHERE vsLoginName=? AND bEnable= ?`,
    checkUser: `SELECT * FROM nw_loms_login WHERE vsLoginName=? AND bEnabled= ?`,
    // validate login
    // loginValid: `SELECT * FROM nw_convergence_login_dtl WHERE vsLoginName=? AND vsPassword=?`,
    loginValid: `SELECT * FROM nw_loms_login WHERE vsLoginName=? AND vsPassword=?`,
    // validate login for master
    loginValidLoms: `SELECT * FROM nw_loms_login WHERE vsLoginName=? AND vsPassword=?`,

    // check login for master
    checkUserLoms: `select login.vsLoginName, login.pklLoginId
                    from nw_loms_login as login 
                    inner join nw_loms_login_role role on role.fklLoginId = login.pklLoginId 
                    inner join nw_mams_role mams on mams.pklRoleId = role.fklRoleId 
                    where login.vsLoginName = ? and mams.pklRoleId=64`,

    updateLogin:`update nw_convergence_department_master set dtLastLogin = now() where pklDepartmentId = ?`,
    getCandidate:`select * from ds.nw_candidate_basic_dtl where idType = 3 `,
    updateCandidateUniqueId: `
      UPDATE nw_candidate_basic_dtl 
      SET vsCandidateKey = ? 
      WHERE pklCandidateId = ?
    `,
}

module.exports = exports = query
