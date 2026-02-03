import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../constant/Colors';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import TransactionActionModal from '../../components/TransactionActionModal';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const [selectedPeriod, setSelectedPeriod] = useState('Today');
    const [balance, setBalance] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [rawTransactions, setRawTransactions] = useState([]);
    const currencySymbol = useSelector((state) => state.currency.symbol);
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Fetch Data (Memoized)
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: expenses, error: expenseError } = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', user.id);

            const { data: income, error: incomeError } = await supabase
                .from('income')
                .select('*')
                .eq('user_id', user.id);

            const { data: wallets, error: walletError } = await supabase
                .from('wallets')
                .select('amount')
                .eq('user_id', user.id);

            const { data: transfers, error: transferError } = await supabase
                .from('transfers')
                .select('*')
                .eq('user_id', user.id);

            const { data: fetchedCategories, error: categoryError } = await supabase
                .from('categories')
                .select('*')
                .or(`user_id.eq.${user.id},user_id.is.null`);

            if (expenseError || incomeError || walletError || transferError || categoryError) {
                console.error('Error fetching data:', expenseError || incomeError || walletError || transferError || categoryError);
                return;
            }

            if (fetchedCategories) {
                setCategories(fetchedCategories);
            }

            // Calculate Global Balance (From Wallets)
            const totalWalletBalance = (wallets || []).reduce((sum, item) => sum + Number(item.amount), 0);
            setBalance(totalWalletBalance);

            // Combine and sort all transactions
            const combined = [
                ...expenses.map(e => ({ ...e, type: 'expense' })),
                ...income.map(i => ({ ...i, type: 'income' })),
                ...(transfers || []).map(t => ({ ...t, type: 'transfer', category: 'Transfer' }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setRawTransactions(combined);

        } catch (error) {
            console.error('Error in fetchData:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    // Re-calculate financials when period or raw data changes
    useEffect(() => {
        calculateFinancials();
    }, [selectedPeriod, rawTransactions, categories]);

    const getCategoryStyles = (categoryName, type) => {
        const foundCategory = categories.find(c => c.name === categoryName && (!type || c.type === type || !c.type));

        if (foundCategory) {
            return {
                icon: foundCategory.icon,
                color: foundCategory.color,
                bg: foundCategory.color + '20' // Add 20 for 12% opacity (hex transparency)
            };
        }

        // Fallback for hardcoded defaults if DB is empty or miss
        const defaults = {
            'Transfer': { icon: 'exchange', color: '#0077FF', bg: '#E0F2FE' },
            'Food': { icon: 'cutlery', color: '#FF5555', bg: '#FFE6E6' },
            'Shopping': { icon: 'shopping-bag', color: '#FFA500', bg: '#FFF4E6' },
        };
        return defaults[categoryName] || { icon: 'question', color: '#6B7280', bg: '#F3F4F6' };
    };

    const [categories, setCategories] = useState([]);



    const calculateFinancials = () => {
        const now = new Date();
        let start, end;

        switch (selectedPeriod) {
            case 'Today':
                start = startOfDay(now);
                end = endOfDay(now);
                break;
            case 'Week':
                start = startOfWeek(now, { weekStartsOn: 1 });
                end = endOfWeek(now, { weekStartsOn: 1 });
                break;
            case 'Month':
                start = startOfMonth(now);
                end = endOfMonth(now);
                break;
            case 'Year':
                start = startOfYear(now);
                end = endOfYear(now);
                break;
            default: // 'All' or fallback
                start = new Date(0); // Epoch
                end = new Date(8640000000000000); // Max date
                break;
        }

        const filtered = rawTransactions.filter(item => {
            const date = new Date(item.created_at);
            return isWithinInterval(date, { start, end });
        });

        // Calculate Period Income/Expenses (Exclude transfers from these totals)
        const periodIncome = filtered
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const periodExpenses = filtered
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        setTotalIncome(periodIncome);
        setTotalExpenses(periodExpenses);

        // Recent Transactions
        const recent = filtered.slice(0, 5).map(curr => {
            // Handle Transfer Styles
            if (curr.type === 'transfer') {
                return {
                    ...curr,
                    title: 'Transfer',
                    description: curr.description || 'Wallet Transfer',
                    displayAmount: curr.amount,
                    time: format(new Date(curr.created_at), 'dd MMM, hh:mm a'),
                    icon: 'exchange',
                    backgroundColor: '#E0F2FE', // Light Blue
                    iconColor: '#0077FF', // Blue
                    type: 'transfer'
                };
            }

            const categoryStyle = getCategoryStyles(curr.category, curr.type);
            return {
                ...curr,
                title: curr.category,
                description: curr.description || curr.wallet,
                displayAmount: curr.type === 'expense' ? -Math.abs(curr.amount) : Math.abs(curr.amount),
                time: format(new Date(curr.created_at), 'dd MMM, hh:mm a'),
                icon: categoryStyle.icon,
                backgroundColor: categoryStyle.bg,
                iconColor: categoryStyle.color,
                type: curr.type
            };
        });

        setRecentTransactions(recent);
    };

    const handleTransactionPress = (transaction) => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
    };

    const handleEdit = () => {
        setModalVisible(false);
        if (!selectedTransaction) return;

        let screen;
        const params = {
            id: selectedTransaction.id,
            mode: 'edit',
            amount: selectedTransaction.amount.toString(),
            category: selectedTransaction.category,
            description: selectedTransaction.description || '',
            date: selectedTransaction.created_at, // Pass date
        };

        if (selectedTransaction.type === 'expense') {
            screen = '/(Common)/ExpenseScreen';
            params.wallet_id = selectedTransaction.wallet_id;
            params.wallet = selectedTransaction.wallet;
            params.is_repeat = selectedTransaction.is_repeat?.toString();
        } else if (selectedTransaction.type === 'income') {
            screen = '/(Common)/IncomeScreen';
            params.wallet_id = selectedTransaction.wallet_id;
            params.wallet = selectedTransaction.wallet;
            params.is_repeat = selectedTransaction.is_repeat?.toString(); // Assuming income might have repeat later
        } else if (selectedTransaction.type === 'transfer') {
            screen = '/(Common)/TransferScreen';
            params.from_wallet_id = selectedTransaction.from_wallet_id;
            params.to_wallet_id = selectedTransaction.to_wallet_id;
        }

        router.push({
            pathname: screen,
            params: params
        });
    };

    const handleDelete = () => {
        if (!selectedTransaction) return;

        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const table = selectedTransaction.type === 'expense' ? 'expenses' : 'income';
                            const { error } = await supabase
                                .from(table)
                                .delete()
                                .eq('id', selectedTransaction.id);

                            if (error) throw error;

                            setModalVisible(false);
                            fetchData(); // Refresh data
                            Alert.alert("Success", "Transaction deleted successfully");
                        } catch (error) {
                            console.error("Error deleting transaction:", error);
                            Alert.alert("Error", "Failed to delete transaction");
                        }
                    }
                }
            ]
        );
    };

    const renderTransactionItem = (transaction) => {
        return (
            <TouchableOpacity
                key={transaction.id}
                style={[styles.transactionItem, { borderBottomColor: colors.border }]}
                onPress={() => handleTransactionPress(transaction)}
            >
                <View
                    style={[
                        styles.transactionIcon,
                        { backgroundColor: transaction.backgroundColor },
                    ]}
                >
                    <FontAwesome
                        name={transaction.icon}
                        size={24}
                        color={transaction.iconColor}
                    />
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionTitle, { color: colors.textPrimary }]}>{transaction.title}</Text>
                    <Text style={[styles.transactionDescription, { color: colors.textSecondary }]}>
                        {transaction.description}
                    </Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text
                        style={[
                            styles.transactionAmount,
                            { color: transaction.type === 'expense' ? '#FF5555' : transaction.type === 'income' ? '#00D09E' : '#0077FF' }
                        ]}
                    >
                        {transaction.type === 'income' && transaction.displayAmount > 0 ? '+' : ''}
                        {currencySymbol}{Math.abs(transaction.displayAmount)}
                    </Text>
                    <Text style={[styles.transactionTime, { color: colors.textSecondary }]}>{transaction.time}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header with gradient background */}
                <LinearGradient
                    colors={themeMode === 'dark' ? ['#1C1C1E', '#0D0E0F'] : ['#FFF8E1', '#FFFFFF']}
                    style={styles.header}
                >


                    {/* Account Balance */}
                    <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Account Balance</Text>
                    <Text style={[styles.balanceAmount, { color: colors.textPrimary }]}>{currencySymbol}{balance.toFixed(2)}</Text>

                    {/* Income and Expense Cards */}
                    <View style={styles.cardsContainer}>
                        {/* Income Card */}
                        <View style={[styles.card, styles.incomeCard]}>
                            <View style={styles.cardIcon}>
                                <FontAwesome name="arrow-down" size={20} color="#FFFFFF" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardLabel}>Income</Text>
                                <Text style={styles.cardAmount}>{currencySymbol}{totalIncome.toFixed(2)}</Text>
                            </View>
                        </View>

                        {/* Expense Card */}
                        <View style={[styles.card, styles.expenseCard]}>
                            <View style={styles.cardIcon}>
                                <FontAwesome name="arrow-up" size={20} color="#FFFFFF" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardLabel}>Expenses</Text>
                                <Text style={styles.cardAmount}>{currencySymbol}{totalExpenses.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Spend Frequency Section */}
                <View style={styles.section}>

                    {/* Period Selector */}
                    <View style={styles.periodSelector}>
                        {['Today', 'Week', 'Month', 'Year'].map((period) => (
                            <TouchableOpacity
                                key={period}
                                style={[
                                    styles.periodButton,
                                    selectedPeriod === period && { backgroundColor: themeMode === 'dark' ? '#2D2440' : '#FFF4E6' },
                                ]}
                                onPress={() => setSelectedPeriod(period)}
                            >
                                <Text
                                    style={[
                                        styles.periodText,
                                        { color: selectedPeriod === period ? '#FFA500' : colors.textSecondary },
                                        selectedPeriod === period && styles.periodTextActive,
                                    ]}
                                >
                                    {period}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Transaction Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Transaction</Text>
                        <TouchableOpacity
                            style={[styles.seeAllButton, { backgroundColor: colors.primaryLight }]}
                            onPress={() => router.push("/(tab)/TransactionScreen")}
                        >
                            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Transaction List */}
                    {recentTransactions.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Please add transaction</Text>
                        </View>
                    ) : (
                        recentTransactions.map(renderTransactionItem)
                    )}
                </View>

                {/* Extra padding for bottom tab bar */}
                <View style={{ height: 100 }} />
            </ScrollView>

            <TransactionActionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#7C3FED',
    },
    balanceLabel: {
        textAlign: 'center',
        fontSize: 14,
        color: '#999999',
        marginBottom: 8,
    },
    balanceAmount: {
        textAlign: 'center',
        fontSize: 48,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 30,
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    card: {
        flex: 1,
        padding: 16,
        borderRadius: 24,
        gap: 8,
        justifyContent: 'space-between',
    },
    incomeCard: {
        backgroundColor: '#00D09E',
    },
    expenseCard: {
        backgroundColor: '#FF5555',
    },
    cardIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardContent: {
        // Removed flex: 1
    },
    cardLabel: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        marginBottom: 4,
    },
    cardAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeAllButton: {
        backgroundColor: '#F0E6FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    seeAllText: {
        color: '#7C3FED',
        fontSize: 14,
        fontWeight: '600',
    },
    chartContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 8,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: '#FFF4E6',
    },
    periodText: {
        fontSize: 14,
        color: '#999999',
    },
    periodTextActive: {
        color: '#FFA500',
        fontWeight: '600',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    transactionIcon: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    transactionDescription: {
        fontSize: 13,
        color: '#999999',
    },
    transactionRight: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF5555',
        marginBottom: 4,
    },
    transactionTime: {
        fontSize: 13,
        color: '#999999',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
});
