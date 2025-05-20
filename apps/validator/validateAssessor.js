const Joi = require('joi');
const validateAssessorInput = (input) => {
    const schema = Joi.object({
        rowNumber: Joi.optional(),
        queryType: Joi.string().valid('assessor').required(),
        fklDepartmentId: Joi.number().required(),
        // assosserId: Joi.number(),
        vsAssessorName: Joi.string().required(),
        vsEmail: Joi.string(),
        vsMobile: Joi.number().required(),
        vsAssessmentAgency: Joi.string().required(),
        dtValidUpTo: Joi.date().required(),
        vsPAN: Joi.string().required(),
        QPNOS: Joi.string().optional(),
        fklBatchId: Joi.optional(),
        fklCourseId :Joi.required()
    });
    return schema.validate(input);
}

//file upload
const assessorSchema = Joi.object({
    "SL No": Joi.optional(),
    // "assosser id": Joi.number().required(),
    "Assessor Name": Joi.string().required(),
    "Email": Joi.string(),
    "Mobile": Joi.number().required(),
    "Assessment Agency": Joi.string().required(),
    "Valid Up To": Joi.date().required(),
    "QPNOS Code": Joi.string().optional(), ///make it required check with course fklCourseId
    "Batch Number": Joi.optional(),
    "PAN": Joi.string().required()
});

const validateAssesor = (data) => {
    return assessorSchema.validate(data, { abortEarly: false });
};
module.exports = { validateAssessorInput, validateAssesor };