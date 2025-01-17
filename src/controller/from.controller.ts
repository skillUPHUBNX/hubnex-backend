import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import FormModel from "../modal/from.modal";


// Define the Zod schema
const formSchema = z.object({
  name: z.string().nonempty({ message: "Username is required." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  phonenumber: z
    .string()
    .regex(/^\+\d{1,4}\d{7,14}$/, { message: "Please provide a valid phone number (e.g., +1234567890)." }),
  service: z.string().nonempty({ message: "Please provide a service." }),
  message: z.string().optional(),
});

export const submitFrom = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the request body using Zod
    const validatedData = formSchema.parse(req.body);

    // Check for duplicates in the database
    const existingUser = await FormModel.findOne({ email: validatedData.email });
    if (existingUser) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    // Create a new form entry
    const form = new FormModel(validatedData);
     await form.save();

    // Respond with success
    res.status(201).json({
      message: "Form submitted successfully",
    });
  } catch (error) {
    // Narrow the error type
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else if (error instanceof Error) {
      // For non-Zod errors
      res.status(500).json({ error: "Failed to save form", message: error.message });
    } else {
      // Fallback for unexpected error types
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};


export const getFromDetails = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  try {
    
      const submissions = await FormModel.find({});
      // If user not found
      if (!submissions) {
          res.status(404).json({ success: false, message: "Details not found" });
      }

       res.status(201).json({ loading: true, submissions  });

  } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Internal Error" });
  }
};

// UPDATE SUBMISSION BY ID
export const updateDetail = async function (req: Request, res: Response, next:NextFunction): Promise<void> {
  let submissionId = req.params.id;
  try {
    let submission = await FormModel.findById(submissionId);
    
    if (!submission) throw new Error("Submission with this id does not exist");

    submission.isRead = !submission.isRead;
    const updatedSubmission = await submission.save({});
     res.send(updatedSubmission);
  } catch (error) {
    next(error);
  }
};

// UPDATE SUBMISSION BY ID
export const deleteDetail = async function (req: Request, res: Response, next:NextFunction): Promise<void> {
  let submissionId = req.params.id;
  try {
    let submission = await FormModel.findByIdAndDelete(submissionId);
    if (!submission) throw new Error("Data does not exists");
     res.send({_id:submission._id});
  } catch (error) {
    next(error);
  }
};
