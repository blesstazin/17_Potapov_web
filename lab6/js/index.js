class Block {
    constructor(id) {
        this._id = id;
    }

    getHTML() {
        return '<div>Базовый блок</div>';
    }

    getId() {
        return this._id;
    }
}

class HeaderBlock extends Block {
    constructor(id, name, title, imageUrl) {
        super(id);
        this._name = name;
        this._title = title;
        this._imageUrl = imageUrl;
    }

    getHTML() {
        return `
            <header class="header-block" id="${this._id}">
                <img src="${this._imageUrl}" alt="${this._name}">
                <h1>${this._name}</h1>
                <p>${this._title}</p>
            </header>
        `;
    }
}

class StatsBlock extends Block {
    constructor(id, stats, bio) {
        super(id);
        this._stats = stats;
        this._bio = bio;
    }

    getHTML() {
        const statsList = Object.entries(this._stats)
            .map(([key, value]) => `<li>${key}: ${value}</li>`)
            .join('');
        return `
            <section class="stats-block" id="${this._id}">
                <h2>Информация</h2>
                <ul>${statsList}</ul>
                <p>${this._bio}</p>
            </section>
        `;
    }
}

class CollabsBlock extends Block {
    constructor(id, collabs) {
        super(id);
        this._collabs = collabs;
    }

    getHTML() {
        const collabsList = this._collabs
            .map(collab => `<li>${collab}</li>`)
            .join('');
        return `
            <section class="collabs-block" id="${this._id}">
                <h2>Коллаборации</h2>
                <ul>${collabsList}</ul>
            </section>
        `;
    }
}

class AlbumsBlock extends Block {
    constructor(id, albums) {
        super(id);
        this._albums = albums;
    }

    getHTML() {
        const albumsList = this._albums
            .map(album => `
                <li>
                    <img src="${album.cover}" alt="${album.title}">
                    <span>${album.title}</span>
                </li>
            `)
            .join('');
        return `
            <section class="albums-block" id="${this._id}">
                <h2>Популярные альбомы</h2>
                <ul>${albumsList}</ul>
            </section>
        `;
    }
}

class TicketBlock extends Block {
    constructor(id, imageUrl) {
        super(id);
        this._imageUrl = imageUrl;
    }

    getHTML() {
        return `
            <section class="ticket-block" id="${this._id}">
                <h2>Желанный многими билет на Kai Angel</h2>
                <div class="ticket-wrapper">
                    <img src="${this._imageUrl}" alt="Билет на концерт Kai Angel">
                </div>
            </section>
        `;
    }
}

class QuotesBlock extends Block {
    constructor(id, quotes) {
        super(id);
        this._quotes = quotes;
    }

    getHTML() {
        const quotesList = this._quotes
            .map(quote => `<li>"${quote}"</li>`)
            .join('');
        return `
            <section class="quotes-block" id="${this._id}">
                <h2>Цитаты из песен</h2>
                <ul>${quotesList}</ul>
            </section>
        `;
    }
}

class FooterBlock extends Block {
    constructor(id, text, link) {
        super(id);
        this._text = text;
        this._link = link;
    }

    getHTML() {
        return `
            <footer class="footer-block" id="${this._id}">
                <p>${this._text} | <a href="${this._link}" target="_blank">Слушать на YandexMusic</a></p>
            </footer>
        `;
    }
}

function setupCountriesSection() {
    const countriesList = document.getElementById('countries-list');
    const loader = document.querySelector('#countries-section .loader');
    const getButton = document.querySelector('#countries-section button[data-method="get"]');

    getButton.addEventListener('click', async () => {
        countriesList.innerHTML = '<li>Выполняется...</li>';

        try {
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital');
            const countries = await response.json();
            loader.remove();
            countriesList.innerHTML = countries.slice(0, 5).map(country => `<li>${country.name.common} - ${country.capital?.[0] || 'Нет столицы'}</li>`).join('');
        } catch (error) {
            loader.remove();
            countriesList.innerHTML = `<li>Ошибка: ${error.message}</li>`;
        }
    });
}

