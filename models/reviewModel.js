const mongoose = require("mongoose");
const db_link = require("../atlas_uri");
const planModel = require("./planModel.js");
const userModel = require("./userModel.js");

mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("Review DB connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review is required"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Rating is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "Review must belong to a user"],
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: "plan",
    required: [true, "Review must belong to a plan"],
  },
});

// find, findById, findOne
reviewSchema.pre(/^find/, function (next) {
  console.log("yy")
  this.populate({
    path: "user",
    select: "name profilePicture",
  }).populate("plan");
  next();
});

const reviewModel = mongoose.model("review", reviewSchema);
module.exports = reviewModel;