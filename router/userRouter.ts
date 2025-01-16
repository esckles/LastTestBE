import { Router } from "express";
import {
  changePassword,
  forgetPassword,
  ReadAllUser,
  ReadOneUser,
  signInUser,
  signUPUser,
  verifyUser,
} from "../controller/userController";

const router: any = Router();
//user RegisterFlow
router.route("/signup-user").post(signUPUser);
router.route("/verify-user/:userID").get(verifyUser);
router.route("/signin-user/").post(signInUser);
//user RegisterFlow

//Readusers
router.route("/readone/:userID").get(ReadOneUser);
router.route("/readall").get(ReadAllUser);
//Readusers

//changePassword
router.route("/forget-password").patch(forgetPassword);
router.route("/change-password/:userID").patch(changePassword);
//changePassword

export default router;
