const CryptoJS = require("crypto-js");
const Auth = require("../models/Auth");


// RegisterUser function :

const registerUser = async (req, res) => {
  try {
    const sameEmailUser = await Auth.findOne({ email: req.body.email });

    if (sameEmailUser) {
      return res.status(500).json("User with this email already exists.");
    }

    if (req.body.pass == undefined ||  (req.body.pass).length < 6) {
      return res.status(401).json("Password is undefined or length of password is less then 6 !!!");
    }

    const newUser = new Auth({
      email: req.body.email,
      pass: CryptoJS.AES.encrypt(
        req.body.pass,
        process.env.PASS_SEC
      ).toString(),
    });
    console.log(req.body.email);
    console.log(req.body.pass);
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(`Error occured while registration : ${err}`);
  }
};

let counter = 0 ; 

const loginUser = async (req, res) => {
  try { 
      
    const user = await Auth.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json("Wrong Credentials!");
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      user.pass,
      process.env.PASS_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword != req.body.pass) {
        counter ++ ; 
        console.log(counter) ; 
        if(counter >= 4){
            counter = 0 ;  
            return res.status(403).json("Wrong Passowrd 4 times , try login after 30 minutes .")
        } 
      return res.status(401).json("Wrong Password!");
    }

    const { pass, ...others } = user._doc;

    res.status(201).json({ ...others });
  } catch (err) {
    res.status(500).json(`Error occured while login : ${err}`);
  }
};

module.exports = { registerUser, loginUser };
