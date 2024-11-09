import { View, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import {Bars3BottomLeftIcon, CheckBadgeIcon} from  "react-native-heroicons/solid"
import {RFValue} from "react-native-responsive-fontsize"
import MetaAiLogo from "../assets/nextAi.png"
import CustomText from './CustomText'
import { useDispatch } from 'react-redux'
import {  clearChat } from '../redux/reducers/chatSlice'
import SideDrawer from './SideDrawer'

const CustomHeader = ({
    currentChatId,
    chats,
    setCurrentChatId
}) => {
    const dispatch=useDispatch()
    const [visible,setVisible]=useState(false)
    const onClearChats=async ()=>{
        await dispatch(clearChat({chatId:currentChatId}))
    }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.subContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={()=>setVisible(true)}>
                <Bars3BottomLeftIcon size={RFValue(20)} color={"white"}/>
            </TouchableOpacity>
            <View style={styles.flexRow}>
                <View style={styles.logoContainer}>
                    <Image source={MetaAiLogo} style={styles.img}/>
                </View>
                <View style={styles.titleContainer}>
                    <CustomText fontWeight='bold' style={styles.mainTitle}>Next Ai
                        <CheckBadgeIcon color={"#27d366"} size={16}/>
                    </CustomText>
                    <CustomText style={styles.subtitle}  opacity={0.6} fontWeight='500'>with Llama 3.2</CustomText>
                </View>
            </View>
            <TouchableOpacity onPress={onClearChats} style={styles.clearButton}>
                <CustomText style={styles.clearText} size={14}>Clear</CustomText>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
      {visible && 
      <SideDrawer 
      setCurrentChatId={(id)=>setCurrentChatId(id)}
      chats={chats}
      onPressHide={()=>setVisible(false)}
      visible={visible}
      currentChatId={currentChatId}
      />}
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "rgba(10,15,35,1)", 
        borderBottomWidth: 1,
        borderBottomColor: "rgba(123,145,255,0.15)", 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    img: {
        width: 38,
        height: 38,
        borderRadius: 12, 
    },
    logoContainer: {
        padding: 3,
        backgroundColor: "rgba(123,145,255,0.1)", 
        borderRadius: 14,
        shadowColor: "#7B91FF",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    flexRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 12,
    },
    subContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
    },
    iconButton: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: "rgba(123,145,255,0.1)",
    },
    clearButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: "rgba(123,145,255,0.1)",
    },
    clearText: {
        color: "#7B91FF",
    },
    titleContainer: {
        alignItems: 'flex-start',
    },
    mainTitle: {
        fontSize: RFValue(16),
        color: "#FFFFFF",
        marginBottom: 2,
    },
    subtitle: {
        fontSize: RFValue(12),
        color: "#7B91FF",
    },
})
export default CustomHeader