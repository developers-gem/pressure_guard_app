import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    room: { type: String, trim: true, default: "—" },
    mrn: { type: String, trim: true, default: "" }, // optional internal medical record number
    active: { type: Boolean, default: true },

    // Denormalized "current state" fields for fast dashboard reads.
    // Source of truth for history remains the BradenAssessment / RepositionLog collections.
    bradenScore: { type: Number, min: 6, max: 23 },
    bradenRisk: { type: String, trim: true },
    lastRepositioned: { type: Date },
    lastPosition: { type: String, trim: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

PatientSchema.index({ name: 1, room: 1 });

PatientSchema.methods.toJSONSafe = function toJSONSafe() {
  return {
    id: this._id,
    name: this.name,
    room: this.room,
    mrn: this.mrn,
    active: this.active,
    bradenScore: this.bradenScore,
    bradenRisk: this.bradenRisk,
    lastRepositioned: this.lastRepositioned,
    lastPosition: this.lastPosition,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model("Patient", PatientSchema);
