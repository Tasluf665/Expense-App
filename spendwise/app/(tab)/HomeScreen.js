import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Svg, { Path } from 'react-native-svg';
import Colors from '../../constant/Colors';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const [selectedPeriod, setSelectedPeriod] = useState('Today');

    const transactions = [
        {
            id: 1,
            title: 'Shopping',
            description: 'Buy some grocery',
            amount: -120,
            time: '10:00 AM',
            icon: 'shopping-basket',
            backgroundColor: '#FFF4E6',
            iconColor: '#FFA500',
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
        },
    ];

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
                    <Text style={styles.balanceAmount}>$9400</Text>

                    {/* Income and Expense Cards */}
                    <View style={styles.cardsContainer}>
                        {/* Income Card */}
                        <View style={[styles.card, styles.incomeCard]}>
                            <View style={styles.cardIcon}>
                                <FontAwesome name="arrow-down" size={20} color="#FFFFFF" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardLabel}>Income</Text>
                                <Text style={styles.cardAmount}>$5000</Text>
                            </View>
                        </View>

                        {/* Expense Card */}
                        <View style={[styles.card, styles.expenseCard]}>
                            <View style={styles.cardIcon}>
                                <FontAwesome name="arrow-up" size={20} color="#FFFFFF" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardLabel}>Expenses</Text>
                                <Text style={styles.cardAmount}>$1200</Text>
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
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Transaction List */}
                    {transactions.map((transaction) => (
                        <TouchableOpacity
                            key={transaction.id}
                            style={styles.transactionItem}
                            onPress={() => {
                                router.push("/(Common)/DetailsScreen")
                            }}
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
                                <Text style={styles.transactionAmount}>
                                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                                </Text>
                                <Text style={styles.transactionTime}>{transaction.time}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Extra padding for bottom tab bar */}
                <View style={{ height: 100 }} />
            </ScrollView>
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
