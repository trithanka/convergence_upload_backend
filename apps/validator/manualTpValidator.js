const Joi = require('joi');

function validateTpInput(input) {
  const schema = Joi.object({
    rowNumber: Joi.optional(),
    tpId: Joi.number(),
    vsTpName: Joi.string().required(),
    vsSpocEmail: Joi.string().email(),
    iSpocContactNum: Joi.number(),
    vsSpocName: Joi.string(),
    vsTpCode: Joi.string(),
    vsState: Joi.number(),
    vsDistrict: Joi.number(),
    vsBlock: Joi.number(),
    vsULB: Joi.number(),
    vsVillage: Joi.string(),
    vsCity: Joi.string(),
    vsAddress: Joi.string().required(),
    fklDepartmentId: Joi.number().required(),
    queryType: Joi.string().valid('TP').required(),
    vsSmartId: Joi.string(),
    fklLoginId: Joi.number(),
    isVillageCity: Joi.optional(),
    vsPAN: Joi.string().required()
  });

  return schema.validate(input);
}

//file upload
const tpSchema = Joi.object({
  "Sl No":Joi.optional(),
  "TP Name": Joi.string().required(),
  "PAN": Joi.string().required(),
  "Address": Joi.string().required(),

  // ---- START OLD CODE 29-04-2025 -----------

  // "TP Code": Joi.string(),
  // "Spoc Email": Joi.string(),
  // "Spoc Contact Number": Joi.number().required(),
  // "State": Joi.string().required(),
  // "District": Joi.string().required(),
  // "Block": Joi.string(),
  // "ULB": Joi.string(),
  // "City": Joi.string(),
  // "Village": Joi.string(),
  
  // "Spoc Name": Joi.string().required(),
  // "Smart ID": Joi.string(),
  // "Sl No": Joi.optional(),
  // "City or Village": Joi.optional(),

  // ---- END OLD CODE 29-04-2025 -----------
  
});

const validateTp = (data) => {
  return tpSchema.validate(data, { abortEarly: false });
};
module.exports = { validateTpInput, validateTp };