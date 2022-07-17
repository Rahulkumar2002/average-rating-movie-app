const CryptoJS = require("crypto-js");
const Auth = require("../models/auth.models");
const { accessToken } = require("./login.controller");

// Encrypting Password :

const encryptedPassword = (password) => {
  return CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();
};

// RegisterUser function :

const registerUser = async (req, res) => {
  try {
    const sameEmailUser = await Auth.findOne({ email: req.body.email });

    if (sameEmailUser) {
      return res.status(500).json("User with this email already exists.");
    }

    // Checking Password :

    if (req.body.pass == undefined || req.body.pass.length < 6) {
      return res
        .status(401)
        .json("Password is undefined or length of password is less then 6 !!!");
    }

    const newUser = new Auth({
      email: req.body.email,
      pass: encryptedPassword(req.body.pass),
    });
    
    const user = await newUser.save();
    const token = accessToken(user._doc._id.toString()) ; 

    const {pass , ...others} = user._doc ; 
    res.status(201).json({...others ,token : token});
  } catch (err) {
    res.status(500).json(`Error occured while registration : ${err}`);
  }
};

module.exports = registerUser;
