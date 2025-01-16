"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.forgetPassword = exports.ReadAllUser = exports.ReadOneUser = exports.signInUser = exports.verifyUser = exports.signUPUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const signUPUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt();
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const token = crypto_1.default.randomBytes(4).toString("hex");
        const user = yield userModel_1.default.create({
            userName,
            email,
            password: hashed,
            isVerifiedToken: token,
        });
        (0, email_1.createaccountEmail)(user);
        return res.status(201).json({
            message: "Account created successfully",
            data: user,
            status: 201,
        });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Errror creating account", status: 404 });
    }
});
exports.signUPUser = signUPUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findByIdAndUpdate(userID, {
            isVerified: true,
            isVerifiedToken: "",
        }, { new: true });
        return res.status(201).json({
            message: "Account verified successfully",
            data: user,
            status: 201,
        });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error verifying account", status: 404 });
    }
});
exports.verifyUser = verifyUser;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            const decryptedPassword = yield bcrypt_1.default.compare(password, user.password);
            if (decryptedPassword) {
                if ((user === null || user === void 0 ? void 0 : user.isVerified) && (user === null || user === void 0 ? void 0 : user.isVerifiedToken) === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
                    return res
                        .status(201)
                        .json({ message: "Welcome back", data: token, status: 201 });
                }
                else {
                    return res
                        .status(404)
                        .json({ message: "Error verifying account", status: 404 });
                }
            }
            else {
                return res
                    .status(404)
                    .json({ message: "Incorrect password", status: 404 });
            }
        }
        else {
            return res
                .status(404)
                .json({ message: "Error with user Email", status: 404 });
        }
    }
    catch (error) {
        return res.status(404).json({ message: "Error with Login", status: 404 });
    }
});
exports.signInUser = signInUser;
const ReadOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        return res
            .status(200)
            .json({ message: "One user read successfully", data: user, status: 200 });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error with one user account read", status: 404 });
    }
});
exports.ReadOneUser = ReadOneUser;
const ReadAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.find();
        return res.status(200).json({
            message: "All user found successfully",
            status: 200,
            data: user,
        });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error find all user account", status: 404 });
    }
});
exports.ReadAllUser = ReadAllUser;
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const token = crypto_1.default.randomBytes(6).toString("hex");
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            yield userModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
                isVerifiedToken: token,
            }, { new: true });
            return res
                .status(201)
                .json({ message: "Email has been sent to you", status: 201 });
        }
        else {
            return res.status(404).json({ message: "Error with email", status: 404 });
        }
    }
    catch (error) {
        return res.status(404).json({ message: "Error", status: 404 });
    }
});
exports.forgetPassword = forgetPassword;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { password } = req.body;
        const salt = yield bcrypt_1.default.genSalt();
        const hashed = yield bcrypt_1.default.hash(password, salt);
        if (userID) {
            yield userModel_1.default.findByIdAndUpdate(userID, {
                isVerifiedToken: "",
                password: hashed,
            }, { new: true });
            return res
                .status(201)
                .json({ message: "Password change successfully", status: 201 });
        }
        else {
            return res
                .status(404)
                .json({ message: "Error with password change", status: 404 });
        }
    }
    catch (error) {
        return res.status(404).json({ message: "Error", status: 404 });
    }
});
exports.changePassword = changePassword;
