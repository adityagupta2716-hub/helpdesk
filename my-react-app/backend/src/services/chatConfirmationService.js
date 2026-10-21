const POSITIVE_CONFIRMATIONS = [
    "yes",
    "yeah",
    "yep",
    "sure",
    "okay",
    "ok",
    "please do",
    "go ahead",
    "confirm",
    "proceed",
    "do it",
    "create it",
    "create ticket",
    "yes please",
    "yes, do it"
];

const NEGATIVE_CONFIRMATIONS = [
    "no",
    "nope",
    "cancel",
    "don't",
    "dont",
    "stop",
    "never mind",
    "leave it",
    "not now"
];

function normalize(text)
{
    return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g,"");
}

function detectConfirmation(message)
{
    const normalized=normalize(message);
    if(POSITIVE_CONFIRMATIONS.some(word=>word===normalized))
    {
        return "yes";
    }
    if(NEGETIVE_CONFIRMATIONS.some(word=>word===normalized))
    {
        return "no";
    }
    return null;
}

module.exports={
    detectConfirmation
};