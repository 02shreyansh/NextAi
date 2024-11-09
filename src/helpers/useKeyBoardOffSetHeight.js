import { useEffect, useState } from "react"
import { Keyboard } from "react-native";

export default function useKeyBoardOffSetHeight(){
    const [keyboardOffSetHeight,setKeyboardOffSetHeight]=useState(0)
    useEffect(()=>{
        const KeyboardWillAndroidShowListner=Keyboard.addListener('keyboardDidShow',(e)=>{
            setKeyboardOffSetHeight(e.endCoordinates.height)
        })
        const KeyboardWillAndroidHideListner=Keyboard.addListener('keyboardDidHide',(e)=>{
            setKeyboardOffSetHeight(0)
        })
        const KeyboardWillIoSHideListner=Keyboard.addListener('keyboardWillHide',(e)=>{
            setKeyboardOffSetHeight(0)
        })
        const KeyboardWillIoSsHowListner=Keyboard.addListener('keyboardWillShow',(e)=>{
            setKeyboardOffSetHeight(e.endCoordinates.height)
        })

        return ()=>{
            KeyboardWillAndroidHideListner.remove()
            KeyboardWillAndroidShowListner.remove()
            KeyboardWillIoSHideListner.remove()
            KeyboardWillIoSsHowListner.remove()
        }
    },[])
    return keyboardOffSetHeight;

}