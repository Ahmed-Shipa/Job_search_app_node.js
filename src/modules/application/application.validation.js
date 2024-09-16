import Joi from "joi";

const applyVal = Joi.object({
  jobId: Joi.string().hex().length(24).required(),
  userId: Joi.string().hex().length(24).required(),
  userTechSkills: Joi.array().required(),
  userSoftSkills: Joi.array().required(),
  userResume: Joi.string(),
});

export { applyVal };
