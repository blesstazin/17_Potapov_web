import React from 'react';

const QuotesBlock = () => {
    const quotes = [
        'Она в моей голове навсегда (навсегда)',
        'Сколько можно быть тут одному? — я задаю себе question',
        'Красный свет в глазах, я живу во тьме'
    ];

    return (
        <section className="quotes-block">
            <h2>Цитаты из песен</h2>
            <ul>
                {quotes.map((quote, index) => (
                    <li key={index}>"{quote}"</li>
                ))}
            </ul>
        </section>
    );
};

export default QuotesBlock;