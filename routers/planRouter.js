const express = require("express");
const { protectRoute, isAuthorised } = require("../controller/authController");
const {
  getAllPlans,
  getPlan,
  createPlan,
  deletePlan,
  updatePlan,
  top3Plans,
} = require("../controller/planController");

const planRouter = express.Router();
//Returns All plans
planRouter.route("/allPlans").get(getAllPlans);

//own plan
planRouter.use(protectRoute); //Logged in necessary
planRouter.route("/plan/:id").get(getPlan);

//top 3 plans
//Implement in frontend
planRouter.route("/top3").get(top3Plans);

//Admin and Restaurat owner can only create, delete and update plans
planRouter.use(isAuthorised(["admin", "restaurantowner"]));
planRouter.route("/crudPlan").post(createPlan);
planRouter.route("/crudPlan/:id").patch(updatePlan).delete(deletePlan);

module.exports = planRouter;