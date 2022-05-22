const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    age: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    movies: [
      {
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: [true, "Rating must be out of 5 !!!"],
        },
      },
    ],
    updateRecords : [
      {
        movieName : {
          type : String , 
          required : true , 
        } , 
        rating : {
          type : Number , 
          required : true 
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
