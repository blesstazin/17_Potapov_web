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

const apiHandlers = {
    countries: {
        url: 'https://restcountries.com/v3.1/all?fields=name,capital',
        methods: {
            get: async (listElement) => {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital', {
                    method: 'GET'
                });
                const data = await response.json();
                const limitedData = data.slice(0, 5);
                listElement.innerHTML = limitedData.map(country => `<li>${country.name.common} - ${country.capital?.[0] || 'Нет столицы'}</li>`).join('');
            }
        }
    },
    users: {
        url: 'https://reqres.in/api/users',
        methods: {
            get: async (listElement) => {
                const response = await fetch('https://reqres.in/api/users?per_page=5', {
                    method: 'GET'
                });
                const { data } = await response.json();
                listElement.innerHTML = data.map(user => `
                    <li>
                        ${user.first_name} ${user.last_name} (ID: ${user.id}${user.isCustom ? ', Созданный' : ''})
                        ${!user.isCustom ? `
                            <button class="patch-btn" data-id="${user.id}">Изменить</button>
                            <button class="delete-btn" data-id="${user.id}">Удалить</button>
                        ` : ''}
                    </li>
                `).join('');
            },
            post: async (listElement) => {
                const name = prompt('Введите имя нового пользователя (Внимание: созданных пользователей нельзя будет изменить или удалить):') || 'Kai';
                const response = await fetch('https://reqres.in/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                });
                const newUser = await response.json();
                const nameParts = name.split(' ');
                const formattedUser = {
                    id: newUser.id || Date.now(),
                    first_name: nameParts[0],
                    last_name: nameParts[1] || '',
                    isCustom: true
                };
                const updatedResponse = await fetch('https://reqres.in/api/users?per_page=5', { method: 'GET' });
                const { data } = await updatedResponse.json();
                data.unshift(formattedUser);
                listElement.innerHTML = data.slice(0, 5).map(user => `
                    <li>
                        ${user.first_name} ${user.last_name} (ID: ${user.id}${user.isCustom ? ', Созданный' : ''})
                        ${!user.isCustom ? `
                            <button class="patch-btn" data-id="${user.id}">Изменить</button>
                            <button class="delete-btn" data-id="${user.id}">Удалить</button>
                        ` : ''}
                    </li>
                `).join('');
            },
            put: async (listElement) => {
                const id = prompt('Введите ID пользователя для обновления:');
                if (!id) return;
                const newName = prompt('Введите новое имя:');
                if (!newName) return;

                const response = await fetch(`https://reqres.in/api/users/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName })
                });
                const updatedUser = await response.json();
                const updatedResponse = await fetch('https://reqres.in/api/users?per_page=5', { method: 'GET' });
                const { data } = await updatedResponse.json();
                const userIndex = data.findIndex(user => user.id === parseInt(id));
                if (userIndex !== -1 && !data[userIndex].isCustom) {
                    const nameParts = newName.split(' ');
                    data[userIndex] = {
                        ...data[userIndex],
                        first_name: nameParts[0],
                        last_name: nameParts[1] || ''
                    };
                }
                listElement.innerHTML = data.map(user => `
                    <li>
                        ${user.first_name} ${user.last_name} (ID: ${user.id}${user.isCustom ? ', Созданный' : ''})
                        ${!user.isCustom ? `
                            <button class="patch-btn" data-id="${user.id}">Изменить</button>
                            <button class="delete-btn" data-id="${user.id}">Удалить</button>
                        ` : ''}
                    </li>
                `).join('');
            },
            patch: async (listElement, id) => {
                const userResponse = await fetch(`https://reqres.in/api/users/${id}`, { method: 'GET' });
                const user = await userResponse.json();
                if (user.isCustom) {
                    alert('Нельзя изменить созданного пользователя!');
                    return;
                }

                const newName = prompt('Введите новое имя:');
                if (!newName) return;

                const response = await fetch(`https://reqres.in/api/users/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName })
                });
                const updatedUser = await response.json();

                const updatedResponse = await fetch('https://reqres.in/api/users?per_page=5', { method: 'GET' });
                const { data } = await updatedResponse.json();
                const userIndex = data.findIndex(user => user.id === parseInt(id));
                if (userIndex !== -1) {
                    data[userIndex].first_name = newName;
                }
                listElement.innerHTML = data.map(user => `
                    <li>
                        ${user.first_name} ${user.last_name} (ID: ${user.id}${user.isCustom ? ', Созданный' : ''})
                        ${!user.isCustom ? `
                            <button class="patch-btn" data-id="${user.id}">Изменить</button>
                            <button class="delete-btn" data-id="${user.id}">Удалить</button>
                        ` : ''}
                    </li>
                `).join('');
            },
            delete: async (listElement, id) => {
                const userResponse = await fetch(`https://reqres.in/api/users/${id}`, { method: 'GET' });
                const user = await userResponse.json();
                if (user.isCustom) {
                    alert('Нельзя удалить созданного пользователя!');
                    return;
                }

                await fetch(`https://reqres.in/api/users/${id}`, {
                    method: 'DELETE'
                });

                const updatedResponse = await fetch('https://reqres.in/api/users?per_page=5', { method: 'GET' });
                const { data } = await updatedResponse.json();
                listElement.innerHTML = data.map(user => `
                    <li>
                        ${user.first_name} ${user.last_name} (ID: ${user.id}${user.isCustom ? ', Созданный' : ''})
                        ${!user.isCustom ? `
                            <button class="patch-btn" data-id="${user.id}">Изменить</button>
                            <button class="delete-btn" data-id="${user.id}">Удалить</button>
                        ` : ''}
                    </li>
                `).join('');
            }
        }
    },
    products: {
        url: 'https://dummyjson.com/products',
        methods: {
            get: async (listElement) => {
                const response = await fetch('https://dummyjson.com/products?limit=5', {
                    method: 'GET'
                });
                const { products } = await response.json();
                listElement.innerHTML = products.map(product => `
                    <li>
                        ${product.title} (ID: ${product.id}) [${product.price || 0} $]
                        <button class="patch-btn" data-id="${product.id}">Изменить</button>
                        <button class="delete-btn" data-id="${product.id}">Удалить</button>
                    </li>
                `).join('');
            },
            post: async (listElement) => {
                const title = prompt('Введите название нового продукта:') || 'зипочка vetements';
                const response = await fetch('https://dummyjson.com/products/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title })
                });
                const newProduct = await response.json();
                newProduct.price = newProduct.price || 0;

                const updatedResponse = await fetch('https://dummyjson.com/products?limit=5', { method: 'GET' });
                const { products } = await updatedResponse.json();
                products.unshift(newProduct);
                listElement.innerHTML = products.map(product => `
                    <li>
                        ${product.title} (ID: ${product.id}) [${product.price || 0} $]
                        <button class="patch-btn" data-id="${product.id}">Изменить</button>
                        <button class="delete-btn" data-id="${product.id}">Удалить</button>
                    </li>
                `).join('');
            },
            put: async (listElement) => {
                const id = prompt('Введите ID продукта для обновления:');
                if (!id) return;
                const newTitle = prompt('Введите новое название:');
                if (!newTitle) return;

                const response = await fetch(`https://dummyjson.com/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle })
                });
                const updatedProduct = await response.json();
                const updatedResponse = await fetch('https://dummyjson.com/products?limit=5', { method: 'GET' });
                const { products } = await updatedResponse.json();
                const productIndex = products.findIndex(product => product.id === parseInt(id));
                if (productIndex !== -1) {
                    products[productIndex] = updatedProduct;
                }
                listElement.innerHTML = products.map(product => `
                    <li>
                        ${product.title} (ID: ${product.id}) [${product.price || 0} $]
                        <button class="patch-btn" data-id="${product.id}">Изменить</button>
                        <button class="delete-btn" data-id="${product.id}">Удалить</button>
                    </li>
                `).join('');
            },
            patch: async (listElement, id) => {
                const newPrice = prompt('Введите новую цену:');
                if (!newPrice) return;

                const response = await fetch(`https://dummyjson.com/products/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ price: parseInt(newPrice) })
                });
                const updatedProduct = await response.json();
                const updatedResponse = await fetch('https://dummyjson.com/products?limit=5', { method: 'GET' });
                const { products } = await updatedResponse.json();
                const productIndex = products.findIndex(product => product.id === parseInt(id));
                if (productIndex !== -1) {
                    products[productIndex] = updatedProduct;
                }
                listElement.innerHTML = products.map(product => `
                    <li>
                        ${product.title} (ID: ${product.id}) [${product.price || 0} $]
                        <button class="patch-btn" data-id="${product.id}">Изменить</button>
                        <button class="delete-btn" data-id="${product.id}">Удалить</button>
                    </li>
                `).join('');
            },
            delete: async (listElement, id) => {
                await fetch(`https://dummyjson.com/products/${id}`, {
                    method: 'DELETE'
                });
                const updatedResponse = await fetch('https://dummyjson.com/products?limit=5', { method: 'GET' });
                const { products } = await updatedResponse.json();
                listElement.innerHTML = products.map(product => `
                    <li>
                        ${product.title} (ID: ${product.id}) [${product.price || 0} $]
                        <button class="patch-btn" data-id="${product.id}">Изменить</button>
                        <button class="delete-btn" data-id="${product.id}">Удалить</button>
                    </li>
                `).join('');
            }
        }
    }
};

