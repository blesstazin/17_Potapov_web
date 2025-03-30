import React from 'react';

const CollabsBlock = () => {
    const collabs = [
        '9mice - "LIPSTICK"',
        '9mice - "ОТРАВЛЕН ТОБОЙ"',
        '9mice - "HEAVY METAL"',
        '9mice - "Phoenix"',
        '9mice - "Ринопластика"',
        'Егор Крид, 9mice - "HELL"'
    ];

    return (
        <section className="collabs-block">
            <h2>Коллаборации</h2>
            <ul>
                {collabs.map((collab, index) => (
                    <li key={index}>{collab}</li>
                ))}
            </ul>
        </section>
    );
};

export default CollabsBlock;