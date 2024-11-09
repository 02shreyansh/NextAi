import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import NextAiLogo from "../assets/NextAiCir.png"
import CustomText from './CustomText'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const EmptyComponent = ({ isTyping }) => {
    const rotation = useRef(new Animated.Value(0)).current
    const pulseAnim = useRef(new Animated.Value(1)).current
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideUpAnim = useRef(new Animated.Value(50)).current
    
    useEffect(() => {
        // Rotation animation
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 12000, // Slower rotation for more elegance
                useNativeDriver: true
            })
        ).start()

        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 2000,
                    useNativeDriver: true
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true
                })
            ])
        ).start()

        // Initial fade in and slide up
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true
            }),
            Animated.timing(slideUpAnim, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true
            })
        ]).start()
    }, [rotation, pulseAnim, fadeAnim, slideUpAnim])
    
    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })
    
    return (
        <View style={styles.container}>
            {/* Background Elements */}
            <View style={styles.gradientOverlay} />
            
            {/* Animated Background Circles */}
            <Animated.View style={[styles.backgroundCircle, {
                transform: [{ rotate: rotate }]
            }]} />
            <Animated.View style={[styles.backgroundCircle2, {
                transform: [{ rotate: rotate }]
            }]} />
            <Animated.View style={[styles.backgroundCircle3, {
                transform: [{ rotate: rotate }]
            }]} />

            {/* Main Content */}
            <Animated.View style={[styles.contentContainer, {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
            }]}>
                <View style={styles.glowContainer}>
                    <View style={styles.imgContainer}>
                        <Animated.Image
                            source={NextAiLogo}
                            style={[styles.img, {
                                transform: [
                                    { rotate },
                                    { scale: pulseAnim }
                                ]
                            }]}
                        />
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <CustomText style={styles.title} size={RFValue(32)}>
                        NextAI
                    </CustomText>
                    <CustomText style={styles.text} size={RFValue(18)}>
                        Your AI-Powered Assistant
                    </CustomText>

                    <View style={styles.subtextContainer}>
                        <View style={styles.line} />
                        <CustomText style={styles.subtext} size={RFValue(12)}>
                            ASK ANYTHING
                        </CustomText>
                        <View style={styles.line} />
                    </View>
                </View>

                {/* Feature Points */}
                <View style={styles.featuresContainer}>
                    <CustomText style={styles.featureText} size={RFValue(14)}>
                        • Generate Images and Text
                    </CustomText>
                    <CustomText style={styles.featureText} size={RFValue(14)}>
                        • Get Instant Answers
                    </CustomText>
                    <CustomText style={styles.featureText} size={RFValue(14)}>
                        • Smart Conversations
                    </CustomText>
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a', 
        position: 'relative',
        overflow: 'hidden',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
    },
    backgroundCircle: {
        position: 'absolute',
        width: SCREEN_WIDTH * 1.5,
        height: SCREEN_WIDTH * 1.5,
        borderRadius: SCREEN_WIDTH * 0.75,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.1)',
        backgroundColor: 'rgba(59, 130, 246, 0.02)',
    },
    backgroundCircle2: {
        position: 'absolute',
        width: SCREEN_WIDTH * 1.2,
        height: SCREEN_WIDTH * 1.2,
        borderRadius: SCREEN_WIDTH * 0.6,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.15)',
        backgroundColor: 'rgba(59, 130, 246, 0.03)',
    },
    backgroundCircle3: {
        position: 'absolute',
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_WIDTH * 0.9,
        borderRadius: SCREEN_WIDTH * 0.45,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
        backgroundColor: 'rgba(59, 130, 246, 0.04)',
    },
    contentContainer: {
        alignItems: 'center',
        zIndex: 2,
    },
    glowContainer: {
        padding: RFValue(25),
        borderRadius: RFValue(100),
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        shadowColor: "#3b82f6",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 15,
    },
    imgContainer: {
        width: RFValue(160),
        height: RFValue(160),
        borderRadius: RFValue(80),
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: RFValue(20),
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    img: {
        width: "100%",
        height: '100%',
        resizeMode: 'contain',
        opacity: 0.95,
    },
    textContainer: {
        marginTop: RFValue(40),
        alignItems: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontWeight: '700',
        letterSpacing: 1,
        textShadowColor: 'rgba(59, 130, 246, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: '500',
        marginTop: RFValue(10),
        opacity: 0.9,
    },
    subtextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: RFValue(20),
        gap: RFValue(15),
    },
    line: {
        width: RFValue(30),
        height: 1,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
    },
    subtext: {
        color: 'rgba(59, 130, 246, 0.8)',
        fontWeight: '600',
        letterSpacing: 3,
    },
    featuresContainer: {
        marginBottom: RFValue(90),
        alignItems: 'center',
        opacity: 0.8,
    },
    featureText: {
        color: '#94a3b8',
        marginVertical: RFValue(5),
        fontWeight: '500',
    }
})

export default EmptyComponent