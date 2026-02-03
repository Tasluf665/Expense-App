import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { supabase } from '../../lib/supabase';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);

    useFocusEffect(
        useCallback(() => {
            fetchUser();
        }, [])
    );

    const fetchUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const { error } = await supabase.auth.signOut();
                            if (error) throw error;
                            router.replace('/(Authentication)/LoginScreen');
                        } catch (error) {
                            console.error("Error logging out:", error);
                            Alert.alert("Error", "Failed to logout");
                        }
                    }
                }
            ]
        );
    };

    const renderMenuItem = (icon, title, onPress, isDestructive = false) => (
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBackground }]} onPress={onPress}>
            <View style={[styles.menuIconContainer, isDestructive && styles.destructiveIconBase]}>
                <FontAwesome
                    name={icon}
                    size={24}
                    color={isDestructive ? '#FF5555' : colors.primary}
                />
            </View>
            <Text style={[styles.menuText, { color: colors.textPrimary }]}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>

                <View style={styles.userInfo}>
                    <Text style={[styles.usernameLabel, { color: colors.textSecondary }]}>Username</Text>
                    <Text style={[styles.userName, { color: colors.textPrimary }]}>
                        {user?.user_metadata?.first_name
                            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
                            : user?.email?.split('@')[0] || 'Iriana Saliha'}
                    </Text>
                </View>

            </View>

            {/* Menu List */}
            <View style={[styles.menuContainer, { backgroundColor: colors.cardBackground }]}>
                {renderMenuItem("credit-card", "Account", () => router.push('/(Common)/AccountScreen'))}
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                {renderMenuItem("cog", "Settings", () => router.push('/(Common)/SettingsScreen'))}
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                {renderMenuItem("sign-out", "Logout", handleLogout, true)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },

    userInfo: {
        flex: 1,
    },
    usernameLabel: {
        fontSize: 14,
        color: '#91919F',
        marginBottom: 4,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#161719',
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 10,
        // Shadow/Elevation
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    menuIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#EEE5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    destructiveIconBase: {
        backgroundColor: '#FFE2E4',
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#292B2D',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F1FA',
        marginHorizontal: 20,
    },
});