import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './pHeader/Header';
import Feed from './pFeed/Feed';
import Profile from './pProfile/Profile';
import ProfileDinamico from './ProfileDinamico';

function App() {
  return (
    <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/"></Route>
          <Route path="/feed" element={<Feed/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/profiledinamico" element={<ProfileDinamico/>}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
