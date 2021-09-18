const moongoose = require("mongoose");

const schema = {
  Email: {
    type: String,
    trim: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
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
