import express from "express";
import {
  confirmEmail,
  deleteUser,
  getAllUsers,
  getAnotherUser,
  getByRecoveryEmail,
  getUser,
  signIn,
  signUp,
  updateUser,
} from "./user.controller.js";
import { checkEmail } from "../../middleware/checkEmail.js";
import { isLogged } from "../../middleware/isLogged.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { validate } from "../../middleware/valiadate.js";
import { signInVal, signUpVal, updateUserVal } from "./user.validation.js";
export const userRouter = express.Router();

userRouter
  .route("/user")
  .post(validate(signUpVal), checkEmail, signUp)
  .get(verifyToken, getUser);
userRouter
  .route("/user/:id")
  .put(validate(updateUserVal), isLogged, checkEmail, verifyToken, updateUser)
  .delete(isLogged, verifyToken, deleteUser);
userRouter.post("/user/signIn", validate(signInVal), signIn);
userRouter.get("/user/anotherUser/:id", getAnotherUser);
userRouter.get("/user/getByRecoveryEmail", getByRecoveryEmail);
userRouter.get("/user/getAllUsers", getAllUsers);
userRouter.patch("/confirmEmail", confirmEmail);
