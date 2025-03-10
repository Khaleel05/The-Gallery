import './App.css';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import MovieDetails from './pages/MovieDetails';
import Rankings from './pages/Rankings';


console.log(process.env.REACT_APP_TMDB_API_KEY);

function App() {
  return (
    <div className="App">
      <Router>
       <Routes>
         <Route exact path="/" element={<Login />} />
         <Route exact path="/signup" element={<SignUp />} /> 
         <Route exact path="/home" element={<Home />} />
         <Route exact path ="/details/:id" element={<MovieDetails/>}/>
         <Route exact path = "/rankings" element={<Rankings/>}></Route>
       </Routes>   
     </Router>
    </div>
  );
}

export default App;
