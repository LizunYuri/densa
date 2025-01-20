import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/Main.scss'
import LoginPage from "./components/pages/LoginPage";
import Dashboard from "./components/pages/Dashboard";
import HomePage from './components/pages/HomePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
