import { View, Text, StyleSheet, Animated, Easing } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'

const LoadingDots = () => {
    const [animatedValues] = useState(
        Array.from({length: 3}, () => new Animated.Value(1))
    )
    
    const [colorAnim] = useState(new Animated.Value(0))
    
    const startAnimation = () => {
        // Dots animation
        Animated.loop(
            Animated.stagger(
                150, // Slightly slower for smoother effect
                animatedValues.map(val =>
                    Animated.sequence([
                        Animated.timing(val, {
                            toValue: 1.5, // Increased scale for more dramatic effect
                            duration: 600,
                            easing: Easing.bezier(0.4, 0, 0.2, 1), // Custom easing
                            useNativeDriver: true
                        }),
                        Animated.timing(val, {
                            toValue: 1,
                            duration: 600,
                            easing: Easing.bezier(0.4, 0, 0.2, 1),
                            useNativeDriver: true
                        }),
                    ]),
                ),
            ),
        ).start();

        // Color animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(colorAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true
                }),
                Animated.timing(colorAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true
                })
            ])
        ).start();
    };

    const resetAnimation = () => {
        animatedValues.forEach(val => val.setValue(1));
        colorAnim.setValue(0);
    }

    useEffect(() => {
        startAnimation()
        return () => resetAnimation()
    }, [])

    const interpolatedColor = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(123,145,255,0.9)', 'rgba(255,255,255,0.9)']
    })

    const dotStyle = (index) => {
        const baseDelay = index * 0.2;
        return {
            transform: [
                { scale: animatedValues[index] },
                { 
                    translateY: animatedValues[index].interpolate({
                        inputRange: [1, 1.5],
                        outputRange: [0, -RFValue(3)] // Slight upward movement
                    })
                }
            ],
            backgroundColor: interpolatedColor,
        }
    }

    return (
        <View style={styles.container}>
            {animatedValues?.map((_, index) => (
                <View key={index} style={styles.dotWrapper}>
                    <Animated.View
                        style={[
                            styles.dot,
                            dotStyle(index),
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.dotShadow,
                            {
                                opacity: animatedValues[index].interpolate({
                                    inputRange: [1, 1.5],
                                    outputRange: [0.2, 0]
                                })
                            }
                        ]}
                    />
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 20,
        marginTop: 10,
        alignSelf: 'center',
        marginLeft: 20,
        height: RFValue(20),
        gap: RFValue(6), // Increased gap between dots
    },
    dotWrapper: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100%',
        width: RFValue(8),
    },
    dot: {
        width: RFValue(6),
        height: RFValue(6),
        borderRadius: RFValue(3),
        backgroundColor: 'rgba(123,145,255,0.9)',
        shadowColor: "#7B91FF",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 4,
    },
    dotShadow: {
        position: 'absolute',
        bottom: -RFValue(2),
        width: RFValue(4),
        height: RFValue(2),
        borderRadius: RFValue(2),
        backgroundColor: 'rgba(123,145,255,0.3)',
        transform: [{ scaleX: 1.5 }]
    }
})

export default LoadingDots