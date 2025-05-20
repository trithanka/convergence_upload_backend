const query = {
    //check if vsDepartmentName and iphoneNumber already exist
    checkDepartmentName: `SELECT * FROM nw_convergence_department_master WHERE vsDepartmentName = ?`,
    checkPhoneNumber: `SELECT * FROM nw_convergence_department_master WHERE iPhoneNo = ?`,

    //check username already exist
    checkUsername: `SELECT * FROM nw_convergence_login_dtl WHERE vsLoginName = ?`,

    //get department name list
    getDepartmentNameList: `SELECT pklEntityId AS pklDepartmentId, 
                            vsEntityName AS vsDepartmentName 
                            FROM nw_enms_entity 
                            WHERE fklRoleId = 1
                            ORDER BY vsDepartmentName ASC;;`,

    //list of all department
    getAllDepartment: `SELECT 
    department.pklDepartmentId,
    department.iPhoneNo AS phoneNumber,
    department.vsDepartmentName AS departmentName,
    login.dtModifiedDate AS createdDate,
    loms.vsLoginName AS createdBY,
    login.vsLoginName AS userName,
    login.bEnabled,
    DATE_FORMAT(department.dtLastLogin, "%Y-%m-%d") AS dtLastLogin
FROM nw_convergence_department_master department
INNER JOIN nw_loms_login login 
    ON department.fklLoginId = login.pklLoginId
INNER JOIN nw_loms_login loms 
    ON login.fklModifiedByLoginId = loms.pklLoginId
    ORDER BY department.dtLastLogin DESC;`,

    // count of department
    countAllDepartment: `SELECT COUN(*) AS count FROM  nw_convergence_department_master`,

    //find department sort name 
    findDepartmentSortName:`select vsEntityCode from nw_enms_entity WHERE vsEntityName =? AND fklRoleId = 1`,

    //validate department
    checkUser: `SELECT * FROM nw_convergence_department_master WHERE pklDepartmentId = ?`,

    //get dept by Id
    getUser: `SELECT * FROM nw_convergence_user_master WHERE fklDepartmentId = ?`,

    //create department
    insertDepartment: `INSERT INTO nw_convergence_department_master (vsDepartmentName, dtcreatedAt, fklModifiedByLoginId,iPhoneNo,vsDepartmentSortName) VALUES (?, NOW(), ?,?,?)`,

    // create dept login
    insertLoginDetail: `INSERT INTO nw_convergence_login_dtl (vsLoginName, vsPassword, fklDepartmentId, dtcreatedAt, bEnable,vsPlainPassword) VALUES (?, ?, ?, NOW(), ?,?)`,

    //get dept details by Id
    getDepartmentById: `SELECT 
                        department.pklDepartmentId,
                        department.vsDepartmentName as departmentName,
                        department.dtcreatedAt as createdDate,
                        department.fklModifiedByLoginId as adminLoginId,
                        login.vsLoginName as userName,
                        login.bEnable,
                        loms.vsLoginName as adminName
                        FROM nw_convergence_department_master department
                        left join nw_convergence_login_dtl login on department.pklDepartmentId = login.fklDepartmentId
                        left join nw_loms_login loms on department.fklModifiedByLoginId = loms.pklLoginId WHERE department.pklDepartmentId = ?`,

    //get dept login
    getLoginDetailByDepartmentId: `SELECT * FROM nw_convergence_login_dtl WHERE fklDepartmentId = ?`,

    // update status
    updateDepartmentStatus: `UPDATE nw_convergence_login_dtl SET bEnable = ? WHERE fklDepartmentId = ?`,

}

module.exports = query;