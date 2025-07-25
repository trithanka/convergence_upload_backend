const xlsx = require("xlsx");
// const connection = require("../../JOS/DALMYSQLConnection");
const validators = require("../validator/manualSchemeValidator");
const courseValidators = require("../validator/manualCourseValidator");
const targetValidator = require("../validator/targetValidator");
const tpValidator = require("../validator/manualTpValidator");
const tcValidator = require("../validator/manualTcValidator");
const batchValidator = require("../validator/batchValidator");
const assesmentValidator = require("../validator/validateAssesment");
const placementValidator = require("../validator/validatePlacement");
const validateAssessor = require("../validator/validateAssessor");
const validateTrainer = require("../validator/trainerValidator");
const validateInvoice = require("../validator/validateInvoide");
const validateCandidate = require("../validator/validateCandidate");
const { convertToInt } = require("../../utils/typeconverter");
const connection = require('../../JOS/DALMYSQLConnection');
const { handleConvergence } = require("./newUploadCandidateFormService/candidateFormService");
const {
  handleScheme,
  handleCourse,
  handleTarget,
  handleTP,
  handleTC,
  handleBatch,
  handleAssesment,
  handlePlacement,
  handleAssessor,
  handleTrainer,
  handleInvoice,
  handleCandidate,
} = require("./manualUpload");
const { Console } = require("winston/lib/winston/transports");
const parseDateString = (dateStr) => {
  // Remove any leading/trailing whitespace
  dateStr = dateStr.trim();

  // Check if date contains '/' or '-'
  const separator = dateStr.includes('/') ? '/' : '-';
  const parts = dateStr.split(separator);

  // Ensure we have exactly 3 parts
  if (parts.length !== 3) {
    throw new Error(`Invalid date format. Expected DD-MM-YYYY or YYYY-MM-DD, got: ${dateStr}`);
  }

  // Convert all parts to numbers
  const [first, second, third] = parts.map(Number);

  // Check if first part is a year (assuming year is 4 digits)
  if (first.toString().length === 4) {
    // Format is YYYY-MM-DD
    return new Date(first, second - 1, third);
  } else {
    // Format is DD-MM-YYYY
    return new Date(third, second - 1, first);
  }
};


// Function to convert Excel date serial number to JavaScript Date
function excelSerialDateToDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);

  const fractional_day = serial - Math.floor(serial) + 0.0000001;

  let total_seconds = Math.floor(86400 * fractional_day);

  const seconds = total_seconds % 60;
  total_seconds -= seconds;

  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
}

