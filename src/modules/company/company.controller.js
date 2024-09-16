import { catchError } from "../../middleware/catchError.js";
import { Company } from "../../models/company.model.js";
import { Job } from "../../models/job.model.js";

// add new company
const addCompany = catchError(async (req, res, next) => {
  // check the role in the middleware
  const company = await Company.insertMany(req.body);
  res.status(201).json({ message: `company added successfully`, company });
});

// update company
const updateCompany = catchError(async (req, res, next) => {
  // check the role in the middleware
  const company = await Company.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );
  res.status(200).json({ message: `company updated successfully`, company });
});

// delete company
const deleteCompany = catchError(async (req, res, next) => {
  // check the role in the middleware
  await Company.findByIdAndDelete({ _id: req.params.id });
  // confirm that documents related to company deleted
  await Job.findByIdAndDelete({ companyId: req.params.id });
  res.status(200).json({ message: `company deleted successfully` });
});

// Get company data
const getCompany = catchError(async (req, res, next) => {
  // check the role in the middleware
  const company = await Company.findById({ _id: req.params.id }).populate(
    "companyHR",
    "userName email role"
  );
  res.status(200).json(company);
});

// Search for a company with a companyName
const searchCompany = catchError(async (req, res, next) => {
  // check the role if company_HR or user
  if (req.companyHR.role == "company_HR" || "user") {
    const company = await Company.findOne({
      companyName: req.query.companyName,
    });
    res.status(200).json(company);
  } else {
    return next(new AppError(`you are not allowed to do this action`, 401));
  }
});

// return all jobs related to this company

export { addCompany, updateCompany, deleteCompany, getCompany, searchCompany };
