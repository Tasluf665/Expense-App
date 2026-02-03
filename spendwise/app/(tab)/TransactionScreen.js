import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SectionList,
    Modal,
    FlatList,
    Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useFocusEffect, router } from 'expo-router';
import TransactionActionModal from '../../components/TransactionActionModal';
import { useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

export default function TransactionScreen() {
    // Helper to generate last 12 months
    const generateLast12Months = () => {
        const months = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(format(d, 'MMM yyyy'));
        }
        return months;
    };

    const months = generateLast12Months();
    const [selectedMonth, setSelectedMonth] = useState(months[0]);
    const [showMonthModal, setShowMonthModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterBy, setFilterBy] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [transactionSections, setTransactionSections] = useState([]);
    const [rawTransactions, setRawTransactions] = useState([]); // Declared rawTransactions state at the top
    const [loading, setLoading] = useState(true);
    const currencySymbol = useSelector((state) => state.currency.symbol);
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const filterOptions = ['Income', 'Expense', 'Transfer'];
    const sortOptions = ['Highest', 'Lowest', 'Newest', 'Oldest'];
    // const categories = ['Food', 'Shopping', 'Transportation', 'Entertainment', 'Bills', 'Salary', 'Bonus', 'Other']; // Removed hardcoded list

    const [categories, setCategories] = useState([]); // Dynamic categories state

    const getCategoryStyles = (categoryName, type) => {
        const foundCategory = categories.find(c => c.name === categoryName && (!type || c.type === type || !c.type));

        if (foundCategory) {
            return {
                icon: foundCategory.icon,
                color: foundCategory.color,
                bg: foundCategory.color + '20'
            };
        }

        const defaults = {
            'Food': { icon: 'cutlery', color: '#FF5555', bg: '#FFE6E6' },
            'Shopping': { icon: 'shopping-bag', color: '#FFA500', bg: '#FFF4E6' },
            'Transfer': { icon: 'exchange', color: '#0077FF', bg: '#E0F2FE' },
        };

        return defaults[categoryName] || { icon: 'question', color: '#6B7280', bg: '#F3F4F6' };
    };

    // Filter Logic
    const processTransactions = useCallback(() => {
        let data = [...rawTransactions];

        // 1. Filter by Month
        if (selectedMonth) {
            data = data.filter(item => {
                const date = parseISO(item.created_at);
                const monthName = format(date, 'MMM yyyy');
                return monthName === selectedMonth;
            });
        }

        // 2. Filter by Type (Income/Expense/Transfer)
        if (filterBy) {
            const typeMap = { 'Income': 'income', 'Expense': 'expense', 'Transfer': 'transfer' };
            if (typeMap[filterBy]) {
                data = data.filter(item => item.type === typeMap[filterBy]);
            }
        }

        // 3. Filter by Category
        if (selectedCategories.length > 0) {
            data = data.filter(item => selectedCategories.includes(item.category));
        }

        // 4. Sort
        if (sortBy) {
            switch (sortBy) {
                case 'Highest':
                    data.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
                    break;
                case 'Lowest':
                    data.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
                    break;
                case 'Newest':
                    data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case 'Oldest':
                    data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    break;
                default:
                    data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
        } else {
            // Default sort
            data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        // 5. Group by Date
        const grouped = data.reduce((acc, curr) => {
            const date = parseISO(curr.created_at);
            let title = format(date, 'dd MMM yyyy');

            if (isToday(date)) title = 'Today';
            if (isYesterday(date)) title = 'Yesterday';

            const existingSection = acc.find(s => s.title === title);

            let item;
            if (curr.type === 'transfer') {
                item = {
                    id: curr.id,
                    title: 'Transfer',
                    description: curr.description || 'Wallet Transfer',
                    amount: Math.abs(curr.amount),
                    time: format(date, 'dd MMM, hh:mm a'),
                    icon: 'exchange',
                    backgroundColor: '#E0F2FE', // Light Blue
                    iconColor: '#0077FF',
                    type: 'transfer',
                    originalDate: curr.created_at
                };
            } else {
                const categoryStyle = getCategoryStyles(curr.category, curr.type);
                item = {
                    id: curr.id,
                    title: curr.category,
                    description: curr.description || curr.wallet,
                    amount: curr.type === 'expense' ? -Math.abs(curr.amount) : Math.abs(curr.amount),
                    time: format(date, 'dd MMM, hh:mm a'),
                    icon: categoryStyle.icon,
                    backgroundColor: categoryStyle.bg,
                    iconColor: categoryStyle.color,
                    type: curr.type,
                    originalDate: curr.created_at
                };
            }

            if (existingSection) {
                existingSection.data.push(item);
            } else {
                acc.push({ title, data: [item] });
            }
            return acc;
        }, []);

        setTransactionSections(grouped);
    }, [rawTransactions, selectedMonth, filterBy, sortBy, selectedCategories, categories]); // Added categories dependency

    // Apply filters whenever state changes
    useEffect(() => {
        processTransactions();
    }, [processTransactions]);

    const fetchTransactions = async () => {
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

            const { data: transfers, error: transferError } = await supabase
                .from('transfers')
                .select('*')
                .eq('user_id', user.id);

            // Fetch categories too
            const { data: fetchedCategories, error: categoryError } = await supabase
                .from('categories')
                .select('*')
                .or(`user_id.eq.${user.id},user_id.is.null`);

            if (expenseError || incomeError || transferError || categoryError) {
                console.error('Error fetching data:', expenseError || incomeError || transferError || categoryError);
                return;
            }

            if (fetchedCategories) {
                setCategories(fetchedCategories);
            }

            const allTransactions = [
                ...expenses.map(e => ({ ...e, type: 'expense' })),
                ...income.map(i => ({ ...i, type: 'income' })),
                ...(transfers || []).map(t => ({ ...t, type: 'transfer', category: 'Transfer' }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setRawTransactions(allTransactions);

        } catch (error) {
            console.error('Error in fetchTransactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTransactions();
        }, [])
    );

    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
        setShowMonthModal(false);
    };

    const handleFilterSelect = (option) => {
        setFilterBy(option);
    };

    const handleSortSelect = (option) => {
        setSortBy(option);
    };

    const handleCategoryToggle = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleReset = () => {
        setFilterBy(null);
        setSortBy(null);
        setSelectedCategories([]);
        setSelectedMonth(months[0]);
    };

    const handleApplyFilters = () => {
        setShowFilterModal(false);
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
                            fetchTransactions(); // Refresh data
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

    const renderTransactionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.transactionItem}
            onPress={() => handleTransactionPress(item)}
        >
            <View
                style={[
                    styles.transactionIcon,
                    { backgroundColor: item.backgroundColor },
                ]}
            >
                <FontAwesome
                    name={item.icon}
                    size={24}
                    color={item.iconColor}
                />
            </View>
            <View style={styles.transactionDetails}>
                <Text style={[styles.transactionTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.transactionDescription, { color: colors.textSecondary }]}>
                    {item.description}
                </Text>
            </View>
            <View style={styles.transactionRight}>
                <Text
                    style={[
                        styles.transactionAmount,
                        { color: item.type === 'expense' ? '#FF5555' : item.type === 'income' ? '#00D09E' : '#0077FF' },
                    ]}
                >
                    {item.type === 'expense' ? '-' : item.type === 'income' ? '+' : ''}{currencySymbol}{Math.abs(item.amount)}
                </Text>
                <Text style={[styles.transactionTime, { color: colors.textSecondary }]}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderSectionHeader = ({ section: { title } }) => (
        <Text style={[styles.sectionHeader, { color: colors.textPrimary, backgroundColor: colors.background }]}>{title}</Text>
    );

    const renderMonthItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.monthItem,
                { backgroundColor: selectedMonth === item ? colors.primaryLight : colors.cardBackground },
                selectedMonth === item && styles.monthItemSelected,
            ]}
            onPress={() => handleMonthSelect(item)}
        >
            <Text
                style={[
                    styles.monthItemText,
                    { color: selectedMonth === item ? colors.primary : colors.textPrimary },
                    selectedMonth === item && styles.monthItemTextSelected,
                ]}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Transaction</Text>

                {/* Month Filter and Filter Button */}
                <View style={styles.headerControls}>
                    <TouchableOpacity
                        style={[styles.monthButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                        onPress={() => setShowMonthModal(true)}
                    >
                        <Text style={[styles.monthButtonText, { color: colors.primary }]}>{selectedMonth}</Text>
                        <FontAwesome name="chevron-down" size={14} color={colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, { backgroundColor: colors.cardBackground }]}
                        onPress={() => setShowFilterModal(true)}
                    >
                        <FontAwesome name="sliders" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* Financial Report Banner */}
                <TouchableOpacity style={[styles.reportBanner, { backgroundColor: colors.primaryLight }]} onPress={() => router.push('/(tab)/ExportScreen')}>
                    <Text style={[styles.reportText, { color: colors.primary }]}>See your financial report</Text>
                    <FontAwesome name="chevron-right" size={18} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Transaction List */}
            <SectionList
                sections={transactionSections}
                keyExtractor={(item) => item.id}
                renderItem={renderTransactionItem}
                renderSectionHeader={renderSectionHeader}
                scrollEnabled={true}
                contentContainerStyle={[styles.listContent, { paddingBottom: 110 }]}
                refreshing={loading}
                onRefresh={fetchTransactions}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Please add transaction</Text>
                    </View>
                )}
            />

            {/* Month Selection Modal */}
            <Modal
                visible={showMonthModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowMonthModal(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={() => setShowMonthModal(false)}
                    />

                    <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Month</Text>
                            <TouchableOpacity onPress={() => setShowMonthModal(false)}>
                                <FontAwesome name="times" size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={months}
                            renderItem={renderMonthItem}
                            keyExtractor={(item) => item}
                            numColumns={3}
                            scrollEnabled={true}
                            contentContainerStyle={styles.monthGridContent}
                        />
                    </View>
                </View>
            </Modal>

            {/* Filter Modal */}
            <Modal
                visible={showFilterModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={() => setShowFilterModal(false)}
                    />

                    <View style={[styles.filterModalContent, { backgroundColor: colors.cardBackground }]}>
                        {/* Handle Bar */}
                        <View style={[styles.handleBar, { backgroundColor: colors.border }]} />

                        {/* Filter Header */}
                        <View style={styles.filterHeader}>
                            <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>Filter Transaction</Text>
                            <TouchableOpacity onPress={handleReset}>
                                <Text style={[styles.resetButton, { color: colors.primary }]}>Reset</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.filterContent}
                        >
                            {/* Filter By Section */}
                            <View style={styles.filterSection}>
                                <Text style={[styles.filterSectionTitle, { color: colors.textPrimary }]}>Filter By</Text>
                                <View style={styles.filterButtonsContainer}>
                                    {filterOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.filterOptionButton,
                                                filterBy === option && styles.filterOptionButtonActive,
                                            ]}
                                            onPress={() => handleFilterSelect(option)}
                                        >
                                            <Text
                                                style={[
                                                    styles.filterOptionText,
                                                    filterBy === option && styles.filterOptionTextActive,
                                                ]}
                                            >
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Sort By Section */}
                            <View style={styles.filterSection}>
                                <Text style={[styles.filterSectionTitle, { color: colors.textPrimary }]}>Sort By</Text>
                                <View style={styles.sortButtonsContainer}>
                                    {sortOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.sortOptionButton,
                                                sortBy === option && styles.sortOptionButtonActive,
                                            ]}
                                            onPress={() => handleSortSelect(option)}
                                        >
                                            <Text
                                                style={[
                                                    styles.sortOptionText,
                                                    sortBy === option && styles.sortOptionTextActive,
                                                ]}
                                            >
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Category Section */}
                            <View style={styles.filterSection}>
                                <Text style={[styles.filterSectionTitle, { color: colors.textPrimary }]}>Category</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                    {categories.map((cat) => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.filterOptionButton,
                                                { minWidth: '40%' },
                                                selectedCategories.includes(cat.name) && styles.filterOptionButtonActive
                                            ]}
                                            onPress={() => handleCategoryToggle(cat.name)}
                                        >
                                            <Text style={[
                                                styles.filterOptionText,
                                                selectedCategories.includes(cat.name) && styles.filterOptionTextActive
                                            ]}>
                                                {cat.name.length > 15 ? cat.name.substring(0, 10) + '...' : cat.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        {/* Apply Button */}
                        <View style={styles.filterButtonContainer}>
                            <TouchableOpacity
                                style={[styles.applyButton, { backgroundColor: colors.primary }]}
                                onPress={handleApplyFilters}
                            >
                                <Text style={styles.applyButtonText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 20,
    },
    headerControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    monthButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        gap: 8,
    },
    monthButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7C3FED',
    },
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reportBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#E6D9FF',
        borderRadius: 12,
    },
    reportText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#7C3FED',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 20,
        marginBottom: 12,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
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
        marginBottom: 4,
    },
    transactionTime: {
        fontSize: 13,
        color: '#999999',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    overlay: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
    },
    monthGridContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 12
    },
    monthItem: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginHorizontal: 4,
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthItemSelected: {
        backgroundColor: '#7C3FED',
        borderColor: '#7C3FED',
    },
    monthItemText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000000',
    },
    monthItemTextSelected: {
        color: '#FFFFFF',
    },
    filterModalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 30,
        maxHeight: '85%',
    },
    handleBar: {
        width: 48,
        height: 4,
        backgroundColor: '#E5E5E5',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    resetButton: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7C3FED',
        backgroundColor: '#F0E6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    filterContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    filterSection: {
        marginBottom: 28,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 12,
    },
    filterButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    filterOptionButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        backgroundColor: '#F9F9F9',
        alignItems: 'center',
    },
    filterOptionButtonActive: {
        backgroundColor: '#7C3FED',
        borderColor: '#7C3FED',
    },
    filterOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    filterOptionTextActive: {
        color: '#FFFFFF',
    },
    sortButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    sortOptionButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        backgroundColor: '#F9F9F9',
    },
    sortOptionButtonActive: {
        backgroundColor: '#7C3FED',
        borderColor: '#7C3FED',
    },
    sortOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    sortOptionTextActive: {
        color: '#FFFFFF',
    },
    categorySelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        backgroundColor: '#F9F9F9',
    },
    categorySelectorText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        flex: 1,
    },
    selectedCountText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7C3FED',
        marginRight: 12,
    },
    filterButtonContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    applyButton: {
        backgroundColor: '#7C3FED',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
});
