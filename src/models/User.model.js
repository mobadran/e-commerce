import bcrypt from "bcrypt";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please provide a name"], },
  email: { type: String, required: [true, "Please provide an email"], unique: true, },
  password: { type: String, required: [true, "Please provide a password"], },
  role: { type: String, enum: ["user", "admin"], default: "user", },
  refreshToken: { type: String, default: null, },
  resetToken: { type: String, default: null, },
  resetTokenExpires: { type: Date, default: null, },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1, min: 1 },
    }
  ],
  wishlist: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", }], default: [], },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Hash only if the password is changed
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;