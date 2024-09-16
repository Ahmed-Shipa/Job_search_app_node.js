import { catchError } from "../../middleware/catchError.js";
import { Application } from "../../models/application.model.js";
import { Company } from "../../models/company.model.js";

const apply = catchError(async (req, res, next) => {
  // check the role if  user
  if (req.companyHR.role == "user") {
    const application = await Application.insertMany(req.body);
    res
      .status(201)
      .json({ message: `application added successfully`, application });
  } else {
    return next(new AppError(`you are not allowed to do this action`, 401));
  }
});

// Get all applications for specific Job
const getAllApplications = catchError(async (req, res, next) => {
  const application = await Application.find({
    userId: req.userId.userId,
    // get the user data without the id
  }).populate("userId", "-_id");
  res.json(application);
});

// collects the applications for a specific company on a specific day
const specificApplications = catchError(async (req, res, next) => {
  const application = await Application.find({
    $or: [{ userId: req.query.id }],
  });
  res.json(application);
});

export { apply, getAllApplications, specificApplications };
