import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BG from '../../assets/svg/BG';

import { supabase } from '../../lib/supabase';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';

export default function AccountScreen() {
    const router = useRouter();
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalBalance, setTotalBalance] = useState(0);
    const currencySymbol = useSelector((state) => state.currency.symbol);
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);

    const fetchWallets = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('wallets')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (data) {
                setWallets(data);
                const total = data.reduce((sum, acc) => sum + (acc.amount || 0), 0);
                setTotalBalance(total);
            }
        } catch (error) {
            console.log('Error fetching wallets:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchWallets();
        }, [])
    );


    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>


            {/* Top Navigation */}
            <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Account</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Balance Header */}
            <View style={styles.header}>
                <View style={[styles.headerBackground]}>
                    <View style={{ position: 'absolute', width: '100%', height: '100%', opacity: 1 }}>
                        {/* Removed opacity from View, handle in SVG or assume SVG is light enough. Actually, previous was 0.1 on image. Let's try 0.5 for SVG? or just let it be. */}
                        <BG width="100%" height="100%" preserveAspectRatio="none" />
                    </View>
                    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                        <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Account Balance</Text>
                        <Text style={[styles.balanceAmount, { color: colors.textPrimary }]}>{currencySymbol}{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</Text>
                    </View>
                </View>
            </View>
            {/* Account List */}
            <ScrollView style={styles.listContainer}>
                {wallets.map((account) => (
                    <TouchableOpacity
                        key={account.id}
                        style={styles.accountItem}
                        onPress={() => router.push({
                            pathname: '/(Common)/AccountDetails',
                            params: {
                                id: account.id,
                                name: account.name,
                                amount: account.amount,
                                icon: account.icon,
                                color: account.color,
                                type: account.type
                            }
                        })}
                    >
                        <View style={styles.accountLeft}>
                            {/* Icon with dynamic background */}
                            <View style={[styles.iconContainer, { backgroundColor: (account.color || '#7F3DFF') + '1A' }]}>
                                <FontAwesome name={account.icon || 'bank'} size={20} color={account.color || '#7F3DFF'} />
                            </View>
                            <Text style={[styles.accountName, { color: colors.textPrimary }]}>{account.name}</Text>
                        </View>
                        <Text style={[styles.accountAmount, { color: colors.textPrimary }]}>{currencySymbol}{account.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Add Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(Common)/AddNewWallet')}>
                    <FontAwesome name="plus" size={16} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Add new wallet</Text>
                </TouchableOpacity>
            </View>
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
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    balanceLabel: {
        fontSize: 14,
        color: '#91919F',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#000000',
    },
    header: {
        paddingHorizontal: 0,
        marginBottom: 20,
        height: '22%'
    },
    headerBackground: {
        borderRadius: 20, // Card like appearance
        width: '100%',
        height: '100%'
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    accountItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    accountLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    accountName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
    },
    accountAmount: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
    },
    footer: {
        padding: 20,
        paddingBottom: "15%",
    },
    addButton: {
        backgroundColor: '#7F3DFF',
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
