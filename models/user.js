const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please, add a name "],
      maxlength: [32, "Name cannot be more 32 characters"]
    },

    phone: {
      type: String,
      maxlength: [20, "   Phone Number cannot be longer than 20 characters"]
    },

    email: {
      type: String,
      trim: true,
      required: [true, "Please, add a email address "],
      maxlength: [50, "Email cannot be more than 50 characters"],
      unique: true
      
    },

    address: {
      type: String,
      required: [false, "Please, add address"]
    },
    location: {
      //TYPE IS GEOJSON POINT
      type: {
        type: String,
        enum: ["Point"],
        required: false
      },
      coordinates: {
        type: [Number],
        required: false,
        index: "2dsphere"
      },

      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },

    photo: {
      type: String,
      default: "no-photo.jpeg"
    },
    hashed_password: {
      type: String,
      required: true
    },
    about: {
      type: String,
      trim: true
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    history: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
//CREATE AUTHENTICATE METHOD IN USER MODEL FOR SI
authenticate: function(plainText){
  return this.encryptPassword(plainText) === this.hashed_password;
},



  encryptPassword: function(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};
module.exports = mongoose.model("User", userSchema);
