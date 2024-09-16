import { catchError } from "../../middleware/catchError.js";
import { Application } from "../../models/application.model.js";
import { Company } from "../../models/company.model.js";
import { Job } from "../../models/job.model.js";

// add new job
const addJob = catchError(async (req, res, next) => {
  // check the role in the middleware
  const job = await Job.insertMany(req.body);
  res.status(201).json({ message: `job added successfully`, job });
});

// update company
const updateJob = catchError(async (req, res, next) => {
  // check the role in the middleware
  const job = await Job.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });
  res.status(200).json({ message: `job updated successfully`, job });
});

// delete job
const deleteJob = catchError(async (req, res, next) => {
  // check the role in the middleware
  await Job.findByIdAndDelete({ _id: req.params.id });
  // confirm that documents related to jobs are deleted
  await Application.findByIdAndDelete({ jobId: req.params.id });
  res.status(200).json({ message: `job deleted successfully` });
});

// Get all Jobs with their company’s information
const getJobs = catchError(async (req, res, next) => {
  // check the role if company_HR or user
  if (req.companyHR.role == "company_HR" || "user") {
    const job = await Job.find().populate("addedBy", "userName email role");
    res.status(200).json(job);
  } else {
    return next(new AppError(`you are not allowed to do this action`, 401));
  }
});

// Get all Jobs for a specific company.
const getJobsForCompany = catchError(async (req, res, next) => {
  // check the role if company_HR or user
  if (req.companyHR.role == "company_HR" || "user") {
    // get the all jobs by company name
    const company = await Company.find({ companyName: req.query.companyName });
    const job = await Job.find({ companyId: company[0]._id }).populate(
      "companyId",
      "companyName"
    );
    res.json(job);
  } else {
    return next(new AppError(`you are not allowed to do this action`, 401));
  }
});

// Get all Jobs that match the filters : workingTime , jobLocation , seniorityLevel and jobTitle,technicalSkills
const getJobsWithFilter = catchError(async (req, res, next) => {
  // check the role if company_HR or user
  if (req.companyHR.role == "company_HR" || "user") {
    // get the all jobs by company name
    const job = await Job.find({
      $and: [
        { workingTime: req.query.workingTime },
        { jobLocation: req.query.jobLocation },
        { seniorityLevel: req.query.seniorityLevel },
        { jobTitle: req.query.jobTitle },
      ],
    });
    res.json(job);
  } else {
    return next(new AppError(`you are not allowed to do this action`, 401));
  }
});

export {
  addJob,
  updateJob,
  deleteJob,
  getJobs,
  getJobsForCompany,
  getJobsWithFilter,
};
