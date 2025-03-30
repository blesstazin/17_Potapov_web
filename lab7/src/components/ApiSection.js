import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';

const config = {
    countries: {
        promptLabel: 'название',
        display: item => `${item.name.common} - ${item.capital?.[0] || 'Нет столицы'}`,
        methods: ['get']
    },
    users: {
        promptLabel: 'имя',
        display: item => `${item.first_name} ${item.last_name} (ID: ${item.id}${item.isCustom ? ', Созданный' : ''})`,
        methods: ['get', 'post', 'put', 'patch', 'delete']
    },
    products: {
        promptLabel: 'название',
        display: item => `${item.title} (ID: ${item.id}) [${item.price || 0} $]${item.isCustom ? ' (Созданный)' : ''}`,
        methods: ['get', 'post', 'put', 'patch', 'delete'],
        patchLabel: 'цену'
    }
};

const ApiSection = ({ apiKey, title }) => {
    const { countries, users, products, apiHandlers, loading } = useContext(ApiContext);
    const data = { countries, users, products }[apiKey];
    const isLoading = loading[apiKey];
    const apiConf = config[apiKey];

    const handleAction = async (method, id = null, value = null) => {
        const actions = {
            get: () => apiHandlers[apiKey].get(),
            post: async () => {
                const input = prompt(`Введите ${apiConf.promptLabel}:`) || 'Kai';
                await apiHandlers[apiKey].post(input);
            },
            put: async () => {
                const inputId = prompt('Введите ID для обновления:');
                if (!inputId) return;
                const inputValue = prompt(`Введите новое ${apiConf.promptLabel}:`);
                if (!inputValue) return;
                await apiHandlers[apiKey].put(inputId, inputValue);
            },
            patch: async (patchId = id) => {
                const promptText = apiConf.patchLabel || apiConf.promptLabel;
                const effectiveId = patchId || prompt('Введите ID для изменения:');
                if (!effectiveId) return;
                const newValue = prompt(`Введите новое ${promptText}:`);
                if (!newValue) return;
                await apiHandlers[apiKey].patch(effectiveId, newValue);
            },
            delete: () => apiHandlers[apiKey].delete(id)
        };

        if (actions[method]) {
            await actions[method]();
        }
    };

    return (
        <section className="api-section">
            <p className="api-warning">Внимание, API абсолютно рандомные и отношения к сайту практически не имеют!!!</p>
            <h2>{title}</h2>
            <div className="controls">
                {apiConf.methods.includes('get') && (
                    <button onClick={() => handleAction('get')}>GET</button>
                )}
                {apiConf.methods.includes('post') && (
                    <button onClick={() => handleAction('post')}>POST</button>
                )}
                {apiConf.methods.includes('put') && (
                    <button onClick={() => handleAction('put')}>PUT</button>
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
                            {apiConf.display(item)}
                            {apiConf.methods.includes('patch') && (
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