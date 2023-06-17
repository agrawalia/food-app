const planModel = require("../models/planModel");

async function getAllPlans(req, res) {
  try {
    let plans = await planModel.find();
    if (plans) {
      return res.json({
        message: "All plans received",
        data: plans,
      });
    } else {
      return res.json({
        message: "Plans not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
async function getPlan(req, res) {
  try {
    let id = req.params.id;
    let plan = await planModel.findById(id);
    if (plan) {
      return res.json({
        message: "plan received",
        data: plan,
      });
    } else {
      return res.json({
        message: "Plans not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
async function createPlan(req, res) {
  try {
    let planData = req.body;
    let createdPlan = await planModel.create(planData);
    return res.json({
      message: "Plan created successfully",
      data: createdPlan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
async function deletePlan(req, res) {
  try {
    let id = req.params.id;
    let deletedPlan = await planModel.findByIdAndDelete(id);
    return res.json({
      message: "Plan deleted",
      data: deletedPlan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
async function updatePlan(req, res) {
  try {
    let id = req.params.id;
    let dataToBeUpdated = req.body;

    let keys = [];
    for (let key in dataToBeUpdated) {
      keys.push(key);
    }
    console.log("Data to update - ", dataToBeUpdated)
    let plan = await planModel.findById(id);
    console.log(plan)
    for (let i = 0; i< keys.length; i++) {
      plan[keys[i]] = dataToBeUpdated[keys[i]];
    }
    //doc save
    await plan.save();

    return res.json({
      message: "Plan updated",
      data: plan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
async function top3Plans(req, res) {
  try {
    const top3Plans = await planModel
      .find()
      .sort({ ratingsAverage: -1 })
      .limit(3);
    return res.json({
      message: "Top 3 plans",
      data: top3Plans,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = {
  getAllPlans,
  getPlan,
  createPlan,
  deletePlan,
  updatePlan,
  top3Plans,
};
