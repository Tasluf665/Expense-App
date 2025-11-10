import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Keep this import for Redux Persist
import authReducer from "./authSlice"; // 🔹 Import auth slice

const persistConfig = {
    key: "root",
    storage: AsyncStorage, // ✅ This is required for Redux Persist (separate from Firebase)
    whitelist: ["auth"], // 🔹 Persist only selected reducers
};

const rootReducer = combineReducers({
    auth: authReducer, // 🔹 Add auth to store
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
