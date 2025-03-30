import React from 'react';
import { Link } from 'react-router-dom';

const NavBlock = () => {
    return (
        <nav className="nav-block">
            <ul>
                <li><Link to="/">Главная</Link></li>
                <li><Link to="/countries">Страны</Link></li>
                <li><Link to="/users">Пользователи</Link></li>
                <li><Link to="/products">Продукты</Link></li>
            </ul>
        </nav>
    );
};

export default NavBlock;