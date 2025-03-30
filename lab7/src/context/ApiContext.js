import React, { createContext, useState, useEffect } from 'react';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const [countries, setCountries] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState({ countries: true, users: true, products: true });

    const fetchData = async (key) => {
        setLoading(prev => ({ ...prev, [key]: true }));
        try {
            if (key === 'countries') {
                const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital');
                const data = await res.json();
                setCountries(data.slice(0, 5));
            } else if (key === 'users') {
                const res = await fetch('https://reqres.in/api/users?per_page=5');
                const { data } = await res.json();
                setUsers(data);
            } else if (key === 'products') {
                const res = await fetch('https://dummyjson.com/products?limit=5');
                const { products } = await res.json();
                setProducts(products);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Ошибка при загрузке ${key}:`, error);
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    useEffect(() => {
        fetchData('countries');
        fetchData('users');
        fetchData('products');
    }, []);

    const apiHandlers = {
        countries: {
            get: () => fetchData('countries'),
            set: setCountries
        },
        users: {
            get: () => fetchData('users'),
            set: setUsers,
            post: async (name) => {
                const res = await fetch('https://reqres.in/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                });
                const newUser = await res.json();
                const nameParts = name.split(' ');
                setUsers([{ id: Date.now(), first_name: nameParts[0], last_name: nameParts[1] || '', isCustom: true }, ...users.slice(0, 4)]);
            },
            put: async (id, newName) => {
                const numericId = parseInt(id);
                const isCustom = users.find(u => u.id === numericId)?.isCustom;
                if (!isCustom) {
                    await fetch(`https://reqres.in/api/users/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newName })
                    });
                    const nameParts = newName.split(' ');
                    setUsers(users.map(user => user.id === numericId ? { ...user, first_name: nameParts[0], last_name: nameParts[1] || '' } : user));
                } else {
                    const nameParts = newName.split(' ');
                    setUsers(users.map(user => user.id === numericId ? { ...user, first_name: nameParts[0], last_name: nameParts[1] || '' } : user));
                }
            },
            patch: async (id, newName) => {
                const numericId = parseInt(id);
                const isCustom = users.find(u => u.id === numericId)?.isCustom;
                if (!isCustom) {
                    await fetch(`https://reqres.in/api/users/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newName })
                    });
                    setUsers(users.map(user => user.id === numericId ? { ...user, first_name: newName } : user));
                } else {
                    setUsers(users.map(user => user.id === numericId ? { ...user, first_name: newName } : user));
                }
            },
            delete: async (id) => {
                const numericId = parseInt(id);
                await fetch(`https://reqres.in/api/users/${id}`, { method: 'DELETE' });
                setUsers(users.filter(user => user.id !== numericId));
            }
        },
        products: {
            get: () => fetchData('products'),
            set: setProducts,
            post: async (title) => {
                const res = await fetch('https://dummyjson.com/products/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title })
                });
                const newProduct = await res.json();
                setProducts([{ id: Date.now(), title, price: 0, isCustom: true }, ...products.slice(0, 4)]);
            },
            put: async (id, newTitle) => {
                const numericId = parseInt(id);
                const isCustom = products.find(p => p.id === numericId)?.isCustom;
                if (!isCustom) {
                    const res = await fetch(`https://dummyjson.com/products/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: newTitle })
                    });
                    const updatedProduct = await res.json();
                    setProducts(products.map(product => product.id === numericId ? { ...product, title: updatedProduct.title } : product));
                } else {
                    setProducts(products.map(product => product.id === numericId ? { ...product, title: newTitle } : product));
                }
            },
            patch: async (id, newPrice) => {
                const numericId = parseInt(id);
                const isCustom = products.find(p => p.id === numericId)?.isCustom;
                if (!isCustom) {
                    const res = await fetch(`https://dummyjson.com/products/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ price: parseInt(newPrice) })
                    });
                    const updatedProduct = await res.json();
                    setProducts(products.map(product => product.id === numericId ? { ...product, price: updatedProduct.price } : product));
                } else {
                    setProducts(products.map(product => product.id === numericId ? { ...product, price: parseInt(newPrice) } : product));
                }
            },
            delete: async (id) => {
                const numericId = parseInt(id);
                await fetch(`https://dummyjson.com/products/${id}`, { method: 'DELETE' });
                setProducts(products.filter(product => product.id !== numericId));
            }
        }
    };

    return (
        <ApiContext.Provider value={{ countries, users, products, apiHandlers, loading }}>
            {children}
        </ApiContext.Provider>
    );
};