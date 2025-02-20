import express from "express";
import { userRouter } from "./src/modules/user/user.routes.js";
import { companyRouter } from "./src/modules/company/company.routes.js";
import { jobRouter } from "./src/modules/job/job.routes.js";
import { applicationRouter } from "./src/modules/application/application.routes.js";
import cors from "cors";

export const routes = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(userRouter);
  app.use(companyRouter);
  app.use(jobRouter);
  app.use(applicationRouter);
};
