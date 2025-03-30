import React from 'react';

const StatsBlock = () => {
    const stats = {
        'Настоящее имя': 'Дмитрий Ицков',
        'Дата рождения': '4 февраля 1997',
        'Город': 'Брянск, Россия',
        'Жанр': 'Хип-хоп / Рэп'
    };
    const bio = 'Kai Angel — российский рэп-исполнитель, продюсер и участник дуэта VIPERR. Известен своим уникальным стилем и мрачной эстетикой.';

    return (
        <section className="stats-block">
            <h2>Информация</h2>
            <ul>
                {Object.entries(stats).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                ))}
            </ul>
            <p>{bio}</p>
        </section>
    );
};

export default StatsBlock;