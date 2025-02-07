import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/Main.scss'
import LoginPage from "./components/pages/LoginPage";
import Dashboard from "./components/pages/Dashboard";
import HomePage from './components/pages/HomePage';
import Politic from "./components/pages/Politic";
import NoFound from "./components/pages/NoFound";




function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/politic' element={<Politic />} />
        <Route path='*' element={<NoFound />} />
      </Routes>
    </Router>
  );
}

export default App;
