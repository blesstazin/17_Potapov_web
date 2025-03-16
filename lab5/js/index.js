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

function buildSite() {
    const header = new HeaderBlock(
        'header',
        'Kai Angel',
        'Российский рэпер',
        '../img/kai-angel.jpg'
    );
    const stats = new StatsBlock(
        'stats',
        {
            'Настоящее имя': 'Дмитрий Ицков',
            'Дата рождения': '4 февраля 1997',
            'Город': 'Брянск, Россия',
            'Жанр': 'Хип-хоп / Рэп'
        },
        'Kai Angel — российский рэп-исполнитель, продюсер и участник дуэта VIPERR. Известен своим уникальным стилем и мрачной эстетикой.'
    );
    const collabs = new CollabsBlock(
        'collabs',
        [
            '9mice - "LIPSTICK"',
            '9mice - "ОТРАВЛЕН ТОБОЙ"',
            '9mice - "HEAVY METAL"',
            '9mice - "Phoenix"',
            '9mice - "Ринопластика"'
        ]
    );
    const albums = new AlbumsBlock(
        'albums',
        [
            { title: 'Heavy Metal 2', cover: '../img/heavy-metal-2.jpg' },
            { title: 'GOD SYSTEM', cover: '../img/god-system.jpg' },
            { title: 'ANGEL MAY CRY', cover: '../img/angel-may-cry.jpg' }
        ]
    );
    const quotes = new QuotesBlock(
        'quotes',
        [
            'Она в моей голове навсегда (навсегда)',
            'Сколько можно быть тут одному? — я задаю себе question',
            'Красный свет в глазах, я живу во тьме'
        ]
    );
    const footer = new FooterBlock(
        'footer',
        'Kai Angel — восходящая звезда российской сцены',
        'https://music.yandex.ru/artist/16509384'
    );

    const blocks = [stats, collabs, albums, quotes];
    const htmlContent = `
        ${header.getHTML()}
        <main>
            ${blocks.map(block => block.getHTML()).join('')}
        </main>
        ${footer.getHTML()}
    `;
    document.body.innerHTML = htmlContent;
}

window.addEventListener('DOMContentLoaded', buildSite);