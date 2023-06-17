const mongoose = require("mongoose");
const db_link = require("../atlas_uri");

mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("Plan DB connected");
  })
  .catch(function (err) {
    console.log(err);
  });
const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: [20, "Plan name should not exceed 20 characters"],
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: [true, "Price not entered"],
  },
  ratingsAverage: {
    type: Number,
    required: [false],
    default: 0
  },
  discount: {
    type: Number,
    validate: [
      function () {
        return this.discount < 100;
      },
      "Discount should not exceed price",
    ],
  },
});
//model
const planModel = mongoose.model("plan", planSchema);

(async function createPlan() {
  let planObj = {
    name: "Superfood",
    duration: 30,
    price: 1000,
    ratingsAverage: 5,
    discount: 20,
  };
  //   const doc = await planModel.create(planObj);
  //   const doc = new planModel(planObj);
  //   await doc.save();
})();
module.exports = planModel;
