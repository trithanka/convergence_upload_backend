const Joi = require('joi');

function validateCourseInput(input) {
  const schema = Joi.object({
    rowNumber: Joi.optional(),
    dtFromDate: Joi.required(),
    dtToDate: Joi.required(),
    fklTpId: Joi.optional(),
    fklLoginId: Joi.optional(),
    fklSectorId: Joi.number().required(),
    vsCourseCode: Joi.optional(),
    vsCourseName: Joi.string().required(),
    iTheoryDurationInHours: Joi.number(),
    iPracticalDurationInHours: Joi.number(),
    fklDepartmentId: Joi.number().required(),
    queryType: Joi.string().valid('course').required(),
    fklTcId: Joi.optional(),
    qpnos: Joi.optional()
  });

  return schema.validate(input);
}

//file upload
const courseSchema = Joi.object({
  "Sl No": Joi.optional(),
  // "tp id": Joi.number().required(),
  "Course Name": Joi.string().required(),
  "QPNOS Code": Joi.optional(),
  "From Date": Joi.required(),
  "To Date": Joi.required(),
  // "login id": Joi.number().required(),
  "Theory Duration Hours": Joi.number(),
  "Practical Duration Hours": Joi.number(),
  "Sector Name": Joi.string(),
  "Tranning Center": Joi.optional()
});

const validateCourse = (data) => {
  return courseSchema.validate(data, { abortEarly: false });
};

module.exports = { validateCourseInput, validateCourse };