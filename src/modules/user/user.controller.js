import { User } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { email } from "../../utilities/email.js";
import { customAlphabet, nanoid } from "nanoid";
import { Company } from "../../models/company.model.js";
import { Job } from "../../models/job.model.js";
import { Application } from "../../models/application.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";
// signUp new user
const signUp = catchError(async (req, res, next) => {
  // hash password
  req.body.password = bcrypt.hashSync(req.body.password, 8);

  // generating OTP
  const code = customAlphabet("123456789", 4);
  req.body.OTP = code();
  // sending OTP
  email(req.body.OTP);
  await User.insertMany(req.body);
  // setting the time of produced OTP
  const dateNow = new Date();
  const updatedUser = await User.findOneAndUpdate(
    { email: req.body.email },
    { producedAT: dateNow },
    { new: true }
  );
  //   hiding password from response
  updatedUser.password = undefined;
  res.status(201).json({ message: `user added successfully`, updatedUser });
});

// signIn user
const signIn = catchError(async (req, res, next) => {
  // signIn with email or mobileNumber or recoveryEmail
  const user = await User.findOne({
    $or: [
      { email: req.body.email },
      { mobileNumber: req.body.mobileNumber },
      { recoveryEmail: req.body.recoveryEmail },
    ],
  });
  // check if user confirmed email
  if (user.isVerified == false)
    return res.json({ message: `please confirm your email` });
  //   generating the token for user
  jwt.sign(
    { userName: user.userName, userId: user._id, role: user.role },
    process.env.secretKey,
    async (err, token) => {
      if (!user || !bcrypt.compareSync(req.body.password, user.password))
        return next(new AppError(`invalid email or password`, 401));
      // updating the status of user to "online"
      await User.updateOne({ email: req.body.email }, { status: "online" });
      res.status(200).json({ message: `login`, token });
    }
  );
});

// confirmEmail
const confirmEmail = catchError(async (req, res, next) => {
  let dateNow = new Date();
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError(`invalid email`, 401));

  // setting time for expire of OTP
  function dateDifference(date1, date2) {
    const newDate1 = new Date(String(date1)).getMinutes();
    const newDate2 = new Date(date2).getMinutes();

    return newDate1 - newDate2;
  }
  let difference = dateDifference(dateNow, user.producedAT);
  //   setting time of OTP 3 minutes before expire
  if (req.body.OTP != user.OTP || req.body.OTP == null || difference > 3) {
    // removing OTP if expired time
    await User.updateOne(
      { email: req.body.email },
      { OTP: null, expiredAt: dateNow }
    );
    return next(new AppError(`invalid OTP`, 401));
  }
  // verification of user and setting the expire date of OTP
  await User.updateOne(
    { email: req.body.email },
    { isVerified: true, OTP: null, expiredAt: dateNow }
  );
  res.json({ message: "email confirmed" });
});

// update user and update password
const updateUser = catchError(async (req, res, next) => {
  // check the if the user is logged in middleware
  // check if the email and mobileNumber is unique in middleware
  const user = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });
  res.status(200).json({ message: `user updated successfully`, user });
});

// delete user
const deleteUser = catchError(async (req, res, next) => {
  // check the if the user is logged in middleware
  const user = await User.findByIdAndDelete({ _id: req.params.id });
  // confirm that when i delete a user to delete what is related to him
  await Company.findOneAndDelete({ companyHR: req.params.id });
  await Job.findByIdAndDelete({ addedBy: req.params.id });
  await Application.findByIdAndDelete({ userId: req.params.id });

  res.status(200).json({ message: `user deleted successfully` });
});

// get user data
const getUser = catchError(async (req, res, next) => {
  const user = await User.find({ _id: req._id.userId });
  //   confirm that user has logged
  if (user[0].status == "offline") return res.json({ message: `please login` });
  res.json({ user });
});

// Get profile data for another user
const getAnotherUser = catchError(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  res.json({ user });
});

// Get all accounts associated to a specific recovery Email
const getByRecoveryEmail = catchError(async (req, res, next) => {
  const user = await User.find({ recoveryEmail: req.query.recoveryEmail });
  res.json({ user });
});

// Get all accounts associated to a specific recovery Email
const getAllUsers = catchError(async (req, res, next) => {
  const users = await User.find();
  res.json({ users });
});

export {
  signUp,
  signIn,
  updateUser,
  deleteUser,
  getUser,
  getAnotherUser,
  confirmEmail,
  getByRecoveryEmail,
  getAllUsers,
};
