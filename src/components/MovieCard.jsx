import React from "react";

const MovieCard = ({
  movie: {adult, title, release_date, vote_average, poster_path, original_language },
}) => {
  return (
    adult ? null :
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/No-Poster.png"
        }
        alt={`${title} poster`}
        srcSet=""
      />
      <div className="mt-4">
        <h3>
            {title}
        </h3>
        <div className="content">
            <div className="rating">
                <img src="Rating.svg" alt="" />
                {
                    vote_average ? (
                        <p>{vote_average.toFixed(1)}</p>
                    ) : (
                        <p>Not Rated</p>
                    )
                }
                <span>•</span>
                {
                    original_language ? (
                        <p>{ original_language.toUpperCase()  }</p>
                    ) : (
                        <p>Not Rated</p>
                    )
                }
                <span>•</span>
                  {
                    release_date ? (
                        <p>{ release_date.split('-')[0]}</p>
                    ) : (
                        <p>Not Rated</p>
                    )
                }
                <span>•</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
