import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedCurrency: 'USD',
    symbol: '$',
};

const currencySymbols = {
    'USD': '$',
    'IDR': 'Rp',
    'JPY': '¥',
    'RUB': '₽',
    'EUR': '€',
    'WON': '₩',
    'BDT': '৳',
};

const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {
        setCurrency: (state, action) => {
            state.selectedCurrency = action.payload;
            state.symbol = currencySymbols[action.payload] || '$';
        },
    },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
