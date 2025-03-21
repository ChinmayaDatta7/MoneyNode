import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/paytm");

const db = mongoose.connection;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
  },
  firstName: {
    type: String,
    required: true,
    lowercase: true,
    match: /^[a-z]+$/,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true,
    match: /^[a-z]+$/,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    match:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
