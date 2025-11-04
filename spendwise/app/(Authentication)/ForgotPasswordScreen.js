import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleContinue = () => {
        if (!email) {
            alert('Please enter your email');
            return;
        }
        console.log('Sending reset link to:', email);
        // Handle password reset logic here
        setIsSubmitted(true);
        // After a delay, navigate to verification or confirm screen
        // setTimeout(() => {
        //   navigation.navigate('VerifyEmail');
        // }, 1500);
    };

    const goBack = () => {
        if (isSubmitted) {
            setIsSubmitted(false);
            setEmail('');
        } else {
            router.back();
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={goBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Forgot Password</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Title */}
                    <Text style={styles.title}>
                        Don't worry. Enter your email and we'll send you a link to reset your
                        password.
                    </Text>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#B0B0B0"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isSubmitted}
                        />
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                        disabled={isSubmitted}
                    >
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>

                    {/* Success Message */}
                    {isSubmitted && (
                        <View style={styles.successContainer}>
                            <View style={styles.successIconContainer}>
                                <Ionicons name="checkmark-circle" size={48} color="#7C3FED" />
                            </View>
                            <Text style={styles.successTitle}>Check your email</Text>
                            <Text style={styles.successMessage}>
                                We've sent a password reset link to {email}. Click the link in the
                                email to reset your password.
                            </Text>
                        </View>
                    )}
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
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
    },
    placeholder: {
        width: 40,
    },
    form: {
        flex: 1,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 40,
        lineHeight: 36,
    },
    inputContainer: {
        marginBottom: 30,
        position: 'relative',
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#000000',
        backgroundColor: '#FFFFFF',
    },
    continueButton: {
        height: 56,
        backgroundColor: '#7C3FED',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    successContainer: {
        marginTop: 60,
        alignItems: 'center',
    },
    successIconContainer: {
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 12,
    },
    successMessage: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
    },
});
