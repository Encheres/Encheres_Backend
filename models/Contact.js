const moongoose = require("mongoose");
const validator = require("validator");
const schema = {
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    // can be one from {'Complaint', 'Feedback', 'Help'} // can be wtitten on frontend
    type: String, 
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
};

const contactSchema = new moongoose.Schema(schema);

const contactModel = moongoose.model("contactUs", contactSchema);
module.exports = contactModel;
