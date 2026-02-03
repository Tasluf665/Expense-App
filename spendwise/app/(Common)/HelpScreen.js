import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';

export default function HelpScreen() {
    const router = useRouter();
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);

    const faqs = [
        {
            question: 'How do I add a transaction?',
            answer: 'Tap the "+" button at the bottom of the screen. Select Expense, Income, or Transfer, enter the amount, choose a category, and save.'
        },
        {
            question: 'Can I edit or delete a transaction?',
            answer: 'Yes. Go to the Transaction History or Account Details, tap on the transaction you want to modify, and select Edit or Delete.'
        },
        {
            question: 'How do I add a new wallet?',
            answer: 'Go to Profile -> Account, then tap the "Add new wallet" button at the bottom. Choose a name, type (Bank/Cash), and initial balance.'
        },
        {
            question: 'How do I change the currency?',
            answer: 'Go to Profile -> Settings -> Currency and select your preferred currency from the list.'
        },
        {
            question: 'Is my data secure?',
            answer: 'Absolutely. We prioritize your privacy and all your financial data is stored securely. We do not share your data with third parties.'
        },
        {
            question: 'How do I switch to Dark Mode?',
            answer: 'Go to Profile -> Settings -> Theme and toggle the switch to Dark Mode.'
        }
    ];

    const handleSupportEmail = () => {
        Linking.openURL('mailto:support@spendwise.app?subject=SpendWise Support Request');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                {/* Support Banner */}
                <View style={[styles.banner, { backgroundColor: colors.primary }]}>
                    <Text style={styles.bannerTitle}>How can we help you?</Text>
                    <Text style={styles.bannerSubtitle}>Read our FAQ or contact support below.</Text>
                </View>

                {/* FAQ Section */}
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Frequently Asked Questions</Text>

                <View style={styles.faqContainer}>
                    {faqs.map((item, index) => (
                        <View key={index} style={[styles.faqItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                            <View style={styles.questionRow}>
                                <FontAwesome name="question-circle" size={20} color={colors.primary} style={{ marginTop: 2, marginRight: 10 }} />
                                <Text style={[styles.questionText, { color: colors.textPrimary }]}>{item.question}</Text>
                            </View>
                            <Text style={[styles.answerText, { color: colors.textSecondary }]}>{item.answer}</Text>
                        </View>
                    ))}
                </View>

                {/* Contact Support Button */}
                <View style={styles.contactContainer}>
                    <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Still need help?</Text>
                    <TouchableOpacity style={[styles.contactButton, { borderColor: colors.primary }]} onPress={handleSupportEmail}>
                        <FontAwesome name="envelope-o" size={20} color={colors.primary} />
                        <Text style={[styles.contactButtonText, { color: colors.primary }]}>Contact Support</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    banner: {
        padding: 24,
        borderRadius: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    bannerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    bannerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    faqContainer: {
        gap: 12,
        marginBottom: 30,
    },
    faqItem: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    questionRow: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingRight: 10,
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    answerText: {
        fontSize: 14,
        lineHeight: 22,
        paddingLeft: 30,
    },
    contactContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    contactLabel: {
        fontSize: 16,
        marginBottom: 12,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        borderWidth: 1.5,
        gap: 10,
    },
    contactButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
