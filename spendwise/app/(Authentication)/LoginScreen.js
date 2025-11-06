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
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSignIn } from '../../hooks/useSignIn';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { signIn, loading, error } = useSignIn();

    const handleLogin = async () => {
        // if (!email || !password) {
        //     alert('Please fill all fields');
        //     return;
        // }

        // const { success, error: loginError } = await signIn(email, password);
        // if (success) {
        //     router.push('/HomeScreen');
        // } else {
        //     alert(loginError || 'An error occurred during login');
        // }
        router.push('/HomeScreen');
    };

    const handleForgotPassword = () => {
        router.push('/ForgotPasswordScreen');
    };

    const handleSignUp = () => {
        router.push('/SignUpScreen');
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
                    <Text style={styles.headerTitle}>Login</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Form */}
                <View style={styles.form}>
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
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, styles.passwordInput]}
                            placeholder="Password"
                            placeholderTextColor="#B0B0B0"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!isPasswordVisible}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            <Ionicons
                                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                                size={24}
                                color="#B0B0B0"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    {/* Error Message */}
                    {error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}

                    {/* Forgot Password Link */}
                    <TouchableOpacity
                        style={styles.forgotPasswordContainer}
                        onPress={handleForgotPassword}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account yet? </Text>
                        <TouchableOpacity onPress={handleSignUp}>
                            <Text style={styles.signUpLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
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
    errorText: {
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 14,
    },
    loginButtonDisabled: {
        backgroundColor: '#B794F4',
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
        paddingTop: 60,
    },
    inputContainer: {
        marginBottom: 20,
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
    passwordInput: {
        paddingRight: 60,
    },
    eyeIcon: {
        position: 'absolute',
        right: 20,
        top: 16,
        padding: 8,
    },
    loginButton: {
        height: 56,
        backgroundColor: '#7C3FED',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#7C3FED',
        fontWeight: '600',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 14,
        color: '#999999',
    },
    signUpLink: {
        fontSize: 14,
        color: '#7C3FED',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
