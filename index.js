/*
Task : 

1. The user signs up and sets up a password.
2. The user can logs in using email and password. Maximum password attempts are 4 after which the account gets locked for 30 minutes.
5. The user provides basic information about themselves such as name, age, list of favourite movies and rating out of 5 for each movie. 
4. Shut down the login route for next 30 min for a particular user.
3. Registration can be done without a password solve this issue .
6. The user can search for a movie to fetch the average rating. 
6a. Average rating is the average of the ratings provided by users for a particular movie 
6b. The user might not enter the exact movie name, the search results should show all relevant movies. 
// Uncompleted
7.  The user can edit the rating for particular movies and the history of changes is required to be maintained.


*/

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const AuthRoutes = require("./routes/auth") ; 
const UserRoutes = require("./routes/user") ; 

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(morgan("common"));
app.use(helmet());

// middleware :

app.use("/api/v1/auth" , AuthRoutes) ; 
app.use("/api/v1/users" , UserRoutes) ; 

// Connecting to server and DB ...
const start = async () => {
    try {
      mongoose
        .connect(process.env.MONGO_URL)
        .then(() => console.log("Connected to MongoDB..."));
  
      app.listen(port, () => {
        console.log(`App is listing at localhost:${port}`);
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  start();
