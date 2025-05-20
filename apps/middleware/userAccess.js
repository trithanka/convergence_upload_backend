const { propagateError } = require('../../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');

const userAccess = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.user.role; // department or admin

        //console.log("userRole",userRole);
        if (userRole !== requiredRole) {
            return res.status(StatusCodes.FORBIDDEN).send(propagateError(StatusCodes.FORBIDDEN, "sLoad-403", "Access Denied"));
        }

        next();
    };
};

module.exports = userAccess;