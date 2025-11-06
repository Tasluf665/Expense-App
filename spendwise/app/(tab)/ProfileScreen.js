import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { useSignOut } from '../../hooks/useSignOut'

export default function ProfileScreen() {
    const { signOut, loading, error } = useSignOut();

    const handleLogout = async () => {
        const { success, error: logoutError } = await signOut();
        if (!success) {
            alert(logoutError || 'Error logging out. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>

            <TouchableOpacity
                style={[styles.logoutButton, loading && styles.logoutButtonDisabled]}
                onPress={handleLogout}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.logoutButtonText}>Logout</Text>
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000000',
        marginTop: 60,
        marginBottom: 20,
    },
    logoutButton: {
        height: 56,
        backgroundColor: '#7C3FED',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
    logoutButtonDisabled: {
        backgroundColor: '#B794F4',
    },
    logoutButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
})