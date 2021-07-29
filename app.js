const express = require("express");
const path = require("path");
const app = express();
module.exports = app;
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
const initializeServerAndDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started");
    });
  } catch (e) {
    console.log(`Error: ${e.message}`);
    process.exit(1);
  }
};
initializeServerAndDatabase();

//API 1
app.get("/movies/", async (request, response) => {
  const getMovieNameQuery = `
        SELECT movie_name, movie_id
        FROM movie;
    `;
  const movieArray = await db.all(getMovieNameQuery);
  response.send(movieArray);
});

//API 2
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const addMovieQuery = `
        INSERT INTO 
        movie (director_id, movie_name, lead_actor)
        VALUES 
        (
            ${movieDetails.directorId},
            '${movieDetails.movieName}',
            '${movieDetails.leadActor}'
        );
    `;
  await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

//API 3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
        SELECT *
        FROM movie
        WHERE movie_id = ${movieId};
    `;
  const movieDetails = await db.get(getMovieQuery);
  response.send(movieDetails);
});

//API 4
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const updateMovieQuery = `
       UPDATE movie
       SET
        director_id = ${movieDetails.directorId},
        movie_name = '${movieDetails.movieName}',
        lead_actor = '${movieDetails.leadActor}';
    `;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

//API 5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
       DELETE FROM
       movie
       WHERE movie_id = ${movieId};
    `;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//API 6
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
        SELECT *
        FROM director;
    `;
  const directorArray = await db.all(getDirectorsQuery);
  response.send(directorArray);
});

//API 7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMovieNamesOfDirectorQuery = `
        SELECT DISTINCT movie_name
        FROM movie
        WHERE director_id = ${directorId};
    `;
  const movieNames = await db.all(getMovieNamesOfDirectorQuery);
  response.send(movieNames);
});
