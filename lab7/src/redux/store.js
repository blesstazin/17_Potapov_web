import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './apiSlice';

export default configureStore({
    reducer: {
        api: apiReducer,
    },
});