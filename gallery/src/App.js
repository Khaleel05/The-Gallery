import './App.css';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';

function App() {
  return (
    <div className="App">
      <Router>
       <Routes>
         <Route exact path="/" element={<Login />} />
         <Route exact path="/signup" element={<SignUp />} /> 
         <Route exact path="/home" element={<Home />} />
       </Routes>   
     </Router>
    </div>
  );
}

export default App;
