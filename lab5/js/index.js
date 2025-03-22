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

function loadBlocks() {
    const savedData = localStorage.getItem('kaiAngelBlocks');
    if (savedData) {
        const data = JSON.parse(savedData);
        return data.map(item => {
            switch (item.type) {
                case 'header': return new HeaderBlock(item.id, item.name, item.title, item.imageUrl);
                case 'stats': return new StatsBlock(item.id, item.stats, item.bio);
                case 'collabs': return new CollabsBlock(item.id, item.collabs);
                case 'albums': return new AlbumsBlock(item.id, item.albums);
                case 'ticket': return new TicketBlock(item.id, item.imageUrl);
                case 'quotes': return new QuotesBlock(item.id, item.quotes);
                case 'footer': return new FooterBlock(item.id, item.text, item.link);
            }
        });
    }
    return null;
}

function saveBlocks(blocks) {
    const data = blocks.map(block => {
        if (block instanceof HeaderBlock) return { type: 'header', id: block._id, name: block._name, title: block._title, imageUrl: block._imageUrl };
        if (block instanceof StatsBlock) return { type: 'stats', id: block._id, stats: block._stats, bio: block._bio };
        if (block instanceof CollabsBlock) return { type: 'collabs', id: block._id, collabs: block._collabs };
        if (block instanceof AlbumsBlock) return { type: 'albums', id: block._id, albums: block._albums };
        if (block instanceof TicketBlock) return { type: 'ticket', id: block._id, imageUrl: block._imageUrl };
        if (block instanceof QuotesBlock) return { type: 'quotes', id: block._id, quotes: block._quotes };
        if (block instanceof FooterBlock) return { type: 'footer', id: block._id, text: block._text, link: block._link };
    });
    localStorage.setItem('kaiAngelBlocks', JSON.stringify(data));
}

function buildSite(playMusic = false) {
    let blocks = loadBlocks();
    if (!blocks) {
        blocks = [
            new HeaderBlock('header', 'Kai Angel', 'Российский рэпер', 'img/kai_angel.jpg'),
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
                '9mice - "Ринопластика"'
            ]),
            new AlbumsBlock('albums', [
                { title: 'Heavy Metal 2', cover: 'img/heavy_metal_2.jpg' },
                { title: 'GOD SYSTEM', cover: 'img/god_system.jpg' },
                { title: 'ANGEL MAY CRY', cover: 'img/angel_may_cry.jpg' }
            ]),
            new TicketBlock('ticket', 'img/kai_angel_ticket.jpg'),
            new QuotesBlock('quotes', [
                'Она в моей голове навсегда (навсегда)',
                'Сколько можно быть тут одному? — я задаю себе question',
                'Красный свет в глазах, я живу во тьме'
            ]),
            new FooterBlock('footer', 'Kai Angel — восходящая звезда российской сцены', 'https://music.yandex.ru/artist/16509384')
        ];
    }

    const mainBlocks = blocks.filter(block => !(block instanceof HeaderBlock) && !(block instanceof FooterBlock));
    const headerBlock = blocks.find(block => block instanceof HeaderBlock);
    const footerBlock = blocks.find(block => block instanceof FooterBlock);

    const htmlContent = `
        ${headerBlock.getHTML()}
        <main>
            ${mainBlocks.map(block => block.getHTML()).join('')}
        </main>
        ${footerBlock.getHTML()}
        ${playMusic ? '<audio id="background-music" autoplay loop src="audio/kai_angel_otravlen.mp3"></audio>' : ''}
    `;
    document.body.innerHTML = htmlContent;
    saveBlocks(blocks);
}

function showIntroPopup() {
    const popupHTML = `
        <div id="intro-popup" class="popup">
            <div class="popup-content">
                <h2>Погрузиться глубже?</h2>
                <p class="warning">⚠️ Внимание: при нажатии на кнопку "Да", Вы автоматически соглашаетесь с тем, что сейчас может быть воспроизведена ненормативная лексика!</p>
                <button id="yes-btn">Да (убавьте звук, если он на максимуме)</button>
                <button id="no-btn">Нет (очень жаль)</button>
            </div>
        </div>
    `;
    document.body.innerHTML = popupHTML;

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