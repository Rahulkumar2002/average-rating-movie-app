const jwt = require("jsonwebtoken");
const Auth = require("../models/auth.models") ; 
const CryptoJS = require("crypto-js");
require('dotenv').config() ; 

const accessToken = (id) => {
  return jwt.sign(
    {
      id:id,
    },
    process.env.JWT_SEC,
    { expiresIn: "1h" }
  );
};

const password = (pass) => {

    const hashedPassword = CryptoJS.AES.decrypt(
        pass,
        process.env.PASS_SEC
      );
  
      return hashedPassword.toString(CryptoJS.enc.Utf8);
}

// LoginUse Function :
const loginUser = async (req, res) => {
  try {
    const user = await Auth.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json("Wrong email user not found!");
    }

    const originalPassword = password(user.pass) ; 

    if (originalPassword != req.body.pass) {
      return res.status(401).json("Wrong Password!");
    }
  
    const token = accessToken(user._id.toString());

    const { pass, ...others } = user._doc;

    res.status(201).json({ ...others , token });
  } catch (err) {
    console.log(err); 
    res.status(500).json(`Error occured while login : ${err}`);
  }
};



module.exports = {accessToken , loginUser} ; 
