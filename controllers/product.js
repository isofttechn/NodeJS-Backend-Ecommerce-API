const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");




exports.productById = (req, res, next, id)=>{
  Product.findById(id).exec((err, product) =>{
    if(err || !product){
      return res.status(400).json({
        error: "Product not found"
      });
    }
       req.product = product;
      next();
  });
};
exports.read = (req, res)=>{
   req.product.photo = undefined;
   return res.json(req.product);
}


//CREATE PRODUCT CONTROLLER
exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }


    //CHECK FOR ALL FIELDS

    const { name, description, price, category, quantity, shipping } = fields;

    if (!name || !description || !price, !category || !shipping || !quantity) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    let product = new Product(fields);

    //1kb = 1000
    //1mb = 1000000

    if (files.photo) {
     // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 1000000){
        return res.status(400).json({
          error: "Image should be 1m or less in size"
        });
      }


      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(result);
    });
  });
};
//END CREATE PRODUCT CONTROLLER



//METHOD FOR REMOVING PRODUCT

exports.remove = (req, res)=>{
  let product = req.product;
    product.remove((err, deletedProduct) =>{
      if(err){
        return res.status(400).json({
          error: errorHandler(err)
        });
      } 

      res.json({
       
        message: "Product deleted successfully"
      });
    });
}

//END METHOD FOR REMOVING PRODUCT


//UPDATE PRODUCT CONTROLLER
exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }


    //CHECK FOR ALL FIELDS

    const { name, description, price, category, quantity, shipping } = fields;

    if (!name || !description || !price, !category || !shipping || !quantity) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    let product = req.product;
    //USE EXTENT FROM LODASH PACKAGE
    product = _.extend(product, fields);

    //1kb = 1000
    //1mb = 1000000

    if (files.photo) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be 1m or less in size"
        });
      }


      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(result);
    });
  });
};
//END UPDATE PRODUCT CONTROLLER

/**
 * RETURNING PRODUCTS BASE ON SELL AND ARRIVAL 
 * By Sell = /products?sortBy=sold&order=desc&limit=4
 * 
 * By Arrival = /products?sortBy=createdAt&order=desc&limit=4
 * 
 * If no params are sent, then all products returned
 */


 exports.list = (req, res)=>{
    let  order = req.query.order ? req.query.order: 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy: '_id'
    let limit = req.query.limit ?  parseInt(req.query.limit) : 10




    Product.find()
      .select("-photo")
      .populate('category')
      .sort([[sortBy, order]])
      .limit(limit)
      .exec((err, products) =>{
        if(err){
          return res.status(400).json({
            error: 'Product not found'
          });
        }

        res.json(products);
      });
 };


 /**
  *  It will find the product base on the req product category
  * Other product that has the same category
  */

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found"
        });
      }
      res.json(products);
    });
};


exports.listCategories = (req, res) =>{
  Product.distinct("category", {}, (err, categories) =>{
  if(err){
    return res.status(400).json({
      error: "Category not found"
    })
  }res.json(categories)
  });
}



/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
 
// route - make sure its post
// router.post("/products/by/search", listBySearch);
 
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }


            res.json({
                size: data.length,
                data
            });
        });
};


exports.photo = (req, res, next) => {
    if(req.product.photo.data){
      res.set("content-Type", req.product.photo.contentType)
      return res.send(req.product.photo.data)
    }
    next();

}




