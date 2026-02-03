import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { supabase } from '../../lib/supabase';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

export default function ExportScreen() {
    const router = useRouter();
    const currencySymbol = useSelector((state) => state.currency.symbol);
    const themeMode = useSelector((state) => state.theme.mode);
    const themeColors = getColors(themeMode);
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
    const monthList = generateLast12Months();

    const [chartType, setChartType] = useState('line'); // 'line' or 'pie'
    const [transactionType, setTransactionType] = useState('expense'); // 'expense', 'income'
    const [timeRange, setTimeRange] = useState(monthList[0]); // Default to current month
    const [allData, setAllData] = useState([]); // Store ALL fetched data

    // UI State
    const [loading, setLoading] = useState(false);
    const [showTimeRangeModal, setShowTimeRangeModal] = useState(false);
    const [showViewModeModal, setShowViewModeModal] = useState(false);

    // Data State
    const [transactions, setTransactions] = useState([]); // List view data
    const [pieData, setPieData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [categoryMapState, setCategoryMapState] = useState({});

    // Sorting
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

    // Color Palette
    const colors = {
        primary: '#7F3DFF',
        primaryLight: '#EEE5FF',
        expense: '#FD3C4A',
        income: '#00A86B',
        text: '#0D0E0F',
        gray: '#91919F',
        bg: '#FFFFFF',
    };

    // ... imports

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const table = transactionType === 'expense' ? 'expenses' : 'income';

            // Fetch Transactions
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) {
                console.error(error);
                return;
            }

            // Fetch Categories
            const { data: fetchedCategories, error: categoryError } = await supabase
                .from('categories')
                .select('*');

            if (categoryError) {
                console.error(categoryError);
            }

            const catMap = {};
            if (fetchedCategories) {
                fetchedCategories.forEach(c => {
                    catMap[c.name] = c;
                });
            }
            setCategoryMapState(catMap);

            // Store raw ALL data
            setAllData(data.map(item => ({ ...item }))); // Keep ascending for charts

            // Set initial transactions (reversed for list)
            // setTransactions(data.map(item => ({ ...item })).reverse()); 
            // ^ We will derive display transactions in the useEffect

        } catch (error) {
            console.error('Error fetching export data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Fetch
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [transactionType]) // Refetch if transaction type changes (though we fetch specific table in fetchData)
    );

    // Replace the previous useEffect with this main driver
    React.useEffect(() => {
        if (!allData || allData.length === 0) return;

        // 1. Filter Logic
        const filtered = filterDataByTimeRange(allData, timeRange);

        // 2. Update Total
        const total = filtered.reduce((sum, item) => sum + Number(item.amount), 0);
        setTotalAmount(total);

        // 3. Update Pie Data (always needed for toggle)
        const pData = processPieChartData(filtered, total, categoryMapState);
        setPieData(pData);

        // 4. Update Main Chart Data
        if (chartType === 'line') {
            processLineChartData(filtered, categoryMapState);
        } else {
            setChartData(pData);
        }

        // 5. Update List View (Reverse for newest first)
        setTransactions(filtered.map(i => ({ ...i })).reverse());

    }, [timeRange, chartType, allData, categoryMapState, transactionType]); // re-run when source data changes




    // ... (fetchData keeps fetching everything for the table, but we might want to filter the table too? 
    // Usually Export/Report screen shows current month by default. 
    // Let's filter the data passed to the charts and list based on timeRange)

    // Actually, good practice: Fetch everything, then filter in memory if dataset is small, 
    // OR fetch with date range query. 
    // Given the previous code fetched all, let's filter in memory for checking.
    // BUT, the previous code fetched EVERYTHING for the user. That might be heavy.
    // Let's stick to client-side filtering for now as it matches the pattern.

    const filterDataByTimeRange = (data, range) => {
        if (!range) return data;
        try {
            return data.filter(d => format(new Date(d.created_at), 'MMM yyyy') === range);
        } catch (e) {
            console.error("Error filtering by date", e);
            return data;
        }
    };

    // Effect to update chart/list when timeRange or chartType changes
    React.useEffect(() => {
        // filter raw transactions first
        const filtered = filterDataByTimeRange(transactions, timeRange);

        // Update Chart
        if (chartType === 'line') {
            processLineChartData(filtered, categoryMapState);
        } else {
            // For Pie, we need to recalculate totals based on filtered data
            // Recalculate Total Amount for the view
            const newTotal = filtered.reduce((sum, item) => sum + Number(item.amount), 0);
            setTotalAmount(newTotal);
            const pData = processPieChartData(filtered, newTotal, categoryMapState);
            setChartData(pData);
            setPieData(pData); // Update pieData state as well
        }

        // We should also theoretically update the 'transactions' list shown in list view 
        // IF the list view is supposed to only show the selected range.
        // The current implementation uses 'transactions' state directly in render.
        // We shouldn't mutate 'transactions' state if it holds 'all' data.
        // So we need a new state 'displayTransactions' or just derive it.
        // Let's verify how 'transactions' is populated. 
        // It's populated in fetchData.
        // Let's refactor fetchData to store 'allData' and then filter into 'transactions'.
    }, [timeRange, chartType, transactions]); // transactions dependency needed if we fetch new data

    const processLineChartData = (data, catMap) => {
        // 1. Aggregate by label
        const aggregated = {};

        data.forEach(item => {
            const date = new Date(item.created_at);
            // Day of month
            const label = format(date, 'd');

            if (!aggregated[label]) {
                aggregated[label] = 0;
            }
            aggregated[label] += Number(item.amount);
        });

        // 2. Convert to array
        let points = Object.keys(aggregated).map(label => ({
            value: aggregated[label],
            label: label,
            dataPointText: aggregated[label].toString(),
        }));

        // 3. Sort numerically
        points.sort((a, b) => Number(a.label) - Number(b.label));

        if (points.length === 0) {
            setChartData([{ value: 0 }, { value: 0 }]); // Empty state
        } else {
            setChartData(points);
        }
    };

    const processPieChartData = (data, total, catMap) => { // Accept catMap
        const categoryMap = {};

        data.forEach(item => {
            if (!categoryMap[item.category]) {
                categoryMap[item.category] = 0;
            }
            categoryMap[item.category] += Number(item.amount);
        });

        const pieResult = Object.keys(categoryMap).map((cat, index) => {
            // Get color from dynamic categories or fallback
            const dynamicColor = catMap && catMap[cat] ? catMap[cat].color : null;

            return {
                value: categoryMap[cat],
                color: dynamicColor || `hsl(${index * 40}, 70%, 50%)`, // Use HSL for unique colors if unknown
                text: total > 0 ? `${((categoryMap[cat] / total) * 100).toFixed(0)}%` : '0%',
                category: cat,
                amount: categoryMap[cat],
                focused: index === 0,
            };
        });

        return pieResult.sort((a, b) => b.value - a.value);
    };

    const getCategoryIcon = (category) => {
        if (categoryMapState[category]?.icon) return categoryMapState[category].icon;

        const map = {
            'Shopping': 'shopping-bag',
            'Food': 'cutlery',
            'Transport': 'car',
            'Subscription': 'file-text',
            'Salary': 'dollar',
            'Business': 'briefcase',
            'Passive Income': 'line-chart',
        };
        return map[category] || 'ellipsis-h';
    };

    const getCategoryColor = (category) => { // Helper if needed elsewhere, though chart logic handles its own colors
        if (categoryMapState[category]?.color) return categoryMapState[category].color;

        const categoryColors = {
            'Shopping': '#FCAE12',
            'Subscription': '#7F3DFF',
            'Food': '#FD3C4A',
            'Transport': '#3B82F6',
            'Salary': '#00A86B',
            'Passive Income': '#00A86B',
            'Other': '#EEE5FF',
        };
        return categoryColors[category] || '#91919F';
    }

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <FontAwesome name="arrow-left" size={24} color={themeColors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Financial Report</Text>
            <View style={{ width: 24 }} />
        </View>
    );

    const renderControls = () => (
        <View style={styles.controlsRow}>
            <TouchableOpacity
                style={[styles.monthSelector, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
                onPress={() => setShowTimeRangeModal(true)}
            >
                <FontAwesome name="angle-down" size={18} color={themeColors.primary} />
                <Text style={[styles.monthText, { color: themeColors.primary }]}>{timeRange}</Text>
            </TouchableOpacity>

            <View style={[styles.chartToggle, { backgroundColor: themeColors.cardBackground }]}>
                <TouchableOpacity
                    style={[styles.chartBtn, { backgroundColor: chartType === 'line' ? themeColors.primary : themeColors.cardBackground }]}
                    onPress={() => setChartType('line')}
                >
                    <FontAwesome name="line-chart" size={16} color={chartType === 'line' ? '#fff' : themeColors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.chartBtn, { backgroundColor: chartType === 'pie' ? themeColors.primary : themeColors.cardBackground }]}
                    onPress={() => setChartType('pie')}
                >
                    <FontAwesome name="pie-chart" size={16} color={chartType === 'pie' ? '#fff' : themeColors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );



    const handleSortPress = () => {
        const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        setSortOrder(newOrder);

        if (chartType === 'line') {
            const sorted = [...transactions].sort((a, b) => {
                return newOrder === 'desc'
                    ? Number(b.amount) - Number(a.amount)
                    : Number(a.amount) - Number(b.amount);
            });
            setTransactions(sorted);
        } else {
            const sorted = [...pieData].sort((a, b) => {
                return newOrder === 'desc'
                    ? b.value - a.value
                    : a.value - b.value;
            });
            setPieData(sorted);
        }
    };

    const handleViewModeSelect = (type) => { // 'Transaction' or 'Category'
        setChartType(type === 'Transaction' ? 'line' : 'pie');
        setShowViewModeModal(false);
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            {renderHeader()}

            <ScrollView showsVerticalScrollIndicator={false}>
                {renderControls()}

                <Text style={[styles.totalLabel, { color: themeColors.textSecondary }]}>
                    Total {transactionType === 'expense' ? 'Expense' : 'Income'}
                </Text>
                <Text style={[styles.totalAmount, { color: themeColors.textPrimary }]}>{currencySymbol} {totalAmount.toFixed(0)}</Text>

                {/* CHART AREA */}
                <View style={styles.chartContainer}>
                    {chartType === 'line' ? (
                        <LineChart
                            data={chartData}
                            height={180}
                            width={width - 40}
                            spacing={40}
                            color={colors.primary}
                            thickness={3}
                            startFillColor={colors.primary}
                            endFillColor={colors.primaryLight}
                            startOpacity={0.2}
                            endOpacity={0.0}
                            initialSpacing={10}
                            curved
                            hideRules
                            hideYAxisText
                            hideAxesAndRules
                            hideDataPoints={false}
                            dataPointsColor={colors.primary}
                        />
                    ) : (
                        <View style={{ alignItems: 'center' }}>
                            <PieChart
                                data={chartData}
                                donut
                                showText
                                sectionAutoFocus
                                radius={90}
                                innerRadius={60}
                                innerCircleColor={themeColors.background}
                                centerLabelComponent={() => (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 22, color: themeColors.textPrimary, fontWeight: 'bold' }}>
                                            {currencySymbol}{totalAmount.toFixed(0)}
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>
                    )}
                </View>

                {/* TOGGLE */}
                <View style={[styles.toggleContainer, { backgroundColor: themeColors.cardBackground }]}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, { backgroundColor: transactionType === 'expense' ? themeColors.primary : themeColors.cardBackground }]}
                        onPress={() => setTransactionType('expense')}
                    >
                        <Text style={[styles.toggleText, { color: transactionType === 'expense' ? '#FFFFFF' : themeColors.textPrimary }]}>Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleBtn, { backgroundColor: transactionType === 'income' ? themeColors.primary : themeColors.cardBackground }]}
                        onPress={() => setTransactionType('income')}
                    >
                        <Text style={[styles.toggleText, { color: transactionType === 'income' ? '#FFFFFF' : themeColors.textPrimary }]}>Income</Text>
                    </TouchableOpacity>
                </View>

                {/* LIST HEADER */}
                <View style={styles.listHeader}>
                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={() => setShowViewModeModal(true)}
                    >
                        <FontAwesome name="angle-down" size={16} color={themeColors.textSecondary} />
                        <Text style={[styles.filterText, { color: themeColors.textSecondary }]}>{chartType === 'line' ? 'Transaction' : 'Category'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sortBtn}
                        onPress={handleSortPress}
                    >
                        <FontAwesome name={sortOrder === 'desc' ? "sort-amount-desc" : "sort-amount-asc"} size={20} color={themeColors.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* LIST ITEMS */}
                <View style={styles.listContainer}>
                    {chartType === 'line' ? (
                        // TRANSACTION LIST
                        transactions.map((item, index) => (
                            <View key={index} style={[styles.transactionItem, { backgroundColor: themeColors.cardBackground }]}>
                                <View style={[styles.iconContainer, { backgroundColor: (categoryMapState[item.category]?.color || '#FCAE12') + '20' }]}>
                                    <FontAwesome name={getCategoryIcon(item.category)} size={24} color={categoryMapState[item.category]?.color || '#FCAE12'} />
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={[styles.itemTitle, { color: themeColors.textPrimary }]}>{item.category}</Text>
                                    <Text style={[styles.itemSubtitle, { color: themeColors.textSecondary }]}>{item.description}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.itemAmount, { color: transactionType === 'expense' ? colors.expense : colors.income }]}>
                                        {transactionType === 'expense' ? '-' : '+'} {currencySymbol}{item.amount}
                                    </Text>
                                    <Text style={[styles.itemTime, { color: themeColors.textSecondary }]}>
                                        {item.created_at ? format(new Date(item.created_at), 'dd MMM, hh:mm a') : ''}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        // CATEGORY LIST
                        pieData.map((item, index) => (
                            <View key={index} style={styles.categoryItem}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                                    <Text style={[styles.categoryName, { color: themeColors.textPrimary }]}>{item.category}</Text>
                                    <Text style={[styles.categoryAmount, { color: transactionType === 'expense' ? colors.expense : colors.income }]}>
                                        {transactionType === 'expense' ? '-' : '+'} {currencySymbol}{item.amount}
                                    </Text>
                                </View>
                                <View style={styles.progressBarBg}>
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            { width: item.text, backgroundColor: item.color }
                                        ]}
                                    />
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Time Range Selection Modal */}
            <Modal
                visible={showTimeRangeModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowTimeRangeModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowTimeRangeModal(false)}
                >
                    <View style={[styles.menuPopover, { width: 150, maxHeight: 400 }]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {monthList.map((month, index) => (
                                <View key={month}>
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => { setTimeRange(month); setShowTimeRangeModal(false); }}
                                    >
                                        <Text style={[styles.menuText, timeRange === month && styles.menuTextActive]}>{month}</Text>
                                        {timeRange === month && <FontAwesome name="check" size={14} color="#7F3DFF" />}
                                    </TouchableOpacity>
                                    {index < monthList.length - 1 && <View style={styles.menuDivider} />}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* View Mode Selection Modal */}
            <Modal
                visible={showViewModeModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowViewModeModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowViewModeModal(false)}
                >
                    <View style={styles.menuPopover}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleViewModeSelect('Transaction')}
                        >
                            <Text style={[styles.menuText, chartType === 'line' && styles.menuTextActive]}>Transaction</Text>
                            {chartType === 'line' && <FontAwesome name="check" size={14} color="#7F3DFF" />}
                        </TouchableOpacity>
                        <View style={styles.menuDivider} />
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleViewModeSelect('Category')}
                        >
                            <Text style={[styles.menuText, chartType === 'pie' && styles.menuTextActive]}>Category</Text>
                            {chartType === 'pie' && <FontAwesome name="check" size={14} color="#7F3DFF" />}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    monthText: {
        marginLeft: 8,
        fontWeight: '500',
    },
    chartToggle: {
        flexDirection: 'row',
        backgroundColor: '#F1F1FA',
        borderRadius: 8,
        padding: 2,
    },
    chartBtn: {
        padding: 8,
        borderRadius: 6,
    },
    chartBtnActive: {
        backgroundColor: '#7F3DFF',
    },
    totalLabel: {
        textAlign: 'center',
        color: '#91919F',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    totalAmount: {
        textAlign: 'center',
        fontSize: 32,
        fontWeight: '700',
        marginTop: 4,
        marginBottom: 20,
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F1FA',
        borderRadius: 30,
        marginBottom: 20,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 30,
    },
    toggleBtnActive: {
        backgroundColor: '#7F3DFF',
    },
    toggleText: {
        color: '#000',
        fontWeight: '500',
    },
    toggleTextActive: {
        color: '#fff',
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    filterText: {
        marginLeft: 8,
        fontWeight: '500',
    },
    sortBtn: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderRadius: 8,
    },
    listContainer: {
        marginTop: 10,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 24,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 1,
        marginHorizontal: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    itemSubtitle: {
        fontSize: 13,
        color: '#91919F',
        marginTop: 4,
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'right',
    },
    itemTime: {
        fontSize: 13,
        color: '#91919F',
        textAlign: 'right',
        marginTop: 4,
    },
    // Category items
    categoryItem: {
        marginBottom: 20,
    },
    categoryDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 10,
    },
    categoryName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    categoryAmount: {
        fontSize: 18,
        fontWeight: '500',
        color: '#FD3C4A',
    },
    progressBarBg: {
        height: 10,
        backgroundColor: '#F1F1FA',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuPopover: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: 200,
        paddingVertical: 8,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuText: {
        fontSize: 16,
        color: '#0D0E0F',
    },
    menuTextActive: {
        color: '#7F3DFF',
        fontWeight: '600',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#F1F1FA',
        marginHorizontal: 16,
    },
});