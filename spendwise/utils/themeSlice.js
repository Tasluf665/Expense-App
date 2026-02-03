import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: 'light', // 'light' or 'dark'
};

// Color palettes for both themes
export const lightColors = {
    background: '#FFFFFF',
    cardBackground: '#F9F9F9',
    textPrimary: '#000000',
    textSecondary: '#91919F',
    border: '#E5E5E5',
    primary: '#7C3FED',
    primaryLight: '#EEE5FF',
    expense: '#FD3C4A',
    income: '#00A86B',
    transfer: '#0077FF',
    divider: '#F6F6F6',
};

export const darkColors = {
    background: '#0D0E0F',
    cardBackground: '#1C1C1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#2C2C2E',
    primary: '#9D6FFF',
    primaryLight: '#2D2440',
    expense: '#FF5C5C',
    income: '#00D09E',
    transfer: '#4D9FFF',
    divider: '#2C2C2E',
};

// Helper function to get colors based on theme
export const getColors = (mode) => {
    return mode === 'dark' ? darkColors : lightColors;
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action) => {
            state.mode = action.payload; // 'light' or 'dark'
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
