
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import PagerView from 'react-native-pager-view';
import Onboarding1 from '../../assets/svg/Onboarding1.js';
import Onboarding2 from '../../assets/svg/Onboarding2.js';
import Onboarding3 from '../../assets/svg/Onboarding3.js';
import { router } from 'expo-router';

const OnboardingData = [
    {
        id: 1,
        title: 'Gain total control of your money',
        description: 'Become your own money manager and make every cent count',
        image: Onboarding1,
    },
    {
        id: 2,
        title: 'Know where your money goes',
        description: 'Track your transaction easily, with categories and financial report',
        image: Onboarding2,
    },
    {
        id: 3,
        title: 'Planning ahead',
        description: 'Setup your budget for each category so you in control',
        image: Onboarding3,
    },
];

export default function App() {
    const [currentPage, setCurrentPage] = useState(0);

    const handlePageChange = (e) => {
        setCurrentPage(e.nativeEvent.position);
    };

    const handleSignUp = () => {
        router.push('/SignUpScreen');
    };

    const handleLogin = () => {
        router.push('/LoginScreen');
    };

    return (
        <View style={styles.container}>
            {/* PagerView contains only scrollable content */}
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={handlePageChange}
            >
                {OnboardingData.map((item) => {
                    const ImageComponent = item.image;
                    return (
                        <View key={item.id} style={styles.scrollableContent}>
                            <View style={styles.imageContainer}>
                                <ImageComponent width={250} height={250} />
                            </View>

                            <View style={styles.content}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </View>
                    );
                })}
            </PagerView>

            {/* Fixed bottom section */}
            <View style={styles.fixedBottomSection}>
                <View style={styles.dotsContainer}>
                    {OnboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentPage && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={handleSignUp}
                >
                    <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    pagerView: {
        flex: 1,
    },
    scrollableContent: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 40,
        justifyContent: 'flex-start',
    },
    imageContainer: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    content: {
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 12,
        lineHeight: 34,
    },
    description: {
        fontSize: 14,
        fontWeight: '400',
        color: '#999999',
        lineHeight: 20,
    },
    fixedBottomSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 4,
    },
    activeDot: {
        width: 30,
        height: 8,
        backgroundColor: '#7C3FED',
        borderRadius: 4,
    },
    signUpButton: {
        backgroundColor: '#7C3FED',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    signUpText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    loginButton: {
        backgroundColor: '#F0E6FF',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#7C3FED',
    },
});

