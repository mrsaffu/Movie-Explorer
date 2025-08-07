import React, { useEffect, useState } from "react";
import "./hero.css";

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 15;

  const genreThumbnails = {
    Action: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkb8EBDYaB9pSVQIBHr1OWUjmUF6ouYKrp4muJfjdHSSWZX5K-8oiOzdktpjxqy0DM9cA&usqp=CAU",
    Comedy: "https://static.vecteezy.com/system/resources/thumbnails/010/286/336/small_2x/realistic-open-movie-clapper-open-isolated-on-transparent-background-shown-slate-board-png.png",
    Drama: "https://img.freepik.com/premium-vector/detailed-realistic-movie-clapper-with-copy-space-isolated-white_88653-1419.jpg",
    Horror: "https://img.freepik.com/premium-psd/movie-cinema-icon-3d-illustration-rendering_256361-35.jpg",
    Romance: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNY1hjEt9kUFRMcAExZ1BX0e9s0SENcaR2s9NAhGi8jMLUwP6Z8ttL_uUp-ifSVxRdDT8&usqp=CAU",
    Adventure: "https://cdn3d.iconscout.com/3d/premium/thumb/movie-promotion-3d-icon-download-in-png-blend-fbx-gltf-file-formats--megaphone-advertisement-announcement-advertising-cinema-pack-entertainment-icons-6444192.png",
    Animation: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkb8EBDYaB9pSVQIBHr1OWUjmUF6ouYKrp4muJfjdHSSWZX5K-8oiOzdktpjxqy0DM9cA&usqp=CAU",
    default: "https://static.vecteezy.com/system/resources/thumbnails/010/286/336/small_2x/realistic-open-movie-clapper-open-isolated-on-transparent-background-shown-slate-board-png.png",
  };

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setFilteredMovies(data);
        const genreSet = new Set();
        data.forEach((movie) => {
          movie.genres.forEach((genre) => genreSet.add(genre));
        });
        setGenres(Array.from(genreSet).sort());
      });
  }, []);

  useEffect(() => {
    let filtered = movies;
    if (searchTitle) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) =>
        selectedGenres.some((genre) => movie.genres.includes(genre))
      );
    }
    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [searchTitle, selectedGenres, movies]);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getThumbnail = (genres) => {
    for (let genre of genres) {
      if (genreThumbnails[genre]) return genreThumbnails[genre];
    }
    return genreThumbnails.default;
  };

  return (
    <div className="app">
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🎬 Movie Explorer</h1>
          <p className="hero-subtitle">
            Find your favorite films by title and genre
          </p>
        </div>
      </header>

      <div className="filters">
        <div className="input-group">
          <label htmlFor="search">🔍 Search Title</label>
          <input
            id="search"
            type="text"
            placeholder="e.g. Batman, Avengers, Titanic..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="genre">🎭 Filter by Genre</label>
          <select
            id="genre"
            multiple
            value={selectedGenres}
            onChange={(e) =>
              setSelectedGenres(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="movie-table">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Year</th>
            <th>Cast</th>
            <th>Genres</th>
          </tr>
        </thead>
        <tbody>
          {currentMovies.map((movie, idx) => (
            <tr key={idx}>
              <td>
                {/* <img
                  src={getThumbnail(movie.genres)}
                  alt="thumb"
                  className="thumbnail"
                /> */}
                <img  className="thumbnailimg" src={movie.thumbnail} alt="thumbnail" />
              </td>
              <td>{movie.title}</td>
              <td>{movie.year}</td>
              <td>{movie.cast.join(", ")}</td>
              <td>{movie.genres.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          ◀ Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default Hero;
