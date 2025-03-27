import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCountries, setUsers, setProducts } from './redux/apiSlice';
import HeaderBlock from './components/HeaderBlock';
import NavBlock from './components/NavBlock';
import StatsBlock from './components/StatsBlock';
import CollabsBlock from './components/CollabsBlock';
import AlbumsBlock from './components/AlbumsBlock';
import TicketBlock from './components/TicketBlock';
import QuotesBlock from './components/QuotesBlock';
import FooterBlock from './components/FooterBlock';
import CountriesSection from './components/CountriesSection';
import UsersSection from './components/UsersSection';
import ProductsSection from './components/ProductsSection';

function IntroPopup({ onChoice }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Погрузиться глубже?</h2>
        <h3>Песня была вновь изменена</h3>
        <p className="warning">
          ⚠️ Внимание: при нажатии на кнопку "Да", Вы автоматически соглашаетесь с тем, что сейчас может быть воспроизведена ненормативная лексика!
        </p>
        <button onClick={() => onChoice(true)}>Да (убавьте звук, если он на максимуме)</button>
        <button onClick={() => onChoice(false)}>Нет (очень жаль)</button>
      </div>
    </div>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [playMusic, setPlayMusic] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Предзагрузка данных из API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const countriesRes = await fetch('https://restcountries.com/v3.1/all?fields=name,capital');
        const countries = await countriesRes.json();
        dispatch(setCountries(countries.slice(0, 5)));

        const usersRes = await fetch('https://reqres.in/api/users?page=1&per_page=5');
        const { data: users } = await usersRes.json();
        dispatch(setUsers(users));

        const productsRes = await fetch('https://dummyjson.com/products?limit=5');
        const { products } = await productsRes.json();
        dispatch(setProducts(products));
      } catch (error) {
        console.error('Ошибка при предзагрузке данных:', error);
      }
    };
    fetchInitialData();
  }, [dispatch]);

  const handleChoice = (choice) => {
    setPlayMusic(choice);
    setShowIntro(false);
    navigate('/');
  };

  return (
    <>
      {showIntro ? (
        <IntroPopup onChoice={handleChoice} />
      ) : (
        <>
          <HeaderBlock />
          <NavBlock />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <StatsBlock />
                  <CollabsBlock />
                  <AlbumsBlock />
                  <TicketBlock />
                  <QuotesBlock />
                </>
              } />
              <Route path="/countries" element={<CountriesSection />} />
              <Route path="/users" element={<UsersSection />} />
              <Route path="/products" element={<ProductsSection />} />
            </Routes>
          </main>
          <FooterBlock />
          {playMusic && <audio id="background-music" autoPlay loop src="/audio/jennifers_body_kai_angel.mp3" />}
        </>
      )}
    </>
  );
}

export default App;