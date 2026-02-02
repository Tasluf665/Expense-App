import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../constant/Colors'
import CustomeFonts from '../constant/CustomeFonts';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function CustomeTitle({ title, goBack }) {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.TextBlack} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.placeholder} />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: hp(3),
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        color: Colors.TextBlack,
        fontFamily: CustomeFonts.FunnelDisplay_SemiBold
    },
    placeholder: {
        width: wp("8%"),
    },
})