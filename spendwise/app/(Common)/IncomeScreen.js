import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

export default function IncomeScreen() {
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [description, setDescription] = useState('');
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showWalletDropdown, setShowWalletDropdown] = useState(false);
    const router = useRouter();

    const categories = [
        { id: 1, name: 'Salary', icon: 'briefcase' },
        { id: 2, name: 'Bonus', icon: 'gift' },
        { id: 3, name: 'Freelance', icon: 'laptop' },
        { id: 4, name: 'Investment', icon: 'line-chart' },
        { id: 5, name: 'Refund', icon: 'undo' },
        { id: 6, name: 'Other', icon: 'ellipsis-h' },
    ];

    const wallets = [
        { id: 1, name: 'Cash' },
        { id: 2, name: 'Debit Card' },
        { id: 3, name: 'Credit Card' },
    ];

    const handleContinue = () => {
        if (!amount || !selectedCategory || !selectedWallet) {
            alert('Please fill all required fields');
            return;
        }
        console.log({
            amount,
            category: selectedCategory,
            description,
            wallet: selectedWallet,
            repeat: isRepeatEnabled,
        });
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
                {/* Header with Green Gradient */}
                <LinearGradient
                    colors={['#00D09E', '#00B887']}
                    style={styles.header}
                >
                    {/* Back Button */}
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Income</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {/* Amount Input Field */}
                    <Text style={styles.amountLabel}>How much?</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="decimal-pad"
                            maxLength={10}
                        />
                    </View>
                </LinearGradient>

                {/* Form Section */}
                <View style={styles.formSection}>
                    {/* Category Dropdown */}
                    <TouchableOpacity
                        style={styles.inputField}
                        onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    >
                        <Text
                            style={[
                                styles.inputLabel,
                                selectedCategory && styles.inputLabelSelected,
                            ]}
                        >
                            {selectedCategory ? selectedCategory.name : 'Category'}
                        </Text>
                        <FontAwesome name="chevron-down" size={16} color="#B0B0B0" />
                    </TouchableOpacity>

                    {/* Category Dropdown Menu */}
                    {showCategoryDropdown && (
                        <View style={styles.dropdownMenu}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setSelectedCategory(category);
                                        setShowCategoryDropdown(false);
                                    }}
                                >
                                    <FontAwesome name={category.icon} size={16} color="#00D09E" />
                                    <Text style={styles.dropdownItemText}>{category.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Description Input */}
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Description"
                        placeholderTextColor="#B0B0B0"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    {/* Wallet Dropdown */}
                    <TouchableOpacity
                        style={styles.inputField}
                        onPress={() => setShowWalletDropdown(!showWalletDropdown)}
                    >
                        <Text
                            style={[
                                styles.inputLabel,
                                selectedWallet && styles.inputLabelSelected,
                            ]}
                        >
                            {selectedWallet ? selectedWallet.name : 'Wallet'}
                        </Text>
                        <FontAwesome name="chevron-down" size={16} color="#B0B0B0" />
                    </TouchableOpacity>

                    {/* Wallet Dropdown Menu */}
                    {showWalletDropdown && (
                        <View style={styles.dropdownMenu}>
                            {wallets.map((wallet) => (
                                <TouchableOpacity
                                    key={wallet.id}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setSelectedWallet(wallet);
                                        setShowWalletDropdown(false);
                                    }}
                                >
                                    <FontAwesome name="wallet" size={16} color="#00D09E" />
                                    <Text style={styles.dropdownItemText}>{wallet.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Repeat Toggle */}
                    <View style={styles.repeatContainer}>
                        <View>
                            <Text style={styles.repeatLabel}>Repeat</Text>
                            <Text style={styles.repeatSubtext}>Repeat transaction</Text>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.toggle,
                                isRepeatEnabled && styles.toggleActive,
                            ]}
                            onPress={() => setIsRepeatEnabled(!isRepeatEnabled)}
                        >
                            <View
                                style={[
                                    styles.toggleCircle,
                                    isRepeatEnabled && styles.toggleCircleActive,
                                ]}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                    >
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        padding: 20,
        paddingTop: 50,
        paddingBottom: 40,
    },
    headerTop: {
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
    amountLabel: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 16,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        padding: 0,
    },
    formSection: {
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    inputField: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#F9F9F9',
    },
    inputLabel: {
        fontSize: 16,
        color: '#B0B0B0',
    },
    inputLabelSelected: {
        color: '#000000',
        fontWeight: '500',
    },
    dropdownMenu: {
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#000000',
    },
    descriptionInput: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#000000',
        marginBottom: 16,
        backgroundColor: '#F9F9F9',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    repeatContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 30,
    },
    repeatLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    repeatSubtext: {
        fontSize: 13,
        color: '#999999',
    },
    toggle: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E8E8E8',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleActive: {
        backgroundColor: '#D4F5EC',
    },
    toggleCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    toggleCircleActive: {
        alignSelf: 'flex-end',
    },
    continueButton: {
        backgroundColor: '#7C3FED',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
