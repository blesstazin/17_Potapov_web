import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBlock() {
    return (
        <nav className="nav-block">
            <ul>
                <li><NavLink to="/">Главная</NavLink></li>
                <li><NavLink to="/countries">Страны</NavLink></li>
                <li><NavLink to="/users">Пользователи</NavLink></li>
                <li><NavLink to="/products">Продукты</NavLink></li>
            </ul>
        </nav>
    );
}

export default NavBlock;