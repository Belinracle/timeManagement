import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

function App() {
  return (
      <div className="App" >
        <Router>
          <Routes>
              <Route path="/" element={<Login/>}/>
              <Route path="/main" element={<Main/>}/>
          </Routes>
        </Router>
      </div>
  );
}

export default App;