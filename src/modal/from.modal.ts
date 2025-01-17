import mongoose from "mongoose";

const FromSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phonenumber: { type: String, required: true },
    service: { type: String, required: true },
    message: { type: String, default:"" },
    isRead: { type: Boolean, default: false}
  },
  {
    timestamps: true,
  }
);

const FormModel = mongoose.model("from", FromSchema);

export default FormModel;
