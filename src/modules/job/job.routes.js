import express from "express";
import { checkRole } from "../../middleware/checkRole.js";
import {
  addJob,
  deleteJob,
  getJobs,
  getJobsForCompany,
  getJobsWithFilter,
  updateJob,
} from "./job.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { validate } from "../../middleware/valiadate.js";
import { addJobVal, updateJobVal } from "./job.validation.js";

export const jobRouter = express.Router();
jobRouter.use(verifyToken);
jobRouter.route("/job").post(validate(addJobVal),checkRole, addJob).get(getJobs);
jobRouter.route("/job/:id").put(validate(updateJobVal),checkRole, updateJob).delete(checkRole, deleteJob);
jobRouter.get("/jobForCompany", getJobsForCompany);
jobRouter.get("/getJobsWithFilter", getJobsWithFilter);
