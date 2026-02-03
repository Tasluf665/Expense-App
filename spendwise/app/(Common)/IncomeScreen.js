import React, { useState, useEffect } from 'react';
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
import { supabase } from '../../lib/supabase';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useLocalSearchParams } from 'expo-router';

export default function IncomeScreen() {
    const params = useLocalSearchParams();
    const isEditMode = params.mode === 'edit';

    const [amount, setAmount] = useState(params.amount || '');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [description, setDescription] = useState(params.description || '');
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showWalletDropdown, setShowWalletDropdown] = useState(false);
    const router = useRouter();
    const currencySymbol = useSelector((state) => state.currency.symbol);
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);

    const [categories, setCategories] = useState([]);

    // Fetch categories from Supabase
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .or('type.eq.income,type.is.null'); // Fetch income categories or generic ones

                if (error) throw error;

                if (data && data.length > 0) {
                    setCategories(data);
                } else {
                    const defaultCategories = [
                        { id: 1, name: 'Salary', icon: 'dollar', color: '#00A86B' },
                        { id: 2, name: 'Passive Income', icon: 'line-chart', color: '#00A86B' },
                        { id: 3, name: 'Business', icon: 'briefcase', color: '#00A86B' },
                    ];
                    setCategories(defaultCategories);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // We need to change 'wallets' from const to state
    const [wallets, setWallets] = useState([]);

    useEffect(() => { // Fetch wallets
        const getWallets = async () => {
            const { data } = await supabase.from('wallets').select('*');
            if (data) setWallets(data);
        };
        getWallets();
    }, []);

    // Initialize selected items if in edit mode
    useEffect(() => {
        if (isEditMode) {
            if (params.category) {
                const category = categories.find(c => c.name === params.category);
                if (category) setSelectedCategory(category);
            }
            if (params.wallet_id && wallets.length > 0) {
                const wallet = wallets.find(w => w.id === params.wallet_id);
                if (wallet) setSelectedWallet(wallet);
            }
        }
    }, [isEditMode, wallets, categories, params]);

    const handleContinue = async () => {
        if (!amount || !selectedCategory || !selectedWallet) {
            alert('Please fill all required fields');
            return;
        }

        const incomeAmount = parseFloat(amount);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('User not authenticated');
                return;
            }

            const payload = {
                user_id: user.id,
                amount: incomeAmount,
                category: selectedCategory.name,
                wallet_id: selectedWallet.id,
                wallet: selectedWallet.name,
                description: description,
                created_at: date.toISOString(),
            };

            let error;
            if (isEditMode) {
                // DB Trigger handles wallet updates now
                const { error: updateError } = await supabase
                    .from('income')
                    .update(payload)
                    .eq('id', params.id);
                error = updateError;

            } else {
                // DB Trigger handles wallet updates now
                const { error: insertError } = await supabase
                    .from('income')
                    .insert([payload]);
                error = insertError;
            }

            if (error) {
                console.error('Error saving income:', error);
                alert(`Failed to ${isEditMode ? 'update' : 'add'} income`);
            } else {
                alert(`Income ${isEditMode ? 'updated' : 'added'} successfully`);
                router.back();
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred: ' + error.message);
        }
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
                        <Text style={styles.headerTitle}>{isEditMode ? 'Edit Income' : 'Income'}</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {/* Amount Input Field */}
                    <Text style={styles.amountLabel}>How much?</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.currencySymbol}>{currencySymbol}</Text>
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
                                    <FontAwesome name={category.icon} size={16} color={category.color || "#00D09E"} />
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
                        style={[styles.inputField, isEditMode && { opacity: 0.7 }]}
                        onPress={() => !isEditMode && setShowWalletDropdown(!showWalletDropdown)}
                        disabled={isEditMode}
                    >
                        <Text
                            style={[
                                styles.inputLabel,
                                selectedWallet && styles.inputLabelSelected,
                            ]}
                        >
                            {selectedWallet ? selectedWallet.name : 'Wallet'}
                        </Text>
                        {!isEditMode && <FontAwesome name="chevron-down" size={16} color="#B0B0B0" />}
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
                                    <FontAwesome name="bank" size={16} color="#00D09E" />
                                    <Text style={styles.dropdownItemText}>{wallet.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Date Picker */}
                    <TouchableOpacity
                        style={styles.inputField}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={[styles.inputLabel, { color: '#000', fontWeight: '500' }]}>
                            {format(date, 'dd MMM yyyy')}
                        </Text>
                        <FontAwesome name="calendar" size={16} color="#B0B0B0" />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDate(selectedDate);
                            }}
                        />
                    )}

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                    >
                        <Text style={styles.continueButtonText}>{isEditMode ? 'Update' : 'Continue'}</Text>
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
