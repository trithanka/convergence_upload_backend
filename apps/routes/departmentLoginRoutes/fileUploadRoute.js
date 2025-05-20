const express = require("express");
const Router = express.Router();
const service = require("../../services/fileUpload");
const multer = require('multer');
const upload = multer({ dest: 'Uploads/' });
const fs = require('fs');


Router.post("/upload", upload.single('file'), (req, res) => {
    let result;
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // //console.log("req.type",req.body.type);
    const type = req.body.type;

    const fklDepartmentId = req.body.fklDepartmentId;  
    
    const schemeId = req.body.fklSchemeId
    if(!fklDepartmentId){
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
        return res.status(400).send('fklDepartmentId is required.');
    }
    if(!type){
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
        return res.status(400).send('Type is required.');
    }
    // //console.log(req.file.path,type,fklDepartmentId,schemeId)
    result = service.processExcelFile(req.file.path, type,fklDepartmentId, schemeId);
    result.then(response => {
        if(response.success===false){
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
            const sendObj = {
                status: false,
                message: response.message
            }
            return res.status(200).send(sendObj);
        }
        res.send(response);
    }).catch(error => {
        //if errror delete the file
        fs.unlink(req.file.path, (err) => {
            //console success
            //console.log("File deleted successfully");
            if (err) console.error('Error deleting file:', err);
        });
        console.error("error------------",error);
        res.status(400).send(error);
    });  
});

module.exports = Router;