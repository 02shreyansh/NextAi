import { ImageBackground, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import image from "./assets/w_bg.png"
import CustomHeader from './components/CustomHeader'
import { useDispatch, useSelector } from 'react-redux'
import { changeCurrentChatId, selectChats, selectCurrentChatId } from './redux/reducers/chatSlice'
import SendButton from './components/SendButton'
import Chat from './components/Chat'

const MetaAi = () => {
  const dispatch=useDispatch()
  const chats=useSelector(selectChats)
  const currentChatId=useSelector(selectCurrentChatId)
  const [isTyping,setIsTyping]=useState(false)
  const [heightOfMessageBox,setHeightOfMessageBox]=useState(0)
  const setCurrentChatId=id=>{
    dispatch(changeCurrentChatId({chatId:id}));
  };
  return (
    <ImageBackground source={image} style={styles.container} resizeMode='cover'>
      <CustomHeader
      chats={chats}
      currentChatId={currentChatId}
      setCurrentChatId={id=>setCurrentChatId(id)}
      />
      <Chat
      isTyping={isTyping}
      heightOfMessageBox={heightOfMessageBox}
      messages={chats?.find(chat=>chat.id=== currentChatId)?.messages || []}
      />
      <SendButton
        isTyping={isTyping}
        setHeightOfMessageBox={setHeightOfMessageBox}
        heightOfMessageBox={heightOfMessageBox}
        setIsTyping={setIsTyping}
        currentChatId={currentChatId}
        setCurrentChatId={id=>setCurrentChatId(id)}
        length={chats?.find(chat=>chat.id==currentChatId)?.messages?.length || [].length}
        messages={chats?.find(chat=>chat.id == currentChatId)?.messages || []}
      />
    </ImageBackground>
  )
}
const styles = StyleSheet.create({
  container:{
    flex:1
  }
})

export default MetaAi