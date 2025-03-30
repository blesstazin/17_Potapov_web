import React from 'react';

const AlbumsBlock = () => {
    const albums = [
        { title: 'Heavy Metal 2', cover: '/img/heavy_metal_2.jpg' },
        { title: 'GOD SYSTEM', cover: '/img/god_system.jpg' },
        { title: 'ANGEL MAY CRY', cover: '/img/angel_may_cry.jpg' }
    ];

    return (
        <section className="albums-block">
            <h2>Популярные альбомы</h2>
            <ul>
                {albums.map((album, index) => (
                    <li key={index}>
                        <img src={album.cover} alt={album.title} />
                        <span>{album.title}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default AlbumsBlock;