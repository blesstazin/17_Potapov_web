import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, updateProduct, deleteProduct } from '../redux/apiSlice';

function ProductsSection() {
    const [displayedData, setDisplayedData] = useState(null);
    const products = useSelector((state) => state.api.products);
    const dispatch = useDispatch();

    const handleMethod = async (method) => {
        setDisplayedData(['Выполняется...']);
        try {
            if (method === 'get') {
                setDisplayedData(products.map(product => product.title));
            } else if (method === 'post') {
                const response = await fetch('https://dummyjson.com/products/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: 'зипочка vetements' }),
                });
                const data = await response.json();
                dispatch(addProduct(data));
                setDisplayedData([`Создан продукт: ${data.title}`]);
            } else if (method === 'put') {
                const response = await fetch('https://dummyjson.com/products/1', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: 'новая зипоччччка' }),
                });
                const data = await response.json();
                dispatch(updateProduct(data));
                setDisplayedData([`Обновлен продукт: ${data.title}`]);
            } else if (method === 'patch') {
                const response = await fetch('https://dummyjson.com/products/1', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ price: 99999 }),
                });
                const data = await response.json();
                dispatch(updateProduct(data));
                setDisplayedData([`Изменен продукт, новая цена: ${data.price} ₽`]);
            } else if (method === 'delete') {
                const response = await fetch('https://dummyjson.com/products/1', { method: 'DELETE' });
                const data = await response.json();
                dispatch(deleteProduct());
                setDisplayedData([`Продукт удален (ID: ${data.id}) (а зачем тебе его айдишник?))`]);
            }
        } catch (error) {
            setDisplayedData([`Ошибка: ${error.message}`]);
        }
    };

    return (
        <section id="products-section" className="api-section">
            <p className="api-warning">Внимание, API абсолютно рандомные и отношения к сайту практически не имеют!!!</p>
            <h2>Продукты</h2>
            <div className="controls">
                <button onClick={() => handleMethod('get')}>GET</button>
                <button onClick={() => handleMethod('post')}>POST</button>
                <button onClick={() => handleMethod('put')}>PUT</button>
                <button onClick={() => handleMethod('patch')}>PATCH</button>
                <button onClick={() => handleMethod('delete')}>DELETE</button>
            </div>
            <ul>
                {displayedData ? displayedData.map((item, index) => <li key={index}>{item}</li>) : <li>Нажмите кнопку для действия</li>}
            </ul>
        </section>
    );
}

export default ProductsSection;