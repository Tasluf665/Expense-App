import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrency } from '../../utils/currencySlice';
import { getColors } from '../../utils/themeSlice';

export default function CurrencyScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const selectedCurrency = useSelector((state) => state.currency.selectedCurrency);
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);

    const currencies = [
        { code: 'USD', name: 'United States' },
        { code: 'IDR', name: 'Indonesia' },
        { code: 'JPY', name: 'Japan' },
        { code: 'RUB', name: 'Russia' },
        { code: 'EUR', name: 'Germany' },
        { code: 'WON', name: 'Korea' },
        { code: 'BDT', name: 'Bangladesh' },
    ];

    const handleSelect = (code) => {
        dispatch(setCurrency(code));
    };

    const renderCurrencyItem = (item) => (
        <TouchableOpacity
            key={item.code}
            style={styles.itemContainer}
            onPress={() => handleSelect(item.code)}
        >
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                {item.name} ({item.code})
            </Text>
            {selectedCurrency === item.code && (
                <FontAwesome name="check" size={20} color={colors.primary} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Top Navigation */}
            <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Currency</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {currencies.map(renderCurrencyItem)}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F6F6F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#0D0E0F',
    },
});
