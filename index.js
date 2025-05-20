"use strict";
//requires
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const CreateError = require("http-errors");
var morgan = require("morgan"); //logger 
const PORT = 7272;
require('dotenv').config();

/************************************************************************* */

const { propagateError } = require("./utils/responseHandler");

/************************************************************************** */

// Create the express app
const app = express();

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(morgan("dev"));
/*************************************************************************** */
//error handling middleware function
app.use((error, req, res, next) => {
 
  return res.status(error.status || 500).json({
    status: false,
    message: error.message,
  });
});


/************************************************************************** */
//login route
const loginRoute = require("./apps/routes/loginRoute");
app.use('/department', loginRoute);

//department Routes /master api
const router = require("./apps/routes/departmentLoginRoutes/route");
app.use('/', router)

//department creation
const departmentCreationRoute = require("./apps/routes/departmentCreationRoute/route");
app.use('/department-creation', departmentCreationRoute);

//convergence new candidate form
const convergenceRoute = require("./apps/routes/newUploadCandiateForm/candidateFormRoute");
app.use('/convergence', convergenceRoute);


/************************************************************************* */

// Error handlers
// Define a middleware function that will be executed for any incoming HTTP requests
app.use((res, req, next) => {
  return propagateError(404, "ROUTE_NOT_FOUND", "Route Not Found! inside server");
});



// Start server
app.listen(PORT, function (err) {
  if (err) {
    return console.error(err);
  }

  //console.log("Started at port" + PORT);
});
