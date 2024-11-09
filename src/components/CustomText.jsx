import { View, Text } from 'react-native'
import React from 'react'
import { RFValue } from 'react-native-responsive-fontsize'

const CustomText = ({
    children,
    size=RFValue(13),
    color="#fff",
    opacity=1,
    fontWeight="normal",
    style,
    ...props
}) => {
  return (
    <Text style={{
        fontSize:size,
        color,
        fontWeight,
        opacity,
        ...style

    }} {...props}>{children}</Text>
  )
}

export default CustomText