function setupUsersSection() {
    const usersList = document.getElementById('users-list');
    const loader = document.querySelector('#users-section .loader');
    const buttons = document.querySelectorAll('#users-section .controls button');

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            const method = button.dataset.method;
            usersList.innerHTML = '<li>Выполняется...</li>';

            try {
                if (method === 'get') {
                    const response = await fetch('https://reqres.in/api/users?page=1&per_page=5');
                    const { data: users } = await response.json();
                    loader.remove();
                    usersList.innerHTML = users.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join('');
                } else if (method === 'post') {
                    const response = await fetch('https://reqres.in/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: 'Kai' })
                    });
                    const data = await response.json();
                    loader.remove();
                    usersList.innerHTML = `<li>Создан пользователь: ${data.name}</li>`;
                } else if (method === 'put') {
                    const response = await fetch('https://reqres.in/api/users/2', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: 'Kai Angel' })
                    });
                    const data = await response.json();
                    loader.remove();
                    usersList.innerHTML = `<li>Обновлен пользователь: ${data.name}</li>`;
                } else if (method === 'patch') {
                    const response = await fetch('https://reqres.in/api/users/2', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: '9mice?????' })
                    });
                    const data = await response.json();
                    loader.remove();
                    usersList.innerHTML = `<li>Изменен пользователь: ${data.name}</li>`;
                } else if (method === 'delete') {
                    await fetch('https://reqres.in/api/users/2', {
                        method: 'DELETE'
                    });
                    loader.remove();
                    usersList.innerHTML = `<li>Пользователь удален((</li>`;
                }
            } catch (error) {
                loader.remove();
                usersList.innerHTML = `<li>Ошибка: ${error.message}</li>`;
            }
        });
    });
}

function setupProductsSection() {
    const productsList = document.getElementById('products-list');
    const loader = document.querySelector('#products-section .loader');
    const buttons = document.querySelectorAll('#products-section .controls button');

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            const method = button.dataset.method;
            productsList.innerHTML = '<li>Выполняется...</li>';

            try {
                if (method === 'get') {
                    const response = await fetch('https://dummyjson.com/products?limit=5');
                    const { products } = await response.json();
                    loader.remove();
                    productsList.innerHTML = products.map(product => `<li>${product.title}</li>`).join('');
                } else if (method === 'post') {
                    const response = await fetch('https://dummyjson.com/products/add', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: 'зипочка vetements' })
                    });
                    const data = await response.json();
                    loader.remove();
                    productsList.innerHTML = `<li>Создан продукт: ${data.title}</li>`;
                } else if (method === 'put') {
                    const response = await fetch('https://dummyjson.com/products/1', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: 'новая зипоччччка' })
                    });
                    const data = await response.json();
                    loader.remove();
                    productsList.innerHTML = `<li>Обновлен продукт: ${data.title}</li>`;
                } else if (method === 'patch') {
                    const response = await fetch('https://dummyjson.com/products/1', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ price: 99999 })
                    });
                    const data = await response.json();
                    loader.remove();
                    productsList.innerHTML = `<li>Изменен продукт, новая цена: ${data.price} ₽</li>`;
                } else if (method === 'delete') {
                    const response = await fetch('https://dummyjson.com/products/1', {
                        method: 'DELETE'
                    });
                    const data = await response.json();
                    loader.remove();
                    productsList.innerHTML = `<li>Продукт удален (ID: ${data.id}) ( а зачем тебе его айдишник?)) )</li>`;
                }
            } catch (error) {
                loader.remove();
                productsList.innerHTML = `<li>Ошибка: ${error.message}</li>`;
            }
        });
    });
}

