import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';

const ApiSection = ({ apiKey, title }) => {
    const { countries, users, products, apiHandlers, loading } = useContext(ApiContext);
    const data = { countries, users, products }[apiKey];
    const isLoading = loading[apiKey];

    const handleAction = async (method, id = null, value = null) => {
        if (method === 'get') {
            await apiHandlers[apiKey].get();
        } else if (method === 'post') {
            const input = prompt(`Введите ${apiKey === 'users' ? 'имя' : 'название'}:`) || 'Kai';
            await apiHandlers[apiKey].post(input);
        } else if (method === 'put') {
            const id = prompt('Введите ID для обновления:');
            if (!id) return;
            const value = prompt(`Введите новое ${apiKey === 'users' ? 'имя' : 'название'}:`);
            if (!value) return;
            await apiHandlers[apiKey].put(id, value);
        } else if (method === 'patch') {
            const promptText = apiKey === 'products' ? 'цену' : 'имя';
            if (!id) {
                // Для пользовательских элементов запрашиваем ID
                const customId = prompt('Введите ID для изменения:');
                if (!customId) return;
                const newValue = prompt(`Введите новое ${promptText}:`);
                if (!newValue) return;
                await apiHandlers[apiKey].patch(customId, newValue);
            } else {
                // Для не пользовательских элементов сразу запрашиваем значение
                const newValue = prompt(`Введите новое ${promptText}:`);
                if (!newValue) return;
                await apiHandlers[apiKey].patch(id, newValue);
            }
        } else if (method === 'delete') {
            await apiHandlers[apiKey].delete(id);
        }
    };

    return (
        <section className="api-section">
            <p className="api-warning">Внимание, API абсолютно рандомные и отношения к сайту практически не имеют!!!</p>
            <h2>{title}</h2>
            <div className="controls">
                <button onClick={() => handleAction('get')}>GET</button>
                {apiKey !== 'countries' && (
                    <>
                        <button onClick={() => handleAction('post')}>POST</button>
                        <button onClick={() => handleAction('put')}>PUT</button>
                    </>
                )}
            </div>
            <ul>
                {isLoading ? (
                    <li>Загрузка...</li>
                ) : data.length === 0 ? (
                    <li>Нет данных</li>
                ) : (
                    data.map(item => (
                        <li key={item.id || item.name?.common}>
                            {apiKey === 'countries' && `${item.name.common} - ${item.capital?.[0] || 'Нет столицы'}`}
                            {apiKey === 'users' && `${item.first_name} ${item.last_name} (ID: ${item.id}${item.isCustom ? ', Созданный' : ''})`}
                            {apiKey === 'products' && `${item.title} (ID: ${item.id}) [${item.price || 0} $]${item.isCustom ? ' (Созданный)' : ''}`}
                            {apiKey !== 'countries' && (
                                <>
                                    <button
                                        className="patch-btn"
                                        onClick={() => handleAction('patch', item.isCustom ? null : item.id)}
                                    >
                                        Change
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleAction('delete', item.id)}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </section>
    );
};

export default ApiSection;