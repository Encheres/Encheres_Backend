const moongoose = require("mongoose");
const validator = require("validator");
const schema = {
  Email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  Name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  Category: {
    Complaint: { type: Boolean, default: false },
    Feedback: { type: Boolean, default: false },
    Help: { type: Boolean, default: false },
  },
  Description: {
    type: String,
    maxLength: 250,
    required: true,
  },
};

const contactSchema = new moongoose.Schema(schema);

const contactModel = moongoose.model("contactUs", contactSchema);
module.exports = contactModel;
