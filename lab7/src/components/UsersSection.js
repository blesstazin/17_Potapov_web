import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, updateUser, deleteUser } from '../redux/apiSlice';

function UsersSection() {
    const [displayedData, setDisplayedData] = useState(null);
    const users = useSelector((state) => state.api.users);
    const dispatch = useDispatch();

    const handleMethod = async (method) => {
        setDisplayedData(['Выполняется...']);
        try {
            if (method === 'get') {
                setDisplayedData(users.map(user => `${user.first_name} ${user.last_name}`));
            } else if (method === 'post') {
                const response = await fetch('https://reqres.in/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: 'Kai' }),
                });
                const data = await response.json();
                dispatch(addUser(data));
                setDisplayedData([`Создан пользователь: ${data.name}`]);
            } else if (method === 'put') {
                const response = await fetch('https://reqres.in/api/users/2', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: 'Kai Angel' }),
                });
                const data = await response.json();
                dispatch(updateUser(data));
                setDisplayedData([`Обновлен пользователь: ${data.name}`]);
            } else if (method === 'patch') {
                const response = await fetch('https://reqres.in/api/users/2', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: '9mice?????' }),
                });
                const data = await response.json();
                dispatch(updateUser(data));
                setDisplayedData([`Изменен пользователь: ${data.name}`]);
            } else if (method === 'delete') {
                await fetch('https://reqres.in/api/users/2', { method: 'DELETE' });
                dispatch(deleteUser());
                setDisplayedData(['Пользователь удален((']);
            }
        } catch (error) {
            setDisplayedData([`Ошибка: ${error.message}`]);
        }
    };

    return (
        <section id="users-section" className="api-section">
            <p className="api-warning">Внимание, API абсолютно рандомные и отношения к сайту практически не имеют!!!</p>
            <h2>Пользователи</h2>
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

export default UsersSection;