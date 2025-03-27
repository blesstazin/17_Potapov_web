import { createSlice } from '@reduxjs/toolkit';

const apiSlice = createSlice({
    name: 'api',
    initialState: {
        countries: [],
        users: [],
        products: [],
    },
    reducers: {
        setCountries: (state, action) => {
            state.countries = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        addUser: (state, action) => {
            state.users.push(action.payload);
        },
        updateUser: (state, action) => {
            const index = state.users.findIndex(u => u.id === 2);
            if (index !== -1) state.users[index] = { ...state.users[index], ...action.payload };
        },
        deleteUser: (state) => {
            state.users = state.users.filter(u => u.id !== 2);
        },
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex(p => p.id === 1);
            if (index !== -1) state.products[index] = { ...state.products[index], ...action.payload };
        },
        deleteProduct: (state) => {
            state.products = state.products.filter(p => p.id !== 1);
        },
    },
});

export const {
    setCountries, setUsers, setProducts,
    addUser, updateUser, deleteUser,
    addProduct, updateProduct, deleteProduct,
} = apiSlice.actions;
export default apiSlice.reducer;