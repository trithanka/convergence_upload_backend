const Joi = require('joi');
const validatePlacementInput = (input) => {
    const schema = Joi.object({
        rowNumber:Joi.optional(),
        queryType: Joi.string().valid('placement').required(),
        fklDepartmentId: Joi.number().required(),
        batchId: Joi.number().required(),
        candidateId: Joi.required(),
        bIsCandidatePlaced: Joi.optional(),
        vsEmployeerName: Joi.optional(),
        vsPlacementType: Joi.string().optional(),
        vsEmployeerContactNumber: Joi.optional(),
        vsPlacementDistrict: Joi.optional(),
        vsPlacementState: Joi.optional(),
        vsMonthlySalary: Joi.optional(),
        dtAppointmentDate: Joi.optional()
    });
    return schema.validate(input);
}

//file upload
const placementSchema = Joi.object({
    "Sl No": Joi.optional(),
    "Batch ID": Joi.number().required(),
    "Candidate ID": Joi.required(),
    "Is Candidate Placed": Joi.optional(),
    "Employer Name": Joi.string().optional(),
    "Placement Type": Joi.string().optional(),
    "Employer Contact Number": Joi.number().optional(),
    "Placement District": Joi.string().optional(),
    "Placement State": Joi.string().optional(),
    "Monthly Salary": Joi.number().optional(),
    "Appointment Date": Joi.optional()
});

const validatePlacement = (data) => {
    return placementSchema.validate(data, { abortEarly: false });
};
module.exports = { validatePlacementInput, validatePlacement };