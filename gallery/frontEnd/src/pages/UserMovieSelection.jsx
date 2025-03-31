import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Style from './userMovieSelection.module.css';

function UserMovieSelection() {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [userGenres, setUserGenres] = useState([]);
    const [currentGenreIndex, setCurrentGenreIndex] = useState(0);
    const [movies, setMovies] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user's selected genres and movies
    useEffect(() => {
        const fetchUserGenres = async () => {
            try {
                // Fetch user's genres from the backend
                const response = await axios.get('http://localhost:8081/user/userMovieSelection', {
                    withCredentials: true
                });
                
                if (response.data.length === 0) {
                    console.log(response.data);
                    console.log('no data returned!')
                    // If no genres found, redirect to genre selection
                    //navigate('/home');
                    return;
                }

                setUserGenres(response.data);
            } catch (error) {
                console.error('Error fetching user genres:', error);
                //navigate('/home');
                console.log('Error fetching user gneres');
            }
        };

        fetchUserGenres();
    }, [navigate]);

    // Fetch movies for the current genre
    useEffect(() => {
        const fetchMoviesForGenre = async () => {
            if (userGenres.length === 0) return;

            setLoading(true);
            try {
                const genreId = userGenres[currentGenreIndex].genre_id;
                const response = await axios.get(`http://localhost:8081/api/movies?genreId=${genreId}`, {
                    withCredentials: true
                });

                // Randomize and limit to 6 movies
                const randomMovies = response.data
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 6);

                setMovies(randomMovies);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setLoading(false);
            }
        };

        fetchMoviesForGenre();
    }, [userGenres, currentGenreIndex]);

    // Toggle movie selection
    const toggleMovieSelection = (movie) => {
        setSelectedMovies(prev => {
            const isAlreadySelected = prev.some(m => m.id === movie.id);
            
            if (isAlreadySelected) {
                // Remove movie if already selected
                return prev.filter(m => m.id !== movie.id);
            } else {
                // Add movie, limit to 3 selections per genre
                return prev.length < 3 
                    ? [...prev, {
                        id: movie.id, 
                        title: movie.title, 
                        poster_path: movie.poster_path,
                        vote_average: movie.vote_average
                    }] 
                    : prev;
            }
        });
    };

    // Move to next genre or submit favorites
    const handleNext = async () => {
        // Validate movie selection
        if (selectedMovies.length === 0) {
            alert('Please select at least one movie');
            return;
        }

        if (currentGenreIndex < userGenres.length - 1) {
            // Move to next genre
            setCurrentGenreIndex(prev => prev + 1);
            setSelectedMovies([]); // Reset selected movies
        } else {
            // Submit all selected movies to favorites
            try {
                const movieSubmissions = selectedMovies.map(movie => 
                    axios.post('http://localhost:8081/api/user/favorites/add', {
                        movieId: movie.id,
                        title: movie.title,
                        posterPath: movie.poster_path,
                        voteAverage: movie.vote_average
                    }, { withCredentials: true })
                );

                await Promise.all(movieSubmissions);
                
                // Navigate to home after successful submission
                navigate('/home');
            } catch (error) {
                console.error('Error adding favorites:', error);
                alert('Failed to add favorites. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className={Style.loadingContainer}>
                <div className={Style.loader}></div>
                <p>Loading movies...</p>
            </div>
        );
    }

    return (
        <div className={Style.movieSelectionContainer}>
            <h1 style={{color: "white"}}>Select Your Favorite Movies</h1>
            <h2 style={{color: "white"}}>{userGenres[currentGenreIndex]?.genre_name} Genre</h2>
            <p style={{color: "white"}}>Select up to 3 movies ({selectedMovies.length}/3)</p>

            <div className={Style.movieGrid}>
                {movies.map(movie => (
                    <div 
                        key={movie.id} 
                        className={`${Style.movieCard} ${
                            selectedMovies.some(m => m.id === movie.id) ? Style.selected : ''
                        }`}
                        onClick={() => toggleMovieSelection(movie)}
                    >
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title} 
                            className={Style.moviePoster}
                        />
                        <div className={Style.movieTitle}>
                            {movie.title}
                            {selectedMovies.some(m => m.id === movie.id) && (
                                <span className={Style.checkmark}>✓</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button 
                className={Style.nextButton}
                onClick={handleNext}
                disabled={selectedMovies.length === 0}
            >
                {currentGenreIndex < userGenres.length - 1 
                    ? 'Next Genre' 
                    : 'Finish & Go to Home'}
            </button>
        </div>
    );
}

export default UserMovieSelection;