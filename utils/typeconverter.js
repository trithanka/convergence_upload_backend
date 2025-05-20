const connection = require("../JOS/DALMYSQLConnection");



//convert string to int for database readability
//sector, scheme, state, district, candidate
const convertToInt = async (columnName, value) => {
    let mySqlCon = await connection.getDB();
    //case if columnName is sector
    switch (columnName) {
        //trainer pan to pklTrainerId
        case "TrainerPAN":
            try {
                const queryTrainer = await connection.query(mySqlCon, `Select pklConvTrainerId from nw_convergence_trainer_dtl where vsPAN = ?`, [value]);
                return queryTrainer.length > 0 ? queryTrainer[0].pklConvTrainerId : null;
            } catch (error) {
                console.error("Error fetching Trainer ID:", error);
                throw new Error("Error fetching Trainer ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "Target Order Number":
            try {
                const queryTarget = await connection.query(mySqlCon, `Select pklTargetId from nw_convergence_target_dtl where vsTargetNo = ?`, [value]);
                return queryTarget.length > 0 ? queryTarget[0].pklTargetId : null;
            } catch (error) {
                console.error("Error fetching Target Order Number:", error);
                throw new Error("Error fetching Target Order Number");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "sector":
            try {
                const queryResult = await connection.query(mySqlCon, `SELECT pklSectorId FROM nw_coms_sector WHERE vsSectorName = ?`, [value]);
                return queryResult.length > 0 ? queryResult[0].pklSectorId : null;
            } catch (error) {
                console.error("Error fetching sector ID:", error);
                throw new Error("Error fetching sector ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "scheme":
            try {
                const queryScheme = await connection.query(mySqlCon, `Select pklSchemeId from nw_convergence_scheme_dtl where vsSchemeName = ?`, [value]);
                return queryScheme.length > 0 ? queryScheme[0].pklSchemeId : null;
            } catch (error) {
                console.error("Error fetching scheme ID:", error);
                throw new Error("Error fetching scheme ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "state":
            try {
                const queryState = await connection.query(mySqlCon, `Select pklStateId from nw_mams_state where vsStateName = ?`, [value]);
                return queryState.length > 0 ? queryState[0].pklStateId : null;
            } catch (error) {
                console.error("Error fetching state ID:", error);
                throw new Error("Error fetching state ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "district":
            try {
                const queryDistrict = await connection.query(mySqlCon, `Select pklDistrictId from nw_mams_district where vsDistrictName = ?`, [value]);
                return queryDistrict.length > 0 ? queryDistrict[0].pklDistrictId : null;
            } catch (error) {
                console.error("Error fetching district ID:", error);
                throw new Error("Error fetching district ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "block":
            try {
                const queryBlock = await connection.query(mySqlCon, `Select pklTalukaId from nw_mams_taluka where vsTalukaName = ?`, [value]);
                return queryBlock.length > 0 ? queryBlock[0].pklTalukaId : null;
            } catch (error) {
                console.error("Error fetching Taluka ID:", error);
                throw new Error("Error fetching Taluka ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "ulb":
            try {
                const queryUlb = await connection.query(mySqlCon, `Select pklUlbId from nw_mams_ulb where vsUlbName = ?`, [value]);
                return queryUlb.length > 0 ? queryUlb[0].pklUlbId : null;
            } catch (error) {
                console.error("Error fetching ulb ID:", error);
                throw new Error("Error fetching ulb ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "candidate":
            try {
                const queryCandidate = await connection.query(mySqlCon, `Select candidateId from nw_convergence_candidate_basic_dtl where vsCandidateName = ?`, [value]);
                return queryCandidate.length > 0 ? queryCandidate[0].candidateId : null;
            } catch (error) {
                console.error("Error fetching candidate ID:", error);
                throw new Error("Error fetching candidate ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "PklCandidate":
            try {
                const queryCandidate = await connection.query(mySqlCon, `Select pklCandidateBasicId from nw_convergence_candidate_basic_dtl where vsCandidateName = ?`, [value]);
                return queryCandidate.length > 0 ? queryCandidate[0].pklCandidateBasicId : null;
            } catch (error) {
                console.error("Error fetching candidate ID:", error);
                throw new Error("Error fetching candidate ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "PklCandidateById":
            try {
                const queryCandidate = await connection.query(mySqlCon, `Select pklCandidateBasicId from nw_convergence_candidate_basic_dtl where candidateId = ?`, [value]);
                return queryCandidate.length > 0 ? queryCandidate[0].pklCandidateBasicId : null;
            } catch (error) {
                console.error("Error fetching candidate ID:", error);
                throw new Error("Error fetching candidate ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "Course":
            try {
                const queryCourse = await connection.query(mySqlCon, `select pklCourseId from nw_convergence_course_dtl WHERE vsCourseName = ?;`, [value]);
                return queryCourse.length > 0 ? queryCourse[0].pklCourseId : null;
            } catch (error) {
                console.error("Error fetching Course Id:", error);
                throw new Error("Error fetching Course Id");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "qpnos":
        try {
            const queryCourse = await connection.query(mySqlCon, `select pklCourseId from nw_convergence_course_dtl WHERE vsCourseCode = ?;`, [value]);
            return queryCourse.length > 0 ? queryCourse[0].pklCourseId : null;
        } catch (error) {
            console.error("Error fetching Course Id:", error);
            throw new Error("Error fetching Course Id");
        } finally {
            if (mySqlCon) mySqlCon.release();
        }
        case "TP":
            try {
                const queryTP = await connection.query(mySqlCon, `SELECT pklTpId FROM nw_convergence_tp_dtl WHERE vsTpName = ?`, [value]);
                return queryTP.length > 0 ? queryTP[0].pklTpId : null;
            } catch (error) {
                console.error("Error fetching TP ID:", error);
                throw new Error("Error fetching TP ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "Assessmbly":
            try {
                const queryAssessmbly = await connection.query(mySqlCon, `SELECT pklAssemblyConstituencyId FROM nw_mams_constituency_assembly WHERE vsConstituencyName = ?;`, [value]);
                return queryAssessmbly.length > 0 ? queryAssessmbly[0].pklAssemblyConstituencyId : null;
            } catch (error) {
                console.error("Error fetching Assessmbly ID:", error);
                throw new Error("Error fetching Assessmbly ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "LokSabha":
            try {
                const queryLokSabha = await connection.query(mySqlCon, `SELECT pklLoksabhaConstituencyId FROM nw_mams_constituency_loksabha WHERE vsConstituencyName = ?;`, [value]);
                return queryLokSabha.length > 0 ? queryLokSabha[0].pklLoksabhaConstituencyId : null;
            } catch (error) {
                console.error("Error fetching LokSabha ID:", error);
                throw new Error("Error fetching LokSabha ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "TC":
            try {
                const queryTC = await connection.query(mySqlCon, `SELECT pklTcId FROM nw_convergence_tc_dtl WHERE vsTcName = ?;`, [value]);
                return queryTC.length > 0 ? queryTC[0].pklTcId : null;
            } catch (error) {
                console.error("Error fetching TC ID:", error);
                throw new Error("Error fetching TC ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }

        case "Trainer":
            try {
                const queryTrainer = await connection.query(mySqlCon, `SELECT pklConvTrainerId FROM nw_convergence_trainer_dtl WHERE vsTrainerName = ?;`, [value]);
                return queryTrainer.length > 0 ? queryTrainer[0].pklConvTrainerId : null;
            } catch (error) {
                console.error("Error fetching Trainer ID:", error);
                throw new Error("Error fetching Trainer ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "Assessor":
            try {
                const queryAssessor = await connection.query(mySqlCon, `SELECT pklConvAssessorId FROM nw_convergence_assessor_dtl WHERE vsAssosserName = ?;`, [value]);
                return queryAssessor.length > 0 ? queryAssessor[0].pklConvAssessorId : null;
            } catch (error) {
                console.error("Error fetching Assessor ID:", error);
                throw new Error("Error fetching Assessor ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "AssessorPan":
            try {
                const queryAssessor = await connection.query(mySqlCon, `SELECT pklConvAssessorId FROM nw_convergence_assessor_dtl WHERE vsPan = ?;`, [value]);
                return queryAssessor.length > 0 ? queryAssessor[0].pklConvAssessorId : null;
            } catch (error) {
                console.error("Error fetching Assessor ID:", error);
                throw new Error("Error fetching Assessor ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "Placement Type":
            try {
                const queryPlacementType = await connection.query(mySqlCon, `SELECT pklPlacementTypeId FROM ds.nw_mams_placement_tracking_type WHERE vsTypeDisplayName = ?;`, [value]);
                return queryPlacementType.length > 0 ? queryPlacementType[0].pklPlacementTypeId : null;
            } catch (error) {
                console.error("Error fetching Placement Type ID:", error);
                throw new Error("Error fetching Placement Type ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "Gender":
            try {
                const queryGender = await connection.query(mySqlCon, `SELECT pklGenderId FROM nw_mams_gender WHERE vsGenderName = ?;`, [value]);
                return queryGender.length > 0 ? queryGender[0].pklGenderId : null;
            } catch (error) {
                console.error("Error fetching Gender ID:", error);
                throw new Error("Error fetching Gender ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "ID type":
            try {
                const queryIdType = await connection.query(mySqlCon, `select pklIdType from nw_mams_id_type WHERE vsIdTypeDisplayName LIKE ?;`, [value]);
                //console.log("queryIdType", queryIdType)
                return queryIdType.length > 0 ? queryIdType[0].pklIdType : null;

            } catch (error) {
                console.error("Error fetching ID Type:", error);
                throw new Error("Error fetching ID Type");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "Religion":
            try {
                const queryReligion = await connection.query(mySqlCon, `select pklReligionId from nw_mams_religion WHERE vsReligionName = ?;`, [value]);
                return queryReligion.length > 0 ? queryReligion[0].pklReligionId : null;
            } catch (error) {
                console.error("Error fetching Religion Id:", error);
                throw new Error("Error fetching Religion Id");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "Category":
            try {
                const queryCategory = await connection.query(mySqlCon, `select pklCasteId from nw_mams_caste WHERE vsCasteName like ?;`, [value]);
                return queryCategory.length > 0 ? queryCategory[0].pklCasteId : null;
            } catch (error) {
                console.error("Error fetching Category Id:", error);
                throw new Error("Error fetching Category Id");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "Qualification":
            try {
                const queryQaulification = await connection.query(mySqlCon, `select pklQualificationId from nw_mams_qualification WHERE vsQualification = ?;`, [value]);
                return queryQaulification.length > 0 ? queryQaulification[0].pklQualificationId : null;
            } catch (error) {
                console.error("Error fetching Qualification Id:", error);
                throw new Error("Error fetching Qualification Id");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "Bank":
            try {
                const queryBank = await connection.query(mySqlCon, `select pkBankId from nw_mams_bank WHERE vcBankName = ?;`, [value]);
                return queryBank.length > 0 ? queryBank[0].pkBankId : null;
            } catch (error) {
                console.error("Error fetching Bank Id:", error);
                throw new Error("Error fetching Bank Id");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "Branch":
            try {
                const queryBranch = await connection.query(mySqlCon, `select pklBranchId from nw_mams_bank_branch WHERE vsbranchName = ?;`, [value]);
                return queryBranch.length > 0 ? queryBranch[0].pklBranchId : null;
            } catch (error) {
                console.error("Error fetching Branch Id:", error);
                throw new Error("Error fetching Branch Id");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "batch":
            try {
                const queryBatch = await connection.query(mySqlCon, `select pklBatchId from nw_convergence_batch_dtl WHERE iBatchNumber = ?;`, [value]);
                return queryBatch.length > 0 ? queryBatch[0].pklBatchId : null;
            } catch (error) {
                console.error("Error fetching Batch Id:", error);
                throw new Error("Error fetching Batch Id");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "scheme_type":
            try {
                const querySchemeType = await connection.query(mySqlCon, `select pklSchemeTypeId from nw_mams_convergence_scheme_type WHERE vsSchemeType = ?;`, [value]);
                return querySchemeType.length > 0 ? querySchemeType?.[0]?.pklSchemeTypeId ?? null : null;
            } catch (error) {
                console.error("Error fetching Scheme Type Id:", error);
                throw new Error("Error fetching Scheme Type Id");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "fund_type":
            try {
                const queryFundType = await connection.query(mySqlCon, `select pklFundingTypeId from nw_mams_convergence_funding_type WHERE vsFundingType = ?;`, [value]);
                return queryFundType.length > 0 ? queryFundType?.[0]?.pklFundingTypeId ?? null : null;
            } catch (error) {
                console.error("Error fetching Scheme Type Id:", error);
                throw new Error("Error fetching Scheme Type Id");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "scheme_code":
            try {
                const queryFundType = await connection.query(mySqlCon, `select pklSchemeId from nw_convergence_scheme_dtl WHERE vsSchemeCode = ?;`, [value]);
                return queryFundType.length > 0 ? queryFundType?.[0]?.pklSchemeId ?? null : null;
            } catch (error) {
                console.error("Error fetching Scheme Id:", error);
                throw new Error("Error fetching Scheme  Id");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "invoice type":
            try {
                const queryInvoice = await connection.query(mySqlCon, `select pklInvoiceTypeId from nw_mams_invoice_type WHERE vsInvoiceType like ?;`, [value]);
                return queryInvoice.length > 0 ? queryInvoice[0].pklInvoiceTypeId : null;
            } catch (error) {
                console.error("Error fetching Batch Id:", error);
                throw new Error("Error fetching Batch Id");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }
        case "target_type":
            try {
                const queryInvoice = await connection.query(mySqlCon, `select pklTargetTypeId from nw_mams_convergence_target_type WHERE vsTargetType = ?;`, [value]);
                return queryInvoice.length > 0 ? queryInvoice[0].pklTargetTypeId : null;
            } catch (error) {
                console.error("Error fetching Target Type ID:", error);
                throw new Error("Error fetching Target Type ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }

        case "tc":
            try {
                const queryInvoice = await connection.query(mySqlCon, `select pklTcId from nw_convergence_tc_dtl WHERE vsTcName = ?;`, [value]);
                return queryInvoice.length > 0 ? queryInvoice[0].pklTcId : null;
            } catch (error) {
                console.error("Error fetching TC ID:", error);
                throw new Error("Error fetching TC ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }

        case "assessor_name":
            try {
                const queryInvoice = await connection.query(mySqlCon, `select pklConvAssessorId from nw_convergence_assessor_dtl WHERE vsAssosserName = ?;`, [value]);
                return queryInvoice.length > 0 ? queryInvoice[0].pklConvAssessorId : null;
            } catch (error) {
                console.error("Error fetching Aessor Name ID:", error);
                throw new Error("Error fetching Assessor Name ID");
            } finally {
                if (mySqlCon) mySqlCon.release();
            }


    }

}

module.exports = { convertToInt };