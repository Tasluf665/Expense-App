import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router } from 'expo-router';
import { useDispatch, useSelector } from "react-redux";

import CustomeTitle from '../../components/CustomeTitle';
import CustomeFonts from '../../constant/CustomeFonts';
import Colors from '../../constant/Colors';
import CommonButton from '../../components/CommonButton';
import CustomInput from '../../components/CustomInput';
import { forgotPassword, resetError } from "../../utils/authSlice";
import LoadingActivityIndicator from '../../components/LoadingActivityIndicator';
import ErrorDialog from '../../components/ErrorDialog';
import SuccessDialog from '../../components/SuccessDialog';
import { getErrorMessage } from '../../constant/HelperFun';

export default function ForgotPasswordScreen() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');

    const [dialogVisible, setDialogVisible] = useState(false);
    const [errorDialogVisible, setErrorDialogVisible] = useState(false);

    const hideDialog = () => {
        setDialogVisible(false);
        router.replace('/LoginScreen');
    };

    const hideErrorDialog = () => {
        setErrorDialogVisible(false);
    };

    const handleContinue = () => {
        if (!email) {
            setErrorDialogVisible(true);
            return;
        }
        dispatch(forgotPassword(email))
            .unwrap()
            .then(() => {
                setDialogVisible(true)
            })
            .catch((err) => {
                console.log('ForgotPassword error:', err);
            });
    };

    const goBack = () => {
        router.back();
    };

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                dispatch(resetError());
            }, 3000);
        }
    }, [error, dispatch]);



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
                <CustomeTitle title="Forgot Password" goBack={goBack} />


                {/* Form */}
                <View style={styles.form}>
                    {/* Title */}
                    <Text style={styles.title}>
                        Don't worry. Enter your email and we'll send you a link to reset your
                        password.
                    </Text>

                    {/* Email Input */}
                    <CustomInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    {/* Error Message */}
                    {error && (
                        <Text style={styles.errorText}>
                            {getErrorMessage(error)}
                        </Text>
                    )}

                    {/* Continue Button */}

                    <CommonButton
                        title="Continue"
                        onPress={handleContinue}
                    />

                    <SuccessDialog
                        visible={dialogVisible}
                        onDismiss={hideDialog}
                        title="Congratulations"
                        message="Check your email for password reset instructions!"
                    />

                    <ErrorDialog
                        visible={errorDialogVisible}
                        onDismiss={hideErrorDialog}
                        title="Error"
                        message="Email field is required!"
                    />


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
        paddingHorizontal: wp('6%'),
    },
    form: {
        flex: 1,
        paddingTop: hp('5%'),
    },
    title: {
        fontSize: 24,
        fontFamily: CustomeFonts.FunnelDisplay_Bold,
        color: Colors.TextBlack,
        marginBottom: hp('5%'),
        lineHeight: 36,
    },

    errorText: {
        color: Colors.Red,
        textAlign: "center",
        marginVertical: hp(1),
    },

});
