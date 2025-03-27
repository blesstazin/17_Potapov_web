import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function CountriesSection() {
    const [displayedData, setDisplayedData] = useState(null);
    const countries = useSelector((state) => state.api.countries);

    const handleGet = () => {
        setDisplayedData(countries.map(country => `${country.name.common} - ${country.capital?.[0] || 'Нет столицы'}`));
    };

    return (
        <section id="countries-section" className="api-section">
            <p className="api-warning">Внимание, API абсолютно рандомные и отношения к сайту практически не имеют!!!</p>
            <h2>Страны</h2>
            <div className="controls">
                <button onClick={handleGet}>GET</button>
            </div>
            <ul>
                {displayedData ? displayedData.map((item, index) => <li key={index}>{item}</li>) : <li>Нажмите GET для загрузки</li>}
            </ul>
        </section>
    );
}

export default CountriesSection;