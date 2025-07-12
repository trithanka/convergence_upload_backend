const Joi = require('joi');

const validateCandidateInput = (input) => {
  const schema = Joi.object({
    rowNumber:Joi.optional(),
    fklDepartmentId: Joi.number().valid().required(),
    candidateId: Joi.string().valid(),
    batchId: Joi.optional(),
    vsCandidateName: Joi.string().valid().required(),
    vsDOB: Joi.date().valid().required(),
    iAge: Joi.number().optional(),
    vsFatherName: Joi.optional(),
    vsGender: Joi.number().valid().required(),
    fklIdType: Joi.optional(),
    vsUUID: Joi.optional(),
    fklReligionId: Joi.number().valid().required(),
    fklCategoryId: Joi.number().valid().required(),
    vsMobile: Joi.valid(),
    vsEmail: Joi.string(),
    vsEducationAttained: Joi.number().valid().required(),

    bDropout: Joi.optional(),
    //assessmest
    bAssessed: Joi.optional(),
    vsResult: Joi.optional(),
  

    //placement
    vsPlacementType: Joi.optional(),
    placed: Joi.optional(),
    declared: Joi.optional(),

    bDisability: Joi.number().valid(),
    bTeaTribe: Joi.number().valid(),
    bBPLcardHolder: Joi.number(),
    bMinority: Joi.number(),
    // fklCandidateBasicId: Joi.number().valid().required(),
    // fklDepartmentId: Joi.number().valid().required(),
    iSameAddress:Joi.optional(),
    vsRAddress: Joi.optional(),
    vsRState:Joi.optional(),
    vsRDistrict: Joi.optional(),
    vsRBlock: Joi.optional(),
    vsRUlb: Joi.optional(),
    isRCityVillage:Joi.optional(),
    vsRVillageCity: Joi.optional(),
    vsRPostOffice: Joi.optional(),
    vsRPolice: Joi.optional(),
    vsRPIN: Joi.optional(),
    vsRCouncilContituency: Joi.optional(),
    vsRAssemblyContituency: Joi.optional(),
    
    vsPAddress: Joi.optional(),
    vsPState:Joi.optional(),
    vsPDistrict: Joi.optional(),
    vsPBlock: Joi.optional(),
    vsPUlb: Joi.optional(),
    isPCityVillage:Joi.optional(),
    vsPVillageCity: Joi.optional(),
    vsPPostOffice: Joi.optional(),
    vsPPolice: Joi.optional(),
    vsPPIN: Joi.optional(),
    vsPCouncilContituency: Joi.optional(),
    vsPAssemblyContituency: Joi.optional(),

    vsBankHolderName: Joi.optional(),
    vsAccountNumber: Joi.optional(),
    vsBankName: Joi.optional(),
    vsBankIFSC: Joi.optional(),
    vsBranchName:Joi. optional(),

    queryType: Joi.string().valid('candidate').required()
  });

  return schema.validate(input);
};

const validateCandidateAddress = (input) => {
  const schema = Joi.object({
    vsPAddress: Joi.optional(),
    vsPState:Joi.optional(),
    vsPDistrict: Joi.optional(),
    vsPBlock: Joi.optional(),
    vsPUlb: Joi.optional(),
    isPCityVillage:Joi.optional(),
    vsPVillageCity: Joi.optional(),
    vsPPostOffice: Joi.optional(),
    vsPPolice: Joi.optional(),
    vsPPIN: Joi.optional(),
    vsPCouncilContituency: Joi.optional(),
    vsPAssemblyContituency: Joi.optional(),
  });

  return schema.validate(input);
};

