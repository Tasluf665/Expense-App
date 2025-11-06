import { View, TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import { useState } from 'react';
import Colors from "../../constant/Colors";

export default () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();

    const handleAddPress = () => {
        setIsExpanded(!isExpanded);
    };

    const handleExpensePress = () => {
        setIsExpanded(false);
        router.push('/(Common)/ExpenseScreen');
    };

    const handleIncomePress = () => {
        setIsExpanded(false);
        router.push('/(Common)/IncomeScreen');
    };

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors.Primary || '#7C3FED',
                    tabBarInactiveTintColor: Colors.DarkGray || '#B0B0B0',
                    tabBarShowLabel: true,
                    tabBarStyle: styles.tabBar,
                    tabBarLabelStyle: styles.tabLabel,
                }}
            >
                <Tabs.Screen
                    name="HomeScreen"
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <FontAwesome size={24} name="home" color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="TransactionScreen"
                    options={{
                        title: "Transaction",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <FontAwesome size={24} name="exchange" color={color} />
                        ),
                    }}
                />
                {/* Center Floating Button */}
                <Tabs.Screen
                    name="AddScreen"
                    options={{
                        title: "",
                        headerShown: false,
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.floatingButtonContainer}>
                                <TouchableOpacity
                                    style={styles.floatingButton}
                                    activeOpacity={0.8}
                                    onPress={handleAddPress}
                                >
                                    <FontAwesome
                                        name={isExpanded ? "times" : "plus"}
                                        size={28}
                                        color="#FFFFFF"
                                    />
                                </TouchableOpacity>
                            </View>
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                        },
                    }}
                />
                <Tabs.Screen
                    name="ExportScreen"
                    options={{
                        title: "Export",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <FontAwesome size={24} name="pie-chart" color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="ProfileScreen"
                    options={{
                        title: "Profile",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <FontAwesome size={24} name="user" color={color} />
                        ),
                    }}
                />
            </Tabs>

            {/* Floating Action Buttons - Expense and Income (Side by Side) */}
            {isExpanded && (
                <View style={styles.expandedButtonsContainer}>
                    {/* Expense Button - Left */}
                    <TouchableOpacity
                        style={[styles.expandedButton, styles.expenseButton]}
                        onPress={handleExpensePress}
                        activeOpacity={0.8}
                    >
                        <FontAwesome name="arrow-up" size={24} color="#FFFFFF" />
                        <Text style={styles.expandedButtonLabel}>Expense</Text>
                    </TouchableOpacity>

                    {/* Income Button - Right */}
                    <TouchableOpacity
                        style={[styles.expandedButton, styles.incomeButton]}
                        onPress={handleIncomePress}
                        activeOpacity={0.8}
                    >
                        <FontAwesome name="arrow-down" size={24} color="#FFFFFF" />
                        <Text style={styles.expandedButtonLabel}>Income</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Overlay when expanded */}
            {isExpanded && (
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setIsExpanded(false)}
                    activeOpacity={0.5}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        height: 70,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    floatingButtonContainer: {
        position: 'absolute',
        top: -30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#7C3FED',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#7C3FED',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 6,
        borderColor: '#FFFFFF',
    },
    expandedButtonsContainer: {
        position: 'absolute',
        bottom: 85,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 40,
        zIndex: 1000,
    },
    expandedButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    expenseButton: {
        backgroundColor: '#FF5555',
    },
    incomeButton: {
        backgroundColor: '#00D09E',
    },
    expandedButtonLabel: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 999,
    },
});
