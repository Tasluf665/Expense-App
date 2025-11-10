import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import { useDispatch, useSelector } from "react-redux";
import { signupUser, resetError } from "../../utils/authSlice";

import CommonButton from '../../components/CommonButton';
import CustomInput from '../../components/CustomInput';
import PasswordInput from '../../components/PasswordInput';
import Colors from '../../constant/Colors';
import LoadingActivityIndicator from '../../components/LoadingActivityIndicator';
import { getErrorMessage } from '../../constant/HelperFun';
import SuccessDialog from '../../components/SuccessDialog';
import ErrorDialog from '../../components/ErrorDialog';


export default function SignUpScreen() {
    const dispatch = useDispatch();
    const { loading, signupError } = useSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [aggreeDialogVisible, setAgreeDialogVisible] = useState(false);
    const [errorDialogVisible, setErrorDialogVisible] = useState(false);

    const hideDialog = () => {
        setDialogVisible(false);
        router.replace('/LoginScreen');
    };

    const hideErrorDialog = () => {
        setErrorDialogVisible(false);
    };

    const hideAgreeDialog = () => {
        setAgreeDialogVisible(false);
    }

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            setErrorDialogVisible(true);
            return;
        }
        if (!isAgreed) {
            setAgreeDialogVisible(true);
            return;
        }

        dispatch(signupUser({ username: name, email, password }))
            .unwrap()
            .then(() => {
                setDialogVisible(true)
            })
            .catch((err) => {
                console.log('Signup error:', err);
            });
    };

    const handleLogin = () => {
        router.push('/LoginScreen');
    };

    const goBack = () => {
        router.back();
    };

    useEffect(() => {
        if (signupError) {
            setTimeout(() => {
                dispatch(resetError());
            }, 3000);
        }
    }, [signupError, dispatch]);



    if (loading) {
        return (
            <LoadingActivityIndicator />
        )
    }

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
                        <Ionicons name="arrow-back" size={24} color={Colors.TextBlack} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sign Up</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Name Input */}
                    <CustomInput
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />

                    {/* Email Input */}
                    <CustomInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    {/* Password Input */}
                    <PasswordInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                    />

                    {/* Error Message */}
                    {signupError && (
                        <Text style={styles.errorText}>
                            {getErrorMessage(signupError)}
                        </Text>
                    )}

                    <SuccessDialog
                        visible={dialogVisible}
                        onDismiss={hideDialog}
                        title="Congratulations"
                        message="Account created! Verify your email."
                    />

                    <ErrorDialog
                        visible={errorDialogVisible}
                        onDismiss={hideErrorDialog}
                        title="Error"
                        message="All fields are required!"
                    />

                    <ErrorDialog
                        visible={aggreeDialogVisible}
                        onDismiss={hideAgreeDialog}
                        title="Error"
                        message="Please agree to Terms of Service and Privacy Policy!"
                    />

                    {/* Terms Checkbox */}
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            value={isAgreed}
                            onValueChange={setIsAgreed}
                            color={isAgreed ? Colors.Primary : undefined}
                            style={styles.checkbox}
                        />
                        <Text style={styles.checkboxText}>
                            By signing up, you agree to the{' '}
                            <Text style={styles.linkText}>Terms of Service and Privacy Policy</Text>
                        </Text>
                    </View>

                    {/* Sign Up Button */}
                    <CommonButton
                        title="Sign Up"
                        onPress={handleSignUp}
                        style={{ marginBottom: 15 }}
                    />

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={handleLogin}>
                            <Text style={styles.loginLink}>Login</Text>
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
        backgroundColor: Colors.Background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 30,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.TextBlack,
    },
    placeholder: {
        width: 40,
    },
    form: {
        flex: 1,
        paddingTop: 40,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 30,
    },
    checkbox: {
        marginRight: 12,
        borderRadius: 4,
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: Colors.Primary,
    },
    checkboxText: {
        flex: 1,
        fontSize: 14,
        color: Colors.TextBlack,
        lineHeight: 20,
    },
    linkText: {
        color: Colors.Primary,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: Colors.TextGray,
    },
    loginLink: {
        fontSize: 14,
        color: Colors.Primary,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },

    errorText: {
        color: Colors.Red,
        textAlign: "center",
        marginVertical: 10,
    },
});
