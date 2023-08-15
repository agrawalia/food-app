const express = require("express");
const app = express();
const multer = require("multer");
const {
  getUser,
  deleteUser,
  updateUser,
  getAllUser,
  updateProfileImage,
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

const multerStorage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,'public/images');
  },
  filename: function(req, file, cb){
    cb(null, `user-${Date.now()}.jpeg`)
  }
});

const filter = function(req, file, cb) {
  if(file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image "))
  }
}

//multer for file upload
const upload = multer({
  storage:multerStorage,
  fileFilter:filter
})

//update profile image
userRouter.post("/ProfileImage", upload.single('photo'), updateProfileImage)
userRouter.get('/ProfileImage', (req, res)=>{
  res.sendFile('/Users/ishan/workspace/test/views/multer.html')
})

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
