const express = require("express");
const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const db_link = require("./atlas_uri.js");
const app = express();

app.use(express.json()); // convert data from frontend to json format
app.listen(3000);

/*
app.get('/', function(req, res) {
    res.send('Hello World')
})  
app.get('/about', function(req, res) {
    res.sendFile('./views/about.html', {root : __dirname});
})
//redirects
app.get('/about-us', function(req, res) {
    res.redirect('/about');
})
//404 page
app.use((req, res) => {
    res.status(400).sendFile('views/404.html', {root : __dirname});
})
*/
let users = [
  {
    id: 1,
    name: "Abhishek",
  },
  {
    id: 2,
    name: "Ajay",
  },
  {
    id: 3,
    name: "Ashish",
  },
];

//Mini App
const userRouter = express.Router();
const authRouter = express.Router();

app.use("/users", userRouter); //Base route, router to use
app.use("/auth", authRouter); //global middleware

userRouter
  .route("/")
  .get(getUsers)
  .post(postUsers)
  .patch(updateUser)
  .delete(deleteUser);

userRouter.route("/:id").get(getUserById);

authRouter
  .route("/signup")
  .get(middleware1, getSignup, middleware2) //path specific middleware
  .post(postSignup);

//Queries
//localhost:3000/users/?name=Abhishek
app.get("/users", (req, res) => {
  console.log(req.query); //{ name: 'Abhishek' }
  res.send({
    message: req.query.name,
  });
});

//GET ->
app.get("/users", (req, res) => {
  res.send(users);
});

//POST ->
app.post("/users", (req, res) => {
  users = req.body;
  res.json({
    message: "Data added successfully",
    user: users,
  });
});

//PATCH -> update
app.patch("/users", (req, res) => {
  let dataToBeUpdated = req.body;
  for (let key in dataToBeUpdated) {
    users[key] = dataToBeUpdated[key];
  }
  res.json({
    message: "Data updated sucessfully",
    user: users,
  });
});

//delete a data
app.delete("/users", (req, res) => {
  users = {};
  res.json({
    message: "Data deleted",
  });
});

//Parameters
app.get("/users/:id", (req, res) => {
  console.log(req.params.id);
  res.send("Request id received");
});

/*Mounting in express*/

async function getUsers(req, res) {
  //res.send(users);
  let allUsers = await userModel.find();
  //let user = await userModel.findOne({name : 'Abhishek'});
  res.json({
    message: "list of all users",
    data: allUsers,
  });
}

function postUsers(req, res) {
  users = req.body;
  res.json({
    message: "Data added successfully",
    user: users,
  });
}

async function updateUser(req, res) {
  let dataToBeUpdated = req.body;
  // for (let key in dataToBeUpdated) {
  //   users[key] = dataToBeUpdated[key];
  // }
  let user = await userModel.findOneAndUpdate(
    { email: "abhishek@gmail.com" },
    dataToBeUpdated
  );
  res.json({
    message: "Data updated sucessfully",
    user: user,
  });
}

async function deleteUser(req, res) {
  //users = {};
  let dataToBeDeleted = req.body;
  let user = await userModel.findOneAndDelete(dataToBeDeleted);
  res.json({
    message: "Data deleted",
    data: user,
  });
}

//Parameters
function getUserById(req, res) {
  console.log(req.params.id);
  let result = {};
  let idx = req.params.id;
  for (let i = 0; i < users.length; i++) {
    if (users[i].id == idx) {
      result = users[i];
      break;
    }
  }
  res.json({
    message: "Get data with parameters",
    data: result,
  });
  // res.json({
  //   message: "Get data with not parameters",
  //   data: result,
  // });
}

/* ------------Auth---------------*/
function middleware1(req, res, next) {
  console.log("Middle ware encountered");
  next();
}

async function getSignup(req, res, next) {
  //res.sendFile("/public/index.html", { root: __dirname });
}

function middleware2(req, res, next) {
  console.log("Middle ware encountered");
  next();
}

async function postSignup(req, res) {
  let dataObj = req.body;
  let user = await userModel.create(dataObj);

  res.json({
    message: "User signed Up",
    data: user,
  });
}

mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("DB connected");
  })
  .catch(function (err) {
    console.log(err);
  });

//Schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function(){
      return emailValidator.validate(this.email);
    }
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
    validate: function(){
      return this.confirmPassword == this.password;
    }
  },
});

//Models
const userModel = mongoose.model("user", userSchema);

//Mongoose Hooks - check password and confirmPassword match
//before save occurs in db
/*
userSchema.pre("save", function () {
  console.log("before saving in db",this);
});

//after save event occurs in db
userSchema.post("save", function (doc) {
  console.log("after saving in db");
});
*/

//Dont save confirm password in MongoDb
userSchema.pre("save", function(){
  this.confirmPassword = undefined
});

/*
(async function createUser() {
  let user = {
    name: "Abhishek",
    email: "abhishek@gmail.com",
    password: "12345678",
    confirmPassword: "12345678"
  };

  let data = await userModel.create(user);
  console.log(data);
})();
*/