//Function to format date to MySQL datetime format
function formatDateToMySQL(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are zero-indexed
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

exports.processExcelFile = async function (
  filePath,
  type,
  fklDepartmentId,
  fklSchemeId
) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: undefined });
  let responses = [];

  // Validate data based on type
  let validationResult;
  switch (type) {
    case "scheme":
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;

        for (const item of data) {
          try {
            console.log("item---", item["Date of Sanction"]);
            const rawDate = excelSerialDateToDate(item["Date of Sanction"]);
            console.log("rawDate---", rawDate);
            const formattedDate = formatDateToMySQL(rawDate);
            let convert_items = {
              fund_type: item["Scheme Funding Type"] ?? null,
              scheme_type: item["Scheme Type"] ?? null
            };
            for (let [key, value] of Object.entries(convert_items)) {
              if (value !== null && value !== '') {
                let convert_value = await convertToInt(key, value);
                if (convert_value) {
                  convert_items[key] = convert_value;
                } else {
                  throw new Error(`${key.replaceAll('_', ' ')} found for name : ${value}`);
                }
              }
            }
            const transformedItem = {
              schemeFundingType: convert_items.fund_type,
              schemeFundingRatio: item["Scheme Funding Ratio"],
              sanctionOrderNo: item["Sanction Order No"],
              dateOfSanction: formattedDate,
              schemeType: convert_items.scheme_type,
              fundName: item["Fund Name"],
              scheme: item["Scheme Name"],
              schemeCode: item["Scheme Code"],
              fklDepartmentId: fklDepartmentId,
              queryType: "scheme",
              rowNumber: rowNumber
            };

            const validationResult = validators.validateScheme(item);
            if (validationResult.error) {
              throw new Error(`Validation failed: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          }
          rowNumber++;
        }

        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleScheme(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }
        // //console.log("insertedRow----", insertedRow);
        // //console.log("validationErrors----", validationErrors);
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;
    case "report":
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;

        for (const item of data) {
          try {
            const transformedItem = {
              vsSchemeName: item["Scheme Name"],
              dtFinancialYear: item["Financial Year"],
              iTotalJobRoleCount: item["Job Role Count"],
              // itotalTrainingCandidate: item["Total Candidate Count"],
              itotalCertifiedCandidate: item["Total Certified Candidate"],
              itotalPlacedCandidate: item["Total Placed Candidate"],
              itotalTarget: item["Total Target"],
              iMaleCount: item["Male Candidate Count"],
              iFemaleCount: item["Female Candidate Count"],
              // iOtherCount: item["Other Candidate Count"],
              iScCount: item["SC Candidate Count"],
              iStHCount: item["ST Candidate Count"],
              iObcCount: item["OBC Candidate Count"],
              iGeneralCount: item["General Candidate Count"],
              iMinorityCount: item["Minority Candidate Count"],
              iTeaTribeCount: item["Tea Tribe Candidate Count"],
              iPwdCount: item["PwD Candidate Count"],
              iOtherCount: item["Other Candidate Count"],
              totalCount: item["Total Candidate Count"],
              // schemeCode: item["Scheme Code"],
              fklDepartmentId: fklDepartmentId,
              // queryType: "scheme",
              rowNumber: rowNumber
            };

            const validationResult = validateCandidate.validateConvergence(item);
            if (validationResult.error) {
              throw new Error(`Validation failed: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          }
          rowNumber++;
        }

        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleConvergence(transformedItem, 2, fklDepartmentId);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }
        // //console.log("insertedRow----", insertedRow);
        // //console.log("validationErrors----", validationErrors);
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;
    case "course":
      try {
        const transformedItems = [];
        const validationErrors = [];
        let mySqlCon = null;
        let rowNumber = 1;
        for (const item of data) {
          try {
            const fromDate = excelSerialDateToDate(item["From Date"]);
            const formattedFromDate = formatDateToMySQL(fromDate);
            const toDate = excelSerialDateToDate(item["To Date"]);
            const formattedToDate = formatDateToMySQL(toDate);
            if (formattedFromDate > formattedToDate) {
              throw new Error(`The batch end date must be on or after the batch Start date. `);
            }
            const sectorName = item["Sector Name"];
            const sectorId = await convertToInt("sector", sectorName);
            let tc_id = null;
            // const tc_id = await convertToInt('tc', item['Tranning Center']);
            // if (!tc_id) {
            //   throw new Error(`TC ID not found for given name: ${item["Tranning Center"]}`);
            // }
            if (!sectorId) {
              throw new Error(`Sector ID not found for sector name: ${sectorName}`);
            }
            let queryQpnos = `select course.vsCourseName , sector.vsSectorName ,config.dtFromDate, config.dtToDate
                            from nw_coms_course course 
                            left join nw_coms_course_config config on course.pklCourseId = config.fklCourseId
                            left join nw_coms_sector sector on sector.pklSectorId = course.fklSectorId
                            where course.vsCourseCode= ? and vsSectorName =? and dtFromDate=? and dtToDate=? and course.vsCourseName=?; `;
            try {
              mySqlCon = await connection.getDB();
            } catch (error) {
              console.error(error);
              return propagateError(StatusCodes.INTERNAL_SERVER_ERROR, "sLoad-40", "DB connection failed");
            }

            if (item["QPNOS Code"] !== undefined) {
              //check if qpnos match with the course name , sector name and validation date by checking db
              const qpnos = await connection.query(mySqlCon, queryQpnos, [item["QPNOS Code"], sectorName, formattedFromDate, formattedToDate, item["Course Name"]]);
              // console.log("qpnos---", qpnos);
              // console.log("qpnos length---", qpnos.length);
              if (qpnos.length === 0) {
                console.error("qpnos not found for course name: ", item["Course Name"], "sector name: ", sectorName, "validation date: ", formattedFromDate);
                throw new Error(`QPNOS not found for course name: ${item["Course Name"]}, sector name: ${sectorName} and validation date: ${formattedFromDate}`);
              }
            }


            const transformedItem = {
              vsCourseName: item["Course Name"],
              vsCourseCode: item["QPNOS Code"],
              dtFromDate: formattedFromDate,
              dtToDate: formattedToDate,
              iTheoryDurationInHours: item["Theory Duration Hours"],
              iPracticalDurationInHours: item["Practical Duration Hours"],
              fklSectorId: sectorId,
              fklDepartmentId: fklDepartmentId,
              queryType: "course",
              fklTcId: tc_id || null,
              rowNumber: rowNumber // store original row number here
            };

            const validationResult = courseValidators.validateCourse(item);
            if (validationResult.error) {
              throw new Error(`Validation failed: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          } finally {
            mySqlCon?.release();
          }
          rowNumber++;
        }
        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleCourse(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;
    case "target":
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;

        for (const item of data) {
          try {
            let sectionDate;
            //if type is batch Based then format
            if (item["Target Type"] === "Batch Based") {

              const targetDate = item["Target Date"];

              if (typeof targetDate === 'number') {
                // Excel serial date
                sectionDate = excelSerialDateToDate(targetDate);
              } else if (typeof targetDate === 'string') {
                const dateStr = targetDate.trim();
                if (dateStr.includes('/') || dateStr.includes('-')) {
                  try {
                    sectionDate = parseDateString(dateStr); // Must return a valid JS Date
                  } catch (err) {
                    throw new Error(`Invalid date format for Batch Based: ${err.message}`);
                  }
                } else {
                  throw new Error(`Unsupported date string format for Batch Based: "${dateStr}"`);
                }
              } else {
                throw new Error(`Invalid date format for Batch Based target: ${targetDate}`);
              }

            } else {
              // For non-Batch Based, allow direct Date object

              sectionDate = item["Target Date"];

            }


            const target_type_id = await convertToInt("target_type", item["Target Type"]);
            if (!target_type_id) {
              throw new Error(`Target Type ID not found for Target Type: ${item["Target Type"]}`);
            }
            const scheme_code = await convertToInt('scheme_code', item["Scheme Code"])
            if (!scheme_code) {
              throw new Error(`Scheme ID not found for Scheme Code: ${item["Scheme Code"]}`);
            }
            // const schemeId = await convertToInt("scheme", item["Scheme Name"]);

            // if (!schemeId) {
            //   throw new Error(`Scheme ID not found for scheme name: ${item["Scheme Name"]}`);
            // }
            console.log("sectionDate---", sectionDate);
            const transformedItem = {
              // vsSanctionNo: item["Sanction No"],
              targetType: target_type_id,
              vsSchemeCode: scheme_code,
              iTotalTarget: item["Total Target"],
              vsTargetNo: item["Target Sanction Order No"],
              dtTargetDate: sectionDate,
              fklDepartmentId: fklDepartmentId,
              queryType: "target",
              // fklSchemeId: schemeId,
              rowNumber: rowNumber // store original row number here
            };

            const validationResult = targetValidator.validateTarget(item);
            if (validationResult.error) {
              throw new Error(`Validation failed: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          }
          rowNumber++;
        }
        // Insertion loop using the stored rowNumber from each transformed item
        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleTarget(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;
    case "TP": //done checked
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;

        for (const item of data) {
          try {

            // ----- START OLD CODE BEFORE 29-04-2025 --------------

            // const isCity = item["City or Village"] === "city";
            // const isVillage = item["City or Village"] === "village";
            // let ulbId = isCity ? await convertToInt("ulb", item["ULB"]) : 0;
            // let blockId = isVillage ? await convertToInt("block", item["Block"]) : 0;
            // if (ulbId == null) {
            //   throw new Error(`ulb Id not found for given name: ${item["ULB"]}`);
            // }
            // if (blockId == null) {
            //   throw new Error(`block Id not found for given name: ${item["Block"]}`);
            // }
            // const stateId = await convertToInt("state", item["State"]);

            // const districtId = await convertToInt("district", item["District"]);

            // if (!stateId || !districtId) {
            //   throw new Error(`State ID not found for given names ${item["State"]} , ${item["District"]}`);
            // }

            // ----- END OLD CODE BEFORE 29-04-2025 --------------

            const transformedItem = {
              vsTpName: item["TP Name"],
              vsPAN: item["PAN"],
              vsAddress: item["Address"],
              fklDepartmentId: fklDepartmentId,
              queryType: "TP",

              // ----- START OLD CODE BEFORE 29-04-2025 --------------

              // vsTpCode: item["TP Code"],
              // vsSpocEmail: item["Spoc Email"],
              // iSpocContactNum: item["Spoc Contact Number"],
              // vsState: stateId,
              // vsDistrict: districtId,
              // vsBlock: blockId,
              // vsULB: ulbId,
              // vsVillage: item["Village"],
              // vsCity: item["City"],
              // vsSpocName: item["Spoc Name"],

              // vsSmartId: item["Smart ID"],
              // isVillageCity: item["City or Village"],

              // ----- END OLD CODE BEFORE 29-04-2025 --------------

              rowNumber: rowNumber // store original row number here
            };
            const validationResult = tpValidator.validateTp(item);
            if (validationResult.error) {
              throw new Error(`Validation failed for ${item["TP Name"]}: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          }
          rowNumber++;
        }



        // for (const transformedItem of transformedItems) {
        //   const response = await handleTP(transformedItem, 2);
        //   if (response.success === false) {
        //     throw new Error(response.message);
        //   }
        //   responses.push(response.data);
        // }
        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleTP(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.pSTART
            insertedRow++;
          }
        }
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;


    case "TC": //checked done
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;

        for (const item of data) {
          try {

            // ---- START OLD CODE 29-04-2025 --------------

            // const isCity = item["City or Village"] === "city";
            // const isVillage = item["City or Village"] === "village";
            // let ulbId = isCity ? await convertToInt("ulb", item["ULB"]) : 0;
            // //console.log("ULB test", item['ULB']);START
            // //console.log("ULB ID", ulbId)
            // let blockId = isVillage ? await convertToInt("block", item["Block"]) : 0;
            // let assemblyC = item["Assembly Constituency"] ? await convertToInt("Assessmbly", item["Assembly Constituency"]) : 0;
            // let LokSabhaC = item["Lok Sabha Constituency"] ? await convertToInt("LokSabha", item["Lok Sabha Constituency"]) : 0;

            // if (blockId === null) {
            //   throw new Error(`Block ID not found .`);
            // }

            // ---- END OLD CODE 29-04-2025 --------------

            const stateId = await convertToInt("state", item["State"]);
            const districtId = await convertToInt("district", item["District"]);
            const tpid = await convertToInt("TP", item["TP Name"])

            if (!tpid) {
              throw new Error(`Tp Name not found for ${item["TP Name"]}`);
            }
            // if (ulbId === null) {
            //   throw new Error(`ULB ID not found .`);
            // }
            if (!stateId) {
              throw new Error(`Location ID not found for given state ${item["State"]}.`);
            }
            if (!districtId) {
              throw new Error(`Location ID not found for given district ${item["District"]}.`);
            }


            const transformedItem = {
              vsTcName: item["TC Name"],
              fklTpId: tpid,
              vsState: stateId,
              vsDistrict: districtId,
              vsLatitude: item["Langtitude"],
              vsLongitude: item["Longtitude"],
              vsAddress: item["Address"],
              fklDepartmentId: fklDepartmentId,
              queryType: "TC",

              // ---- START OLD CODE 29-04-2025 --------------

              // vsTcCode: item["TC Code"],
              // vsTcCode: item["Center Code"],
              // vsSpocEmail: item["Spoc Email"],
              // iSpocContactNum: item["Spoc Contact Number"],
              // vsBlock: blockId,
              // vsULB: ulbId,
              // vsVillage: item["Village"],
              // vsCity: item["City"],
              // vsSpocName: item["Spoc Name"],
              // smartId: item["Smart ID"],
              // isVillageCity: item["City or Village"],
              // fklAssemblyConstituencyId: assemblyC,
              // fklLoksabhaConstituencyId: LokSabhaC,

              // ---- END OLD CODE 29-04-2025 --------------

              rowNumber: rowNumber // store original row number here
            };
            const validationResult = tcValidator.validateTc(item);
            if (validationResult.error) {
              throw new Error(`Validation failed for ${item["TC Name"]}: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          }
        }

        // if (validationErrors.length > 0) {
        //   console.error("Validation Errors:", validationErrors);
        //   return {
        //     success: false,
        //     message: `Validation errors found. Details: ${JSON.stringify(validationErrors)}`
        //   };

        // }

        // Insertion loop using the stored rowNumber from each transformed item
        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleTC(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }
        //console.log("insertedRow----", insertedRow);
        //console.log("validationErrors----", validationErrors);
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;
    case "batch": //done checked
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;
        for (const item of data) {
          try {
            const startDate = excelSerialDateToDate(item["Start Date"]);
            const formattedStartDate = formatDateToMySQL(startDate);
            const endDate = excelSerialDateToDate(item["End Date"]);
            const formattedEndDate = formatDateToMySQL(endDate);
            //start date and end date validation
            if (formattedStartDate > formattedEndDate) {
              throw new Error(`Start date must be before end date`);
            }
            // const tpId = await convertToInt("TP", item["TP Name"]);

            // if (tpId == null) {
            //   throw new Error(`TP ID not found for given name: ${item["TP Name"]}`);
            // }
            const tcId = await convertToInt("TC", item["TC Name"]);
            if (tcId == null) {
              throw new Error(`TC ID not found for given name: ${item["TC Name"]}`);
            }
            const courseId = await convertToInt("Course", item["Course Name"]);
            if (courseId == null) {
              throw new Error(`Course ID not found for given name: ${item["Course Name"]}`);
            }
            // const sectorId = await convertToInt("sector", item["Sector"]);
            // if (sectorId == null) {
            //   throw new Error(`Sector ID not found for given name: ${item["Sector"]}`);
            // }

            // ----- START OLD CODE 30-04-2025 ------
            // const trainerId = await convertToInt("TrainerPAN", item["Trainer PAN"]);
            // if (trainerId == null) {
            //   throw new Error(`Trainer not found for given PAN: ${item["Trainer PAN"]}`);
            // }
            // ----- END OLD CODE 30-04-2025 ------


            //target order number to pklTargetId
            const pklTargetId = await convertToInt("Target Order Number", item["Target Order Number"]);
            if (pklTargetId == null) {
              throw new Error(`Target Order Number not found for given Number: ${item["Target Order Number"]}`);
            }
            const transformedItem = {
              fklTcId: tcId,
              fklCourseId: courseId,
              iBatchNumber: item["Batch Number"],
              dtStartDate: formattedStartDate,
              dtEndDate: formattedEndDate,
              iBatchTarget: item["Batch Target"],
              vsPAN: item['Trainer PAN'],
              fklTargetId: pklTargetId,
              vsTrainerName: item['Trainner Name'],
              queryType: "batch",
              fklDepartmentId: fklDepartmentId,

              // ----- START OLD CODE 30-04-2025 ------

              // fklTrainerId: trainerId, 
              // fklTpId: tpId, 
              // QPNOS: item["QPNOS"],
              // SDMSid: item["SDMS ID"],
              // fklSectorId: sectorId,

              // ----- END OLD CODE 30-04-2025 ------

              rowNumber: rowNumber // store original row number here
            };

            const validationResult = batchValidator.validateBatch(item);
            if (validationResult.error) {
              throw new Error(`Validation failed: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          }
          rowNumber++;
        }

        // Insertion loop using the stored rowNumber from each transformed item
        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleBatch(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }
        //console.log("insertedRow----", insertedRow);
        //console.log("validationErrors----", validationErrors);
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;
    case "assessment": //done checked
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;

        for (const item of data) {
          let mySqlCon;
          try {
            const assessmentDate = excelSerialDateToDate(item["Assessment Date"]);
            const formattedAssessmentDate = formatDateToMySQL(assessmentDate);
            const resultDate = excelSerialDateToDate(item["Result Date"]);
            const formattedResultDate = formatDateToMySQL(resultDate);
            const isAssessed = item["Is Assessed"] === "yes" ? 1 : 0;
            const bAssessed = item["Is Result Declare"] === "yes" ? 1 : 0;
            const fklBatchId = await convertToInt("batch", item["Batch ID"]);


            // //console.log("fkl batch id", fklBatchId)
            if (bAssessed === 1) {
              const assessmentDate = excelSerialDateToDate(item["Assessment Date"]);
              const formattedAssessmentDate = new Date(formatDateToMySQL(assessmentDate));

              const resultDate = excelSerialDateToDate(item["Result Date"]);
              const formattedResultDate = new Date(formatDateToMySQL(resultDate));
              if (formattedAssessmentDate > formattedResultDate) {
                throw new Error(`The result date must be on or after the assessment date. `);
              }
            }
            if (!fklBatchId) {
              throw new Error(`Batch ID not found for given name: ${item["Batch ID"]}`);
            }
            mySqlCon = await connection.getDB();
            const queryCandidate = await connection.query(mySqlCon, `Select pklCandidateBasicId from nw_convergence_candidate_basic_dtl where candidateId = ? and fklDepartmentId`, [item["Candidate ID"], fklDepartmentId]);
            const candidateId = queryCandidate.length > 0 ? queryCandidate[0].pklCandidateBasicId : null;
            if (candidateId === null) {
              throw new Error(`Candidate not found for given ID: ${item["Candidate ID"]}`);
            }
            //check batch id and candidate id
            const queryBatch = await connection.query(mySqlCon, `Select count(pklCandidateBasicId) as count from nw_convergence_candidate_basic_dtl where candidateId = ? and fklDepartmentId=? and batchId=?`, [item["Candidate ID"], fklDepartmentId, fklBatchId]);

            if (queryBatch[0].count === 0) {
              throw new Error(`Candidate is not part of the batch ${item["Batch ID"]}`);
            }
            const fklAsessorId = await convertToInt("AssessorPan", item['Accessor PAN']);
            if (!fklAsessorId) {
              throw new Error(`Assesor PAN ID not found for given PAN: ${item["Accessor PAN"]}`);
            }
            const transformedItem = {
              batchId: fklBatchId,
              SDMSBatchId: item["SDMS Batch ID"],
              candidateId: candidateId,
              // isAssessed: isAssessed,
              dtAssessmentDate: formattedAssessmentDate,
              vsAgency: item["Agency"],
              vsAgencyMobile: item["Agency Mobile"],
              vsAgencyEmail: item["Agency Email"],
              accessorId: fklAsessorId,
              // vsAccessorName: item["Accessor Name"],
              vsResult: item["Result"],
              bAssessed: bAssessed,
              dtResultDate: formattedResultDate,
              vsCertificationStatus: item["Certification Status"],
              vsTotalMarks: item["Total Marks"],
              vsObtainedMarks: item["Obtained Marks"],
              vsMarksheetUrl: item["Marksheet URL"],
              vsCertificateUrl: item["Certificate URL"],
              fklDepartmentId: fklDepartmentId,
              queryType: "assesment",
              rowNumber: rowNumber // store original row number here
            };

            const validationResult = assesmentValidator.validateAssesment(item);
            if (validationResult.error) {
              throw new Error(`Validation failed: ${validationResult.error.message}`);
            }
            transformedItems.push(transformedItem);

          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          } finally {
            if (mySqlCon) mySqlCon.release();
          }
          rowNumber++;
        }

        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleAssesment(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;
    case "placement": //done checked
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;

        for (const item of data) {
          let mySqlCon;
          try {
            let districtId = null;
            let stateId = null;
            mySqlCon = await connection.getDB();

            const queryCandidate = await connection.query(mySqlCon, `Select pklCandidateBasicId from nw_convergence_candidate_basic_dtl where candidateId = ? and fklDepartmentId`, [item["Candidate ID"], fklDepartmentId]);
            const candidateId = queryCandidate.length > 0 ? queryCandidate[0].pklCandidateBasicId : null;
            if (candidateId === null) {
              throw new Error(`Candidate not found for given ID: ${item["Candidate ID"]}`);
            }

            if (item["Placement District"]) {
              districtId = await convertToInt("district", item["Placement District"]);
              if (districtId == null) {
                throw new Error(`District ID not found for given name: ${item["Placement District"]}`);
              }
            }
            if (item["Placement State"]) {
              stateId = await convertToInt("state", item["Placement State"]);
              if (stateId == null) {
                throw new Error(`State ID not found for given name: ${item["Placement State"]}`);
              }
            }

            if (item["Is Candidate Placed"] != "yes" && item["Is Candidate Placed"] != "no") {
              throw new Error(`Is Candidate Placed should be yes or no`);
            }
            //console.log("Batch id", item["Batch ID"]);
            const fklBatchId = await convertToInt("batch", item["Batch ID"]);
            if (!fklBatchId) {
              throw new Error(`Batch ID not found for given name: ${item["Batch ID"]}`);
            }

            // //on campus or Wage-Employment
            // if(item["Placement Type"]!="Wage-Employment" && item["Placement Type"]!="Self-Employment"){
            //   throw new Error(`Placement Type should be "on campus" or "Wage-Employment" only`);
            // }
            // const placementTypeId = await convertToInt("Placement Type", item["Placement Type"]);
            // if(placementTypeId==null){
            //   throw new Error(`Placement Type ID not found for given name: ${item["Placement Type"]}`);
            // }
            const isCandidatePlaced = item["Is Candidate Placed"].toLowerCase() === "yes" ? 1 : 0;
            const transformedItem = {
              batchId: fklBatchId,
              candidateId: candidateId,
              bIsCandidatePlaced: isCandidatePlaced,
              vsEmployeerName: item["Employer Name"],
              vsPlacementType: item["Placement Type"],
              vsEmployeerContactNumber: item["Employer Contact Number"],
              vsPlacementDistrict: districtId,
              vsPlacementState: stateId,
              vsMonthlySalary: item["Monthly Salary"],
              fklDepartmentId: fklDepartmentId,
              queryType: "placement",
              rowNumber: rowNumber // store original row number here
            };

            const validationResult = placementValidator.validatePlacement(item);
            if (validationResult.error) {
              throw new Error(`Validation failed: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
            rowNumber++;
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          } finally {
            if (mySqlCon) mySqlCon.release();
          }
          rowNumber++;
        }

        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handlePlacement(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;
    case "assessor": //done checked
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;
        for (const item of data) {
          try {
            const validDate = excelSerialDateToDate(item["Valid Up To"]);
            const formattedValidDate = formatDateToMySQL(validDate);
            const fklCourseId = await convertToInt('qpnos', item['QPNOS Code']);
            if (!fklCourseId) {
              throw new Error(`Course not found for QPNOS ${item['QPNOS Code']}`);
            }
            const transformedItem = {
              // assessorId: item["assessor id"],
              vsAssessorName: item["Assessor Name"],
              vsEmail: item["Email"],
              vsMobile: item["Mobile"],
              vsAssessmentAgency: item["Assessment Agency"],
              dtValidUpTo: formattedValidDate,
              fklDepartmentId: fklDepartmentId,
              queryType: "assessor",
              vsPAN: item['PAN'],
              QPNOS: item['QPNOS Code'],
              fklBatchId: null,
              fklCourseId: fklCourseId,
              rowNumber: rowNumber // store original row number here
            };


            const validationResult = validateAssessor.validateAssesor(item);
            if (validationResult.error) {
              throw new Error(`Validation failed: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          }
          rowNumber++;
        }
        // Insertion loop using the stored rowNumber from each transformed item
        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleAssessor(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;
    case "trainer": //done checked
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;
        for (const item of data) {
          try {
            const tc_id = await convertToInt('tc', item['Tranning Center']);
            if (!tc_id) {
              throw new Error(`TC ID not found for given name: ${item["Tranning Center"]}`);
            }
            const course_id = await convertToInt('Course', item['Course Name']);
            if (!course_id) {
              throw new Error(`Course ID not found for given name: ${item["Course Name"]}`);
            }
            const transformedItem = {

              // trainerId: item["trainer id"],
              vsTrainerName: item["Trainer Name"],
              vsEmail: item["Email"],
              vsMobile: item["Mobile"],
              vsPAN: item["PAN No"],
              fklDepartmentId: fklDepartmentId,
              queryType: "trainer",
              fklTcId: tc_id,
              fklCourseId: course_id,
              rowNumber: rowNumber // store original row number here
            };

            const validationResult = validateTrainer.validateTrainner(item);
            if (validationResult.error) {
              throw new Error(`Validation failed: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          }
          rowNumber++;
        }// Insertion loop using the stored rowNumber from each transformed item
        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleTrainer(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;
    case "invoice": //all checked
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;  // Initialize row counter

        for (const item of data) {
          try {
            const invoiceDate = excelSerialDateToDate(item["Invoice Date"]);
            const formattedInvoiceDate = formatDateToMySQL(invoiceDate);

            const tcId = await convertToInt("tc", item["Trainning Center"]);
            if (tcId == null) {
              throw new Error(`Trainng ID not found for given name: ${item["Trainning Center"]}`);
            }

            const batchId = await convertToInt("batch", item["Batch Number"]);
            if (batchId == null) {
              throw new Error(`Batch ID not found for given name: ${item["Batch Number"]}`);
            }

            const invoiceTypeId = await convertToInt("invoice type", item["Invoice Type"]);
            if (invoiceTypeId == null) {
              throw new Error(`Invoice Type not found for given name: ${item["Batch Number"]} It should be "First Installment (Training Invoice)" or "Second Installment(Training Invoice)" or "Third Installment (Training Invoice)" or "Hostel Invoice"`);
            }

            const transformedItem = {
              fklTcId: tcId,
              fklInvoiceType: invoiceTypeId,
              vsInvoiceTranche: item["Invoice Tranche"],
              vsInvoiceDate: formattedInvoiceDate,
              vsInvoiceNo: item["Invoice No"],
              fAmount: item["Amount"],
              fRate: item["Rate"],
              iTotalCandidate: item["Total Candidate"],
              fklBatchId: batchId,
              fklDepartmentId: fklDepartmentId,
              queryType: "invoice",
              rowNumber: rowNumber  // Add row number to transformed item
            };

            const validationResult = validateInvoice.validateInvoice(item);
            if (validationResult.error) {
              throw new Error(`Validation failed: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          }
          rowNumber++;  // Increment row counter
        }

        // Process transformed items and track successful insertions
        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleInvoice(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }

        // Add results to responses array
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });
      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;
    case "candidate": //done checked
      try {
        const transformedItems = [];
        const validationErrors = [];
        let rowNumber = 1;

        // Transformation/Validation loop
        for (const item of data) {
          try {
            const dob = excelSerialDateToDate(item["DOB"]);
            const formattedDOB = formatDateToMySQL(dob);
            // Gender validation
            if (item["Gender"] != "Male" && item["Gender"] != "Female" && item["Gender"] != "Transgender" && item["Gender"] != "Any") {
              throw new Error(`Gender should be Male or Female or Transgender or Any`);
            }
            const genderId = await convertToInt("Gender", item["Gender"]);
            if (genderId == null) {
              throw new Error(`Gender ID not found for given name: ${item["Gender"]}`);
            }
            // Religion validation
            if (item["Religion"] != "Hinduism" && item["Religion"] != "Islam" && item["Religion"] != "Christianity" && item["Religion"] != "Sikhism" && item["Religion"] != "Other") {
              throw new Error(`Religion should be Hinduism or Islam or Christianity or Sikhism or Other`);
            }
            const religionId = await convertToInt("Religion", item["Religion"]);
            if (religionId == null) {
              throw new Error(`Religion ID not found for given name: ${item["Religion"]}`);
            }
            // Category validation
            // if (item["Category"] != "General" && item["Category"] != "SC" && item["Category"] != "ST(H)" && item["Category"] != "ST(P)" && item["Category"] != "OBC" && item["Category"] != "MOBC") {
            //   throw new Error(`Category should be General or SC or ST(H) or ST(P) or OBC or MOBC `);
            // }
            const categoryId = await convertToInt("Category", item["Category"]);
            if (categoryId == null) {
              throw new Error(`Category ID not found for given name: ${item["Category"]}`);
            }
            // Education Attained validation
            if (item["Education Attained"] != "5th Pass" && item["Education Attained"] != "8th Pass" && item["Education Attained"] != "Diploma/ITI" && item["Education Attained"] != "Graduate/Equivalent" && item["Education Attained"] != "High School/10th/Matric/Equivalent" && item["Education Attained"] != "Higher Secondary/Intermediate/12th/Equivalent" && item["Education Attained"] != "Other" && item["Education Attained"] != "Post Graduate/Equivalent" && item["Education Attained"] != "Uneducated/No formal education") {
              throw new Error(`Education Attained should be 5th Pass or 8th Pass or Diploma/ITI or Graduate/Equivalent or High School/10th/Matric/Equivalent or Higher Secondary/Intermediate/12th/Equivalent or Other or Post Graduate/Equivalent or Uneducated/No formal education`);
            }
            const educationAttainedId = await convertToInt("Qualification", item["Education Attained"]);
            if (educationAttainedId == null) {
              throw new Error(`Education Attained ID not found for given name: ${item["Education Attained"]}`);
            }
            const disability = item["Disability"] === "yes" ? 1 : 0;
            const teaTribe = item["Tea Tribe"] === "yes" ? 1 : 0;
            const bplCardHolder = item["BPL Card Holder"] === "yes" ? 1 : 0;
            const minority = item["Minority"] === "yes" ? 1 : 0;
            const isAssessmentComplete = item["Is Assessment Complete"] === "yes" ? 1 : 0;
            const isCandidatePlaced = item["Is Candidate Placed"] === "yes" ? 1 : 0;
            const bDropout = item["Dropout"] === "Yes" ? 1 : 0;


            // Batch ID validation
            let fklBatchId;
            if (item["Batch ID"] !== undefined) {
              fklBatchId = await convertToInt("batch", item["Batch ID"]);
              if (!fklBatchId) {
                throw new Error(`Batch not found for Batch Number : ${item["Batch ID"]}`);
              }
            }

            // Save the current rowNumber in the transformed object

            const transformedItem = {
              batchId: fklBatchId,
              vsCandidateName: item["Candidate Name"],
              vsDOB: formattedDOB,
              vsGender: genderId,
              vsUUID: item["ID Card Number"],
              fklReligionId: religionId,
              fklCategoryId: categoryId,
              vsEducationAttained: educationAttainedId,
              bDisability: disability,
              bTeaTribe: teaTribe,
              bBPLcardHolder: bplCardHolder,
              bMinority: minority,
              bAssessed: isAssessmentComplete,
              vsResult: item['Result'],
              placed: isCandidatePlaced,
              vsPlacementType: item['Placement Type'],
              fklDepartmentId: fklDepartmentId,
              queryType: "candidate",
              rowNumber: rowNumber, // store original row number here,
              bDropout:bDropout
            };

            // --- START OLD CODE 30-04-2025 --------
            // const transformedItem = {
            //   candidateId: item["Candidate ID"],
            //   batchId: fklBatchId,
            //   vsCandidateName: item["Candidate Name"],
            //   vsDOB: formattedDOB,
            //   iAge: item["Age"],
            //   vsFatherName: item["Father Name"],
            //   vsGender: genderId,
            //   // fklIdType: idTypeId,
            //   vsUUID: item["ID Card Number"],
            //   fklReligionId: religionId,
            //   fklCategoryId: categoryId,
            //   vsMobile: item["Mobile"],
            //   vsEmail: item["Email"],
            //   vsEducationAttained: educationAttainedId,
            //   bDisability: disability,
            //   bTeaTribe: teaTribe,
            //   bBPLcardHolder: bplCardHolder,
            //   bMinority: minority,
            //   vsRAddress: null,
            //   vsRDistrict: null,
            //   vsRState: null,
            //   vsRBlock: null,
            //   vsRUlb: null,
            //   vsRVillageCity: null,
            //   vsRPostOffice: null,
            //   vsRPolice: null,
            //   vsRPIN: null,
            //   vsRCouncilContituency: null,
            //   vsRAssemblyContituency: null,
            //   vsPAddress: null,
            //   vsPDistrict: null,
            //   vsPState: null,
            //   vsPBlock: null,
            //   vsPUlb: null,
            //   vsPVillageCity: null,
            //   vsPPostOffice: null,
            //   vsPPolice: null,
            //   vsPPIN: null,
            //   vsPCouncilContituency: null,
            //   vsPAssemblyContituency: null,
            //   vsBankHolderName: null,
            //   vsAccountNumber: null,
            //   vsBankName: null,
            //   vsBankIFSC: null,
            //   vsBranchName: null,
            //   fklDepartmentId: fklDepartmentId,
            //   queryType: "candidate",
            //   rowNumber: rowNumber // store original row number here
            // };

            // --- END OLD CODE 30-04-2025 --------

            const validationResult = validateCandidate.validateCandidate(item);
            if (validationResult.error) {
              throw new Error(`Validation failed: ${validationResult.error.message}`);
            }

            transformedItems.push(transformedItem);
          } catch (err) {
            validationErrors.push({ error: err.message, rowNumber: rowNumber });
          }
          rowNumber++;
        }

        // Insertion loop using the stored rowNumber from each transformed item
        let insertedRow = 0;
        for (const transformedItem of transformedItems) {
          const response = await handleCandidate(transformedItem, 2);
          if (response.success === false) {
            // Use the rowNumber stored in the transformedItem
            validationErrors.push({ error: response.message, rowNumber: transformedItem.rowNumber });
          } else {
            insertedRow++;
          }
        }
        //console.log("insertedRow----", insertedRow);
        //console.log("validationErrors----", validationErrors);
        responses.push({ insertedRow: insertedRow });
        responses.push({ error: validationErrors });

      } catch (error) {
        //console.log("error", error);
        return {
          success: false,
          message: error.message,
        };
      }
      break;

    // Add cases for other types
    default:
      return "Invalid type for validation";
  }
  //console.log("validationResult.error", validationResult)
  if (validationResult != undefined) {
    //console.log("validationResult.error", validationResult.error)
    throw new Error(`Validation failed: ${validationResult.error.message}`);
  }
  return {
    statusCode: 200,
    success: true,
    message: "All Data processed successfully",
    successCode: "sLoad-200",
    data: responses, // Return all responses in a single data object
  };
};


//***sector details from Master table */
async function getSectorIdByName(sectorName) {
  let mySqlCon = null;
  try {
    mySqlCon = await connection.getDB();
    const queryResult = await connection.query(mySqlCon, "SELECT pklSectorId FROM nw_coms_sector WHERE vsSectorName = ?", [sectorName]);
    //console.log("here-----", queryResult)
    return queryResult.length > 0 ? queryResult[0].pklSectorId : null;
  } catch (error) {
    console.error("Error fetching sector ID:", error);
    throw new Error("Error fetching sector ID");
  } finally {
    if (mySqlCon) mySqlCon.release();
  }
}
