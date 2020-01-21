const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            maxlength: [100, 'Name cannot be more than 100 characters']
        },
        cover: {
            data: Buffer,
            contentType: String
        },
    }, 
    { timestamps: true }
);


module.exports = mongoose.model('Category', categorySchema); 