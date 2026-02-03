import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../../constant/Colors';
import { supabase } from '../../lib/supabase';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';

export default function AccountDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, icon, color, type } = params; // Ensure ID is passed

    // Global Currency
    const currencySymbol = useSelector((state) => state.currency.symbol);
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);
    const [categoryMap, setCategoryMap] = useState({});

    // Local state for wallet display (so we can update it immediately)
    const [walletName, setWalletName] = useState(params.name);
    const [walletAmount, setWalletAmount] = useState(params.amount);


    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState(params.name);
    const [editAmount, setEditAmount] = useState(params.amount ? String(params.amount) : '');

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleUpdateWallet = async () => {
        if (!editName) {
            alert("Name is required");
            return;
        }

        try {
            const { error } = await supabase
                .from('wallets')
                .update({
                    name: editName,
                })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setWalletName(editName);
            setShowEditModal(false);
            alert("Wallet updated successfully!");

        } catch (error) {
            console.error('Error updating wallet:', error);
            alert('Failed to update wallet');
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchTransactions = async () => {
                if (!id) return;
                setLoading(true);
                try {
                    // Fetch Categories first
                    const { data: fetchedCategories, error: categoryError } = await supabase
                        .from('categories')
                        .select('*');

                    if (categoryError) {
                        console.error('Category fetch error:', categoryError);
                    }

                    // Fetch Wallet Details (Refresh Balance)
                    const { data: walletData, error: walletError } = await supabase
                        .from('wallets')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (walletError) {
                        console.error('Error fetching wallet:', walletError);
                    } else if (walletData) {
                        setWalletAmount(walletData.amount);
                        setWalletName(walletData.name);
                    }

                    const catMap = {};
                    if (fetchedCategories) {
                        fetchedCategories.forEach(c => {
                            catMap[c.name] = c;
                        });
                    }
                    setCategoryMap(catMap);

                    // Fetch Expenses
                    const { data: expenses, error: expenseError } = await supabase
                        .from('expenses')
                        .select('*')
                        .eq('wallet_id', id);

                    if (expenseError) throw expenseError;

                    // Fetch Income
                    const { data: income, error: incomeError } = await supabase
                        .from('income')
                        .select('*')
                        .eq('wallet_id', id);

                    if (incomeError) throw incomeError;

                    // Fetch Transfers
                    const { data: transfers, error: transferError } = await supabase
                        .from('transfers')
                        .select('*')
                        .or(`from_wallet_id.eq.${id},to_wallet_id.eq.${id}`);

                    if (transferError) throw transferError;

                    // Combine and normalize
                    const combined = [
                        ...(expenses || []).map(t => ({ ...t, type: 'Expense', isExpense: true })),
                        ...(income || []).map(t => ({ ...t, type: 'Income', isExpense: false })),
                        ...(transfers || []).map(t => ({
                            ...t,
                            type: 'Transfer',
                            category: 'Transfer',
                            isExpense: t.from_wallet_id === id // If from this wallet, it's an outflow (expense-like)
                        }))
                    ];

                    // Sort by created_at desc (newest first)
                    combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                    // Group by Date (Today, Yesterday, etc.) - Simplified for now
                    // We will just put everything in "Recent" if we don't do full date grouping logic
                    // Or implementing basic "Today" / "Yesterday" logic
                    const grouped = groupTransactionsByDate(combined);
                    setTransactions(grouped);

                } catch (error) {
                    console.error('Error fetching transactions:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchTransactions();
        }, [id])
    );

    const groupTransactionsByDate = (data) => {
        const groups = {
            'Today': [],
            'Yesterday': [],
            'Earlier': []
        };

        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        data.forEach(item => {
            const itemDate = new Date(item.created_at).toDateString();
            if (itemDate === today) {
                groups['Today'].push(item);
            } else if (itemDate === yesterdayStr) {
                groups['Yesterday'].push(item);
            } else {
                groups['Earlier'].push(item);
            }
        });

        // Filter out empty groups and convert to array array
        const result = [];
        if (groups['Today'].length > 0) result.push({ title: 'Today', data: groups['Today'] });
        if (groups['Yesterday'].length > 0) result.push({ title: 'Yesterday', data: groups['Yesterday'] });
        if (groups['Earlier'].length > 0) result.push({ title: 'Earlier', data: groups['Earlier'] });

        return result;
    };

    const renderTransactionItem = (item) => (
        <TouchableOpacity key={item.id} style={[styles.transactionItem, { backgroundColor: colors.cardBackground }]} onPress={() => {
            // Navigate to Transaction Details (The file user mentioned: DetailsScreen.js)
            // For now, we reuse DetailsScreen or just ignore. 
            // If it's a transfer, we might want different details, but sticking to existing pattern.
            router.push({
                pathname: '/(Common)/DetailsScreen',
                params: {
                    id: item.id,
                    type: item.type,
                    amount: item.amount,
                    description: item.description,
                    category: item.category,
                    wallet: walletName, // Current wallet name
                    date: new Date(item.created_at).toDateString(),
                    time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isExpense: item.isExpense
                }
            });
        }}>
            <View style={styles.transactionLeft}>
                <View style={[
                    styles.transactionIconContainer,
                    {
                        backgroundColor: item.type === 'Transfer'
                            ? '#E0F2FE'
                            : (categoryMap[item.category]?.color ? categoryMap[item.category].color + '20' : (item.isExpense ? '#FFE6E6' : '#E6F9F5'))
                    }
                ]}>
                    <FontAwesome
                        name={
                            item.type === 'Transfer'
                                ? 'exchange'
                                : (categoryMap[item.category]?.icon || (item.isExpense ? 'shopping-bag' : 'dollar'))
                        }
                        size={24}
                        color={
                            item.type === 'Transfer'
                                ? '#0077FF'
                                : (categoryMap[item.category]?.color || (item.isExpense ? '#FF5555' : '#00A86B'))
                        }
                    />
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionCategory, { color: colors.textPrimary }]}>{item.category || item.type}</Text>
                    <Text style={[styles.transactionDescription, { color: colors.textSecondary }]} numberOfLines={1}>{item.description}</Text>
                </View>
            </View>
            <View style={styles.transactionRight}>
                <Text style={[
                    styles.transactionAmount,
                    {
                        color: item.type === 'Transfer' ? '#0077FF' : (item.isExpense ? '#FD3C4A' : '#00A86B')
                    }
                ]}>
                    {item.isExpense ? `- ${currencySymbol}${item.amount}` : `+ ${currencySymbol}${item.amount}`}
                </Text>
                <Text style={[styles.transactionTime, { color: colors.textSecondary }]}>{format(new Date(item.created_at), 'dd MMM, hh:mm a')}</Text>
            </View>
        </TouchableOpacity>
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
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Detail Account</Text>
                <TouchableOpacity onPress={() => {
                    setEditName(walletName);
                    setEditAmount(String(walletAmount));
                    setShowEditModal(true);
                }}>
                    <FontAwesome name="pencil" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Account Hero */}
            <View style={styles.heroContainer}>
                <View style={[styles.accountIconContainer, { backgroundColor: (color || '#7F3DFF') + '1A' }]}>
                    <FontAwesome name={icon || 'bank'} size={32} color={color || '#7F3DFF'} />
                </View>
                <Text style={[styles.accountName, { color: colors.textPrimary }]}>{walletName || 'Account Name'}</Text>
                <Text style={[styles.balanceAmount, { color: colors.textPrimary }]}>{currencySymbol}{parseFloat(walletAmount || '0').toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</Text>
            </View>

            {/* Transactions List */}
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {transactions.map((section, index) => (
                    <View key={index} style={styles.sectionContainer}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{section.title}</Text>
                        {section.data.map((item) => renderTransactionItem(item))}
                    </View>
                ))}
                {/* Spacer for bottom */}
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Edit Modal */}
            <Modal
                visible={showEditModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={() => setShowEditModal(false)}
                    />
                    <View style={[styles.editModalContent, { backgroundColor: colors.cardBackground }]}>
                        <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Edit Wallet</Text>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Name</Text>
                            <TextInput
                                style={[styles.textInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                                value={editName}
                                onChangeText={setEditName}
                                placeholder="Wallet Name"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>



                        <TouchableOpacity style={[styles.updateButton, { backgroundColor: colors.primary }]} onPress={handleUpdateWallet}>
                            <Text style={styles.updateButtonText}>Update Wallet</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    heroContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    accountIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    accountName: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    transactionDetails: {
        justifyContent: 'center',
    },
    transactionCategory: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    transactionDescription: {
        fontSize: 13,
        color: '#91919F',
        maxWidth: 150,
    },
    transactionRight: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    transactionTime: {
        fontSize: 13,
        color: '#91919F',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    overlay: {
        flex: 1,
    },
    editModalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 40,
    },
    handleBar: {
        width: 48,
        height: 4,
        backgroundColor: '#E5E5E5',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#91919F',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#000',
    },
    updateButton: {
        backgroundColor: '#7F3DFF',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
