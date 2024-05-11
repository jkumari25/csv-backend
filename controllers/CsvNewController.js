const CatchAsyncError = require("../middleware/CatchAsyncError");
const CsvUpload = require("../models/CsvNewModel");
const csv = require("csvtojson");

exports.importNewCsvFile = CatchAsyncError(async (req, res, next) => {
  try {
    var fileData = [];

    csv()
      .fromFile(req.file.path)
      .then(async (data) => {
        // Changed variable name from 'res' to 'data'
        // insert many csv file :-
        for (var i = 0; i < data.length; i++) {
          fileData.push({
            source: data[i]["Source"],
            firstName: data[i]["First Name"], // Access properties using bracket notation
            lastName: data[i]["Last Name"],
            emailId: data[i]["Email Id"],
            designation: data[i]["Designation"],
            companyName: data[i]["Company Name"],
            industryType: data[i]["Industry Type"],
            phoneNo: data[i]["Phone No"],
            country: data[i]["Country"],
            city: data[i]["City"],
            linkedInProfile: data[i]["LinkedIn Profile"],
            toolsUsed: data[i]["Tools Used"],
          });
        }
        await CsvUpload.insertMany(fileData);
      });
    res.send({ status: 200, success: true, msg: "Csv Imported" });
  } catch (error) {
    res.send({
      status: 400,
      success: false,
      msg: error.message,
    });
  }
});
// exports.importNewCsvFile = CatchAsyncError(async (req, res, next) => {
//   try {
//     var fileData = [];

//     csv()
//       .fromFile(req.file.path)
//       .then(async (data) => {
//         // Changed variable name from 'res' to 'data'
//         // insert many csv file :-
//         for (var i = 0; i < data.length; i++) {
//           // Check if any of the required fields are empty
//           if (
//             data[i]["Source"] &&
//             data[i]["First Name"] &&
//             data[i]["Last Name"] &&
//             data[i]["Email Id"] &&
//             data[i]["Designation"] &&
//             data[i]["Company Name"] &&
//             data[i]["Industry Type"] &&
//             data[i]["Phone No"] &&
//             data[i]["Country"] &&
//             data[i]["City"] &&
//             data[i]["LinkedIn Profile"] &&
//             data[i]["Tools Used"]
//           ) {
//             fileData.push({
//               source: data[i]["Source"],
//               firstName: data[i]["First Name"], // Access properties using bracket notation
//               lastName: data[i]["Last Name"],
//               emailId: data[i]["Email Id"],
//               designation: data[i]["Designation"],
//               companyName: data[i]["Company Name"],
//               industryType: data[i]["Industry Type"],
//               phoneNo: data[i]["Phone No"],
//               country: data[i]["Country"],
//               city: data[i]["City"],
//               linkedInProfile: data[i]["LinkedIn Profile"],
//               toolsUsed: data[i]["Tools Used"],
//             });
//           }
//         }
//         await CsvUpload.insertMany(fileData);
//       });
//     res.send({ status: 200, success: true, msg: "Csv Imported" });
//   } catch (error) {
//     res.send({
//       status: 400,
//       success: false,
//       msg: error.message,
//     });
//   }
// });

// Get CSV Details:-
exports.getNewCsv = CatchAsyncError(async (req, res, next) => {
  const csv = await CsvUpload.find();

  res.status(200).json({
    success: true,
    csv,
  });
});

// Get CSV Details with Filters:-
exports.getFilteredCsv = CatchAsyncError(async (req, res, next) => {
  // Extract filter parameters from request query
  const {
    firstName,
    lastName,
    companyName,
    source,
    emailId,
    designation,
    industryType,
    phoneNo,
    country,
    city,
    linkedInProfile,
    toolsUsed,
  } = req.query;

  // Construct MongoDB query based on filter parameters
  const filter = {};
  const andConditions = []; // Changed to andConditions

  if (firstName) andConditions.push({ firstName: new RegExp(firstName, "i") });
  if (lastName) andConditions.push({ lastName: new RegExp(lastName, "i") });
  if (source) andConditions.push({ source: new RegExp(source, "i") });
  if (emailId) andConditions.push({ emailId: new RegExp(emailId, "i") });
  if (designation)
    andConditions.push({ designation: new RegExp(designation, "i") });
  if (industryType)
    andConditions.push({ industryType: new RegExp(industryType, "i") });
  if (phoneNo) andConditions.push({ phoneNo: new RegExp(phoneNo, "i") });
  if (country) andConditions.push({ country: new RegExp(country, "i") });
  if (city) andConditions.push({ city: new RegExp(city, "i") });
  if (linkedInProfile)
    andConditions.push({ linkedInProfile: new RegExp(linkedInProfile, "i") });
  if (toolsUsed) andConditions.push({ toolsUsed: new RegExp(toolsUsed, "i") });

  // Add separate condition for company name
  if (companyName) {
    andConditions.push({ companyName: new RegExp(companyName, "i") });
  }

  // If there are conditions, set the $and operator
  if (andConditions.length > 0) {
    filter["$and"] = andConditions;
  }

  // Fetch CSV data with applied filters
  const csv = await CsvUpload.find(filter);

  // Aggregate to count occurrences of each country
  const countryCounts = await CsvUpload.aggregate([
    { $match: filter }, // Apply the same filter
    { $group: { _id: "$country", count: { $sum: 1 } } }, // Group by country and count
  ]);

  // Aggregate to count occurrences of industryType and designation
  const industryTypeCounts = await CsvUpload.aggregate([
    { $match: filter }, // Apply the same filter
    { $group: { _id: "$industryType", count: { $sum: 1 } } }, // Group by industryType and count
  ]);

  const designationCounts = await CsvUpload.aggregate([
    { $match: filter }, // Apply the same filter
    { $group: { _id: "$designation", count: { $sum: 1 } } }, // Group by designation and count
  ]);

  res.status(200).json({
    success: true,
    csv,
    counts: {
      countryCounts,
      industryTypeCounts,
      designationCounts,
    },
  });
});

