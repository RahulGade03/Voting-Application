import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";

import authSlice from "./authSlice.js"
import pollSlice from "./pollSlice.js"

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth: authSlice,
    polls: pollSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER', 'persist/FLUSH', 'persist/PAUSE', 'persist/PURGE'],
        },
    }),
})

export default store;