function setupApiSection(sectionId, apiKey) {
    const listElement = document.getElementById(`${sectionId}-list`);
    const loader = document.querySelector(`#${sectionId}-section .loader`);
    const buttons = document.querySelectorAll(`#${sectionId}-section .controls button`);

    const initialLoad = async () => {
        listElement.innerHTML = '<li>Выполняется...</li>';
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
            await apiHandlers[apiKey].methods.get(listElement);
            loader.remove();
            setupActions();
        } catch (error) {
            loader.remove();
            listElement.innerHTML = `<li>Ошибка: ${error.message}</li>`;
        }
    };

    initialLoad();

    buttons.forEach(button => {
        const method = button.dataset.method;
        if (method) {
            button.addEventListener('click', async () => {
                listElement.innerHTML = '<li>Выполняется...</li>';
                await new Promise(resolve => setTimeout(resolve, 500));
                try {
                    await apiHandlers[apiKey].methods[method](listElement);
                    loader.remove();
                    setupActions();
                } catch (error) {
                    loader.remove();
                    listElement.innerHTML = `<li>Ошибка: ${error.message}</li>`;
                }
            });
        }
    });

    function setupActions() {
        document.querySelectorAll(`#${sectionId}-list .patch-btn`).forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                listElement.innerHTML = '<li>Выполняется...</li>';
                await new Promise(resolve => setTimeout(resolve, 500));
                try {
                    await apiHandlers[apiKey].methods.patch(listElement, id);
                    loader.remove();
                    setupActions();
                } catch (error) {
                    loader.remove();
                    listElement.innerHTML = `<li>Ошибка: ${error.message}</li>`;
                }
            });
        });

        document.querySelectorAll(`#${sectionId}-list .delete-btn`).forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                listElement.innerHTML = '<li>Выполняется...</li>';
                await new Promise(resolve => setTimeout(resolve, 500));
                try {
                    await apiHandlers[apiKey].methods.delete(listElement, id);
                    loader.remove();
                    setupActions();
                } catch (error) {
                    loader.remove();
                    listElement.innerHTML = `<li>Ошибка: ${error.message}</li>`;
                }
            });
        });
    }
}

