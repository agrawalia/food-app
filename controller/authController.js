const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const JWT_KEY = require("../secrets");
//SignUp user
async function signup(req, res) {
  try {
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    if (user) {
      res.json({
        message: "User signed Up",
        data: user,
      });
    } else {
      res.json({
        message: "Error while signup",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
}

//Loggin User
async function login(req, res) {
  try {
    let data = req.body;
    if (data.email) {
      let user = await userModel.findOne({ email: data.email });
      if (user) {
        if (user.password == data.password) {
          let uid = user["_id"]; //payload
          let token = jwt.sign({ payload: uid }, JWT_KEY);

          res.cookie("login", token, { httpOnly: true });
          //res.cookie("isLoggedIn", true,{httpOnly: true});

          return res.json({
            message: "User logged in successfully",
            data: user,
          });
        } else {
          return res.json({
            message: "Wrong credentials !",
          });
        }
      }
    } else {
      res.json({
        message: "Please enter email",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
}

//forgetPassword
async function forgetPassword(req, res) {
  let { email } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const resetToken = user.createResetToken();
      let resetPasswordLink = `${req.protocol}://${req.get(
        "host"
      )}/resetpassword/${resetToken}`;
      //send mail to user using nodemailer
    } else {
      return res.json({
        message: "Please Signup",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

//resetpassword
async function resetPassword(req, res) {
  try {
    const token = req.params.token;
    let { password, confirmPassword } = req.body;
    if (user) {
      const user = await userModel.findOne({ resetToken: token });

      //resetPasswordHandler will update user in db
      user.resetPasswordHandler(password, confirmPassword);
      await user.save();
      res.json({
        message: "Password changed successfully, Login again",
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

async function logout(req, res) {
  res.cookie("login", " ", { maxAge: 1 });
  res.json({
    message: "User logout successfully"
  });
}

//isAuthorised -> to check users user role [admin, owner, restOwner, deliveryBoy]
const isAuthorised = (roles) => {
  //console.log(roles);
  return function (req, res, next) {
    console.log(roles, req.role);
    if (roles.includes(req.role) == true) {
      console.log(roles, req.role);
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized access",
      });
    }
  };
};

//protectRoute -> Check if user is logged in
async function protectRoute(req, res, next) {
  //Use cookies to check if user already logged in
  try {
    let token;
    if (req.cookies.login) {
      token = req.cookies.login;
      let payload = jwt.verify(req.cookies.login, JWT_KEY);

      const user = await userModel.findById(payload.payload);
      req.role = user.role;
      req.id = user.id;

      next();
    } else {
      //browser
      const client = req.get('User-Agent');
      if(client.includes("Mozilla") == true){
        return res.redirect("/login");
      }

      //postman
      res.json({
        message: "Operation not allowed Please login",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
}

async function setCookies(req, res) {
  // res.setHeader('Set-Cookie', 'isLoggedIn=true');
  res.cookie("isLoggedIn", true, {
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    httpOnly: true,
  });
  res.send("Cookies has been sent");
}

async function getCookies(req, res) {
  let cookies = req.cookies;
  console.log(cookies);
  res.send("cookies received");
}

module.exports = {
  signup,
  login,
  forgetPassword,
  resetPassword,
  logout,
  protectRoute,
  isAuthorised,
  setCookies,
  getCookies,
};