// Get CSV Details with Filters:-
// exports.getFilteredCsv = CatchAsyncError(async (req, res, next) => {
//   // Extract filter parameters from request query
//   const {
//     firstName,
//     lastName,
//     companyName,
//     source,
//     emailId,
//     designation,
//     industryType,
//     phoneNo,
//     country,
//     city,
//     linkedInProfile,
//     toolsUsed,
//   } = req.query;

//   // Construct MongoDB query based on filter parameters
//   const filter = {};
//   const andConditions = []; // Changed to andConditions

//   if (firstName) andConditions.push({ firstName });
//   if (lastName) andConditions.push({ lastName });
//   if (source) andConditions.push({ source });
//   if (emailId) andConditions.push({ emailId });
//   if (designation) andConditions.push({ designation });
//   if (phoneNo) andConditions.push({ phoneNo });
//   if (country) andConditions.push({ country });
//   if (city) andConditions.push({ city });
//   if (linkedInProfile) andConditions.push({ linkedInProfile });
//   if (toolsUsed) andConditions.push({ toolsUsed });
//   if (industryType) andConditions.push({ industryType });

//   // Add separate condition for company name
//   if (companyName) {
//     andConditions.push({ companyName });
//   }

//   // If there are conditions, set the $and operator
//   if (andConditions.length > 0) {
//     filter["$and"] = andConditions;
//   }

//   // Fetch CSV data with applied filters
//   const csv = await CsvUpload.find(filter);

//   // Check if any data is found
//   if (csv.length === 0) {
//     return res.status(404).json({
//       success: false,
//       message: "No data found with the provided filter criteria.",
//     });
//   }

//   // Aggregate to count occurrences of each country
//   const countryCounts = await CsvUpload.aggregate([
//     { $match: filter }, // Apply the same filter
//     { $group: { _id: "$country", count: { $sum: 1 } } }, // Group by country and count
//   ]);

//   // Aggregate to count occurrences of industryType and designation
//   const industryTypeCounts = await CsvUpload.aggregate([
//     { $match: filter }, // Apply the same filter
//     { $group: { _id: "$industryType", count: { $sum: 1 } } }, // Group by industryType and count
//   ]);

//   const designationCounts = await CsvUpload.aggregate([
//     { $match: filter }, // Apply the same filter
//     { $group: { _id: "$designation", count: { $sum: 1 } } }, // Group by designation and count
//   ]);

//   res.status(200).json({
//     success: true,
//     csv,
//     counts: {
//       countryCounts,
//       industryTypeCounts,
//       designationCounts,
//     },
//   });
// });

// exports.getFilteredCsv = CatchAsyncError(async (req, res, next) => {
//   // Extract filter parameters from request query
//   const {
//     firstName,
//     lastName,
//     companyName,
//     source,
//     emailId,
//     designation,
//     industryType,
//     phoneNo,
//     country,
//     city,
//     linkedInProfile,
//     toolsUsed,
//   } = req.query;

//   // Construct MongoDB query based on filter parameters
//   const filter = {};
//   const andConditions = [];

//   // Push all conditions into andConditions array
//   if (firstName) andConditions.push({ firstName });
//   if (lastName) andConditions.push({ lastName });
//   if (companyName) andConditions.push({ companyName });
//   if (source) andConditions.push({ source });
//   if (emailId) andConditions.push({ emailId });
//   if (designation) andConditions.push({ designation });
//   if (industryType) andConditions.push({ industryType });
//   if (phoneNo) andConditions.push({ phoneNo });
//   if (country) andConditions.push({ country });
//   if (city) andConditions.push({ city });
//   if (linkedInProfile) andConditions.push({ linkedInProfile });
//   if (toolsUsed) andConditions.push({ toolsUsed });

//   // If there are conditions, set the $and operator
//   if (andConditions.length > 0) {
//     filter["$and"] = andConditions;
//   }

//   // Fetch CSV data with applied filters
//   const csv = await CsvUpload.find(filter);

//   // Check if any data is found
//   if (csv.length === 0) {
//     return res.status(404).json({
//       success: false,
//       message: "No data found with the provided filter criteria.",
//     });
//   }

//   // Aggregate to count occurrences of each country
//   const countryCounts = await CsvUpload.aggregate([
//     { $match: filter }, // Apply the same filter
//     { $group: { _id: "$country", count: { $sum: 1 } } }, // Group by country and count
//   ]);

//   // Aggregate to count occurrences of industryType and designation
//   const industryTypeCounts = await CsvUpload.aggregate([
//     { $match: filter }, // Apply the same filter
//     { $group: { _id: "$industryType", count: { $sum: 1 } } }, // Group by industryType and count
//   ]);

//   const designationCounts = await CsvUpload.aggregate([
//     { $match: filter }, // Apply the same filter
//     { $group: { _id: "$designation", count: { $sum: 1 } } }, // Group by designation and count
//   ]);

//   res.status(200).json({
//     success: true,
//     csv,
//     counts: {
//       countryCounts,
//       industryTypeCounts,
//       designationCounts,
//     },
//   });
// });
