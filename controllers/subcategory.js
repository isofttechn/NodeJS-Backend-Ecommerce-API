const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Subcategory = require('../models/subcategory');
const { errorHandler } = require("../helpers/dbErrorHandler");



//READING SINGLE CATEGORY BY THEIR IDs
exports.subcategoryById = (req, res, next, id)=>{
    Subcategory.findById(id).exec((err, subcategory) =>{
        if(err || !subcategory){
            return res.status(400).json({
                error: "Sub category does not exist"
            });
        }

        req.subcategory = subcategory;
        next();

    });
};
//READ SUB SUBCATEGORY
exports.read = (req, res) => {
    return res.json(req.subcategory);
};


exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            }); 
        }

        let subcategory = new Subcategory(fields);
       // console.log("COVE PHOTO: ", files.cover);
        if (files.cover) {
            subcategory.cover.data = fs.readFileSync(files.cover.path);
            subcategory.cover.contentType = files.cover.type;
        }

        subcategory.save((err, output) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(output);
        });

    });

};


//UPDATE SUB CATEGORY

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

        let subcategory = req.subcategory;
       subcategory = _.extend(subcategory, fields);
       // console.log("COVE PHOTO: ", files.cover);
        if (files.cover) {
            subcategory.cover.data = fs.readFileSync(files.cover.path);
            subcategory.cover.contentType = files.cover.type;
        }

        subcategory.save((err, output) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(output);
        });

    });

};

//REMOVE SUB CATEGORY
exports.remove = (req, res) =>{
    let subcategory = req.subcategory;
    subcategory.remove((err, deleteSubcategory) =>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Sub category has been deleted successfully."
        });
    });
}

//Fetching all subcategories
exports.list = (req, res) => {
    Subcategory.find().exec((err, data) => {
        if (err) {
            res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}