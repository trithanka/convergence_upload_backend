const Joi = require('joi');
const validateAssesmentInput = (input) => {
  const schema = Joi.object({
    rowNumber:Joi.optional(),
    queryType: Joi.string().valid('assesment').required(),
    fklDepartmentId: Joi.number().required(),
    batchId: Joi.number().required(),
    SDMSBatchId: Joi.optional(),
    candidateId: Joi.number(),
    bAssessed: Joi.number(),
    dtAssessmentDate: Joi.date(),
    vsAgency: Joi.string(),
    vsAgencyMobile: Joi.string(),
    vsAgencyEmail: Joi.string(),
    accessorId: Joi.number(),
    vsAccessorName: Joi.string(),
    vsResult: Joi.optional(),
    dtResultDate: Joi.optional(),
    vsCertificationStatus: Joi.string(),
    vsTotalMarks: Joi.number(),
    vsObtainedMarks: Joi.number(),
    vsMarksheetUrl: Joi.string(),
    vsCertificateUrl: Joi.string(),
  });
  return schema.validate(input);
}

//file upload
const assesmentSchema = Joi.object({
  "Sl No": Joi.optional(),
  "Batch ID": Joi.number().required(),
  "SDMS Batch ID": Joi.optional(),
  "Candidate ID": Joi.string(),
  "Is Assessed": Joi.optional(),
  "Assessment Date": Joi.date().required(),
  "Agency": Joi.string(),
  "Agency Mobile": Joi.string(),
  "Agency Email": Joi.string(),
  "Assessed ID": Joi.number(),
  "Accessor PAN": Joi.string().required(),
  "Is Result Declare": Joi.string().required(),
  "Result Date": Joi.date().when("Is Result Declare", {
    is: "yes",
    then: Joi.date().required().messages({ "any.required": "Result Date is required when vsResult is 'yes'." }),
    otherwise: Joi.date().optional(),
  }),
  "Certification Status": Joi.string(),
  "Total Marks": Joi.number(),
  "Obtained Marks": Joi.number(),
  "Marksheet URL": Joi.string(),
  "Certificate URL": Joi.string(),
  "Result":Joi.string()
});

const validateAssesment = (data) => {
  return assesmentSchema.validate(data, { abortEarly: false });
};
module.exports = { validateAssesmentInput, validateAssesment };