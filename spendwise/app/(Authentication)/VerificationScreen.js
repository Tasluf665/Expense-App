import { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function VerificationScreen({ navigation }) {
    const [code, setCode] = useState(['', '', '', '']);
    const inputRefs = useRef([]);
    const email = 'brajaoma*****@gmail.com';

    // Handle code input
    const handleCodeChange = (index, value) => {
        const newCode = [...code];

        // Only allow single digit
        if (/^\d$/.test(value)) {
            newCode[index] = value;
            setCode(newCode);

            // Move to next input
            if (index < 3) {
                inputRefs.current[index + 1]?.focus();
            }
        } else if (value === '') {
            newCode[index] = '';
            setCode(newCode);
        }
    };

    // Handle backspace
    const handleKeyPress = (index, key) => {
        if (key === 'Backspace' && code[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const fullCode = code.join('');
        if (fullCode.length === 4) {
            console.log('Verifying code:', fullCode);
            // Handle verification logic
        } else {
            alert('Please enter all 4 digits');
        }
    };

    const handleResendCode = () => {
        setCode(['', '', '', '']);
        inputRefs.current[0]?.focus();
        console.log('Code resent');
        // Handle resend logic
    };

    const goBack = () => {
        router.back();
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
                    <Text style={styles.headerTitle}>Verification</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Title */}
                    <Text style={styles.title}>Enter your Verification Code</Text>

                    {/* OTP Input Circles */}
                    <View style={styles.otpContainer}>
                        {code.map((digit, index) => (
                            <View key={index} style={styles.otpInputWrapper}>
                                <TextInput
                                    ref={(ref) => (inputRefs.current[index] = ref)}
                                    style={styles.otpInput}
                                    value={digit}
                                    onChangeText={(value) => handleCodeChange(index, value)}
                                    onKeyPress={({ nativeEvent }) =>
                                        handleKeyPress(index, nativeEvent.key)
                                    }
                                    keyboardType="numeric"
                                    maxLength={1}
                                    editable={true}
                                />
                                {!digit && <View style={styles.otpCircle} />}
                            </View>
                        ))}
                    </View>

                    {/* Info Text */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            We send verification code to your email{' '}
                            <Text style={styles.emailText}>{email}</Text>. You can check your
                            inbox.
                        </Text>
                    </View>

                    {/* Resend Link */}
                    <TouchableOpacity
                        onPress={handleResendCode}
                        style={styles.resendContainer}
                    >
                        <Text style={styles.resendText}>
                            I didn't received the code? Send again
                        </Text>
                    </TouchableOpacity>

                    {/* Verify Button */}
                    <TouchableOpacity
                        style={styles.verifyButton}
                        onPress={handleVerify}
                    >
                        <Text style={styles.verifyButtonText}>Verify</Text>
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
    content: {
        flex: 1,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 50,
        lineHeight: 40,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        marginBottom: 40,
    },
    otpInputWrapper: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    otpInput: {
        width: '100%',
        height: '100%',
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
    otpCircle: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#D0D0D0',
    },
    infoContainer: {
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    infoText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666666',
        lineHeight: 20,
    },
    emailText: {
        color: '#7C3FED',
        fontWeight: '600',
    },
    resendContainer: {
        marginBottom: 30,
    },
    resendText: {
        fontSize: 14,
        color: '#7C3FED',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    verifyButton: {
        height: 56,
        backgroundColor: '#7C3FED',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
