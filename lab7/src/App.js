import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderBlock from './components/HeaderBlock';
import StatsBlock from './components/StatsBlock';
import CollabsBlock from './components/CollabsBlock';
import AlbumsBlock from './components/AlbumsBlock';
import TicketBlock from './components/TicketBlock';
import QuotesBlock from './components/QuotesBlock';
import FooterBlock from './components/FooterBlock';
import NavBlock from './components/NavBlock';
import ApiSection from './components/ApiSection';
import IntroPopup from './components/IntroPopup';
import { ApiProvider } from './context/ApiContext';

const App = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [playMusic, setPlayMusic] = useState(false);

  useEffect(() => {
    if (!showPopup && playMusic) {
      const audio = new Audio('/audio/jennifers_body_kai_angel.mp3');
      audio.loop = true;
      audio.play();
      return () => audio.pause();
    }
  }, [showPopup, playMusic]);

  const handlePopupChoice = (choice) => {
    setPlayMusic(choice);
    setShowPopup(false);
  };

  return (
    <ApiProvider>
      <Router>
        <div className="app">
          {showPopup ? (
            <IntroPopup onChoice={handlePopupChoice} />
          ) : (
            <>
              <HeaderBlock />
              <NavBlock />
              <main>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <StatsBlock />
                        <CollabsBlock />
                        <AlbumsBlock />
                        <TicketBlock />
                        <QuotesBlock />
                      </>
                    }
                  />
                  <Route path="/countries" element={<ApiSection apiKey="countries" title="Страны" />} />
                  <Route path="/users" element={<ApiSection apiKey="users" title="Пользователи" />} />
                  <Route path="/products" element={<ApiSection apiKey="products" title="Продукты" />} />
                </Routes>
              </main>
              <FooterBlock />
            </>
          )}
        </div>
      </Router>
    </ApiProvider>
  );
};

export default App;