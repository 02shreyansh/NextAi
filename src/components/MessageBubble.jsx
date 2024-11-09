import { View, Text, StyleSheet, Image, TouchableOpacity, Clipboard } from 'react-native'
import React, { useState } from 'react'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import dayjs from 'dayjs'
import TickIcon from "../assets/tick.png"
import MarkdownDisplay from 'react-native-markdown-display'
import LoadingDots from './LoadingDots'

const MessageBubble = ({message}) => {
    const isMyMessage = message?.role === 'user'
    const isMessageRead = message?.isMessageRead
    const [showMenu, setShowMenu] = useState(false)

    const handleCopy = () => {
        if (message?.content) {
            Clipboard.setString(message.content)
        }
        setShowMenu(false)
    }

    const renderContent = () => {
        if (message?.isLoading) {
            return <LoadingDots />
        }
        
        if (message?.imageUri) {
            return <Image source={{uri: message.imageUri}} style={styles.img} />
        }
        
        if (!message?.content) {
            return <Text style={styles.messageText}>No message content</Text>
        }

        return (
            <MarkdownDisplay
                style={{
                    body: {
                        ...styles.messageText,
                        left: isMyMessage ? 10 : 0,
                        marginVertical: 0,
                        paddingVertical: 0,
                    },
                    link: {
                        color: "lightblue",
                    },
                    blockquote: {
                        color: 'white',
                        backgroundColor: '#1d211e',
                        borderRadius: 4,
                        borderLeftWidth: 0,
                    },
                    table: {
                        borderColor: 'white'
                    },
                    code_inline: {
                        backgroundColor: '#1d211e',
                        color: 'white',
                        borderRadius: 5,
                    },
                    fence: {
                        backgroundColor: '#1d211e',
                        color: 'white',
                        borderRadius: 5,
                        borderWidth: 0
                    },
                    tr: {
                        borderColor: "white",
                    }
                }}
            >
                {message.content}
            </MarkdownDisplay>
        )
    }

    return (
        <View style={{
            ...styles.messageContainer,
            maxWidth: isMyMessage ? '80%' : '92%',
            alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
            backgroundColor: isMyMessage ? '#154d37' : '#232626',
            borderTopLeftRadius: isMyMessage ? 5 : 0,
            borderTopRightRadius: isMyMessage ? 0 : 5,
        }}>
            {!isMyMessage && (
                <>
                    <View style={{
                        ...styles.leftMessageArrow,
                        display: isMyMessage ? 'none' : 'flex'
                    }}></View>
                    <TouchableOpacity 
                        onPress={() => setShowMenu(!showMenu)}
                        style={styles.menuButton}
                    >
                        <Text style={styles.menuDots}>⋮</Text>
                    </TouchableOpacity>
                    {showMenu && (
                        <TouchableOpacity 
                            onPress={handleCopy}
                            style={styles.menuPopup}
                        >
                            <Text style={styles.menuText}>Copy</Text>
                        </TouchableOpacity>
                    )}
                </>
            )}

            {renderContent()}

            {isMyMessage && (
                <View style={{
                    ...styles.rightMessageArrow,
                    display: isMyMessage ? 'flex' : 'none'
                }}></View>
            )}

            <View style={{...styles.timeAndReadContent, right: 0}}>
                <Text style={styles.timeText}>
                    {dayjs(message?.time).format('HH:mm:A')}
                </Text>
                {isMyMessage && (
                    <View>
                        <Image source={TickIcon} tintColor={isMessageRead ? '#53a6fd' : '#8aa69b'} style={{
                            width: 15,
                            height: 15,
                        }}/>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    messageContainer: {
        minWidth: '24%',
        marginVertical: 8,
        marginHorizontal: 10,
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 10,
        borderRadius: 10,
        position: 'relative'
    },
    messageText: {
        fontSize: RFValue(11.4),
        color: '#fff',
        marginBottom: 15,
        marginRight: 15
    },
    leftMessageArrow: {
        height: 0,
        width: 0,
        borderLeftWidth: 10,
        borderLeftColor: 'transparent',
        borderTopColor: "#232626",
        borderTopWidth: 10,
        alignSelf: "flex-start",
        borderRightColor: 'black',
        right: 10,
        bottom: 0
    },
    rightMessageArrow: {
        height: 0,
        width: 0,
        position: 'absolute',
        borderRightColor: 'transparent',
        borderRightWidth: 10,
        borderTopColor: '#154d37',
        borderTopWidth: 10,
        alignSelf: 'flex-start',
        right: -8,
        top: 0,
    },
    timeAndReadContent: {
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 0,
        position: 'absolute',
        paddingHorizontal: 10,
        gap: 2
    },
    timeText: {
        fontSize: 12,
        fontWeight: '400',
        color: '#8aa69b',
    },
    img: {
        width: RFPercentage(35),
        height: RFPercentage(20),
        resizeMode: 'cover',
        left: -5,
        aspectRatio: 4/4,
        borderRadius: 20
    },
    menuButton: {
        position: 'absolute',
        right: 5,
        top: 5,
        padding: 5,
        zIndex: 1
    },
    menuDots: {
        color: '#8aa69b',
        fontSize: 20,
        fontWeight: 'bold'
    },
    menuPopup: {
        position: 'absolute',
        right: 25,
        top: 5,
        backgroundColor: '#1d211e',
        padding: 8,
        borderRadius: 5,
        elevation: 5,
        zIndex: 2
    },
    menuText: {
        color: '#fff',
        fontSize: 14
    }
})

export default MessageBubble