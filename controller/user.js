const Movie = require("../models/Movie");
const User = require("../models/User");

const userDetails = async (req, res) => {
  try {
    const userDetails = new User({
      name: req.body.name,
      userId: req.body.userId,
      age: req.body.age,
      movies: req.body.movies,
    });
    // Create a program to check if the rating is between 0 to 5 or not .
    if (checkRatingValue(req.body.movies)) {
      return res
        .status(401)
        .json("Rating Must be between 0 and 5 for every movie.");
    }
    updatingRecords(userDetails) ; 
    const savedUser = await userDetails.save();
    addToMovie(req.body.movies, req.body.userId);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(`Error occured in userDetails function : ${err}`);
  }
};

const updatingRecords =  async (user) => {
  try {
    let i = 0 ; 
    while(i < user.movies.length){
      user.updateRecords.push({
        movieName: user.movies[i].name,
        rating: user.movies[i].rating
      });
      i++ ; 
    }
    await User.findByIdAndUpdate(user._id, {
      updateRecords: user.updateRecords,
    });
  } catch (err) {
   console.log("Error occured in updatingRecords function" + err) ;
  }
  }
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

const avgRating = (movie) => {
  let i = 0,
    sum = 0;
  while (i < movie.ratingArray.length) {
    sum = sum + movie.ratingArray[i].rating;
    i++;
  }
  return sum / movie.ratingArray.length;
};

const searchMovie = async (req, res) => {
  try {
    // console.log(req.params.name);
    const searchedMovie = await Movie.find(
      {
        name: {
          $regex: new RegExp(req.params.name),
        },
      },
      {
        _id: 0,
        _v: 0,
      }
    ).limit(10);

    if (searchedMovie.length == 0) {
      return res.status(404).json("Movie not found!!!");
    } else {
      return res.status(200).json(searchedMovie);
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
};

// To update rating first we have to update the rating in Movies(ratingArray , avgRating ) , Users(rating) .

const updateDetails = async (req, res) => {
  try {
    const { movieId, rating, userId } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json("Movie not found!!!");
    }
    let i = 0;
    // console.log(movie.ratingArray.length) ;
    while (i < movie.ratingArray.length) {
      if (movie.ratingArray[i].userId == userId) {
        // movie.ratingArray.splice(i, i);
        movie.ratingArray[i] = {
          userId: userId,
          rating: rating,
        };
        let results = avgRating(movie);
        await Movie.findByIdAndUpdate(movieId, {
          avgRating: results,
          ratingArray: movie.ratingArray,
        });
        updateUser(movie, userId, rating);
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
        // console.log(newMovie) ;
        newMovie.push({
          name: movie.name,
          rating: rating,
        });
        user.updateRecords.push({
          movieName: movie.name,
          rating: rating
        });
        // console.log(newMovie) ;
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
