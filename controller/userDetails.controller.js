const Movie = require("../models/movie.models");
const User = require("../models/user.models");

const userDetails = async (req, res) => {
  try {
    const userDetails = new User({
      name: req.body.name,
      userId: req.body.userId,
      age: req.body.age,
      movies: req.body.movies,
    });
    // A program to check if the rating is between 0 to 5 or not .
    if (checkRatingValue(req.body.movies)) {
      return res
        .status(401)
        .json("Rating Must be between 0 and 5 for every movie.");
    }

    updatingRecords(userDetails);
    const savedUser = await userDetails.save();
    // Fetching new user's favourite movie and adding it in Movie collection if not their already or just adding their ratings in ratingArray
    addToMovie(req.body.movies, req.body.userId);
    // Sending our new user.
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(`Error occured in userDetails function : ${err}`);
  }
};

// Function to check the rating if it is between 0 and 5 or not.
const checkRatingValue = (movies) => {
  let i = 0;
  while (i < movies.length) {
    if (!(movies[i].rating >= 0 && movies[i].rating <= 5)) {
      return true;
    }
    i++;
  }
  return false;
};

// Updating updateRecords for new User. 
const updatingRecords = async (user) => {
  try {
    let i = 0;
    while (i < user.movies.length) {
      user.updateRecords.push({
        movieName: user.movies[i].name,
        rating: user.movies[i].rating,
      });
      i++;
    }
    await User.findByIdAndUpdate(user._id, {
      updateRecords: user.updateRecords,
    });
  } catch (err) {
    console.log("Error occured in updatingRecords function" + err);
  }
};

const addToMovie = async (moviesArray, userId) => {
  try {
    let i = 0;
    // console.log(moviesArray , moviesArray.length , userId) ;
    while (i < moviesArray.length) {
      const movie = await Movie.findOne({ name: moviesArray[i].name });
      if (!movie) {
        const AddedMovie = await Movie({
          name: moviesArray[i].name,
          avgRating: moviesArray[i].rating,
          ratingArray: {
            userId: userId,
            rating: moviesArray[i].rating,
          },
        });
        await AddedMovie.save();
        //  console.log(notAddedMovie) ;
      } else {
        movie.ratingArray.push({
          userId: userId,
          rating: moviesArray[i].rating,
        });
        let result = avgRating(movie);
        await Movie.findByIdAndUpdate(movie._id, {
          ratingArray: movie.ratingArray,
          avgRating: result,
        });
      }
      i++;
    }
  } catch (err) {
    console.log(`Error in addToMovie function : ${err}`);
  }
};

// Finding averageRating : 
const avgRating = (movie) => {
  let i = 0,
    sum = 0;
  while (i < movie.ratingArray.length) {
    sum = sum + movie.ratingArray[i].rating;
    i++;
  }
  return sum / movie.ratingArray.length;
};


module.exports = {userDetails} ; 