//file upload
const candidateSchema = Joi.object({
  "Sl No": Joi.number().optional(),
  "Candidate ID": Joi.string().valid().optional(),
  "Batch ID": Joi.optional(),
  "Candidate Name": Joi.string().valid().required(),
  "DOB": Joi.date().valid().required(),
  "Father Name": Joi.string().valid(),
  "Gender": Joi.string().valid().required(),
  // "Id Type": Joi.valid().required(),
  "ID Card Number": Joi.optional(),
  "Religion": Joi.string().valid().required(),
  "Category": Joi.string().valid().required(),
  "BPL Card Holder": Joi.string().valid(),
  "Mobile": Joi.valid().optional(),
  "Email": Joi.string(),
  "Education Attained": Joi.string().valid().required(),
  "Disability": Joi.string().valid(),
  "Tea Tribe": Joi.string().valid(),
  "Minority": Joi.string().valid(),
  "Residential Address": Joi.optional(),
  "Residential State": Joi.optional(),
  "Residential District": Joi.optional(),
  "Residential Block": Joi.optional(),
  "Residential ULB": Joi.optional(),
  "Residential Village/City": Joi.optional(),
  "Residential Post Office": Joi.optional(),
  "Residential Police": Joi.optional(),
  "Residential PIN": Joi.optional(),
  "Residential Council Contituency": Joi.optional(),
  "Residential Assembly Contituency": Joi.optional(),
  "Permanent Address": Joi.optional(),
  "Permanent State": Joi.optional(),
  "Permanent District": Joi.optional(),
  "Permanent Block": Joi.optional(),
  "Permanent ULB": Joi.optional(),
  "Permanent Village/City": Joi.optional(),
  "Permanent Post Office": Joi.optional(),
  "Permanent Police": Joi.optional(),
  "Permanent PIN": Joi.optional(),
  "Permanent Council Contituency": Joi.optional(),
  "Permanent Assembly Contituency": Joi.optional(),
  "Bank Holder Name": Joi.optional(),
  "Account Number": Joi.optional(),
  "Bank Name": Joi.optional(),
  "Bank IFSC": Joi.optional(),
  "Branch Name": Joi.optional(),
  "Is Assessment Complete":Joi.optional(),
  "Is Candidate Placed":Joi.optional(),
  "Result":Joi.optional(),
  "Placement Type":Joi.optional(),
});

const validateCandidate = (data) => {
  return candidateSchema.validate(data, { abortEarly: false });
};


////////////////////////////////////////////////////////convergence////////////////////////////////////////////////////////////////
const validateConvergenceInput = (input) => {
  const schema = Joi.object({
    rowNumber:Joi.optional(),

    vsSchemeName:Joi.string().valid().optional(),
itotalTrainingCandidate:Joi.number().valid().optional(),
itotalCertifiedCandidate:Joi.number().valid().optional(),
itotalPlacedCandidate:Joi.number().valid().optional(),
itotalTarget:Joi.number().valid().optional(),
iMaleCount:Joi.number().valid().optional(),
iFemaleCount:Joi.number().valid().optional(),
iScCount:Joi.number().valid().optional(),
iStHCount:Joi.number().valid().optional(),
iStPCount:Joi.number().valid().optional(),
iObcCount:Joi.number().valid().optional(),
iGeneralCount:Joi.number().valid().optional(),
iMinorityCount:Joi.number().valid().optional(),
iTeaTribeCount:Joi.number().valid().optional(),
iPwdCount:Joi.number().valid().optional(),
iTotalJobRoleCount:Joi.number().valid().optional(),
fklDepartmentId:Joi.number().valid().optional(),
dtFinancialYear:Joi.valid().optional(),
iOtherCount:Joi.number().valid().optional(),
totalCount:Joi.number().valid().optional()
  });

  return schema.validate(input);
};

const convergenceSchema = Joi.object({
  "Sl No": Joi.optional(),
  "Scheme Name": Joi.string(),
  "Financial Year": Joi.valid(),
  "Job Role Count": Joi.number(),
  // "Total Training Candidate": Joi.number(),
  "Total Certified Candidate": Joi.number(),
  "Total Placed Candidate": Joi.number(),
  "Total Target": Joi.number(),
  "Male Candidate Count": Joi.number(),
  "Female Candidate Count": Joi.number(),
  "SC Candidate Count": Joi.number(),
  "ST Candidate Count": Joi.number(),
  "OBC Candidate Count": Joi.number(),
  "General Candidate Count": Joi.number(),
  "Minority Candidate Count": Joi.number(),
  "Tea Tribe Candidate Count": Joi.number(),
  "PwD Candidate Count": Joi.number(),
  "Other Candidate Count": Joi.number(),
  "Total Candidate Count": Joi.number(),
});

const validateConvergence = (data) => {
  return convergenceSchema.validate(data, { abortEarly: false });
};

module.exports = { validateCandidateInput,validateCandidateAddress ,validateCandidate,validateConvergenceInput,validateConvergence };