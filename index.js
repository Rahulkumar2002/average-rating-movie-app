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

// Authentication Route : 
app.use("/api/v1/auth" , AuthRoutes) ; 
// User Details , Search , Updation Route : 
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
