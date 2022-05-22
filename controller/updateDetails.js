
const Movie = require("../models/Movie");
const User = require("../models/User");


// To update rating first we have to update the rating in Movies(ratingArray , avgRating ) and then in Users(rating) .

// Updating rating in Movie Collection : 
const updateDetails = async (req, res) => {
    try {
      const { movieId, rating, userId } = req.body;
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json("Movie not found!!!");
      }
      let i = 0;
      
      while (i < movie.ratingArray.length) {
        if (movie.ratingArray[i].userId == userId) {
          movie.ratingArray[i] = {
            userId: userId,
            rating: rating,
          };
          let results = avgRating(movie);
          // Updating ratingArray :   
          await Movie.findByIdAndUpdate(movieId, {
            avgRating: results,
            ratingArray: movie.ratingArray,
          });
          // Updating Users collection in this function : 
          updateUser(movie, userId, rating);
          // If everything works fine returning this msg : 
          return res.status(200).json("Updated Successfully");
        } else if (i == movie.ratingArray.length - 1) {
          movie.ratingArray.push({
            userId: userId,
            rating: rating,
          });
          let results = avgRating(movie);
          await Movie.findByIdAndUpdate(movieId, {
            avgRating: results,
            ratingArray: movie.ratingArray,
          });
          updateUser(movie, userId, rating);
          return res.status(200).json("Added Successfully");
        }
        i++;
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(`Error occured in updateDetails : ${err}`);
    }
  };

  // Finding Average Rating : 
  const avgRating = (movie) => {
    let i = 0,
      sum = 0;
    while (i < movie.ratingArray.length) {
      sum = sum + movie.ratingArray[i].rating;
      i++;
    }
    return sum / movie.ratingArray.length;
  };

  // Updating Rating in users and also updating our updateRecords.
  const updateUser = async (movie, userId, rating) => {
    try {
      const user = await User.findOne({ userId: userId });
      // console.log(user) ;
      if (!user) {
        console.log("User not found!!!!");
      }
  
      let i = 0;
      while (i < user.movies.length) {
        if (movie.name === user.movies[i].name) {
          user.movies[i] = {
            name: movie.name,
            rating: rating,
          };
          // Updating updateRecords : 
          user.updateRecords.push({
            movieName: movie.name,
            rating: rating,
          });
          await User.findByIdAndUpdate(user._id, {
            movies: user.movies,
            updateRecords: user.updateRecords,
          }); 
          console.log("Update Movie in User.");
          return;
        } else if (i == user.movies.length - 1) {
          
          let newMovie = user.movies;
          newMovie.push({
            name: movie.name,
            rating: rating,
          });
          user.updateRecords.push({
            movieName: movie.name,
            rating: rating
          });


          await User.findByIdAndUpdate(user._id, {
            movies: newMovie,
            updateRecords: user.updateRecords,
          });
          console.log("Added Movie in User.");
          return;
        }
        i++;
      }
    } catch (err) {
      console.log("Error occured in updateUser  " + err);
    }
  };

  module.exports = {updateDetails} ; 