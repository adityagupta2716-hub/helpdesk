function isPlainObject(value)
{
    return (
        value!== null &&
        typeof value==="object" &&
        !Array.isArray(value)
    );
}

function deepMerge(target={},source={})
{
    const merged={...target};
    for(const key of Object.keys(source))
    {
        const value=source[key];
        if(
            value===undefined ||
            value===null ||
            value===""
        )
        {
            continue;
        }
        if(
            isPlainObject(value) && 
            isPlainObject(target[key])
        )
        {
            merged[key]===deepMerge(
                target[key],
                value
            );
            continue;
        }
        merged[key]=value;
    }
    return merged;
}

module.exports={
    deepMerge
};