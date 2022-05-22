const router = require("express").Router() ; 
const { registerUser, loginUser } = require("../controller/auth");


// Register 
router.post("/register" , registerUser ) ; 


// Login 

router.post("/login" , loginUser) ; 


module.exports = router ; 