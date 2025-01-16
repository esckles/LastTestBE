import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../model/userModel";
import jwt from "jsonwebtoken";
import { createaccountEmail } from "../utils/email";

export const signUPUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userName, email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(4).toString("hex");

    const user = await userModel.create({
      userName,
      email,
      password: hashed,
      isVerifiedToken: token,
    });

    createaccountEmail(user);
    return res.status(201).json({
      message: "Account created successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Errror creating account", status: 404 });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user = await userModel.findByIdAndUpdate(
      userID,
      {
        isVerified: true,
        isVerifiedToken: "",
      },
      { new: true }
    );
    return res.status(201).json({
      message: "Account verified successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error verifying account", status: 404 });
  }
};

export const signInUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const decryptedPassword = await bcrypt.compare(password, user.password);
      if (decryptedPassword) {
        if (user?.isVerified && user?.isVerifiedToken === "") {
          const token = jwt.sign(
            { id: user?._id },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES }
          );
          return res
            .status(201)
            .json({ message: "Welcome back", data: token, status: 201 });
        } else {
          return res
            .status(404)
            .json({ message: "Error verifying account", status: 404 });
        }
      } else {
        return res
          .status(404)
          .json({ message: "Incorrect password", status: 404 });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Error with user Email", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: "Error with Login", status: 404 });
  }
};

export const ReadOneUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user = await userModel.findById(userID);
    return res
      .status(200)
      .json({ message: "One user read successfully", data: user, status: 200 });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error with one user account read", status: 404 });
  }
};

export const ReadAllUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.find();
    return res.status(200).json({
      message: "All user found successfully",
      status: 200,
      data: user,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error find all user account", status: 404 });
  }
};

export const forgetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(6).toString("hex");
    const user = await userModel.findOne({ email });
    if (user) {
      await userModel.findByIdAndUpdate(
        user?._id,
        {
          isVerifiedToken: token,
        },
        { new: true }
      );
      return res
        .status(201)
        .json({ message: "Email has been sent to you", status: 201 });
    } else {
      return res.status(404).json({ message: "Error with email", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: "Error", status: 404 });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const { password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);

    if (userID) {
      await userModel.findByIdAndUpdate(
        userID,
        {
          isVerifiedToken: "",
          password: hashed,
        },
        { new: true }
      );
      return res
        .status(201)
        .json({ message: "Password change successfully", status: 201 });
    } else {
      return res
        .status(404)
        .json({ message: "Error with password change", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: "Error", status: 404 });
  }
};
