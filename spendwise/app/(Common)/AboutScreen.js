import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';

export default function AboutScreen() {
    const router = useRouter();
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);

    const features = [
        {
            icon: 'exchange',
            title: 'Track Transactions',
            description: 'Record your daily income and expenses with ease. Categorize them to see exactly where your money goes.'
        },
        {
            icon: 'pie-chart',
            title: 'Visual Reports',
            description: 'View detailed graphs and charts to analyze your financial health over time. Spot trends and adjust your habits.'
        },
        {
            icon: 'credit-card-alt',
            title: 'Multiple Accounts',
            description: 'Manage different wallets and accounts (Bank, Cash, Digital) in one place. Keep your finances organized.'
        },
        {
            icon: 'file-text-o',
            title: 'Export Data',
            description: 'Export your financial data to Excel or PDF for deeper analysis or for sharing with your accountant.'
        },
        {
            icon: 'shield',
            title: 'Secure & Private',
            description: 'Your data is secure. We prioritize your privacy and ensure your financial information is protected.'
        }
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>About SpendWise</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* App Logo/Info Section */}
                <View style={styles.logoSection}>
                    <View style={[styles.logoContainer, { backgroundColor: colors.primary + '20' }]}>
                        <FontAwesome name="leaf" size={40} color={colors.primary} />
                    </View>
                    <Text style={[styles.appName, { color: colors.textPrimary }]}>SpendWise</Text>
                    <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0</Text>
                </View>

                {/* Description */}
                <Text style={[styles.description, { color: colors.textPrimary }]}>
                    SpendWise is your personal finance companion designed to help you take control of your money.
                    Whether you want to track daily expenses, plan a budget, or simply understand your spending habits,
                    SpendWise provides the tools you need in a simple, intuitive interface.
                </Text>

                {/* Features List */}
                <View style={styles.featuresContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Key Features</Text>
                    {features.map((feature, index) => (
                        <View key={index} style={[styles.featureItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '15' }]}>
                                <FontAwesome name={feature.icon} size={20} color={colors.primary} />
                            </View>
                            <View style={styles.featureTextContainer}>
                                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{feature.title}</Text>
                                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>{feature.description}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Developer / Contact Info */}
                <View style={[styles.contactSection, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 10 }]}>Contact Us</Text>
                    <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                        Have questions or feedback? We'd love to hear from you.
                    </Text>
                    <Text style={[styles.emailText, { color: colors.primary }]}>support@spendwise.app</Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                        © 2026 SpendWise Inc. All rights reserved.
                    </Text>
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
    logoSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    versionText: {
        fontSize: 14,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 30,
        textAlign: 'center',
    },
    featuresContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    featureItem: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    featureIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    contactSection: {
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
    },
    contactText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 8,
    },
    emailText: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    footerText: {
        fontSize: 12,
    },
});
