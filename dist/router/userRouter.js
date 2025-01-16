"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const router = (0, express_1.Router)();
//user RegisterFlow
router.route("/signup-user").post(userController_1.signUPUser);
router.route("/verify-user/:userID").get(userController_1.verifyUser);
router.route("/signin-user/").post(userController_1.signInUser);
//user RegisterFlow
//Readusers
router.route("/readone/:userID").get(userController_1.ReadOneUser);
router.route("/readall").get(userController_1.ReadAllUser);
//Readusers
//changePassword
router.route("/forget-password").patch(userController_1.forgetPassword);
router.route("/change-password/:userID").patch(userController_1.changePassword);
//changePassword
exports.default = router;