function buildSite(playMusic = false) {
    const blocks = [
        { id: 'header', create: () => new HeaderBlock('header', 'Kai Angel', 'Российский рэпер', './img/kai_angel.jpg') },
        {
            id: 'stats',
            create: () =>
                new StatsBlock('stats', {
                    'Настоящее имя': 'Дмитрий Ицков',
                    'Дата рождения': '4 февраля 1997',
                    'Город': 'Брянск, Россия',
                    'Жанр': 'Хип-хоп / Рэп'
                }, 'Kai Angel — российский рэп-исполнитель, продюсер и участник дуэта VIPERR. Известен своим уникальным стилем и мрачной эстетикой.')
        },
        {
            id: 'collabs',
            create: () =>
                new CollabsBlock('collabs', [
                    '9mice - "LIPSTICK"',
                    '9mice - "ОТРАВЛЕН ТОБОЙ"',
                    '9mice - "HEAVY METAL"',
                    '9mice - "Phoenix"',
                    '9mice - "Ринопластика"',
                    'Егор Крид, 9mice - "HELL"'
                ])
        },
        {
            id: 'albums',
            create: () =>
                new AlbumsBlock('albums', [
                    { title: 'Heavy Metal 2', cover: './img/heavy_metal_2.jpg' },
                    { title: 'GOD SYSTEM', cover: './img/god_system.jpg' },
                    { title: 'ANGEL MAY CRY', cover: './img/angel_may_cry.jpg' }
                ])
        },
        { id: 'ticket', create: () => new TicketBlock('ticket', './img/kai_angel_ticket.jpg') },
        {
            id: 'quotes',
            create: () =>
                new QuotesBlock('quotes', [
                    'Она в моей голове навсегда (навсегда)',
                    'Сколько можно быть тут одному? — я задаю себе question',
                    'Красный свет в глазах, я живу во тьме'
                ])
        },
        { id: 'footer', create: () => new FooterBlock('footer', 'Kai Angel — восходящая звезда российской сцены', 'https://music.yandex.ru/artist/16509384') }
    ];

    const mainBlocks = blocks.filter(block => block.id !== 'header' && block.id !== 'footer');
    const headerBlock = blocks.find(block => block.id === 'header');
    const footerBlock = blocks.find(block => block.id === 'footer');

    document.body.innerHTML = `
        ${headerBlock.create().getHTML()}
        <nav class="nav-block">
            <ul>
                <li><a href="#countries-section">Страны</a></li>
                <li><a href="#users-section">Пользователи</a></li>
                <li><a href="#products-section">Продукты</a></li>
            </ul>
        </nav>
        <main>
            ${mainBlocks.map(block => block.create().getHTML()).join('')}
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
                </div>
                <ul id="products-list"></ul>
            </section>
        </main>
        ${footerBlock.create().getHTML()}
        ${playMusic ? '<audio id="background-music" autoplay loop src="./audio/9mice_anora.mp3"></audio>' : ''}
    `;

    setupApiSection('countries', 'countries');
    setupApiSection('users', 'users');
    setupApiSection('products', 'products');
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