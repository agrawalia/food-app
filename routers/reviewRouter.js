const express = require("express");
const app = express();
const reviewRouter = express.Router();

const { isAuthorised, protectRoute } = require("../controller/authController");

const {
  getAllReviews,
  top3Reviews,
  getPlanReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controller/reviewController");

reviewRouter.route("/all").get(getAllReviews);

reviewRouter.route("/top3reviews").get(top3Reviews);

reviewRouter.route("/:id").get(getPlanReviews);

reviewRouter.use(protectRoute);
reviewRouter.route("/crud/:plan").post(createReview);

reviewRouter.route("/crud/:id").patch(updateReview).delete(deleteReview);

module.exports = reviewRouter;