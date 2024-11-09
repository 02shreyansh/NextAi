import { View, Text, StyleSheet, Dimensions, Platform, TextInput, Animated, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import useKeyBoardOffSetHeight from '../helpers/useKeyBoardOffSetHeight'
import { useDispatch, useSelector } from 'react-redux'
import { addAssistantMessage, addMessage, createNewChat, markMessageAsRead, selectChats, selectCurrentChatId, updateAssistantMessage, updateChatSummary } from '../redux/reducers/chatSlice'
import { PaperAirplaneIcon } from 'react-native-heroicons/solid'
import uuid from "react-native-uuid"
import EventSource from 'react-native-sse'
import { HUGGING_API_KEY, HUGGING_API_URL, STABLE_DIFFUSION_KEY, STABLE_DIFFUSION_URL } from '../redux/API'
import axios from 'axios'
const windowHeight=Dimensions.get('window').height
const SendButton = ({
  isTyping,
  setIsTyping,
  setCurrentChatId,
  length,
  setHeightOfMessageBox,
  messages,
}) => {
  const dispatch=useDispatch()
  const [message,setMessage]=useState('')
  const keyboardOffsetHeight=useKeyBoardOffSetHeight()
  const chats=useSelector(selectChats)
  const currentChatId=useSelector(selectCurrentChatId)
  const TextInputRef=useRef(null)
  const animationValue=useRef(new Animated.Value(0)).current
  const handleTextChange=text=>{
    setIsTyping(!!text)
    setMessage(text)
  };
  const handleContentSizeChange=event=>{
    setHeightOfMessageBox(event.nativeEvent.contentSize.height)
  }
  
  useEffect(()=>{
    Animated.timing(animationValue,{
      toValue:isTyping ? 1: 0,
      duration:600,
      useNativeDriver:true,
    }).start();
  },[isTyping])
  
  const sendButtonStyle={
    opacity:animationValue,
    transform:[
      {
        scale:animationValue.interpolate({
          inputRange:[0,1],
          outputRange:[0.5,1]
        })
      }
    ]
  }
  const fetchResponse=async(mes,selectedChatId)=>{
    let id=length+2;
    dispatch(addAssistantMessage({
      chatId:selectedChatId,
      message:{
        content:'Loading...',
        time:mes.time,
        role:'assitant',
        id:id,
      }
    }))
    const eventSource=new EventSource (HUGGING_API_URL,{
      method:'POST',
      headers:{
        Authorization:`Bearer ${HUGGING_API_KEY}`,
        'Content-Type':'application/json',
      },
      pollingInterval:0,
      body:JSON.stringify({
        model:'meta-llama/Llama-3.2-11B-Vision-Instruct',
        messages:[...messages,mes],
        max_tokens:500,
        stream:true
      })
    })

    let content='';
    let responseComplete=false;

    eventSource.addEventListener('message',event=>{
      if(event.data!=='[DONE]'){
        const parsedData=JSON.parse(event.data);
        if(parsedData.choices && parsedData.choices.length>0){
          const delta=parsedData.choices[0].delta.content;
          if(delta){
            content+=delta;
            dispatch(updateAssistantMessage({
              chatId:selectedChatId,
              message:{
                content,
                time:new Date().toString(),
                role:'assitant',
                id:id,
              },
              messageId:id
            }))
          }
          
        }
      }else{
        responseComplete=true;
        eventSource.close()
      }
    })

    eventSource.addEventListener('error',error=>{
      console.log(error);
      dispatch(updateAssistantMessage({
        chatId:selectedChatId,
        message:{
          content:'Oops! , Looks Like something snapped!.',
          time:new Date().toString(),
          role:'assitant',
          id:id,
        },
        messageId:id
      }))
      eventSource.close()
      
    });
    eventSource.addEventListener('close',()=>{
      if(!responseComplete){
        eventSource.close()
      }
    })
    return ()=>{
      eventSource.removeAllEventListeners()
      eventSource.close()
    }
  }
  const generateImage=async(mes,selectedChatId)=>{
    let id=length+2;
    dispatch(addAssistantMessage({
      chatId:selectedChatId,
      message:{
        content:'Loading...',
        time:mes.time,
        role:'assitant',
        id:id,
      }
    }))
    try {
      const res=await axios.post(STABLE_DIFFUSION_URL,{
        key:STABLE_DIFFUSION_KEY,
        prompt:message,
        negative_prompt:'low quality',
        width:'512',
        height:'512',
        safety_checkers:false,
        seed:null,
        samples:1,
        base64:false,
        webhook:null,
        track_id:null,
      },{
        headers:{
          'Content-Type':'application/json',
        }
      })

      dispatch(
        updateAssistantMessage({
          chatId:selectedChatId,
          message:{
            content:res.data?.output[0],
            imageUri:res.data?.output[0],
            time:new Date().toString(),
            role:'assitant',
            id:id,
          },
          messageId:id
        })
      )
    } catch (error) {
      console.log(error);
      dispatch(updateAssistantMessage({
        chatId:selectedChatId,
        message:{
          content:'Oops! , Looks Like something snapped!.',
          time:new Date().toString(),
          role:'assitant',
          id:id,
        },
        messageId:id
      }))
    }
  }
  const identifyImageApi=prompt=>{
    const imageRegex=/\b(generate\s*image|imagine)\b/i;
    if(imageRegex.test(prompt)){
      return true
    }else{
      return false
    }
  }

  const addChat=async(newId)=>{
    let selectedChatId=newId ? newId : currentChatId;
    let msgId=length+1
    if (length == 0 && message.trim().length>0){
      await dispatch(updateChatSummary({
        chatId:selectedChatId,
        summary:message?.trim().slice(0,40),
      }))
    }
    await dispatch(addMessage({
      chatId:selectedChatId,
      message:{
        content:message,
        time: new Date().toString(),
        role:'user',
        id:msgId,
        isMessageRead:false,
      }
    }))
    setMessage('')
    TextInputRef.current.blur()
    setIsTyping(false)
    let promptForAssistant={
      content:message,
      time:new Date().toString(),
      role:'user',
      id:msgId,
      isMessageRead:false
    }

    if(!identifyImageApi(message)){
      fetchResponse(promptForAssistant,selectedChatId)
    }else{
      generateImage(promptForAssistant,selectedChatId)
    }

    dispatch(markMessageAsRead({
      chatId:selectedChatId,
      messageId:msgId
    }))
  }
  return (
    <View style={[styles.container, {
      bottom: Platform.OS === "android" ? windowHeight * 0.02 : Math.max(keyboardOffsetHeight, windowHeight * 0.02)
    }]}>
      <View style={styles.subContainer}>
        <View style={[styles.inputContainer, {
          width: isTyping ? '87%' : '100%'
        }]}>
          <TextInput
            ref={TextInputRef}
            editable
            multiline
            style={styles.textInput}
            placeholder='| Ask NextAI anything |'
            placeholderTextColor="#64748b"
            value={message}
            onChangeText={handleTextChange}
            onContentSizeChange={handleContentSizeChange}
          />
        </View>
        {isTyping && (
          <Animated.View style={[styles.sendButtonWrapper, sendButtonStyle]}>
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={async () => {
                const chatIndex = chats.findIndex(chat => chat.id == currentChatId);
                if (chatIndex === -1) {
                  let newId = uuid.v4()
                  setCurrentChatId(newId)
                  await dispatch(
                    createNewChat({
                      chatId: newId,
                      messages: [],
                      summary: "New Chat !"
                    })
                  );
                  addChat(newId);
                  return;
                }
                addChat()
              }}
            >
              <PaperAirplaneIcon color={'#ffffff'} size={20} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    minHeight: windowHeight * 0.06,
    maxHeight: windowHeight * 0.4,
    paddingHorizontal: 16,
    padding: 10,
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    alignContent: "center",
  },
  subContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    maxHeight: windowHeight * 0.2,
    backgroundColor: "#1e293b",
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2d3748',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textInput: {
    width: "98%",
    padding: 12,
    paddingHorizontal: 16,
    fontSize: RFValue(14),
    color: "#ffffff",
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  sendButtonWrapper: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: "11%",
    justifyContent: 'center',
    alignContent: 'center',
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 50,
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    transform: [{ rotate: '45deg' }]
  }
})

export default SendButton