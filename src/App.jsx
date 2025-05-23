import { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import { Search } from "./components/Search";
import MovieCard from "./components/MovieCard";
import "./index.css";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState();
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchDebounce, setUseSearchDebounce] = useState();

  useDebounce(() => setUseSearchDebounce(searchTerm), 2000, [searchTerm]);
  const [trendingMovieList, setTrendingMovieList] = useState();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        console.log("Fetched trending moviesdasdas:");
        const response = await getTrendingMovies();
        console.log("Fetched trending movies:", response);
        setTrendingMovieList(response);
      } catch (err) {
        console.error("Trending fetch error:", err);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    fetchMovies(searchDebounce);
  }, [searchDebounce]);

  const fetchMovies = async (query = "") => {
    try {
      setIsLoading(true);
      const endpoint = !query
        ? `${API_BASE_URL}/discover/movie?sort_by=popularity.desc?include_adult=false`
        : `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`;

      const res = await fetch(endpoint, API_OPTIONS);
      const data = await res.json();

      if (data.success === false) {
        setErrorMsg(data.status_message);
      } else {
        setMovieList(data.results);
        if (data.results.length > 0 && query) {
          updateSearchCount(encodeURIComponent(query), data.results[0]);
        }
        setErrorMsg(null);
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main>
        <p className="color-w500">No trending movies found.</p>
        <div className="pattern color-primary" />
        <div className="wrapper">
          <header>
            <h1>
              <img src="./hero.png" alt="Hero Banner " />
              Find <span className="text-gradient  ">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
          </header>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {trendingMovieList && trendingMovieList.length > 0 && (
            <section className="trending overflow-y-auto">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovieList.map((movie, index) => (
                  <li key={movie.id || index} className="trending-movie">
                    <p>{index + 1}</p>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title || `Trending movie ${index + 1}`}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies pt-[20px]">
            <h2>All Movies </h2>
            {isLoading ? (
              <Spinner />
            ) : errorMsg ? (
              <p className="text-red-500 ">{errorMsg}</p>
            ) : (
              <ul>
                {movieList &&
                  movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
