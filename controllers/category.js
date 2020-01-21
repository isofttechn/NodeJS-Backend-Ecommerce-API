const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Category = require('../models/category');
const { errorHandler } = require("../helpers/dbErrorHandler");


exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category)=>{
        if(err || !category){
            return res.status(400).json({
                error: "Category does not exist"
            });
        }

        req.category = category;
        next();
    });
};

//READ THE CATEGORY
exports.read = (req, res) => {
    return res.json(req.category);
};
// END READ CATEGORY




exports.create = (req, res)=>{
let form = new formidable.IncomingForm();
form.keepExtensions = true;
    form.parse(req, (err, fields, files) =>{
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

        let category = new Category(fields);
      
       // console.log("COVE PHOTO: ", files.cover);
         if(files.cover){
             category.cover.data = fs.readFileSync(files.cover.path);
             category.cover.contentType = files.cover.type;
         }
         
        category.save((err, output) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(output);
        });
       
    });

}



//UPDATE CATEGORIES
exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

        let category = req.category;
        //USE LODASH EXTEND HERE
        category = _.extend(category, fields);
         
       // console.log("COVE PHOTO: ", files.cover);
        if (files.cover) {
            category.cover.data = fs.readFileSync(files.cover.path);
            category.cover.contentType = files.cover.type;
        }

        category.save((err, output) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(output);
        });

    });

}
//END UPDATE CATEGORY METHOD


//REMOVE CATEGORY METHOD
exports.remove = (req, res)=>{
    let category = req.category;
    category.remove((err, deleteCategory)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err) 
            });
        }
        res.json({
            message: "Category deleted successfully"
        })
    });
};


//Fetching all categories
exports.list = (req, res) => {
    Category.find().exec((err, data)=>{
        if(err){
            res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}