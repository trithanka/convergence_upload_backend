const Joi = require('joi');
const validateSectorInput = (input) => {
    const schema = Joi.object({
        queryType: Joi.string().valid('sector').required(),
        fklDepartmentId: Joi.number().required(),
        vsSectorName: Joi.string().required()
    });
    return schema.validate(input);
}
module.exports = { validateSectorInput };
