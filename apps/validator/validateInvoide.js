const Joi = require('joi');
const validateInvoiceInput = (input) => {
    const schema = Joi.object({
        rowNumber: Joi.optional(),
        queryType: Joi.string().valid('invoice').required(),
        fklDepartmentId: Joi.number().required(),
        fklInvoiceType: Joi.number().required(),
        vsInvoiceTranche: Joi.string().required(),
        vsInvoiceDate: Joi.date().required(),
        vsInvoiceNo: Joi.string().required(),
        fAmount: Joi.number().optional(),
        fklBatchId: Joi.number().required(),
        fRate: Joi.number().optional(),
        iTotalCandidate: Joi.number().required(),
        fklTcId:Joi.number().required()

    });
    return schema.validate(input);
}

//file upload
const invoiceSchema = Joi.object({
    "Sl No": Joi.optional(),
    "Invoice Type": Joi.string().required(),
    "Invoice Tranche": Joi.string().required(),
    "Invoice Date": Joi.date().required(),
    "Invoice No": Joi.string().required(),
    "Amount": Joi.number().optional(),
    "Batch Number": Joi.number().required(),
    "Rate": Joi.number().optional(),
    "Total Candidate": Joi.number().required(),
    "Trainning Center":Joi.string().required()
});

const validateInvoice = (data) => {
    return invoiceSchema.validate(data, { abortEarly: false });
};
module.exports = { validateInvoiceInput, validateInvoice };