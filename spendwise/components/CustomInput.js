import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Colors from '../constant/Colors';
import CustomeFonts from '../constant/CustomeFonts';

export default function CustomInput({
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    autoCapitalize = 'none',
    style,
    ...props
}) {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                placeholderTextColor={Colors.TextGray}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                {...props}
            />
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
        color: Colors.TextBlack,
        backgroundColor: Colors.Background,
        fontFamily: CustomeFonts.FunnelDisplay_Regular
    },
});
