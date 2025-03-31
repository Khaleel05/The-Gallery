import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import{ AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import MovieDetails from './pages/MovieDetails';
import Favourites from './pages/Favourites';
import Rankings from './pages/Rankings';
import Profile from './pages/Profile';
import GenreSelection from './pages/GenreSelection';
import UserMovieSelection from './pages/UserMovieSelection';


console.log(process.env.REACT_APP_TMDB_API_KEY);

//Protected route component 
const ProtectedRoute = ({children}) =>{
  const {isAuthenticated, loading } = React.useContext(AuthProvider);

  if (loading){
    return ('loading...');
  }
  if(!isAuthenticated){
    return(<navigate to="/home"/>, console.log('you have not been authenticated'));
  }

  return (children, console.log('you are authenticated'));

};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/genreSelection" element={<GenreSelection/>}/>
            <Route exact path="/userMovieSelection" element={<UserMovieSelection/>}/> 
            <Route 
                exact path="/home" 
                element={
                  
                    <Home />
                  
                } 
              />
            <Route 
                exact path ="/details/:id" 
                element={
                  
                    <MovieDetails/>
                  
                }
              />
            <Route 
                exact path = "/rankings" 
                element={
                    <Rankings/>
                }
              />
              <Route
              exact path = "/trend"
              element={
                <Favourites/>
              }
              />
              <Route
              exact path = "/profile"
              element={
                <Profile/>
              }
              />
          </Routes>   
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
