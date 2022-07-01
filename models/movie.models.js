const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    avgRating : {
        type : Number,
        default : 0 
    },
    ratingArray: [
      {
        userId: {
          type: String,
          required: true
        },

        rating: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
