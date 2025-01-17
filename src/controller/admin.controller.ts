import jwt from "jsonwebtoken";
import { Admin } from "../modal/admin.model";
import { Request, Response, NextFunction } from "express";

/**
// SIGN UP FOR ADMIN
export const SIGNUP = async function (req, res, next) {
  let { email, password } = req.body;
  try {
    const admin = await Admin.create({ email, password });
    if (!admin) throw new Error("Something went wrong creating admin");
    res.send(admin);
  } catch (error) {
    next(error);
  }
};
 */

// LOG IN FOR ADMIN
export const LOGIN = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let { email, password } = req.body;
  try {
    if (!email) throw new Error("Email is required");
    if (!password && password.length < 5)
      throw new Error("Password should be minimum 5 characters");
    let admin = await Admin.findOne({ email });
    if (!admin) throw new Error("Invalid Email Found");
    let isPasscorrect = admin.password.toString() === password.toString();
    if (!isPasscorrect) throw new Error("Password Incorrect");

    const token = jwt.sign(
      { _id: admin._id, email: admin.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10d",
      }
    );

    res
      .cookie("_admintoken", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 3,
      })
      .send({ _id: admin._id, email: admin.email });
  } catch (error) {
    next(error);
  }
};

// LOGOUT FOR ADMIN
export const LOGOUT = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.clearCookie("_admintoken", { path: "/admin" });
  } catch (error) {
    next(error);
  }
};

// AUTHENTICATE USER
