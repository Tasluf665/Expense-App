import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { getColors } from '../../utils/themeSlice';
import { supabase } from '../../lib/supabase';

export default function AddCategoryScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('tag');
    const [selectedColor, setSelectedColor] = useState('#7F3DFF');
    const [isExpense, setIsExpense] = useState(true); // Default to expense type
    const themeMode = useSelector((state) => state.theme.mode);
    const colors = getColors(themeMode);

    const icons = [
        'tag', 'shopping-bag', 'cutlery', 'car', 'film', 'file-text', 'ellipsis-h',
        'home', 'plane', 'gamepad', 'heart', 'medkit', 'graduation-cap', 'gift',
        'paw', 'music', 'camera', 'briefcase', 'coffee', 'beer'
    ];

    const pickerColors = [
        '#7F3DFF', '#FD3C4A', '#00A86B', '#F59E0B', '#3B82F6', '#8B5CF6',
        '#EC4899', '#14B8A6', '#6366F1', '#F43F5E', '#10B981', '#6B7280'
    ];

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Required", "Please enter a category name");
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('categories')
                .insert([{
                    name: name.trim(),
                    icon: selectedIcon,
                    color: selectedColor,
                    type: isExpense ? 'expense' : 'income',
                    user_id: user.id
                }]);

            if (error) throw error;
            router.back();
        } catch (error) {
            console.error('Error adding category:', error);
            Alert.alert("Error", "Failed to add category");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Add Category</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Name Input */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.textPrimary }]}>Category Name</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.textPrimary, borderColor: colors.border }]}
                        placeholder="e.g. Groceries"
                        placeholderTextColor={colors.textSecondary}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Type Selection */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.textPrimary }]}>Type</Text>
                    <View style={[styles.typeContainer, { backgroundColor: colors.cardBackground }]}>
                        <TouchableOpacity
                            style={[styles.typeButton, isExpense && { ...styles.typeButtonSelected, backgroundColor: colors.background }]}
                            onPress={() => setIsExpense(true)}
                        >
                            <Text style={[styles.typeText, { color: colors.textSecondary }, isExpense && { ...styles.typeTextSelected, color: colors.textPrimary }]}>Expense</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, !isExpense && { ...styles.typeButtonSelected, backgroundColor: colors.background }]}
                            onPress={() => setIsExpense(false)}
                        >
                            <Text style={[styles.typeText, { color: colors.textSecondary }, !isExpense && { ...styles.typeTextSelected, color: colors.textPrimary }]}>Income</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Icon Picker */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.textPrimary }]}>Icon</Text>
                    <View style={styles.grid}>
                        {icons.map((icon) => (
                            <TouchableOpacity
                                key={icon}
                                style={[
                                    styles.gridItem,
                                    { backgroundColor: colors.cardBackground },
                                    selectedIcon === icon && { ...styles.gridItemSelected, backgroundColor: colors.primary }
                                ]}
                                onPress={() => setSelectedIcon(icon)}
                            >
                                <FontAwesome
                                    name={icon}
                                    size={20}
                                    color={selectedIcon === icon ? '#FFFFFF' : colors.textPrimary}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Color Picker */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.textPrimary }]}>Color</Text>
                    <View style={styles.grid}>
                        {pickerColors.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorItem,
                                    { backgroundColor: color },
                                    selectedColor === color && { ...styles.colorItemSelected, borderColor: colors.textPrimary }
                                ]}
                                onPress={() => setSelectedColor(color)}
                            >
                                {selectedColor === color && (
                                    <FontAwesome name="check" size={16} color="#FFFFFF" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Category</Text>
                </TouchableOpacity>
            </ScrollView>
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
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
    },
    typeContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F1F1',
        borderRadius: 12,
        padding: 4,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    typeButtonSelected: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    typeText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#91919F',
    },
    typeTextSelected: {
        color: '#000000',
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridItem: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridItemSelected: {
        backgroundColor: '#7F3DFF',
    },
    colorItem: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorItemSelected: {
        borderWidth: 3,
        borderColor: '#E5E5E5',
    },
    saveButton: {
        backgroundColor: '#7F3DFF',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
