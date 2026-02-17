import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import LocationModal from './components/LocationModal';
import Home from './pages/Home';
import Search from './pages/Search';
import Comparison from './pages/Comparison';
import Cart from './pages/Cart';
import About from './pages/About';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed header */
`;

function App() {
  return (
    <AppContainer>
      <Header />
      <LocationModal />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

export default App;
