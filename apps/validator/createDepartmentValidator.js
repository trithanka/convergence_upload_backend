const Joi = require('joi');

const departmentSchema = Joi.object({
    departmentName: Joi.string().required(),
    // departmentSortName:Joi.string().required(),
    phoneNumber: Joi.number().required(),
    loginName: Joi.string().required(),
    password: Joi.string()
});

const validateDepartmentInput = (data) => {
    return departmentSchema.validate(data);
};

module.exports = { validateDepartmentInput };