import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.menuIconContainer, isDestructive && styles.destructiveIconBase]}>
                <FontAwesome
                    name={icon}
                    size={24}
                    color={isDestructive ? '#FF5555' : '#7F3DFF'}
                />
            </View>
            <Text style={styles.menuText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Text style={styles.usernameLabel}>Username</Text>
                    <Text style={styles.userName}>
                        {user?.user_metadata?.first_name
                            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
                            : user?.email?.split('@')[0] || 'User'}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert("Edit Profile", "Feature coming soon!")}>
                    <FontAwesome name="pencil-square-o" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Menu List */}
            <View style={styles.menuContainer}>
                {renderMenuItem("folder-o", "Account", () => Alert.alert("Account", "Feature coming soon!"))}
                <View style={styles.divider} />
                {renderMenuItem("cog", "Settings", () => Alert.alert("Settings", "Feature coming soon!"))}
                <View style={styles.divider} />
                {renderMenuItem("sign-out", "Logout", handleLogout, true)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6', // Light gray bg like the design
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 10,
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
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
        borderRadius: 12,
        backgroundColor: '#EEE5FF', // Light purple bg for icons
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    destructiveIconBase: {
        backgroundColor: '#FFE5E5', // Light red for logout
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#292B2D',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F1FA',
        marginHorizontal: 20,
    },
});