function buildSite(playMusic = false) {
    const blocks = [
        new HeaderBlock('header', 'Kai Angel', 'Российский рэпер', './img/kai_angel.jpg'),
        new StatsBlock('stats', {
            'Настоящее имя': 'Дмитрий Ицков',
            'Дата рождения': '4 февраля 1997',
            'Город': 'Брянск, Россия',
            'Жанр': 'Хип-хоп / Рэп'
        }, 'Kai Angel — российский рэп-исполнитель, продюсер и участник дуэта VIPERR. Известен своим уникальным стилем и мрачной эстетикой.'),
        new CollabsBlock('collabs', [
            '9mice - "LIPSTICK"',
            '9mice - "ОТРАВЛЕН ТОБОЙ"',
            '9mice - "HEAVY METAL"',
            '9mice - "Phoenix"',
            '9mice - "Ринопластика"',
            'Егор Крид, 9mice - "HELL"'
        ]),
        new AlbumsBlock('albums', [
            { title: 'Heavy Metal 2', cover: './img/heavy_metal_2.jpg' },
            { title: 'GOD SYSTEM', cover: './img/god_system.jpg' },
            { title: 'ANGEL MAY CRY', cover: './img/angel_may_cry.jpg' }
        ]),
        new TicketBlock('ticket', './img/kai_angel_ticket.jpg'),
        new QuotesBlock('quotes', [
            'Она в моей голове навсегда (навсегда)',
            'Сколько можно быть тут одному? — я задаю себе question',
            'Красный свет в глазах, я живу во тьме'
        ]),
        new FooterBlock('footer', 'Kai Angel — восходящая звезда российской сцены', 'https://music.yandex.ru/artist/16509384')
    ];

    const mainBlocks = blocks.filter(block => !(block instanceof HeaderBlock) && !(block instanceof FooterBlock));
    const headerBlock = blocks.find(block => block instanceof HeaderBlock);
    const footerBlock = blocks.find(block => block instanceof FooterBlock);

    document.body.innerHTML = `
        ${headerBlock.getHTML()}
        <nav class="nav-block">
            <ul>
                <li><a href="#countries-section">Страны</a></li>
                <li><a href="#users-section">Пользователи</a></li>
                <li><a href="#products-section">Продукты</a></li>
            </ul>
        </nav>
        <main>
            ${mainBlocks.map(block => block.getHTML()).join('')}
            <section id="countries-section" class="api-section">
                <p class="api-warning">Внимание, API абсолютно рандомные и отношения к сайту практически не имеют!!!</p>
                <h2>Страны</h2>
                <p class="loader">Загрузка стран</p>
                <div class="controls">
                    <button data-method="get">GET</button>
                </div>
                <ul id="countries-list"></ul>
            </section>
            <section id="users-section" class="api-section">
                <h2>Пользователи</h2>
                <p class="loader">Загрузка пользователей</p>
                <div class="controls">
                    <button data-method="get">GET</button>
                    <button data-method="post">POST</button>
                    <button data-method="put">PUT</button>
                    <button data-method="patch">PATCH</button>
                    <button data-method="delete">DELETE</button>
                </div>
                <ul id="users-list"></ul>
            </section>
            <section id="products-section" class="api-section">
                <h2>Продукты</h2>
                <p class="loader">Загрузка продуктов</p>
                <div class="controls">
                    <button data-method="get">GET</button>
                    <button data-method="post">POST</button>
                    <button data-method="put">PUT</button>
                    <button data-method="patch">PATCH</button>
                    <button data-method="delete">DELETE</button>
                </div>
                <ul id="products-list"></ul>
            </section>
        </main>
        ${footerBlock.getHTML()}
        ${playMusic ? '<audio id="background-music" autoplay loop src="./audio/9mice_anora.mp3"></audio>' : ''}
    `;

    setupCountriesSection();
    setupUsersSection();
    setupProductsSection();
}

function showIntroPopup() {
    document.body.innerHTML = `
        <div id="intro-popup" class="popup">
            <div class="popup-content">
                <h2>Погрузиться глубже?</h2>
                <h3>Песня была изменена</h3>
                <p class="warning">⚠️ Внимание: при нажатии на кнопку "Да", Вы автоматически соглашаетесь с тем, что сейчас может быть воспроизведена ненормативная лексика!</p>
                <button id="yes-btn">Да (убавьте звук, если он на максимуме)</button>
                <button id="no-btn">Нет (очень жаль)</button>
            </div>
        </div>
    `;

    document.getElementById('yes-btn').addEventListener('click', () => {
        buildSite(true);
    });

    document.getElementById('no-btn').addEventListener('click', () => {
        buildSite(false);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    showIntroPopup();
});