const co = require("co");
const connection = require("../../JOS/DALMYSQLConnection");
const bcrypt = require("bcrypt");
const query = require("../queries/loginQuery");
const { propagateResponse, propagateError } = require("../../utils/responseHandler");
const { StatusCodes } = require("http-status-codes");
const jwt = require('jsonwebtoken');
const crypto = require("crypto")
const { createHash } = require('node:crypto');
const secret = "3nc4ypt!0n"



function encrypt(data) {
  const cipher = crypto.createCipher(
    "aes256",
    "3ncryp7i0n"
  );
  let encrypted = cipher.update("" + data, "utf8", "hex") + cipher.final("hex");
  return encrypted;
};

function CreateDBHash(plainText) {
  const hash = createHash('sha256');
  hash.update(plainText)
  return hash.digest('hex')
}

function CleanSQLObject(SQLObject) {
  return JSON.parse(JSON.stringify(SQLObject))
}


exports.login = co.wrap(async function (postParam) {
  let resultObj = {};
  let queryResultObj = {};
  let isPasswordValid; 
  let isDept;
  let mySqlCon = null;
  let user ;

  //check input fields
  if (!postParam.user || !postParam.password || !postParam.type) {
    return propagateError(StatusCodes.BAD_REQUEST, "sLoad-10", "Enter all fields");
  }
  //check type
  if (postParam.type != "create" && postParam.type != "login") {
    return propagateError(StatusCodes.BAD_REQUEST, "sLoad-10", "Type should be create or login");
  }

  //get db connection
  try {
    mySqlCon = await connection.getDB();
  } catch (error) {
    console.error(error);
    throw propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-10", "Internal Server Error");
  }

  try {
    //check user
    if(postParam.type =="login"){
      queryResultObj.checkUser = await connection.query(mySqlCon, query.checkUser, [postParam.user, 1]);
      queryResultObj.getDept = await connection.query(mySqlCon, query.getDept, [queryResultObj.checkUser[0].pklLoginId])
    }else if(postParam.type == "create"){
      queryResultObj.checkUser = await connection.query(mySqlCon, query.checkUserLoms, [postParam.user]);
    }
    //check user not found
    if (queryResultObj.checkUser.length == 0) {
      return propagateError(StatusCodes.NOT_FOUND, "sLoad-40", "User not Found");
    }
    //encrypt password
    const encryptedInputPassword = encrypt(postParam.password);
    // //console.log(encryptedInputPassword);
    // Verify password
    if(postParam.type == "login"){
      queryResultObj.loginValid = await connection.query(mySqlCon, query.loginValid, [postParam.user, encryptedInputPassword])
      isDept = 1
    }else if(postParam.type == "create"){
      queryResultObj.loginValid = await connection.query(mySqlCon, query.loginValidLoms, [postParam.user, encryptedInputPassword])
      isDept = 0
    }

    if (queryResultObj.loginValid !== null && queryResultObj.loginValid !== undefined && queryResultObj.loginValid.length > 0) {
      if(postParam.type =="login"){
        user = queryResultObj.getDept[0];
        await connection.query(mySqlCon, query.updateLogin, [user.fklDepartmentId]);
      }else if(postParam.type == "create"){
        user = queryResultObj.checkUser[0];
      }
    const token = jwt.sign(
      { user: user,
        role:isDept === 0 ? 'admin' : 'department' 
      }, // Payload
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )
 
    resultObj = {
        token: token,
        departmentId: user.fklDepartmentId,
        vsDepartmentName: user.vsDepartmentName,
        adminName: postParam.user,
        isDept: isDept
      };
    } else {
      return propagateError(400,400,"Invalid login credentials ");
      resultObj.message = "Invalid Login Details"
      resultObj.status = "failed"
    }

    return propagateResponse("Login Successfully!",resultObj, "sLoad-20", StatusCodes.OK, );
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error sLoad-20");
  } finally {
    mySqlCon.release();
  }
});


exports.generateKey = co.wrap(async function (postParam) {
  let resultObj = {};
  let mySqlCon = null;

  try {
    mySqlCon = await connection.getDB();
    await connection.beginTransaction(mySqlCon);

    // Get all candidates without unique IDs
    let candidates = await connection.query(mySqlCon, query.getCandidate, []);
    
    // Process each candidate
    for (const candidate of candidates) {
      try {
        const date = new Date(candidate.dtDOB);
        const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        
        // Generate unique ID uuid last 4 digit
        const candidateUniqueId = 
          candidate.vsFirstName.substring(0, 4).toUpperCase() + 
          (candidate.UUID || "").slice(-4) + 
          formattedDate + 
          (candidate.vsGender == "MALE" ? 'M' : 
           candidate.vsGender == "FEMALE" ? 'F' : 
           candidate.vsGender == "TRANSGENDER" ? 'T' : 'A');
        // Update candidate with unique ID
        await connection.query(
          mySqlCon, 
          query.updateCandidateUniqueId, 
          [candidateUniqueId, candidate.pklCandidateId]
        );
      } catch (err) {
        console.error(`Error processing candidate ${candidate.pklCandidateId}:`, err);
        // Continue with next candidate even if one fails
        continue;
      }
    }

    await connection.commit(mySqlCon);
    
    return propagateResponse(
      "Unique IDs generated successfully!", 
      { processedCount: candidates.length }, 
      "sLoad-20", 
      StatusCodes.OK
    );

  } catch (error) {
    if (mySqlCon) await connection.rollback(mySqlCon);
    console.error(error);
    throw new Error("Internal Server Error sLoad-20");
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
});
