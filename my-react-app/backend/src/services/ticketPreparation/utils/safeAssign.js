function safeAssign(currentValue,newValue)
{
    if(
        newValue===undefined ||
        newValue===null||
        newValue===""
    )
    {
        return currentValue;
    }
    return newValue;
}

module.exports={
    safeAssign
};