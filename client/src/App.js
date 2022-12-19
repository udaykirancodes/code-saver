import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";


import { ToastContainer } from 'react-toastify';

import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Navbar from './Components/Navbar/Navbar';
import Write from './Pages/Write/Write';
import 'react-toastify/dist/ReactToastify.css';
import SinglePage from './Pages/Single/SinglePage';
import Edit from './Pages/Edit/Edit';

function App() {
  const [darkTheme, setDarkTheme] = useState(true);

  const setTheme = () => {
    if (darkTheme) {
      let body = document.querySelector('body');
      body.classList.add('body-dark-theme');
    }
    else {
      let body = document.querySelector('body');
      body.classList.remove('body-dark-theme');
    }
  }

  useEffect(() => {
    setTheme();
  }, [darkTheme])

  return (
    <BrowserRouter>
      <ToastContainer />
      <Navbar darkTheme={darkTheme} setDarkTheme={setDarkTheme} />
      <Routes>
        <Route exact path="/" element={<Home darkTheme={darkTheme} />} />
        <Route exact path="/:slug" element={<SinglePage darkTheme={darkTheme} />} />
        <Route exact path="/edit/:slug" element={<Edit darkTheme={darkTheme} />} />
        <Route exact path="/login" element={<Login darkTheme={darkTheme} />} />
        <Route exact path="/write" element={<Write darkTheme={darkTheme} />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
