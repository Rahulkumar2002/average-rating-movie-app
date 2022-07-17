const { loginUser } = require("../controller/login.controller");
const registerUser = require("../controller/register.controller");
const router = require("express").Router() ; 


// Register 
router.post("/register" , registerUser ) ; 


// Login 

router.post("/login" , loginUser) ; 


module.exports = router ; 