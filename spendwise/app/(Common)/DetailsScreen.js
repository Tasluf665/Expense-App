import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

export default function DetailsScreen() {
    const router = useRouter();
    const [showEditModal, setShowEditModal] = useState(false);

    // Sample transaction data (can be passed as params)
    const [transaction, setTransaction] = useState({
        type: 'Expense',
        amount: 120,
        description: 'Buy some grocery',
        date: 'Saturday 4 June 2021',
        time: '16:20',
        category: 'Shopping',
        wallet: 'Wallet',
        detailedDescription: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
        isExpense: true,
    });

    // Edit modal state
    const [editAmount, setEditAmount] = useState(String(transaction.amount));
    const [editDescription, setEditDescription] = useState(transaction.description);
    const [selectedCategory, setSelectedCategory] = useState(transaction.category);
    const [selectedWallet, setSelectedWallet] = useState(transaction.wallet);
    const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showWalletDropdown, setShowWalletDropdown] = useState(false);

    const categories = [
        { id: 1, name: 'Food', icon: 'cutlery' },
        { id: 2, name: 'Shopping', icon: 'shopping-bag' },
        { id: 3, name: 'Transport', icon: 'car' },
        { id: 4, name: 'Entertainment', icon: 'film' },
        { id: 5, name: 'Bills', icon: 'file-text' },
        { id: 6, name: 'Other', icon: 'ellipsis-h' },
    ];

    const wallets = [
        { id: 1, name: 'Cash' },
        { id: 2, name: 'Debit Card' },
        { id: 3, name: 'Credit Card' },
    ];

    const handleEditPress = () => {
        setEditAmount(String(transaction.amount));
        setEditDescription(transaction.description);
        setSelectedCategory(transaction.category);
        setSelectedWallet(transaction.wallet);
        setShowEditModal(true);
    };

    const handleSaveChanges = () => {
        setTransaction({
            ...transaction,
            amount: parseInt(editAmount),
            description: editDescription,
            category: selectedCategory,
            wallet: selectedWallet,
        });
        setShowEditModal(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header with Red Gradient */}
                <LinearGradient
                    colors={transaction.isExpense ? ['#FF5555', '#FF3333'] : ['#00D09E', '#00B887']}
                    style={styles.header}
                >
                    {/* Top Controls */}
                    <View style={styles.headerControls}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Detail Transaction</Text>
                        <TouchableOpacity>
                            <FontAwesome name="trash" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Amount */}
                    <View style={styles.amountSection}>
                        <Text style={styles.amountLabel}>${transaction.amount}</Text>
                    </View>

                    {/* Description and Date/Time */}
                    <View style={styles.descriptionSection}>
                        <Text style={styles.descriptionText}>{transaction.description}</Text>
                        <Text style={styles.dateTimeText}>
                            {transaction.date} {transaction.time}
                        </Text>
                    </View>
                </LinearGradient>

                {/* Details Card */}
                <View style={styles.detailsCard}>
                    {/* Type, Category, Wallet Row */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoColumn}>
                            <Text style={styles.infoLabel}>Type</Text>
                            <Text style={styles.infoValue}>{transaction.type}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoColumn}>
                            <Text style={styles.infoLabel}>Category</Text>
                            <Text style={styles.infoValue}>{transaction.category}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoColumn}>
                            <Text style={styles.infoLabel}>Wallet</Text>
                            <Text style={styles.infoValue}>{transaction.wallet}</Text>
                        </View>
                    </View>

                    {/* Dashed Divider */}
                    <View style={styles.dashedDivider} />

                    {/* Description Section */}
                    <View style={styles.descriptionSection2}>
                        <Text style={styles.descriptionTitle}>Description</Text>
                        <Text style={styles.descriptionContent}>
                            {transaction.detailedDescription}
                        </Text>
                    </View>

                    {/* Edit Button */}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditPress}
                    >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
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

                    <View style={styles.editModalContent}>
                        {/* Handle Bar */}
                        <View style={styles.handleBar} />

                        {/* Modal Header */}
                        <View style={styles.editModalHeader}>
                            <Text style={styles.editModalTitle}>Edit Transaction</Text>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <FontAwesome name="times" size={24} color="#000000" />
                            </TouchableOpacity>
                        </View>

                        {/* Edit Form */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.editFormContent}
                        >
                            {/* Amount Input */}
                            <View style={styles.editSection}>
                                <Text style={styles.editSectionLabel}>Amount</Text>
                                <View style={styles.amountInputContainer}>
                                    <Text style={styles.currencySymbol}>$</Text>
                                    <TextInput
                                        style={styles.amountEditInput}
                                        placeholder="0"
                                        placeholderTextColor="#B0B0B0"
                                        value={editAmount}
                                        onChangeText={setEditAmount}
                                        keyboardType="decimal-pad"
                                        maxLength={10}
                                    />
                                </View>
                            </View>

                            {/* Description Input */}
                            <View style={styles.editSection}>
                                <Text style={styles.editSectionLabel}>Description</Text>
                                <TextInput
                                    style={styles.descriptionEditInput}
                                    placeholder="Description"
                                    placeholderTextColor="#B0B0B0"
                                    value={editDescription}
                                    onChangeText={setEditDescription}
                                />
                            </View>

                            {/* Category Dropdown */}
                            <View style={styles.editSection}>
                                <Text style={styles.editSectionLabel}>Category</Text>
                                <TouchableOpacity
                                    style={styles.editDropdown}
                                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                >
                                    <Text style={styles.editDropdownText}>{selectedCategory}</Text>
                                    <FontAwesome name="chevron-down" size={16} color="#B0B0B0" />
                                </TouchableOpacity>

                                {/* Category Dropdown Menu */}
                                {showCategoryDropdown && (
                                    <View style={styles.editDropdownMenu}>
                                        {categories.map((category) => (
                                            <TouchableOpacity
                                                key={category.id}
                                                style={styles.editDropdownItem}
                                                onPress={() => {
                                                    setSelectedCategory(category.name);
                                                    setShowCategoryDropdown(false);
                                                }}
                                            >
                                                <FontAwesome
                                                    name={category.icon}
                                                    size={16}
                                                    color="#7C3FED"
                                                />
                                                <Text style={styles.editDropdownItemText}>
                                                    {category.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Wallet Dropdown */}
                            <View style={styles.editSection}>
                                <Text style={styles.editSectionLabel}>Wallet</Text>
                                <TouchableOpacity
                                    style={styles.editDropdown}
                                    onPress={() => setShowWalletDropdown(!showWalletDropdown)}
                                >
                                    <Text style={styles.editDropdownText}>{selectedWallet}</Text>
                                    <FontAwesome name="chevron-down" size={16} color="#B0B0B0" />
                                </TouchableOpacity>

                                {/* Wallet Dropdown Menu */}
                                {showWalletDropdown && (
                                    <View style={styles.editDropdownMenu}>
                                        {wallets.map((wallet) => (
                                            <TouchableOpacity
                                                key={wallet.id}
                                                style={styles.editDropdownItem}
                                                onPress={() => {
                                                    setSelectedWallet(wallet.name);
                                                    setShowWalletDropdown(false);
                                                }}
                                            >
                                                <FontAwesome name="wallet" size={16} color="#7C3FED" />
                                                <Text style={styles.editDropdownItemText}>
                                                    {wallet.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Repeat Toggle */}
                            <View style={styles.editRepeatContainer}>
                                <View>
                                    <Text style={styles.editRepeatLabel}>Repeat</Text>
                                    <Text style={styles.editRepeatSubtext}>Repeat transaction</Text>
                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.editToggle,
                                        isRepeatEnabled && styles.editToggleActive,
                                    ]}
                                    onPress={() => setIsRepeatEnabled(!isRepeatEnabled)}
                                >
                                    <View
                                        style={[
                                            styles.editToggleCircle,
                                            isRepeatEnabled && styles.editToggleCircleActive,
                                        ]}
                                    />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        {/* Action Buttons */}
                        <View style={styles.editButtonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowEditModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveChanges}
                            >
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 40,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    amountSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    amountLabel: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    descriptionSection: {
        alignItems: 'center',
    },
    descriptionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    dateTimeText: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    detailsCard: {
        marginHorizontal: 20,
        marginTop: -30,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    infoColumn: {
        flex: 1,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 13,
        color: '#B0B0B0',
        marginBottom: 8,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E5E5',
        marginHorizontal: 12,
    },
    dashedDivider: {
        height: 1,
        backgroundColor: '#E5E5E5',
        marginBottom: 20,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    descriptionSection2: {
        marginBottom: 20,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 12,
    },
    descriptionContent: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 22,
    },
    editButton: {
        backgroundColor: '#7C3FED',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    editButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
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
        paddingBottom: 30,
        maxHeight: '90%',
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
    editModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    editModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    editFormContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    editSection: {
        marginBottom: 20,
    },
    editSectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9F9F9',
    },
    currencySymbol: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginRight: 8,
    },
    amountEditInput: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        paddingVertical: 12,
    },
    descriptionEditInput: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#000000',
        backgroundColor: '#F9F9F9',
    },
    editDropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        backgroundColor: '#F9F9F9',
    },
    editDropdownText: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
    },
    editDropdownMenu: {
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        marginTop: 8,
        overflow: 'hidden',
        marginBottom: 16,
    },
    editDropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    editDropdownItemText: {
        fontSize: 14,
        color: '#000000',
    },
    editRepeatContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9F9F9',
    },
    editRepeatLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    editRepeatSubtext: {
        fontSize: 12,
        color: '#999999',
    },
    editToggle: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E8E8E8',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    editToggleActive: {
        backgroundColor: '#D4C5F9',
    },
    editToggleCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    editToggleCircleActive: {
        alignSelf: 'flex-end',
    },
    editButtonContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E5E5',
        backgroundColor: '#F9F9F9',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#7C3FED',
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
