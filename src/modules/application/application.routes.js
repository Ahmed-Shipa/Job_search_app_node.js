import express from "express";
import {
  apply,
  getAllApplications,
  specificApplications,
} from "./application.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkRole } from "../../middleware/checkRole.js";
import { validate } from "../../middleware/valiadate.js";
import { applyVal } from "./application.validation.js";

export const applicationRouter = express.Router();

applicationRouter.use(verifyToken);
applicationRouter.post("/application", validate(applyVal), apply);
applicationRouter.get("/getAllApplications", checkRole, getAllApplications);
applicationRouter.get("/specificApplications", specificApplications);
