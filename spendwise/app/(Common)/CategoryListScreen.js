import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';
import { supabase } from '../../lib/supabase';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function CategoryListScreen() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCategories();
        }, [])
    );

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Category",
            "Are you sure you want to delete this category?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('categories')
                                .delete()
                                .eq('id', id);
                            if (error) throw error;
                            fetchCategories();
                        } catch (error) {
                            console.error('Error deleting category:', error);
                            Alert.alert("Error", "Failed to delete category");
                        }
                    }
                }
            ]
        );
    };

    const seedDefaults = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const defaultCategories = [
                // Expenses
                { name: 'Food', icon: 'cutlery', type: 'expense', color: '#FF5555', user_id: user.id },
                { name: 'Shopping', icon: 'shopping-bag', type: 'expense', color: '#FFA500', user_id: user.id },
                { name: 'Transport', icon: 'car', type: 'expense', color: '#3B82F6', user_id: user.id },
                { name: 'Entertainment', icon: 'film', type: 'expense', color: '#8B5CF6', user_id: user.id },
                { name: 'Bills', icon: 'file-text', type: 'expense', color: '#10B981', user_id: user.id },

                // Income
                { name: 'Salary', icon: 'dollar', type: 'income', color: '#00A86B', user_id: user.id },
                { name: 'Business', icon: 'briefcase', type: 'income', color: '#00A86B', user_id: user.id },
                { name: 'Passive Income', icon: 'line-chart', type: 'income', color: '#00A86B', user_id: user.id },
            ];

            const { error } = await supabase.from('categories').insert(defaultCategories);
            if (error) throw error;
            fetchCategories();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to load defaults");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <FontAwesome name={item.icon} size={20} color={item.color} />
                </View>
                <View>
                    <Text style={[styles.itemText, { color: colors.textPrimary }]}>{item.name}</Text>
                    <Text style={[styles.itemType, { color: colors.textSecondary }]}>{item.type === 'income' ? 'Income' : 'Expense'}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <FontAwesome name="trash" size={20} color="#FF5555" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Categories</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No categories found.</Text>
                        <TouchableOpacity style={[styles.seedButton, { backgroundColor: colors.cardBackground }]} onPress={seedDefaults}>
                            <Text style={[styles.seedButtonText, { color: colors.textPrimary }]}>Load Defaults</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(Common)/AddCategoryScreen')}
            >
                <FontAwesome name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    itemType: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
        gap: 16,
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
    seedButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
    },
    seedButtonText: {
        color: '#000',
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#7F3DFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});
