const Joi = require('joi');

function validateTcInput(input) {
  const schema = Joi.object({
    rowNumber: Joi.optional(),
    fklTpId: Joi.number().required(), /////////////////////////////////////
    partnerCode: Joi.string(),///////////////////////////////////
    vsTcName: Joi.string().required(),
    vsTcCode: Joi.string(),///////////////////////////////
    vsSpocEmail: Joi.string().email(),
    vsSpocName: Joi.string(),
    vsState: Joi.number().required(),
    vsDistrict: Joi.number().required(),
    vsBlock: Joi.optional(),
    vsULB: Joi.number().optional(),
    vsVillage: Joi.optional(),
    vsCity: Joi.optional(),
    vsAddress: Joi.string().required(),
    iSpocContactNum: Joi.number(),
    smartId: Joi.optional(),////////////////////////////////////////////////////
    fklDepartmentId: Joi.number().required(),
    queryType: Joi.string().valid('TC').required(),
    fklLoginId: Joi.number().optional(),
    fklAssemblyConstituencyId: Joi.optional(),
    fklLoksabhaConstituencyId: Joi.optional(),
    isVillageCity: Joi.optional(),
    vsLongitude: Joi.required(),
    vsLatitude: Joi.required()
  });

  return schema.validate(input);
}

//file upload
const tcSchema = Joi.object({
  "Sl No": Joi.optional(),
  "TC Name": Joi.string().required(),
  "TP Name": Joi.required(),
  "State": Joi.string().required(),
  "District": Joi.string().required(),
  "Address": Joi.string().required(),
  "Langtitude": Joi.required(),
  "Longtitude": Joi.required(),

  // ---- START OLD CODE 29-04-2025 --------------

  // "TC Code": Joi.string(),
  // "Center Code": Joi.string().required(),
  // "Spoc Email": Joi.string(),
  // "Spoc Contact Number": Joi.number().required(),
  // "Block": Joi.optional(),
  // "ULB": Joi.optional(),
  // "City or Village": Joi.string(),
  // "Spoc Name": Joi.string().required(),
  // "Partner Code": Joi.string(),
  // "Smart ID": Joi.optional(),
  // "Assembly Constituency": Joi.optional(),
  // "Lok Sabha Constituency": Joi.optional(),
  // "Village": Joi.optional(),
  // "City": Joi.optional(),

  // ---- END OLD CODE 29-04-2025 --------------
  
});

const validateTc = (data) => {
  return tcSchema.validate(data, { abortEarly: false });
};

module.exports = { validateTcInput, validateTc };