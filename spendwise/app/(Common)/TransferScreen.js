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
    Alert,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TransferScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const currencySymbol = useSelector((state) => state.currency.symbol);
    const isEditMode = params.mode === 'edit';

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [fromWallet, setFromWallet] = useState(null);
    const [toWallet, setToWallet] = useState(null);
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [wallets, setWallets] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const { data, error } = await supabase.from('wallets').select('*');
                if (error) throw error;
                const fetchedWallets = data || [];
                setWallets(fetchedWallets);

                if (isEditMode && fetchedWallets.length > 0) {
                    if (params.amount) setAmount(params.amount);
                    if (params.description) setDescription(params.description);
                    if (params.date) setDate(new Date(params.date));

                    const fromW = fetchedWallets.find(w => w.id === params.from_wallet_id);
                    if (fromW) setFromWallet(fromW);

                    const toW = fetchedWallets.find(w => w.id === params.to_wallet_id);
                    if (toW) setToWallet(toW);
                }
            } catch (error) {
                console.error('Error fetching wallets:', error);
                Alert.alert('Error', 'Failed to load wallets');
            }
        };
        fetchWallets();
    }, [isEditMode, params]);

    const handleTransfer = async () => {
        if (!amount || !fromWallet || !toWallet) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        if (fromWallet.id === toWallet.id) {
            Alert.alert('Error', 'Cannot transfer to the same wallet');
            return;
        }

        const transferAmount = parseFloat(amount);
        let availableBalance = fromWallet.amount;

        // If editing and source wallet is same, add back old amount to check availability properly
        if (isEditMode && fromWallet.id === params.from_wallet_id) {
            availableBalance += parseFloat(params.amount || 0);
        }

        if (transferAmount > availableBalance) {
            Alert.alert('Error', 'Insufficient funds in source wallet');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Payload for both insert and update
            const payload = {
                from_wallet_id: fromWallet.id,
                to_wallet_id: toWallet.id,
                amount: transferAmount,
                description: description,
                user_id: user.id,
                created_at: date.toISOString(),
            };

            if (isEditMode) {
                // DB Trigger handles wallet updates now
                const { error: updateError } = await supabase
                    .from('transfers')
                    .update(payload)
                    .eq('id', params.id);
                if (updateError) throw updateError;

                Alert.alert('Success', 'Transfer updated successfully');

            } else {
                // DB Trigger handles wallet updates now
                const { error: transferError } = await supabase
                    .from('transfers')
                    .insert([payload]);

                if (transferError) throw transferError;

                Alert.alert('Success', 'Transfer completed successfully');
            }

            router.back();

        } catch (error) {
            console.error('Transfer error:', error);
            Alert.alert('Error', 'Failed to complete transfer: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <LinearGradient
                    colors={['#0077FF', '#0055CC']}
                    style={styles.header}
                >
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{isEditMode ? 'Edit Transfer' : 'Transfer'}</Text>
                        <View style={{ width: 24 }} />
                    </View>

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
                        />
                    </View>
                </LinearGradient>

                <View style={styles.formSection}>
                    {/* From Wallet */}
                    <View style={{ zIndex: 2000 }}>
                        <Text style={styles.inputLabel}>From</Text>
                        <TouchableOpacity
                            style={styles.inputField}
                            onPress={() => {
                                setShowFromDropdown(!showFromDropdown);
                                setShowToDropdown(false);
                            }}
                        >
                            <Text style={[styles.inputText, fromWallet && styles.selectedText]}>
                                {fromWallet ? fromWallet.name : 'Select Wallet'}
                            </Text>
                            <FontAwesome name="chevron-down" size={16} color="#B0B0B0" />
                        </TouchableOpacity>

                        {showFromDropdown && (
                            <View style={styles.dropdownMenu}>
                                {wallets.map((wallet) => (
                                    <TouchableOpacity
                                        key={wallet.id}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setFromWallet(wallet);
                                            setShowFromDropdown(false);
                                        }}
                                    >
                                        <View style={[styles.iconContainer, { backgroundColor: wallet.color + '20' }]}>
                                            <FontAwesome name={wallet.icon || 'bank'} size={14} color={wallet.color} />
                                        </View>
                                        <Text style={styles.dropdownItemText}>{wallet.name}</Text>
                                        <Text style={styles.balanceText}>{currencySymbol}{wallet.amount}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* To Wallet */}
                    <View style={{ zIndex: 1000, marginTop: 16 }}>
                        <Text style={styles.inputLabel}>To</Text>
                        <TouchableOpacity
                            style={styles.inputField}
                            onPress={() => {
                                setShowToDropdown(!showToDropdown);
                                setShowFromDropdown(false);
                            }}
                        >
                            <Text style={[styles.inputText, toWallet && styles.selectedText]}>
                                {toWallet ? toWallet.name : 'Select Wallet'}
                            </Text>
                            <FontAwesome name="chevron-down" size={16} color="#B0B0B0" />
                        </TouchableOpacity>

                        {showToDropdown && (
                            <View style={styles.dropdownMenu}>
                                {wallets
                                    .filter(w => !fromWallet || w.id !== fromWallet.id)
                                    .map((wallet) => (
                                        <TouchableOpacity
                                            key={wallet.id}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setToWallet(wallet);
                                                setShowToDropdown(false);
                                            }}
                                        >
                                            <View style={[styles.iconContainer, { backgroundColor: wallet.color + '20' }]}>
                                                <FontAwesome name={wallet.icon || 'bank'} size={14} color={wallet.color} />
                                            </View>
                                            <Text style={styles.dropdownItemText}>{wallet.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                            </View>
                        )}
                    </View>

                    {/* Description */}
                    <View style={{ marginTop: 16 }}>
                        <TextInput
                            style={styles.descriptionInput}
                            placeholder="Description"
                            placeholderTextColor="#B0B0B0"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />
                    </View>

                    {/* Date Picker */}
                    <View style={{ marginTop: 16 }}>
                        <Text style={styles.inputLabel}>Date</Text>
                        <TouchableOpacity
                            style={styles.inputField}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={[styles.inputText, { color: '#000', fontWeight: '500' }]}>
                                {format(date, 'dd MMM yyyy')}
                            </Text>
                            <FontAwesome name="calendar" size={16} color="#B0B0B0" />
                        </TouchableOpacity>
                    </View>

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

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleTransfer}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.continueButtonText}>{isEditMode ? 'Update' : 'Continue'}</Text>
                        )}
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
    inputLabel: {
        fontSize: 16,
        color: '#91919F',
        marginBottom: 8,
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
        backgroundColor: '#F9F9F9',
    },
    inputText: {
        fontSize: 16,
        color: '#B0B0B0',
    },
    selectedText: {
        color: '#000000',
        fontWeight: '500',
    },
    dropdownMenu: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        zIndex: 3000,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        maxHeight: 200,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
    balanceText: {
        fontSize: 14,
        color: '#91919F',
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
    continueButton: {
        backgroundColor: '#0077FF',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    continueButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
