const { searchMovie } = require("../controller/searchMovie.controller");
const { updateDetails } = require("../controller/updateDetails.controller");
const { userDetails, getUser } = require("../controller/userDetails.controller");
const verifyToken = require("../middleware/verifyToken.middleware");

const router = require("express").Router() ; 
// To get a user : 

router.get("/user" , verifyToken , getUser ); 


// To give details : 
router.post("/user" ,verifyToken , userDetails) ;  

// To update the rating : 
router.patch("/update" , verifyToken , updateDetails) ; 

// To search : 

/*
User can search the name of the movie.
User will input the name but not in complete.
User must get at the name strings as output which contains the searched string.
But the rating must be average of the rating from all the movie.
So I must provide index to the all the movies.
Then it can be fetched accordingly.
*/

router.get("/search/:name" , verifyToken ,searchMovie) ; 

module.exports = router ; 