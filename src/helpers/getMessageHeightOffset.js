const getMessageHeightOffset=(heightOfMessage,windowHeight)=>{
    const maxHeightOfMessage=windowHeight * 0.18;
    if(heightOfMessage>maxHeightOfMessage){
        return maxHeightOfMessage-windowHeight * 0.05
    }
    if(heightOfMessage>24){
        return heightOfMessage-windowHeight * 0.035
    }
    return 0
}
export default getMessageHeightOffset