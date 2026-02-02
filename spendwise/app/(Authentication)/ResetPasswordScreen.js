import { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import CustomeTitle from '../../components/CustomeTitle';
import CustomeFonts from '../../constant/CustomeFonts';
import Colors from '../../constant/Colors';
import CommonButton from '../../components/CommonButton';
import CustomInput from '../../components/CustomInput';
import LoadingActivityIndicator from '../../components/LoadingActivityIndicator';
import ErrorDialog from '../../components/ErrorDialog';
import SuccessDialog from '../../components/SuccessDialog';

export default function ResetPasswordScreen() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [errorDialogVisible, setErrorDialogVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const hideDialog = () => {
        setDialogVisible(false);
        router.replace('/LoginScreen');
    };

    const hideErrorDialog = () => {
        setErrorDialogVisible(false);
        setErrorMessage('');
    };

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            setErrorMessage('All fields are required!');
            setErrorDialogVisible(true);
            return;
        }

        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long!');
            setErrorDialogVisible(true);
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            setErrorDialogVisible(true);
            return;
        }

        setLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error('No active session. Your reset link may have expired.');
            }

            const { error } = await supabase.auth.updateUser({ password });

            if (error) throw error;

            await supabase.auth.signOut();
            setDialogVisible(true);
        } catch (err) {
            console.error('Reset password error:', err);
            setErrorMessage(err.message || 'Failed to reset password. Please try again.');
            setErrorDialogVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        router.replace('/LoginScreen');
    };

    if (loading) {
        return <LoadingActivityIndicator />;
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <CustomeTitle title="Reset Password" goBack={goBack} />
                <View style={styles.form}>
                    <Text style={styles.title}>Set Your New Password</Text>

                    <View style={styles.successBox}>
                        <Text style={styles.successText}>
                            Your reset link has been verified. Enter your new password.
                        </Text>
                    </View>

                    <CustomInput
                        placeholder="New Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!loading}
                    />

                    <CustomInput
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        editable={!loading}
                    />

                    <CommonButton
                        title={loading ? "Resetting..." : "Reset Password"}
                        onPress={handleResetPassword}
                        disabled={loading}
                    />

                    <SuccessDialog
                        visible={dialogVisible}
                        onDismiss={hideDialog}
                        title="Success"
                        message="Your password has been reset successfully! Please login with your new password."
                    />

                    <ErrorDialog
                        visible={errorDialogVisible}
                        onDismiss={hideErrorDialog}
                        title="Error"
                        message={errorMessage}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.Background },
    scrollContent: { flexGrow: 1, paddingHorizontal: wp('6%') },
    form: { flex: 1, paddingTop: hp('5%') },
    title: { fontSize: 24, fontFamily: CustomeFonts.FunnelDisplay_Bold, color: Colors.TextBlack, marginBottom: hp('2%'), lineHeight: 36 },
    successBox: { backgroundColor: '#D4EDDA', padding: 15, borderRadius: 8, marginBottom: hp('3%'), borderWidth: 1, borderColor: '#C3E6CB' },
    successText: { color: '#155724', textAlign: 'center', fontSize: 14, fontWeight: 'bold' },
});
