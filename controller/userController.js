const userModel = require("../models/userModel");

async function  getUser(req, res) {
  let id = req.id;
  let user = await userModel.findById(id);
  if (user) {
    return res.json({
      data: user,
    });
  } else {
    return res.json({
      message: "User not found",
    });
  }
}

async function updateUser(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findById(id);
    console.log(user);
    let dataToBeUpdated = req.body;
    if (user) {
      const keys = [];
      for (let key in dataToBeUpdated) {
        keys.push(key);
      }
      console.log(keys);

      for (let i = 0; i < keys.length; i++) {
        user[keys[i]] = dataToBeUpdated[keys[i]];
      }

      const updatedData = await user.save();
      res.json({
        message: "Data updated sucessfully",
        user: user,
      });
    } else {
      res.json({
        message: "User not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findByIdAndDelete(id);
    if (!user) {
      res.json({
        message: "User not found",
      });
    }
    res.json({
      message: "Data deleted",
      data: user,
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
}

async function getAllUser(req, res) {
  try {
    let users = await userModel.find();
    if (!users) {
      res.json({
        mesage: "No user found",
      });
    } else {
      res.json({
        messsage: users,
      });
    }
  } catch (err) {
    res.json({
      message: err.mesage,
    });
  }
}

async function updateProfileImage(req, res) {
  res.json({
    message: 'file uploaded successfully',
  })
}

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  getAllUser,
  updateProfileImage,
};
