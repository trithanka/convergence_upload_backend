const Joi = require('joi');

const validateTargetInput = (input) => {
  const schema = Joi.object({
    rowNumber: Joi.optional(),
    vsTargetNo: Joi.string().required(),
    dtTargetDate: Joi.required(),
    dtTargetEndDate: Joi.date().optional(),
    vsSchemeCode: Joi.required(),
    iTotalTarget: Joi.number().integer().required(),
    fklDepartmentId: Joi.number().required(),
    queryType: Joi.string().valid('target').required(),
    targetType: Joi.number().required(),
    fklSchemeId: Joi.number().optional(),

  });
  return schema.validate(input);
};

//file upload
const targetSchema = Joi.object({
  "Sl No": Joi.optional(),
  // "Sanction No": Joi.string().required(),
  "Target Sanction Order No": Joi.required(),
  "Scheme Code": Joi.required(),
  "Total Target": Joi.number().required(),
  "Target Date": Joi.required(),
  "Target Type": Joi.string().required()
  // "Scheme Name": Joi.string().required()
});

const validateTarget = (data) => {
  return targetSchema.validate(data, { abortEarly: false });
};

module.exports = { validateTargetInput, validateTarget };