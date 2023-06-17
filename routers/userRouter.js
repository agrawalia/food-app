const express = require("express");
const app = express();

const {
  getUser,
  deleteUser,
  updateUser,
  getAllUser,
} = require("../controller/userController");

const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  logout,
  isAuthorised,
  protectRoute,
  setCookies,
  getCookies,
} = require("../controller/authController");

const userRouter = express.Router();

//Cookies
userRouter.route("/getCookies").get(getCookies);
userRouter.route("/setCookies").get(setCookies);

//User options
userRouter.route("/:id").patch(updateUser).delete(deleteUser);

userRouter.route("/signup").post(signup);

userRouter.route("/login").post(login);

userRouter.route("/forgetpassword").post(forgetPassword);

userRouter.route("/resetpassword/:token").post(resetPassword);

userRouter.route("/logout").get(logout);

//Profile page
userRouter.use(protectRoute); //Check if user is signed in
userRouter.route("/userProfile").get(getUser);


//admin specific func
userRouter.use(isAuthorised(["admin"]));
//Check if user is signed in
userRouter.route("/").get(getAllUser);

module.exports = userRouter;

/*
userRouter
  .route("/")
  .get(getUsers)
//.post(postUsers)
  .patch(updateUser)
  .delete(deleteUser);

//userRouter.route("/:id").get(getUserById);

*/
