import { Request, Response } from "express";
import Movies from "../models/movies";

export async function getMovies(req: Request, res: Response) {
  try {
    const movies = await Movies.find();
    res.send(movies)
  } catch (e) {
    res.send({ message: "There was a problem getting the movies." })
  }
}

export async function getMovieById(req: Request, res: Response) {
  try {
    const movieId = req.params.movieId
    console.log(req.params)
    const foundMovie = await Movies.findById(movieId)
    res.send(foundMovie)
  } catch (e) {
    console.log(e)
    res.send({ message: "Movie not found. Did you provide a valid movieId?" })
  }
}

export async function createMovie(req: Request, res: Response) {
  // ! Here, to FIX createMovie, we needed to add the currentUser before
  // ! making the movie.
  req.body.user = res.locals.currentUser
  try {
    const movie = await Movies.create(req.body)
    res.send(movie)
  } catch (e) {
    console.log(e)
    res.send({ message: "There was a problem creating your movie. Check you're providing all required fields." })
  }
}

export async function deleteMovie(req: Request, res: Response) {
  try {
    // ! Using the movie we're deleting, get the user from that movie.
    const movieToDelete = await Movies.findById(req.params.movieId)
    // ! If the movie doesn't exist, no movie found.
    if (!movieToDelete) {
      return res.send({ message: 'No movie found.' })
    }
    // ? console.logging is very helpful.
    console.log("currentUserID: ", res.locals.currentUser._id)
    console.log("movie to delete: ", movieToDelete)
    console.log("movieUserID: ", movieToDelete.user)

    // ! If the current User id equals to movie user id, delete the movie
    if (res.locals.currentUser._id.equals(movieToDelete.user)) {
      const movieId = req.params.movieId
      const deletedMovie = await Movies.findByIdAndDelete(movieId)
      return res.send(deletedMovie)
    } else {
      return res.send({ message: "You are not authorized to delete this movie." })
    } 
  } catch (e) {
    res.send({ message: "There was a problem deleting your movie." })
  }
}

export async function updateMovie(req: Request, res: Response) {
  try {
    const movieId = req.params.movieId
    const update = req.body
    const updatedMovie = await Movies.findByIdAndUpdate(movieId, update, { new: true })
    res.send(updatedMovie)
  } catch (e) {
    res.send({ message: "There was a problem updating your movie." })
  }
}