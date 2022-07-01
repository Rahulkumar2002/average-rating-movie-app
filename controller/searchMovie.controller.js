const Movie = require("../models/movie.models");

// Searching for movies with the movieName in params  inside Movie collection : 

const searchMovie = async (req, res) => {
  try {
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
    res.status(500).json(err);
  }
};

module.exports = { searchMovie };
