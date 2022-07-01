const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required!!!"],
      unique : true 
    },
    pass: {
      type: String,
      required: [true,"Password is undefined!!"],
      min : 6 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auth", AuthSchema);
