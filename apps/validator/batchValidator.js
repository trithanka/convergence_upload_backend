const Joi = require('joi');

const batchSchema = Joi.object({
  rowNumber: Joi.optional(),
  SDMSid: Joi.optional(),
  dtStartDate: Joi.date().required(),
  dtEndDate: Joi.date().greater(Joi.ref('dtStartDate')).required(),
  // fklSectorId: Joi.optional(),
  // QPNOS: Joi.optional(),
  fklCourseId: Joi.number().required(),
  // fklTpId: Joi.optional(),
  fklTcId: Joi.number().required(),
  // fklTrainerId: Joi.number().required(),
  iBatchNumber: Joi.required(),
  fklDepartmentId: Joi.number().required(),
  queryType: Joi.string().valid('batch').required(),
  fklTargetId:Joi.number().required(),
  iBatchTarget:Joi.number().required(),
  vsTrainerName:Joi.string().required(),
  vsPAN:Joi.string().required(),
  fklCourseId:Joi.number().required()
});

function validateBatchInput(batchInput) {
  return batchSchema.validate(batchInput);
}

//file upload
const ExcelbatchSchema = Joi.object({
  "Sl No": Joi.optional(),
  // "TP Name": Joi.string().optional(),
  "TC Name": Joi.string().required(),
  "Course Name": Joi.string().required(),
  // "QPNOS": Joi.optional(),
  "SDMS ID": Joi.optional(),
  "Start Date": Joi.date().required(),
  "End Date": Joi.date().greater(Joi.ref('Start Date')).required(),
  // "Sector": Joi.optional(),
  "Trainer PAN": Joi.required(),
  "Batch Number": Joi.string().required(),
  "Target Order Number": Joi.required(),
  "Batch Target": Joi.number().required(),
  "Trainner Name":Joi.string().required()
});

const validateBatch = (data) => {
  return ExcelbatchSchema.validate(data, { abortEarly: false });
};
module.exports = { validateBatchInput, validateBatch };