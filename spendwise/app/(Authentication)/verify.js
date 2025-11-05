import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function VerifyScreen() {
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your email...');
    const router = useRouter();

    useEffect(() => {
        handleVerification();
    }, []);

    const handleVerification = async () => {
        try {
            // Check if email is verified
            const { data: { user } } = await supabase.auth.getUser();

            if (user?.email_confirmed_at) {
                setStatus('success');
                setMessage('Email verified successfully!');
                setTimeout(() => {
                    router.replace('/(app)/home');
                }, 2000);
            } else if (user) {
                setStatus('pending');
                setMessage('Verification email sent!');
                setTimeout(() => {
                    router.replace('/(app)/home');
                }, 2000);
            } else {
                setStatus('error');
                setMessage('Verification failed. Please try again.');
            }
        } catch (err) {
            console.error('Error:', err);
            setStatus('error');
            setMessage('An error occurred.');
        }
    };

    return (
        <View style={styles.container}>
            {status === 'verifying' && (
                <>
                    <ActivityIndicator size="large" color="#7C3FED" />
                    <Text style={styles.message}>{message}</Text>
                </>
            )}
            {status === 'success' && (
                <Text style={[styles.message, styles.successText]}>✓ {message}</Text>
            )}
            {status === 'error' && (
                <Text style={[styles.message, styles.errorText]}>✗ {message}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    message: {
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    successText: {
        color: '#00AA00',
        fontWeight: '600',
    },
    errorText: {
        color: '#FF5F57',
        fontWeight: '600',
    },
});
