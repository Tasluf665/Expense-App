import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../constant/Colors';

export default function CommonButton({
    title,
    onPress,
    backgroundColor = Colors.Primary,
    textColor = Colors.TextPrimary,
    style,
    textStyle
}) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: backgroundColor },
                style
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.text,
                { color: textColor },
                textStyle
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
