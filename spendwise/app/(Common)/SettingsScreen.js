import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../utils/themeSlice';
import { getColors } from '../../utils/themeSlice';

export default function SettingsScreen() {
    const router = useRouter();
    const selectedCurrency = useSelector((state) => state.currency.selectedCurrency);
    const themeMode = useSelector((state) => state.theme.mode);
    const dispatch = useDispatch();
    const colors = getColors(themeMode);

    const renderSettingItem = (title, value, onPress) => (
        <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{title}</Text>
            <View style={styles.itemRight}>
                {value && <Text style={[styles.itemValue, { color: colors.textSecondary }]}>{value}</Text>}
                <FontAwesome name="angle-right" size={20} color={colors.primary} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Top Navigation */}
            <View style={[styles.topBar, { borderBottomColor: colors.divider }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {renderSettingItem("Currency", selectedCurrency, () => router.push('/(Common)/CurrencyScreen'))}
                {renderSettingItem("Categories", null, () => router.push('/(Common)/CategoryListScreen'))}
                {renderSettingItem("Theme", themeMode === 'dark' ? 'Dark' : 'Light', () => dispatch(toggleTheme()))}

                <View style={styles.divider} />

                {renderSettingItem("About", null, () => router.push('/(Common)/AboutScreen'))}
                {renderSettingItem("Help", null, () => router.push('/(Common)/HelpScreen'))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemValue: {
        fontSize: 14,
        marginRight: 12,
    },
    divider: {
        height: 40,
    }
});
