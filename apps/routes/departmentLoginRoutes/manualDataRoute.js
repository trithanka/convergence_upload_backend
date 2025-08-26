const express = require("express");
const Router = express.Router();
const service = require("../../services/manualUpload");

const allowedDomain = "https://convergence-upload.skillmissionassam.org";

Router.post("/", (req, res) => {
    const queryType = req.body.queryType;
    let result;
    let iUploadMethod;
    const origin = req.headers.origin || req.headers.referer || ""; // Check Origin or Referer

    if (origin.startsWith(allowedDomain)) {
        iUploadMethod = 1;
    } else {
        iUploadMethod = 3;
    }

    switch (queryType) {
        case 'scheme':
            result = service.handleScheme(req.body, iUploadMethod); //duplicate check
            break;
        case 'target':
            result = service.handleTarget(req.body, iUploadMethod); //duplicate check
            break;
        case 'course':
            result = service.handleCourse(req.body, iUploadMethod); //duplicate check
            break;
        case 'TP':
            result = service.handleTP(req.body, iUploadMethod);
            break;
        case 'TC':
            result = service.handleTC(req.body, iUploadMethod);
            break;
        case 'batch':
            result = service.handleBatch(req.body, iUploadMethod);
            break;
        case 'candidate':
            result = service.handleCandidate(req.body, iUploadMethod); //duplicate check
            break;
        case 'assesment':
            result = service.handleAssesment(req.body, iUploadMethod);
            break;
        case 'placement':
            result = service.handlePlacement(req.body, iUploadMethod);
            break;
        case 'assessor':
            result = service.handleAssessor(req.body, iUploadMethod);
            break;
        case 'trainer':
            result = service.handleTrainer(req.body, iUploadMethod);
            break;
        case 'invoice':
            result = service.handleInvoice(req.body, iUploadMethod);
            break;
        case 'sector':
            result = service.handleSector(req.body, iUploadMethod);
            break;
        default:
            res.status(400).send({ error: "Invalid query type" });
            return;
    }
    result.then(response => {
        res.send(response);
    }).catch(error => {
        console.error(error);
        res.status(500).send(error);
    });
});

Router.post("/update", async (req, res) => {
    try {
        
        const iUploadMethod = req.headers.origin?.startsWith(allowedDomain) ? 1 : 3;
        const response = await service.updateService(req.body, iUploadMethod); 
        res.status(200).json(response); 
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Failed to update", error: error.message });
    }
});
  

module.exports = Router;
