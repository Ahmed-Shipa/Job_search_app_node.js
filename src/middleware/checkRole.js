export const checkRole = (req, res, next) => {
  // check the role
  if (req.companyHR.role != "company_HR")
    return res.json({ message: `you are not allowed to do this action` });
  next();
};
