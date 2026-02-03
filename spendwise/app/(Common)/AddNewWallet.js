import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../../constant/Colors';
import { getColors } from '../../utils/themeSlice';
import { supabase } from '../../lib/supabase'; // Assuming Supabase client is setup here

export default function AddNewWallet() {
    const router = useRouter();
    const [balance, setBalance] = useState('0');
    const [name, setName] = useState('');
    const [accountType, setAccountType] = useState('Bank'); // Default
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const currencySymbol = useSelector((state) => state.currency.symbol);
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);

    // Hardcoded for now, could be dynamic
    // Figma shows specific bank icons, we will use FontAwesome + Color as proxy or just generic icons for now
    // In a real app we might upload images or use a specific icon set
    const [selectedIcon, setSelectedIcon] = useState('bank');
    const [selectedColor, setSelectedColor] = useState('#7F3DFF');

    const accountTypes = ['Bank', 'Cash'];

    // Mapping fake bank names to icons/colors for UI impact matching Figma
    const providers = [
        { name: 'Revolut', icon: 'credit-card-alt', color: '#0075EB' },
        { name: 'Wise', icon: 'globe', color: '#9DCA00' },
        { name: 'Paypal', icon: 'paypal', color: '#003087' },
        { name: 'S-Bank', icon: 'bank', color: '#5266FA' },
        { name: 'ABN', icon: 'university', color: '#008573' },
        { name: 'Cash', icon: 'money', color: '#27AE60' },
    ];

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'Please enter a wallet name');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user logged in');

            const { error } = await supabase
                .from('wallets')
                .insert([
                    {
                        name: name,
                        amount: parseFloat(balance),
                        icon: selectedIcon,
                        color: selectedColor,
                        type: accountType,
                        user_id: user.id
                    }
                ]);

            if (error) throw error;

            router.back();
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Background */}
            <View style={styles.headerBackground}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <FontAwesome name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add new account</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Balance Input */}
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Balance</Text>
                    <View style={styles.amountWrapper}>
                        <Text style={styles.currencySymbol}>{currencySymbol}</Text>
                        <TextInput
                            style={styles.amountInput}
                            value={balance}
                            onChangeText={setBalance}
                            keyboardType="numeric"
                            placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                    </View>
                </View>
            </View>

            {/* Bottom Form Sheet */}
            <View style={[styles.formContainer, { backgroundColor: colors.background }]}>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.textPrimary, borderColor: colors.border }]}
                    placeholder="Name"
                    placeholderTextColor={colors.textSecondary}
                    value={name}
                    onChangeText={setName}
                />

                <TouchableOpacity
                    style={[styles.inputSelector, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={[styles.inputText, { color: colors.textPrimary }]}>{accountType || 'Account Type'}</Text>
                    <FontAwesome name="chevron-down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Provider Grid (simplified version of Figma's grid) */}
                <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Bank</Text>
                <View style={styles.providerGrid}>
                    {providers.map((p, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.providerItem,
                                { backgroundColor: colors.cardBackground, borderColor: colors.border },
                                (selectedColor === p.color && selectedIcon === p.icon) && { ...styles.selectedProvider, backgroundColor: p.color + '20', borderColor: p.color }
                            ]}
                            onPress={() => {
                                setAccountType(p.name);
                                setSelectedIcon(p.icon);
                                setSelectedColor(p.color);
                            }}
                        >
                            <View style={[styles.providerIcon, { backgroundColor: p.color + '20' }]}>
                                <FontAwesome name={p.icon} size={20} color={p.color} />
                            </View>
                            <Text style={[styles.providerName, { color: colors.textPrimary }]}>{p.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ flex: 1 }} />

                <TouchableOpacity style={styles.continueButton} onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.continueButtonText}>Continue</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Account Type Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Account Type</Text>
                        {accountTypes.map((type, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.modalItem, { borderBottomColor: colors.border }]}
                                onPress={() => {
                                    setAccountType(type);
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={[styles.modalItemText, { color: colors.textPrimary }]}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.background }]} onPress={() => setModalVisible(false)}>
                            <Text style={[styles.closeButtonText, { color: colors.textPrimary }]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7F3DFF', // Purple background for top half
    },
    headerBackground: {
        height: '40%', // Take up top portion
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    balanceContainer: {
        marginTop: 40,
        marginLeft: 10,
    },
    balanceLabel: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
        marginBottom: 10,
    },
    amountWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 10,
    },
    amountInput: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        marginTop: -30, // Overlap slightly
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F1F1FA',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        color: '#000',
    },
    inputSelector: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F1F1FA',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    inputText: {
        fontSize: 16,
        color: '#000',
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    providerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    providerItem: {
        width: '30%',
        backgroundColor: '#F7F9FA',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedProvider: {
        borderColor: '#7F3DFF',
        backgroundColor: '#F3E8FF',
    },
    providerIcon: {
        width: 30,
        height: 30,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    providerName: {
        fontSize: 12,
        fontWeight: '500',
    },
    continueButton: {
        backgroundColor: '#7F3DFF',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    modalView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalItemText: {
        fontSize: 18,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#eee',
        borderRadius: 10,
    },
    closeButtonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});
