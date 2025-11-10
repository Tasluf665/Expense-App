import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constant/Colors';

export default function PasswordInput({
    placeholder = 'Password',
    value,
    onChangeText,
    style,
    ...props
}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, styles.passwordInput, style]}
                placeholder={placeholder}
                placeholderTextColor={Colors.TextGray}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                {...props}
            />
            <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
                <Ionicons
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color={Colors.TextGray}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
        position: 'relative',
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: Colors.BorderDark,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        backgroundColor: Colors.Background,
    },
    passwordInput: {
        paddingRight: 60,
    },
    eyeIcon: {
        position: 'absolute',
        right: 20,
        top: 8,
        padding: 8,
    },
});
