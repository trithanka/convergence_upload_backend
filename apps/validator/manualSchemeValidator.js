const Joi = require('joi');
//all trim is required
function validateSchemeInput(input) {
    const schema = Joi.object({
      rowNumber:Joi.optional(),
      schemeFundingType: Joi.optional(),
      schemeFundingRatio: Joi.optional(),
      sanctionOrderNo: Joi.optional(),
      dateOfSanction: Joi.date().required(),
      schemeType: Joi.optional(),
      fundName: Joi.optional(),
      scheme: Joi.string().required(),
      schemeCode: Joi.string().trim().required(),
      fklDepartmentId: Joi.number().required(),
      queryType: Joi.string().valid('scheme').required()
    });
  
    return schema.validate(input);
}

//file upload
const schemeSchema = Joi.object({
  "Sl No": Joi.optional(),
  "Scheme Funding Type": Joi.string().optional(),
  "Scheme Funding Ratio": Joi.required().optional(),
  "Sanction Order No": Joi.required().optional(),
  "Date of Sanction": Joi.date().required(),
  "Scheme Type": Joi.string().required().optional(),
  "Fund Name": Joi.string().optional(),
  "Scheme Name": Joi.string().required(),
  "Scheme Code": Joi.required()
});

const validateScheme = (data) => {
  return schemeSchema.validate(data, { abortEarly: false });
};
module.exports = { validateSchemeInput,validateScheme };