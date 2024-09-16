import express from "express";
import {
  addCompany,
  deleteCompany,
  getCompany,
  searchCompany,
  updateCompany,
} from "./company.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { checkRole } from "../../middleware/checkRole.js";
import { validate } from "../../middleware/valiadate.js";
import { addCompanyVal, updateCompanyVal } from "./company.validation.js";

export const companyRouter = express.Router();

companyRouter.use(verifyToken);

companyRouter.post("/company", validate(addCompanyVal), checkRole, addCompany);
companyRouter.get("/searchCompany", searchCompany);
companyRouter
  .route("/company/:id")
  .put(validate(updateCompanyVal), checkRole, updateCompany)
  .delete(checkRole, deleteCompany)
  .get(checkRole, getCompany);
