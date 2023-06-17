const express = require("express");
const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const db_link = require("../atlas_uri");
const crypto = require("crypto");

mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("DB connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    minLength: 8,
    validate: function () {
      return this.confirmPassword == this.password;
    },
  },
  role: {
    type: String,
    enum: ["admin", "user", "restaurantowner", "deliveryboy"],
    default: "user",
  },
  profilePicture: {
    type: String,
    default: "default.jpeg",
  },
  resetToken: String,
});

const userModel = mongoose.model("user", userSchema); // "user" is collection name

//Dont save confirm password in MongoDb
// userSchema.pre("save", function(){
//     this.confirmPassword = undefined
//   });

userSchema.methods.createResetToken = function () {
  //create unique token using crypto
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = resetToken;
  return resetToken;
};

userSchema.methods.resetPasswordHandler = function (password, confirmPassword) {
  this.passwprd = password;
  this.confirmPassword = confirmPassword;
  this.resetToken = undefined;
};

module.exports = userModel;
