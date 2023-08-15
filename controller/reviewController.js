const reviewModel = require("../models/reviewModel");
const planModel = require("../models/planModel");
const userModel = require("../models/userModel");
const {paginatedResults} = require("../utility/paginate")


//make it paginated
async function getAllReviews(req, res) {
  try {
    console.log('inside getallreviews')
    
    res.json(res.paginatedResults)    
    
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function top3Reviews(req, res) {
  try {
    let reviews = await reviewModel.find().sort({ rating: -1 }).limit(3);
    if (reviews) {
      return res.json({
        message: "TOP 3 reviews",
        data: reviews,
      });
    } else {
      return res.json({
        message: "No review found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function getPlanReviews(req, res) {
  try {
    const id = req.params.id;
    const planReviews = await reviewModel.findById(id);
    if (planReviews) {
      return res.json({
        message: "Reviews for given plan are",
        data: planReviews,
      });
    } else {
      return res.json({
        message: "No review found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function createReview(req, res) {
  try {
    let reviewData = req.body;
    let id = req.params.plan;
    let plan = await planModel.findById(id);
    plan.ratingsAverage = (plan.ratingsAverage + reviewData.rating)/2;
    let review = await reviewModel.create(reviewData);
    await plan.save();
    if (review) {
      return res.json({
        message: "New review added",
        data: review,
      });
    } else {
      return res.json({
        message: "No review found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function updateReview(req, res) {
  try {
    const id = req.params.id;
    const dataToBeUpdated = req.params.body;
    let review = await reviewModel.findById(id);
    let keys = [];
    for (let key in dataToBeUpdated) {
      keys.push(key);
    }
    for (let key of keys) {
      review[key] = dataToBeUpdated[key];
    }
    await review.save();
    return res.json({
      message: "Review updated succcessfully",
      data: review,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function deleteReview(req, res) {
  try {
    const id = req.params.id;
    const review = await reviewModel.findByIdAndDelete(id);
    return res.json({
      message: "Data deleted successfully",
      data: review,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = {
  getAllReviews,
  top3Reviews,
  getPlanReviews,
  createReview,
  updateReview,
  deleteReview,
};
