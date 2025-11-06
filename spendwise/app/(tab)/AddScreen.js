import { View, Text, StyleSheet } from 'react-native';

export default function AddScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Add Transaction</Text>
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
    text: {
        fontSize: 20,
        fontWeight: '600',
    },
});
