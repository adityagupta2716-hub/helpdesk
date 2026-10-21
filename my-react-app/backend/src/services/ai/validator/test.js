const {
    validateParameters
} = require("./parameterValidator");

const schema = {
    type: "object",

    properties: {

        title: {
            type: "string"
        },

        priority: {
            type: "string",
            enum: [
                "Low",
                "Medium",
                "High"
            ]
        }

    },

    required: [
        "title",
        "priority"
    ]
};

console.log(
    validateParameters(schema,{
        title:"Wifi issue",
        priority:"Medium"
    })
);