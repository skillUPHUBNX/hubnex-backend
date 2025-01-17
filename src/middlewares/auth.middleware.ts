import jwt, { JwtPayload } from "jsonwebtoken";
import { Admin } from "../modal/admin.model";
import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  admin?: { email: string; _id: string }; // Custom property to hold admin data
  user?: JwtPayload | string; // Custom property for decoded token payload
}

export const verifyJwt = async function (
  req: AuthenticatedRequest,
  _: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token = req.cookies?._admintoken;
    console.log(token);
    
    if (!token) throw new Error("Not authenticated!! Please log in");

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const admin = await Admin.findOne(decodedToken._id).select("email _id");

    if (!admin) throw new Error("Invalid access token");
    // Transform _id to a string
    req.admin = {
      email: admin.email,
      _id: admin._id.toString(), // Convert ObjectId to string
    }; // Attach admin data to the request object
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const isAuthenticated = (
  req: AuthenticatedRequest,
  _: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies._admintoken;
    if (!token) {
      throw new Error("Not Authenticated");
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified;
    next();
  } catch (err) {
    next(err);
  }
};
