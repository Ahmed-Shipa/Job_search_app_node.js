import mongoose, { model, Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: mongoose.Types.ObjectId,
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    userTechSkills: [String],
    userSoftSkills: [String],
    userResume: String,
  },
  {
    versionKey: false,
    timestamps: {
      updatedAt: false,
      createdAt: true,
    },
  }
);
export const Application = model("Application", applicationSchema);
