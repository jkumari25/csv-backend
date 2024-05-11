const mongoose = require("mongoose");

const csvNewSchema = new mongoose.Schema(
  {
    source: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    designation: {
      type: String,
    },
    companyName: {
      type: String,
    },
    industryType: {
      type: String,
    },
    emailId: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    linkedInProfile: {
      type: String,
    },
    toolsUsed: {
      type: String,
    },
    Date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = mongoose.model("CsvUpload", csvNewSchema);
