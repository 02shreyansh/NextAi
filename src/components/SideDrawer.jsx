import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import Modal from "react-native-modal"
import CustomText from './CustomText'
import { RFValue } from 'react-native-responsive-fontsize'
import { XCircleIcon } from 'react-native-heroicons/outline'
import { TrashIcon } from 'react-native-heroicons/solid'
import { useDispatch } from 'react-redux'
import { deleteChat, clearAllChats as clrAll, createNewChat } from '../redux/reducers/chatSlice'
import uuid from "react-native-uuid"

const SideDrawer = ({
    setCurrentChatId,
    chats,
    onPressHide,
    visible,
    currentChatId
}) => {
    const dispatch = useDispatch()
    const addNewChat = async () => {
        await dispatch(createNewChat({
            chatId: uuid.v4(),
            messages: [],
            summary: 'New Chat !'
        }))
    }
    const OnclearAllChats = async () => {
        await dispatch(clrAll())
    }
    const deleteAChat = async id => {
        await dispatch(deleteChat({ chatId: id }))
    }
    const renderChats = ({ item }) => {
        return (
            <TouchableOpacity 
                onPress={() => {
                    setCurrentChatId(item.id)
                    onPressHide()
                }}
                style={[
                    styles.chatBtn,
                    {
                        backgroundColor: currentChatId === item.id ? '#1a365d' : '#1e293b'
                    }
                ]}
            >
                <CustomText 
                    numberOfLines={1} 
                    style={{
                        width: '70%',
                        color: currentChatId === item.id ? '#ffffff' : '#94a3b8'
                    }} 
                    size={RFValue(13)} 
                    fontWeight='500'
                >
                    {item?.summary}
                </CustomText>

                <TouchableOpacity 
                    onPress={() => {
                        deleteAChat(item.id)
                    }} 
                    style={styles.trashIcon}
                >
                    <TrashIcon color={'#dc2626'} size={RFValue(13)}/>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
    return (
        <Modal 
            style={styles.bottomModalView} 
            isVisible={visible} 
            backdropColor='black'
            backdropOpacity={0.7}
            animationIn='slideInLeft'
            animationOut='slideOutLeft'
            onBackdropPress={onPressHide}
            onBackButtonPress={onPressHide}
        >
            <SafeAreaView>
                <View style={styles.modalContainer}>
                    <View style={{
                        height: '100%',
                        width: '100%'
                    }}>
                        <View style={styles.header}>
                            <View style={styles.flexRow}>
                                <Image 
                                    source={require('../assets/NextAiCir.png')} 
                                    style={styles.logo}
                                />
                                <CustomText 
                                    opacity={1} 
                                    style={styles.headerText} 
                                    size={RFValue(16)} 
                                    fontWeight='600'
                                >
                                    NextAI
                                </CustomText>
                            </View>
                            <TouchableOpacity 
                                onPress={onPressHide}
                                style={styles.closeButton}
                            >
                                <XCircleIcon color={'#94a3b8'} size={RFValue(20)}/>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.newChat} onPress={addNewChat}>
                            <CustomText size={RFValue(11)} style={styles.newChatText}>+ New Conversation</CustomText>
                        </TouchableOpacity>
                        <CustomText style={styles.sectionTitle}>Recent Chats</CustomText>

                        <View style={styles.chatListContainer}>
                            <FlatList
                                data={[...chats].reverse()}
                                renderItem={renderChats}
                                key={(item) => item.id}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.flatListContent}
                            />
                        </View>
                        <TouchableOpacity style={styles.clearAllChats} onPress={OnclearAllChats}>
                            <CustomText size={RFValue(10)} fontWeight='500' style={styles.clearAllText}>Clear All Chats</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    bottomModalView: {
        justifyContent: 'flex-end',
        width: "75%",
        margin: 0,
        marginLeft: 10,
    },
    modalContainer: {
        backgroundColor: '#0f172a',
        borderRadius: 24,
        overflow: 'hidden',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e293b'
    },
    flexRow: {
        gap: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#1e293b',
        backgroundColor: '#0f172a'
    },
    headerText: {
        color: '#ffffff',
        letterSpacing: 0.5
    },
    logo: {
        width: 32,
        height: 32,
        borderRadius: 16
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#1e293b'
    },
    newChat: {
        backgroundColor: '#3b82f6',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: "70%",
        margin: 16,
        alignSelf: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    newChatText: {
        color: '#ffffff',
        fontWeight: '600'
    },
    clearAllChats: {
        backgroundColor: '#991b1b',
        padding: 12,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        shadowColor: '#991b1b',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    clearAllText: {
        color: '#ffffff',
        letterSpacing: 0.5
    },
    chatBtn: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#1e293b'
    },
    trashIcon: {
        padding: 8,
        backgroundColor: '#1e293b',
        borderRadius: 20
    },
    sectionTitle: {
        margin: 16,
        fontSize: RFValue(12),
        color: '#64748b',
        fontWeight: '500',
        letterSpacing: 0.5
    },
    chatListContainer: {
        height: '60%',
        backgroundColor: '#0f172a'
    },
    flatListContent: {
        paddingHorizontal: 12,
        paddingVertical: 8
    }
})

export default SideDrawer