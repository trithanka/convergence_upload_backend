const express = require("express");
const Router = express.Router();
const service = require("../../services/getData");

Router.post("/", (req, res) => {
    const queryType = req.body.queryType; 
    let result;
    const fklDepartmentId = req.user.user.fklDepartmentId;
    const schemeId = req.body.schemeId;
    //console.log(fklDepartmentId);
    
    switch (queryType) {
        case 'scheme':
            result = service.handleScheme(req.body,fklDepartmentId, schemeId); //scheme name and scheme code check
            break;
        case 'target':
            result = service.handleTarget(req.body,fklDepartmentId);
            break;
        case 'course':
            result = service.handleCourse(req.body,fklDepartmentId); //course name and course code check
            break;
        case 'TP':
            result = service.handleTP(req.body,fklDepartmentId); //tp name and pan check, either we can go for group concat tp on checking pan 
            break;
        case 'TC':
            result = service.handleTC(req.body,fklDepartmentId); 
            break;
        case 'batch':
            result = service.handleBatch(req.body,fklDepartmentId);
            break;
        case 'candidate':
            result = service.handleCandidate(req.body,fklDepartmentId); //candidate name, dob, phone, uuid,,, phone no may conflict 
            break;
        case 'assesment':
            result = service.handleAssesment(req.body,fklDepartmentId);
            break;
        case 'placement':
            result = service.handlePlacement(req.body,fklDepartmentId); //candidate id can have conflict
            break;
        case 'assessor':
            result = service.handleAssessor(req.body,fklDepartmentId); //  assessor pan card
            break;
        case 'trainer':
            result = service.handleTrainer(req.body,fklDepartmentId); // trainer pan card
            break;
        case 'invoice':
            result = service.handleInvoice(req.body,fklDepartmentId);
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


Router.post("/get", (req, res) => {
    let result;
    result = service.handleMaster(req.body);
    result.then(response => {
        res.send(response);
    }).catch(error => {
        console.error(error);
        res.status(500).send(error);
    });
});

//*** get scheme by scheme id for target*/
Router.post("/getSchemeById", (req, res) => {
    let result;
     const fklDepartmentId = req.user.user.fklDepartmentId;
     const schemeId = req.body.schemeId;
    result = service.getSchemeById(req.body, fklDepartmentId, schemeId);
    result.then(response => {
        res.send(response);
    }).catch(error => {
        console.error(error);
        res.status(500).send(error);
    });
});

//**view target by scheme id    */
Router.post("/viewTargetBySchemeId", (req, res) => {
    let result;
    const fklDepartmentId = req.user.user.fklDepartmentId;
    const schemeId = req.body.schemeId;
    result = service.viewTargetBySchemeId(req.body, fklDepartmentId, schemeId);
    result.then(response => {
        res.send(response);
    }).catch(error => {
        console.error(error);
        res.status(500).send(error);
    });
});

//**********get TP by ID***************** */
Router.post("/getTp/id", (req, res) => {
    let result;
    const fklDepartmentId = req.user.user.fklDepartmentId;
    const tpId = req.body.tpId;
    result = service.getTpById(req.body, fklDepartmentId, tpId);
    result.then(response => {
        res.send(response);
    }).catch(error => {
        console.error(error);
        res.status(500).send(error);
    });
});

//**view tc by tp id    */
Router.post("/viewTcByTpId", (req, res) => {
    let result;
    const fklDepartmentId = req.user.user.fklDepartmentId;
    const tp = req.body.tp;
    result = service.viewTCbyTP(req.body, fklDepartmentId, tp);
    result.then(response => {
        res.send(response);
    }).catch(error => {
        console.error(error);
        res.status(500).send(error);
    });
});

//********************************************************************************************************* */
Router.post("/details/get", (req, res) => {
    let result;
    const queryType = req.body.queryType;
    const fklDepartmentId = req.user.user.fklDepartmentId;
    const schemeId = req.body.schemeId;
    const tpId = req.body.tpId

    switch(queryType) {
         case 'getScheme' :
            result = service.getSchemeById(req.body, fklDepartmentId, schemeId);
            break;
         case 'viewTarget' :
            result = service.viewTargetBySchemeId(req.body, fklDepartmentId, schemeId);
            break;
        case 'getTP' : 
            result = service.getTpById(req.body, fklDepartmentId, tpId);
            break;
        case 'viewTC' :
            result = service.viewTCbyTP(req.body, fklDepartmentId, tpId);
            break;
        
        default:
            res.status(400).send({error: "Invalid query type"});
            return;
    }
    result.then(response => {
        res.send(response);
    }).catch(error=> {
        console.error(error);
        res.status(500).send(error);
    })
})

module.exports = Router;
