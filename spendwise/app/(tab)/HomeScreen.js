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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../constant/Colors';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useCallback } from 'react';
import { format } from 'date-fns';
import TransactionActionModal from '../../components/TransactionActionModal';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const [selectedPeriod, setSelectedPeriod] = useState('Today');
    const [balance, setBalance] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState([]);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const getCategoryStyles = (category, type) => {
        const styles = {
            'Food': { icon: 'cutlery', color: '#FF5555', bg: '#FFE6E6' },
            'Shopping': { icon: 'shopping-bag', color: '#FFA500', bg: '#FFF4E6' },
            'Transport': { icon: 'car', color: '#3B82F6', bg: '#E6F2FF' },
            'Entertainment': { icon: 'film', color: '#7C3FED', bg: '#F0E6FF' },
            'Bills': { icon: 'file-text', color: '#EF4444', bg: '#FEE2E2' },
            'Salary': { icon: 'dollar', color: '#00D09E', bg: '#E6F9F5' },
            'Bonus': { icon: 'gift', color: '#F59E0B', bg: '#FEF3C7' },
            'Freelance': { icon: 'laptop', color: '#6366F1', bg: '#E0E7FF' },
            'Investment': { icon: 'line-chart', color: '#10B981', bg: '#D1FAE5' },
            'Refund': { icon: 'undo', color: '#8B5CF6', bg: '#EDE9FE' },
            'Other': { icon: 'ellipsis-h', color: '#6B7280', bg: '#F3F4F6' },
            'Passive Income': { icon: 'line-chart', color: '#10B981', bg: '#D1FAE5' },
            'Business': { icon: 'briefcase', color: '#6366F1', bg: '#E0E7FF' },
            'Gift': { icon: 'gift', color: '#F59E0B', bg: '#FEF3C7' },
        };

        return styles[category] || { icon: 'question', color: '#6B7280', bg: '#F3F4F6' };
    };

    const fetchData = async () => {
        try {
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

            if (expenseError || incomeError) {
                console.error('Error fetching data:', expenseError || incomeError);
                return;
            }

            // Calculate totals
            const expTotal = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
            const incTotal = income.reduce((sum, item) => sum + Number(item.amount), 0);

            setTotalExpenses(expTotal);
            setTotalIncome(incTotal);
            setBalance(incTotal - expTotal);

            // Get recent transactions
            const allTransactions = [
                ...expenses.map(e => ({ ...e, type: 'expense' })),
                ...income.map(i => ({ ...i, type: 'income' }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5); // Take top 5

            const formattedRecent = allTransactions.map(curr => {
                const categoryStyle = getCategoryStyles(curr.category, curr.type);
                return {
                    ...curr, // Keep original data for editing
                    title: curr.category,
                    description: curr.description || curr.wallet,
                    displayAmount: curr.type === 'expense' ? -Math.abs(curr.amount) : Math.abs(curr.amount),
                    time: format(new Date(curr.created_at), 'hh:mm a'),
                    icon: categoryStyle.icon,
                    backgroundColor: categoryStyle.bg,
                    iconColor: categoryStyle.color,
                    type: curr.type
                };
            });

            setRecentTransactions(formattedRecent);

        } catch (error) {
            console.error('Error in fetchData:', error);
        }
    };

    const handleTransactionPress = (transaction) => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
    };

    const handleEdit = () => {
        setModalVisible(false);
        if (!selectedTransaction) return;

        const screen = selectedTransaction.type === 'expense' ? '/(Common)/ExpenseScreen' : '/(Common)/IncomeScreen';

        router.push({
            pathname: screen,
            params: {
                id: selectedTransaction.id,
                mode: 'edit',
                amount: selectedTransaction.amount.toString(),
                category: selectedTransaction.category,
                description: selectedTransaction.description || '',
                wallet: selectedTransaction.wallet,
                is_repeat: selectedTransaction.is_repeat?.toString(),
            }
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
                style={styles.transactionItem}
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
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text style={styles.transactionDescription}>
                        {transaction.description}
                    </Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text
                        style={[
                            styles.transactionAmount,
                            { color: transaction.type === 'expense' ? '#FF5555' : '#00D09E' }
                        ]}
                    >
                        {transaction.displayAmount > 0 ? '+' : ''}${Math.abs(transaction.displayAmount)}
                    </Text>
                    <Text style={styles.transactionTime}>{transaction.time}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header with gradient background */}
                <LinearGradient
                    colors={['#FFF8E1', '#FFFFFF']}
                    style={styles.header}
                >
                    {/* Profile Image */}
                    <View style={styles.profileContainer}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/80' }}
                            style={styles.profileImage}
                        />
                    </View>

                    {/* Account Balance */}
                    <Text style={styles.balanceLabel}>Account Balance</Text>
                    <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>

                    {/* Income and Expense Cards */}
                    <View style={styles.cardsContainer}>
                        {/* Income Card */}
                        <View style={[styles.card, styles.incomeCard]}>
                            <View style={styles.cardIcon}>
                                <FontAwesome name="arrow-down" size={20} color="#FFFFFF" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardLabel}>Income</Text>
                                <Text style={styles.cardAmount}>${totalIncome.toFixed(2)}</Text>
                            </View>
                        </View>

                        {/* Expense Card */}
                        <View style={[styles.card, styles.expenseCard]}>
                            <View style={styles.cardIcon}>
                                <FontAwesome name="arrow-up" size={20} color="#FFFFFF" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardLabel}>Expenses</Text>
                                <Text style={styles.cardAmount}>${totalExpenses.toFixed(2)}</Text>
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
                                    selectedPeriod === period && styles.periodButtonActive,
                                ]}
                                onPress={() => setSelectedPeriod(period)}
                            >
                                <Text
                                    style={[
                                        styles.periodText,
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
                        <Text style={styles.sectionTitle}>Recent Transaction</Text>
                        <TouchableOpacity
                            style={styles.seeAllButton}
                            onPress={() => router.push("/(tab)/TransactionScreen")}
                        >
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Transaction List */}
                    {recentTransactions.map(renderTransactionItem)}
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
        backgroundColor: '#FFFFFF',
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        gap: 12,
    },
    incomeCard: {
        backgroundColor: '#00D09E',
    },
    expenseCard: {
        backgroundColor: '#FF5555',
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 14,
        color: '#FFFFFF',
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
        color: '#000000',
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
        borderBottomColor: '#F5F5F5',
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
        color: '#000000',
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
});
