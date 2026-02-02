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
import { router } from 'expo-router';
import { useDispatch, useSelector } from "react-redux";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import CommonButton from '../../components/CommonButton';
import CustomInput from '../../components/CustomInput';
import PasswordInput from '../../components/PasswordInput';
import Colors from '../../constant/Colors';
import CustomeFonts from '../../constant/CustomeFonts';
import CustomeTitle from '../../components/CustomeTitle';
import LoadingActivityIndicator from '../../components/LoadingActivityIndicator';
import ErrorDialog from '../../components/ErrorDialog';
import { getErrorMessage } from '../../constant/HelperFun';

import { loginUser, resetError } from "../../utils/authSlice";

export default function LoginScreen() {
    const dispatch = useDispatch();
    const { loading, loginError } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorDialogVisible, setErrorDialogVisible] = useState(false);

    const hideErrorDialog = () => {
        setErrorDialogVisible(false);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorDialogVisible(true);
            return;
        }

        dispatch(loginUser({ email, password }))
            .unwrap()
            .then(() => {
                router.replace('/HomeScreen');
            })
            .catch((err) => {
                console.log('Login error:', err);
            });
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

    useEffect(() => {
        if (loginError) {
            setTimeout(() => {
                dispatch(resetError());
            }, 3000);
        }
    }, [loginError, dispatch]);



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
                <CustomeTitle title="Login" goBack={goBack} />

                {/* Form */}
                <View style={styles.form}>
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
                    {loginError && (
                        <Text style={styles.errorText}>
                            {getErrorMessage(loginError)}
                        </Text>
                    )}

                    <ErrorDialog
                        visible={errorDialogVisible}
                        onDismiss={hideErrorDialog}
                        title="Error"
                        message="All fields are required!"
                    />

                    {/* Login Button */}

                    <CommonButton
                        title="Login"
                        onPress={handleLogin}
                        style={{ marginBottom: 15 }}
                    />

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
        backgroundColor: Colors.Background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    form: {
        flex: 1,
        paddingTop: 60,
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        marginBottom: hp(4),
    },
    forgotPasswordText: {
        fontSize: 14,
        color: Colors.Primary,
        fontFamily: CustomeFonts.FunnelDisplay_SemiBold
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 14,
        color: Colors.TextGray,
        fontFamily: CustomeFonts.FunnelDisplay_Regular
    },
    signUpLink: {
        fontSize: 14,
        color: Colors.Primary,
        textDecorationLine: 'underline',
        fontFamily: CustomeFonts.FunnelDisplay_Regular
    },

    errorText: {
        color: Colors.Red,
        textAlign: "center",
        marginVertical: hp(1),
    },
});
