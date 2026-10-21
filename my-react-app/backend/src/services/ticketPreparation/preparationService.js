const {
    buildPreparationContext
}=require("./context/preparationContextBuilder.js");
const{
    buildPreparationPrompt
}=require("./prompt/preparationPrompt.js");
const{
    callPreparationModel
}=require("./model/preparationModel.js");
const{
    parsePreparationOutput
}=require("./parser/preparationParser.js");
const{
    validatePreparation
}=require("./validation/preparationValidator.js");
const {
    normalizePreparation
}=require("./normalization/preparationNormalizer.js");

async function prepareTicket({
    latestMessage,
    history=[],
    draft=null,
    intent=null
})
{
    const preparationContext=buildPreparationContext({
        latestMessage,
        history,
        draft,
        intent
    });
    const prompt=
    buildPreparationPrompt(
        preparationContext
    );
    const rawOutput=await callPreparationModel(prompt);
    console.log(
        "\n========== RAW PREPARATION OUTPUT =========="
    );

    console.log(rawOutput);

    console.log(
        "============================================\n"
    );

    const parsedPreparation=parsePreparationOutput(rawOutput);
    console.log(
        "\n========== PARSED PREPARATION =========="
    );
    console.dir(
        parsedPreparation,
        {
            depth:null,
            colors:true
        }
    );

    console.log(
        "=========================================\n"
    );

    const normalizedPreparation=normalizePreparation(parsedPreparation);

    console.log(
        "\n========== NORMALIZED PREPARATION =========="
    );

    console.dir(
        normalizedPreparation,
        {
            depth:null,
            colors:true
        }
    );

    console.log(
        "============================================\n"
    );
    
    const validatedPreparation=validatePreparation(normalizedPreparation);
    return validatedPreparation;
}

module.exports={
    prepareTicket
};