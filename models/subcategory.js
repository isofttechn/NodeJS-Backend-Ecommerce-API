const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const subcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: [32, 'Description cannot be more than 32 characters']
        },

        category: {
            type: ObjectId,
            ref: "Category",
        },

        cover: {
            data: Buffer,
            contentType: String
        },
    }, 
    { timestamps: true }
);


module.exports = mongoose.model('Subcategory', subcategorySchema);