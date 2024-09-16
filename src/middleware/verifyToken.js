import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let [key, token] = req.headers.token.split(" ");

  jwt.verify(token, process.env.secretKey, (err, decoded) => {
    if (err) return res.json({ message: `invalid token` });
    req._id = decoded;
    req.companyHR = decoded;
    req.userId = decoded;
    next();
  });
};
