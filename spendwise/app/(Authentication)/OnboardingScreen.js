
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { router } from 'expo-router';

import { supabase } from '../../lib/supabase';
import { OnboardingData } from '../../constant/AppData.js'
import Colors from '../../constant/Colors.js';
import CommonButton from '../../components/CommonButton.js';
import LoadingActivityIndicator from '../../components/LoadingActivityIndicator';
import CustomeFonts from '../../constant/CustomeFonts.js';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";


export default function OnboardingScreen() {
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.replace('/HomeScreen');
            }
        } catch (error) {
            console.error('Error checking session:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (e) => {
        setCurrentPage(e.nativeEvent.position);
    };

    const handleSignUp = () => {
        router.push('/SignUpScreen');
    };

    const handleLogin = () => {
        router.push('/LoginScreen');
    };

    if (isLoading) {
        return (
            <LoadingActivityIndicator />
        );
    }

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

                <CommonButton
                    title="Sign Up"
                    onPress={handleSignUp}
                    style={{ marginBottom: 12 }}
                />
                <CommonButton
                    title="Login"
                    onPress={handleLogin}
                    backgroundColor={Colors.Secondary}
                    textColor={Colors.TextSecondary}
                    style={{ marginBottom: 12 }}
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Background,
    },
    pagerView: {
        flex: 1,
    },
    scrollableContent: {
        flex: 1,
        backgroundColor: Colors.Background,
        paddingHorizontal: wp(4),
        paddingTop: hp(6),
        justifyContent: 'flex-start',
    },
    imageContainer: {
        height: hp(40),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(3),
    },
    content: {
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 28,
        color: Colors.TextBlack,
        marginBottom: hp(2),
        lineHeight: 34,
        fontFamily: CustomeFonts.FunnelDisplay_SemiBold
    },
    description: {
        fontSize: 14,
        color: Colors.TextGray,
        lineHeight: 20,
        fontFamily: CustomeFonts.FunnelDisplay_Regular
    },
    fixedBottomSection: {
        backgroundColor: Colors.Background,
        paddingHorizontal: wp(6),
        paddingVertical: hp(3),
        borderTopWidth: 1,
        borderTopColor: Colors.BorderLight,
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
        backgroundColor: Colors.BorderDark,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 30,
        height: 8,
        backgroundColor: Colors.Primary,
        borderRadius: 4,
    },

});

