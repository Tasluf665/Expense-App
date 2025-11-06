import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SectionList,
    Modal,
    FlatList,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TransactionScreen() {
    const [selectedMonth, setSelectedMonth] = useState('Month');
    const [showMonthModal, setShowMonthModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterBy, setFilterBy] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const filterOptions = ['Income', 'Expense', 'Transfer'];
    const sortOptions = ['Highest', 'Lowest', 'Newest', 'Oldest'];
    const categories = ['Food', 'Shopping', 'Transportation', 'Entertainment', 'Bills', 'Salary', 'Bonus', 'Other'];

    const transactions = [
        {
            title: 'Today',
            data: [
                {
                    id: 1,
                    title: 'Shopping',
                    description: 'Buy some grocery',
                    amount: -120,
                    time: '10:00 AM',
                    icon: 'shopping-basket',
                    backgroundColor: '#FFF4E6',
                    iconColor: '#FFA500',
                    type: 'expense',
                },
                {
                    id: 2,
                    title: 'Subscription',
                    description: 'Disney+ Annual..',
                    amount: -80,
                    time: '03:30 PM',
                    icon: 'tv',
                    backgroundColor: '#F0E6FF',
                    iconColor: '#7C3FED',
                    type: 'expense',
                },
                {
                    id: 3,
                    title: 'Food',
                    description: 'Buy a ramen',
                    amount: -32,
                    time: '07:30 PM',
                    icon: 'cutlery',
                    backgroundColor: '#FFE6E6',
                    iconColor: '#FF5555',
                    type: 'expense',
                },
            ],
        },
        {
            title: 'Yesterday',
            data: [
                {
                    id: 4,
                    title: 'Salary',
                    description: 'Salary for July',
                    amount: 5000,
                    time: '04:30 PM',
                    icon: 'dollar',
                    backgroundColor: '#E6F9F5',
                    iconColor: '#00D09E',
                    type: 'income',
                },
                {
                    id: 5,
                    title: 'Transportation',
                    description: 'Charging Tesla',
                    amount: -18,
                    time: '08:30 PM',
                    icon: 'car',
                    backgroundColor: '#E6F2FF',
                    iconColor: '#3B82F6',
                    type: 'expense',
                },
            ],
        },
    ];

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
    };

    const handleApplyFilters = () => {
        console.log({
            filterBy,
            sortBy,
            selectedCategories,
        });
        setShowFilterModal(false);
    };

    const renderTransactionItem = ({ item }) => (
        <TouchableOpacity style={styles.transactionItem}>
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
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionDescription}>
                    {item.description}
                </Text>
            </View>
            <View style={styles.transactionRight}>
                <Text
                    style={[
                        styles.transactionAmount,
                        { color: item.type === 'expense' ? '#FF5555' : '#00D09E' },
                    ]}
                >
                    {item.type === 'expense' ? '-' : '+'}${Math.abs(item.amount)}
                </Text>
                <Text style={styles.transactionTime}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderSectionHeader = ({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    const renderMonthItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.monthItem,
                selectedMonth === item && styles.monthItemSelected,
            ]}
            onPress={() => handleMonthSelect(item)}
        >
            <Text
                style={[
                    styles.monthItemText,
                    selectedMonth === item && styles.monthItemTextSelected,
                ]}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Transaction</Text>

                {/* Month Filter and Filter Button */}
                <View style={styles.headerControls}>
                    <TouchableOpacity
                        style={styles.monthButton}
                        onPress={() => setShowMonthModal(true)}
                    >
                        <Text style={styles.monthButtonText}>{selectedMonth}</Text>
                        <FontAwesome name="chevron-down" size={14} color="#7C3FED" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowFilterModal(true)}
                    >
                        <FontAwesome name="sliders" size={20} color="#000000" />
                    </TouchableOpacity>
                </View>

                {/* Financial Report Banner */}
                <TouchableOpacity style={styles.reportBanner}>
                    <Text style={styles.reportText}>See your financial report</Text>
                    <FontAwesome name="chevron-right" size={18} color="#7C3FED" />
                </TouchableOpacity>
            </View>

            {/* Transaction List */}
            <SectionList
                sections={transactions}
                keyExtractor={(item) => item.id}
                renderItem={renderTransactionItem}
                renderSectionHeader={renderSectionHeader}
                scrollEnabled={true}
                contentContainerStyle={styles.listContent}
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

                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Month</Text>
                            <TouchableOpacity onPress={() => setShowMonthModal(false)}>
                                <FontAwesome name="times" size={24} color="#000000" />
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

                    <View style={styles.filterModalContent}>
                        {/* Handle Bar */}
                        <View style={styles.handleBar} />

                        {/* Filter Header */}
                        <View style={styles.filterHeader}>
                            <Text style={styles.filterTitle}>Filter Transaction</Text>
                            <TouchableOpacity onPress={handleReset}>
                                <Text style={styles.resetButton}>Reset</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.filterContent}
                        >
                            {/* Filter By Section */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Filter By</Text>
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
                                <Text style={styles.filterSectionTitle}>Sort By</Text>
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
                                <Text style={styles.filterSectionTitle}>Category</Text>
                                <TouchableOpacity style={styles.categorySelector}>
                                    <Text style={styles.categorySelectorText}>Choose Category</Text>
                                    <Text style={styles.selectedCountText}>
                                        {selectedCategories.length} Selected
                                    </Text>
                                    <FontAwesome name="chevron-right" size={16} color="#7C3FED" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        {/* Apply Button */}
                        <View style={styles.filterButtonContainer}>
                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={handleApplyFilters}
                            >
                                <Text style={styles.applyButtonText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
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
        gap: 12,
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
});
