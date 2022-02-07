const express = require("express");
const router = express.Router();
const UserModel = require("../model/User");
const bcrypt = require("bcrypt");
const webToken = require("jsonwebtoken");
require("dotenv").config();

// Register
router.post("/register", function (req, res) {
  const {
    name,
    password,
    email, 
    number, 
    gender, 
    image
  } = req.body;
  console.log(name,password,email,number,gender,image);
  if (
    name == undefined ||
    name == "" ||
    password == undefined ||
    password == "" ||
    email == undefined ||
    email == "" ||
    number == undefined ||
    number == "" ||
    gender == undefined ||
    gender == ""
  ) {
    res.status(401).json({
      message: "Fill All Fields",
      status: res.statusCode,
    });
  } else {
    UserModel.findOne({
      attributes: ["user_name"],
      where: {
        email,
      },
    }).then((value) => {
      if (value === null) {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            UserModel.create({
                user_name: name,
                email: email,
                password: hash,
                number: number,
                gender:gender,
                image: image,
              })
              .then((value) =>
                res.status(201).json({
                  message: "User Created Successfully",
                  status: res.statusCode,
                })
              )
              .catch((err) =>
                res.status(404).json({
                  message: "Something went wrong",
                  status: res.statusCode,
                })
              );
          });
        });
      } else {
        res.status(401).json({
          message: "Email already Taken",
          status: res.statusCode,
        });
      }
    });
  }
});


//Login
router.post("/login", function (req, res) {
  const {
    password,
    email
  } = req.body;

  if (
    password == "" ||
    password == undefined ||
    email == "" ||
    email == undefined
  ) {
    res.status(401).json({
      message: "Fill All Fields",
      status: res.statusCode,
    });
  } else {
    UserModel.findOne({
      where: {
        email,
      },
    }).then((value) => {
      if (value === null) {
        res.status(401).json({
          message: "User not found Please SignUp",
          status: res.statusCode,
          token: ''
        });
      } else {
        const dbPassword = value.getDataValue("password");
        const userDetail = {
          name: value.getDataValue("user_name"),
          id: value.getDataValue("id"),
        };

        bcrypt.compare(password, dbPassword, function (err, result) {
          if (result) {
            const token = webToken.sign(userDetail, "abcd", {
              expiresIn: "1h",
            });
            res.status(200).json({
              message: "Logged In successfully",
              status: res.statusCode,
              token,
            });
          } else {
            res.status(401).json({
              message: "Invalid Crendential",
              status: res.statusCode,
              token: ''
            })
          }
        });
      }
    });
  }
});

//Get UserProfil API
router.get("/profile", async function (req, res) {
  console.log(req.headers, "inside profile backend");
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token =  authHeader.substring(7, authHeader.length);
    const user = webToken.verify(token, "abcd");
    console.log(user);
    if (user) {
      try {
        const userDetail = await UserModel.findOne({
          where: {
            id:user.id,
          },
        });
        console.log(userDetail);
        return res.status(200) .json({
          status: res.statusCode,
          data: userDetail,
          message: "success"
        });
      }
      catch(err) {
        return res.status(401).json({
          status: res.statusCode,
          message: "please Login"
        });
      }
    }
    
  } else {
    res.status(401).json({
      status: res.statusCode,
      message: "Please Login"
    }); 
  }
});

module.exports = router;