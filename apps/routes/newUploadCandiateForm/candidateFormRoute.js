const express = require("express");
const Router = express.Router();
const co = require("co");
const jwtValidator = require("../../../utils/jwtValidator");
const service = require("../../services/newUploadCandidateFormService/candidateFormService");
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");


Router.post("/candidateForm",jwtValidator, (req, res) => {
    var result = {};

    co(function* () {
      try {
        postParam = req.body;
        result = yield service.handleConvergence(postParam,1,req?.user?.user?.fklDepartmentId);
        res.send(result);
      } catch (error) { 
        console.log(error);
        res.status(error.statusCode || 500).send(error);
      }
    });
});

//Get All Summary Reports
Router.post("/get-summary-reports",jwtValidator, (req, res) => {
  var result = {};

  co(function* () {
    try {
      postParam = req.body;
      result = yield service.getSummaryReports(postParam,req?.user?.user?.fklDepartmentId);
      res.send(result);
    } catch (error) { 
      console.log(error);
      res.status(error.statusCode || 500).send(error);
    }
  });
});


// file upload to cdn on 17 from 173 
// https://staging.skillmissionassam.org/nw/cdnserver/app1/v1/CDN/uploadMultipartTest/asdm/domainskilling/test
// https://convergence-upload.skillmissionassam.org/nw/convergence/upload

const upload = multer({ dest: "temp/" }); 

Router.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ status: false, message: "No file uploaded" });
  }

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(file.path), {
      filename: file.originalname,
      contentType: file.mimetype
    });

    console.log("Forwarding to CDN...");

    const cdnResponse = await axios.post(
      "https://staging.skillmissionassam.org/nw/cdnserver/app1/v1/CDN/uploadMultipartTest/asdm/domainskilling/test",
      form,
      {
        maxBodyLength: 104857600, // Match server's 100MB limit
        maxContentLength: 104857600,
        timeout: 240000, // Match server's timeout
        headers: form.getHeaders() // Still needed for correct multipart/form-data handling
      }
    );

    fs.unlinkSync(file.path);
    console.log("File uploaded to CDN:", cdnResponse.data);

    return res.json({
      status: true,
      message: "File uploaded to CDN successfully",
      cdnResponse: cdnResponse.data,
    });
  } catch (error) {
    fs.unlinkSync(file.path);
    console.error("Upload failed:", error.response ? error.response.data : error.message);
    return res.status(500).json({
      status: false,
      message: "CDN upload failed",
      error: error.response ? error.response.data : error.message || "Unknown error",
    });
  }
});


module.exports = Router