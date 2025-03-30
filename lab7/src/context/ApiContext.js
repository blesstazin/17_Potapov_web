import React, { createContext, useState, useEffect } from 'react';

export const ApiContext = createContext();

// Конфигурация API
const apiConfig = {
    countries: {
        url: 'https://restcountries.com/v3.1/all?fields=name,capital',
        transform: data => data.slice(0, 5),
        methods: ['get']
    },
    users: {
        url: 'https://reqres.in/api/users?per_page=5',
        transform: data => data.data,
        methods: ['get', 'post', 'put', 'patch', 'delete'],
        baseUrl: 'https://reqres.in/api/users'
    },
    products: {
        url: 'https://dummyjson.com/products?limit=5',
        transform: data => data.products,
        methods: ['get', 'post', 'put', 'patch', 'delete'],
        baseUrl: 'https://dummyjson.com/products'
    }
};

export const ApiProvider = ({ children }) => {
    const [data, setData] = useState({
        countries: [],
        users: [],
        products: []
    });
    const [loading, setLoading] = useState({
        countries: true,
        users: true,
        products: true
    });

    const fetchData = async (key) => {
        const config = apiConfig[key];
        if (!config) return;

        setLoading(prev => ({ ...prev, [key]: true }));
        try {
            const res = await fetch(config.url);
            const rawData = await res.json();
            const transformedData = config.transform ? config.transform(rawData) : rawData;
            setData(prev => ({ ...prev, [key]: transformedData }));
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка для наглядности
        } catch (error) {
            console.error(`Ошибка при загрузке ${key}:`, error);
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    useEffect(() => {
        Object.keys(apiConfig).forEach(key => fetchData(key));
    }, []);

    const apiHandlers = {
        countries: {
            get: () => fetchData('countries'),
            set: newData => setData(prev => ({ ...prev, countries: newData }))
        },
        users: {
            get: () => fetchData('users'),
            set: newData => setData(prev => ({ ...prev, users: newData })),
            post: async (name) => {
                const res = await fetch(`${apiConfig.users.baseUrl}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                });
                const newUser = await res.json();
                const nameParts = name.split(' ');
                setData(prev => ({
                    ...prev,
                    users: [{ id: Date.now(), first_name: nameParts[0], last_name: nameParts[1] || '', isCustom: true }, ...prev.users.slice(0, 4)]
                }));
            },
            put: async (id, newName) => {
                const numericId = parseInt(id);
                const isCustom = data.users.find(u => u.id === numericId)?.isCustom;
                if (!isCustom) {
                    await fetch(`${apiConfig.users.baseUrl}/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newName })
                    });
                    const nameParts = newName.split(' ');
                    setData(prev => ({
                        ...prev,
                        users: prev.users.map(user => user.id === numericId ? { ...user, first_name: nameParts[0], last_name: nameParts[1] || '' } : user)
                    }));
                } else {
                    const nameParts = newName.split(' ');
                    setData(prev => ({
                        ...prev,
                        users: prev.users.map(user => user.id === numericId ? { ...user, first_name: nameParts[0], last_name: nameParts[1] || '' } : user)
                    }));
                }
            },
            patch: async (id, newName) => {
                const numericId = parseInt(id);
                const isCustom = data.users.find(u => u.id === numericId)?.isCustom;
                if (!isCustom) {
                    await fetch(`${apiConfig.users.baseUrl}/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newName })
                    });
                    setData(prev => ({
                        ...prev,
                        users: prev.users.map(user => user.id === numericId ? { ...user, first_name: newName } : user)
                    }));
                } else {
                    setData(prev => ({
                        ...prev,
                        users: prev.users.map(user => user.id === numericId ? { ...user, first_name: newName } : user)
                    }));
                }
            },
            delete: async (id) => {
                const numericId = parseInt(id);
                await fetch(`${apiConfig.users.baseUrl}/${id}`, { method: 'DELETE' });
                setData(prev => ({
                    ...prev,
                    users: prev.users.filter(user => user.id !== numericId)
                }));
            }
        },
        products: {
            get: () => fetchData('products'),
            set: newData => setData(prev => ({ ...prev, products: newData })),
            post: async (title) => {
                const res = await fetch(`${apiConfig.products.baseUrl}/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title })
                });
                const newProduct = await res.json();
                setData(prev => ({
                    ...prev,
                    products: [{ id: Date.now(), title, price: 0, isCustom: true }, ...prev.products.slice(0, 4)]
                }));
            },
            put: async (id, newTitle) => {
                const numericId = parseInt(id);
                const isCustom = data.products.find(p => p.id === numericId)?.isCustom;
                if (!isCustom) {
                    const res = await fetch(`${apiConfig.products.baseUrl}/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: newTitle })
                    });
                    const updatedProduct = await res.json();
                    setData(prev => ({
                        ...prev,
                        products: prev.products.map(product => product.id === numericId ? { ...product, title: updatedProduct.title } : product)
                    }));
                } else {
                    setData(prev => ({
                        ...prev,
                        products: prev.products.map(product => product.id === numericId ? { ...product, title: newTitle } : product)
                    }));
                }
            },
            patch: async (id, newPrice) => {
                const numericId = parseInt(id);
                const isCustom = data.products.find(p => p.id === numericId)?.isCustom;
                if (!isCustom) {
                    const res = await fetch(`${apiConfig.products.baseUrl}/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ price: parseInt(newPrice) })
                    });
                    const updatedProduct = await res.json();
                    setData(prev => ({
                        ...prev,
                        products: prev.products.map(product => product.id === numericId ? { ...product, price: updatedProduct.price } : product)
                    }));
                } else {
                    setData(prev => ({
                        ...prev,
                        products: prev.products.map(product => product.id === numericId ? { ...product, price: parseInt(newPrice) } : product)
                    }));
                }
            },
            delete: async (id) => {
                const numericId = parseInt(id);
                await fetch(`${apiConfig.products.baseUrl}/${id}`, { method: 'DELETE' });
                setData(prev => ({
                    ...prev,
                    products: prev.products.filter(product => product.id !== numericId)
                }));
            }
        }
    };

    return (
        <ApiContext.Provider value={{ ...data, apiHandlers, loading }}>
            {children}
        </ApiContext.Provider>
    );
};