const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

const mongoose = require('mongoose');

require('dotenv').config()

const connection_string = process.env.CONNECTION_STRING

// require database connection 
const databaseConnect = require("./db/databaseConnect");

// execute database connection 
databaseConnect();

// Curb CORS Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

const User = require("./db/userModel");

// register endpoint
app.post("/register", (request, response) => {  
  // hash password
  bcrypt.hash(request.body.password, 12)
    .then((hashedPassword) => {
      // create a new user instance and get the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });      
      // save new user data
      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error on adding user
        .catch((error) => {
          response.status(500).send({
            message: "Error on creating user",
            error,
          });
        });
    })
    // catch error on password hash
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
  });
});

// login endpoint
app.post("/login", (request, response) => {
  // check if email exist in the server
  User.findOne({ email: request.body.email })
    .then((user)=>{
      // check if both passwords match
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }
          // create JWT token for security
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "48h" }
          );
          // return success response
          response.status(200).send({
            message: "Login Success",
            email: user.email,
            token,
          });
        })
        // password error
      .catch((error) => {
        response.status(400).send({
          message: "Passwords does not match",
          error,
        });
      })
    })
    .catch((e) => {
      response.status(404).send({
        message: "There is no email address found.",
        e,
      });
    }); 

  const auth = require("./auth");

  // authentication endpoint
  app.get("/vehicles_backend", auth, (request, response) => {
    response.json({ message: "You are authorized to access me" });
  });
})

module.exports = app;
