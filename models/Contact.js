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
  Category: {},
  Description: {},
};

const contactSchema = new moongoose.Schema(schema);

const contactModel = moongoose.model("contactUs", contactSchema);
module.exports = contactModel;
