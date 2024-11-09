import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import useKeyBoardOffSetHeight from '../helpers/useKeyBoardOffSetHeight'
import getMessageHeightOffset from '../helpers/getMessageHeightOffset'
import { FlashList } from '@shopify/flash-list'
import CustomText from './CustomText'
import MessageBubble from './MessageBubble'
import EmptyComponent from './EmptyComponent'
const windowHeight=Dimensions.get('window').height
const Chat = ({
    isTyping,
    messages,
    heightOfMessageBox
}) => {
    const keyBoardOffsetHeight=useKeyBoardOffSetHeight()
    
    const renderMessageBubble=({item})=>{
      return <MessageBubble message={item}/>
    }
    
  return (
    <View style={{
        height:windowHeight * 0.76 -keyBoardOffsetHeight * 0.95 - getMessageHeightOffset(heightOfMessageBox,windowHeight)
    }}>
      {
        messages?.length==0 ? 
        <EmptyComponent isTyping={isTyping}/>
        :
        <FlashList indicatorStyle='black'
        data={[...messages ].reverse()}
        inverted
        estimatedItemSize={40}
        renderItem={renderMessageBubble}
        />
      }
    </View>
  )
}

export default Chat