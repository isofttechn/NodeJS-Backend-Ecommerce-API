const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: [100, "name cannot be more than 100 characters"]
    },

    description: {
      type: String,
      required: true,
      maxlength: [6000, "Length cannot be more than 6000 characters"]
    },

    price: {
      type: Number,
      trim: true,
      required: [true, "Please, add description"],
      maxlength: [32, "Price cannot be more than 32 characters"]
    },

    averageRating: {
      type: Number,
      min: [1, "Rating must be atleast 1"],
      max: [10, "Rating cannot be more than 10"]
    },

    category: {
      type: ObjectId,
      ref: "Category",
      required: [true, "Please, add category"]
    },
    quantity: {
      type: Number
    },

    sold: {
      type: Number,
      default: 0
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    shipping: {
      required: false,
      type: Boolean
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
