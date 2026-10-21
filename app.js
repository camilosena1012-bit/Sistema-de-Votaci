const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let movies = [
  {
    id: 1,
    title: "Inception",
    description:
      "Una película de ciencia ficción dirigida por Christopher Nolan",
    votes: 0,
  },
  {
    id: 2,
    title: "Titanic",
    description: "Historia romántica dirigida por James Cameron",
    votes: 0,
  },
  {
    id: 3,
    title: "The Matrix",
    description:
      "Película de acción y ciencia ficción dirigida por los hermanos Wachowski",
    votes: 0,
  },
];

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.post("/vote/:id", (req, res) => {
  const movieId = Number(req.params.id);
  const movie = movies.find((m) => m.id === movieId);
  if(movie){
   movie.votes +=1; 
   res.json({ "message": "Voto registrado correctamente." });
  }else{
    res.status(404).json({ error: "Película no encontrada" });
  }
});

app.get('/movie/:id', (req, res) => {
     const movieId = Number(req.params.id);
     const movie = movies.find((m) => m.id === movieId); 

    if(!movie){
      res.status(404).json({ error: "Película no encontrada" });
    } else {
      res.json(movie);
    }
});

app.get ( '/result', (req, res) => {
 const sortedMovies = [...movies].sort((a, b) => b.votes - a.votes);
 res.json({ results: sortedMovies });
});

app.post('/movies', (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Faltan datos obligatorios (title o description)" });
  }

  const newMovie = {
    id: movies.length + 1,
    title,
    description,
    votes: 0
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.put('/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ message: "Película no encontrada para modificar" });
  }

  const { title, description } = req.body;

  if (title) {
    movie.title = title;
  }
  if (description) {
    movie.description = description;
  }

  res.json({ message: "Película modificada correctamente", movie });
});

app.delete('/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = movies.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Película no encontrada" });
  }

  if (movies[index].votes > 0) {
    return res.status(400).json({ message: "No se puede eliminar una película que ya tiene votos" });
  }

  const deleted = movies.splice(index, 1);
  res.json({ message: "Película eliminada con éxito", deleted });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
