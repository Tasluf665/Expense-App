import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

export default function ExportScreen() {
    const router = useRouter();
    const [chartType, setChartType] = useState('line'); // 'line' or 'pie'
    const [transactionType, setTransactionType] = useState('expense'); // 'expense', 'income'
    const [selectedMonth, setSelectedMonth] = useState('Month');
    const [totalAmount, setTotalAmount] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [transactions, setTransactions] = useState([]); // Raw transaction list
    const [pieData, setPieData] = useState([]);           // Processed pie data
    const [loading, setLoading] = useState(false);

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

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [transactionType])
    );

    // Update chart data when chartType changes, without re-fetching if not needed
    // However, for simplicity, we can just process data again if we have it, 
    // or just let fetchData handle it. 
    // The issue was listData being stale. 
    // Now we will separate the data sources for the list view.

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const table = transactionType === 'expense' ? 'expenses' : 'income';

            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) {
                console.error(error);
                return;
            }

            // Calculate Total
            const total = data.reduce((sum, item) => sum + Number(item.amount), 0);
            setTotalAmount(total);

            // Store raw transactions
            setTransactions(data.map(item => ({ ...item })).reverse());

            // Process Pie Data regardless of current view, so it's ready
            const pData = processPieChartData(data, total);
            setPieData(pData);

            // Update Chart Data based on current type
            if (chartType === 'line') {
                processLineChartData(data);
            } else {
                setChartData(pData);
            }

        } catch (error) {
            console.error('Error fetching export data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Effect to update chart data when switching chart types locally
    React.useEffect(() => {
        if (chartType === 'line') {
            // Re-process line data from transactions (which is reversed in state, so we need to reverse back or just use valid source)
            // Ideally we should store sorted data.
            // Let's just re-fetch or keep raw data sorted.
            // Optimized: keep raw data in state.
            // But fetchData sets `transactions` as reversed.
            // Let's just fetch again or ensure we have non-reversed data. 
            // Simplest: just call fetchData which is cheap enough or refactor to store straight data.
            fetchData();
        } else {
            setChartData(pieData);
        }
    }, [chartType]);

    const processLineChartData = (data) => {
        // Group by day for the chart
        const points = data.map(item => ({
            value: Number(item.amount),
            label: format(new Date(item.created_at), 'd'),
            dataPointText: '',
        }));

        if (points.length === 0) {
            setChartData([{ value: 0 }, { value: 0 }]);
        } else {
            setChartData(points);
        }
    };

    const processPieChartData = (data, total) => {
        const categoryMap = {};

        data.forEach(item => {
            if (!categoryMap[item.category]) {
                categoryMap[item.category] = 0;
            }
            categoryMap[item.category] += Number(item.amount);
        });

        // Predefined colors for categories to match UI
        const categoryColors = {
            'Shopping': '#FCAE12',
            'Subscription': '#7F3DFF',
            'Food': '#FD3C4A',
            'Transport': '#3B82F6',
            'Salary': '#00A86B',
            'Passive Income': '#00A86B',
            'Other': '#EEE5FF',
        };

        const pieResult = Object.keys(categoryMap).map((cat, index) => ({
            value: categoryMap[cat],
            color: categoryColors[cat] || `hsl(${index * 60}, 70%, 50%)`,
            text: total > 0 ? `${((categoryMap[cat] / total) * 100).toFixed(0)}%` : '0%',
            category: cat,
            amount: categoryMap[cat],
            focused: index === 0,
        }));

        return pieResult.sort((a, b) => b.value - a.value);
    };

    const getCategoryIcon = (category) => {
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

    const getCategoryColor = (category) => {
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
                <FontAwesome name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Financial Report</Text>
            <View style={{ width: 24 }} />
        </View>
    );

    const renderControls = () => (
        <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.monthSelector}>
                <FontAwesome name="angle-down" size={18} color={colors.primary} />
                <Text style={styles.monthText}>{selectedMonth}</Text>
            </TouchableOpacity>

            <View style={styles.chartToggle}>
                <TouchableOpacity
                    style={[styles.chartBtn, chartType === 'line' && styles.chartBtnActive]}
                    onPress={() => setChartType('line')}
                >
                    <FontAwesome name="line-chart" size={16} color={chartType === 'line' ? '#fff' : colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.chartBtn, chartType === 'pie' && styles.chartBtnActive]}
                    onPress={() => setChartType('pie')}
                >
                    <FontAwesome name="pie-chart" size={16} color={chartType === 'pie' ? '#fff' : colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {renderHeader()}

            <ScrollView showsVerticalScrollIndicator={false}>
                {renderControls()}

                <Text style={styles.totalLabel}>
                    Total {transactionType === 'expense' ? 'Expense' : 'Income'}
                </Text>
                <Text style={styles.totalAmount}>$ {totalAmount.toFixed(0)}</Text>

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
                                innerCircleColor={'#fff'}
                                centerLabelComponent={() => (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }}>
                                            ${totalAmount.toFixed(0)}
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>
                    )}
                </View>

                {/* TOGGLE */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, transactionType === 'expense' && styles.toggleBtnActive]}
                        onPress={() => setTransactionType('expense')}
                    >
                        <Text style={[styles.toggleText, transactionType === 'expense' && styles.toggleTextActive]}>Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleBtn, transactionType === 'income' && styles.toggleBtnActive]}
                        onPress={() => setTransactionType('income')}
                    >
                        <Text style={[styles.toggleText, transactionType === 'income' && styles.toggleTextActive]}>Income</Text>
                    </TouchableOpacity>
                </View>

                {/* LIST HEADER */}
                <View style={styles.listHeader}>
                    <TouchableOpacity style={styles.filterBtn}>
                        <FontAwesome name="angle-down" size={16} color={colors.gray} />
                        <Text style={styles.filterText}>{chartType === 'line' ? 'Transaction' : 'Category'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sortBtn}>
                        <FontAwesome name="sort-amount-desc" size={20} color="black" />
                    </TouchableOpacity>
                </View>

                {/* LIST ITEMS */}
                <View style={styles.listContainer}>
                    {chartType === 'line' ? (
                        // TRANSACTION LIST
                        transactions.map((item, index) => (
                            <View key={index} style={styles.transactionItem}>
                                <View style={[styles.iconContainer, { backgroundColor: '#FFFAE6' }]}>
                                    <FontAwesome name={getCategoryIcon(item.category)} size={24} color="#FCAE12" />
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.itemTitle}>{item.category}</Text>
                                    <Text style={styles.itemSubtitle}>{item.description}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.itemAmount, { color: colors.expense }]}>
                                        - ${item.amount}
                                    </Text>
                                    <Text style={styles.itemTime}>
                                        {item.created_at ? format(new Date(item.created_at), 'hh:mm a') : ''}
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
                                    <Text style={styles.categoryName}>{item.category}</Text>
                                    <Text style={[styles.categoryAmount, { color: colors.expense }]}>
                                        - ${item.amount}
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

                <View style={{ height: 100 }} />
            </ScrollView>
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
});