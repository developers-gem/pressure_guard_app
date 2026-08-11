import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    credentials: { type: String, trim: true, default: "" }, // e.g. "RN, BSN, WOCN"
    role: { type: String, enum: ["staff", "admin"], default: "staff" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

UserSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

UserSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
};

UserSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    credentials: this.credentials,
    role: this.role,
  };
};

export default mongoose.model("User", UserSchema);
