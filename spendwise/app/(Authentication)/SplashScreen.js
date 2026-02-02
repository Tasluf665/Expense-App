import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from "react";
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import Colors from "../../constant/Colors";
import CustomeFonts from "../../constant/CustomeFonts";

const SplashScreen = () => {

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.replace('/OnboardingScreen');
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <LinearGradient
            colors={[Colors.GradientStart, Colors.GradientMiddle, Colors.GradientEnd]}
            style={styles.container}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
        >
            <StatusBar style="light" />
            <View style={styles.content}>
                <Text style={styles.logo}>SpendWise</Text>
            </View>
        </LinearGradient>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontSize: 45,
        color: Colors.TextPrimary,
        fontFamily: CustomeFonts.FunnelDisplay_Bold,
    },
});
