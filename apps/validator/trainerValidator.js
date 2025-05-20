const Joi = require('joi');

const validateTrainerInput = (input) => {
    const schema = Joi.object({
        rowNumber: Joi.optional(),
        trainerId: Joi.optional(),
        vsTrainerName: Joi.string().required(),
        vsEmail: Joi.string().email(),
        vsMobile: Joi.number().required(),
        vsPAN: Joi.required(),
        fklDepartmentId: Joi.number().required(),
        queryType: Joi.string().valid('trainer').required(),
        fklCourseId: Joi.number().required(),
        fklTcId: Joi.number().required(),
    });

    return schema.validate(input);
};

//file upload
const trainnerSchema = Joi.object({
    // "trainer id": Joi.string().required(),
    "Sl No": Joi.optional(),
    "Trainer Name": Joi.string().required(),
    "Email": Joi.string().email(),
    "Mobile": Joi.number().required(),
    "PAN No": Joi.required(),
    "Tranning Center": Joi.string().required(),
    "Course Name": Joi.string().required()
});

const validateTrainner = (data) => {
    return trainnerSchema.validate(data, { abortEarly: false });
};
module.exports = { validateTrainerInput, validateTrainner };
// .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/) for pan card validation