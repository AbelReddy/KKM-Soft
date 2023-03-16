require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken")
const app = express();





app.use(express.static('public'))
app.use(express.json())
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }))


const userSchema = new mongoose.Schema({
  email: {
    unique:true,
    type:String,
    required:true
  },
  name:{
    type:String
  },
  password:{
    type:String
  },
  tokens:[{
    token: {
      type:String,
      required:true
    }
  }]
});


mongoose.connect('mongodb://127.0.0.1:27017/productsDB').then((resolve, reject)=>{
  if(resolve){
    console.log("Database is connected");
  }
});


userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.SecretKey);
    return token;
    token.save()
}

 const User = mongoose.model("User", userSchema);
const newUser = new User();

const token = newUser.generateAuthToken();




app.get("/", function(req,res){
  res.render("home")
});


app.get("/login", function(req,res){
  res.render("login")
});

app.post("/login", function(req,res){
const emailId = req.body.emailId;
const password = req.body.password;
const userLogin = User.findOne({email:emailId});

  userLogin.then((user) =>{

    if(user){
      bcrypt.compare(password,user.password, function(err, result) {
        if(result===true){
          res.render("product")
        }if(result===false){
          res.send("Invalid id or password")
        }
    });
    }
  });

  // const token =  userLogin.generateAuthToken();




})


app.get("/register", function(req,res){
  res.render("register")
});

app.post("/register", function(req,res){
bcrypt.hash(req.body.customerPassword, saltRounds, function(err, hash){
  const newUser = new User({
     email : req.body.customerEmail,
     name :req.body.customerName,
     password : hash
  });

  newUser.save().then((resolve,reject)=>{
    if(resolve){
      res.render("product")
    }
  });


});
});

app.get("/product", function(req,res){
  res.render("product")
});
app.post("/product", function(req,res){
  res.render("thankyou")
});


app.get("/logout", function(req,res){
  res.render("home")
});









app.listen("1919", function(req,res){
  console.log("Server is started")
});
